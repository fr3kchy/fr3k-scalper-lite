'use strict';

// =============================================================================
// fr3k-scalper-lite — Simple Backtester
//
// Runs a strategy against historical candle data from Bybit.
// PRO version includes walk-forward optimization, Monte Carlo simulation,
// and TradeMemory-powered parameter tuning.
//
// Usage: npm run backtest
// =============================================================================

require('dotenv').config();

const ccxt = require('ccxt');
const fs = require('fs');
const path = require('path');
const { createStrategy } = require('./strategies');

const CONFIG_PATH = path.join(__dirname, '..', 'config.json');

function log(level, ...args) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${level.toUpperCase()}]`, ...args);
}

async function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  log('info', '=== fr3k-scalper-lite Backtester ===');
  log('info', 'PRO backtester includes walk-forward optimization and Monte Carlo — https://mcpintelligence.com.au');
  log('info', '');

  // Connect and fetch historical data
  const isTestnet = process.env.BYBIT_TESTNET !== 'false';
  const exchange = new ccxt.bybit({
    enableRateLimit: true,
    options: { defaultType: 'swap' },
  });
  if (isTestnet) exchange.sandbox = true;

  await exchange.loadMarkets();

  const pair = process.env.TRADING_PAIR || config.tradingPair;
  const timeframe = config.timeframe;

  log('info', `Fetching historical data for ${pair} (${timeframe})...`);

  // Fetch as many candles as possible (up to 1000)
  const candles = await exchange.fetchOHLCV(pair, timeframe, undefined, 1000);
  log('info', `Got ${candles.length} candles`);

  if (candles.length < 50) {
    log('error', 'Not enough candle data for backtesting.');
    process.exit(1);
  }

  // Initialize strategy
  const strategy = createStrategy(config.strategy);
  log('info', `Strategy: ${strategy.name}`);
  log('info', `Position size: $${config.positionSize} | SL: ${config.stopLossPercent}% | TP: ${config.takeProfitPercent}%`);
  log('info', '');

  // Backtest simulation
  const results = {
    trades: [],
    wins: 0,
    losses: 0,
    totalPnL: 0,
    maxDrawdown: 0,
    peakPnL: 0,
  };

  let position = null; // { side, entryPrice, qty, stopLoss, takeProfit, entryIdx }
  const windowSize = 50; // minimum candles to feed strategy

  for (let i = windowSize; i < candles.length; i++) {
    const windowCandles = candles.slice(0, i + 1);
    const currentPrice = candles[i][4];
    const currentHigh = candles[i][2];
    const currentLow = candles[i][3];

    // Check SL/TP for open position
    if (position) {
      let closed = false;

      if (position.side === 'BUY') {
        if (currentLow <= position.stopLoss) {
          const pnl = (position.stopLoss - position.entryPrice) * position.qty;
          closeTrade(results, position, position.stopLoss, pnl, 'SL', i);
          position = null;
          closed = true;
        } else if (currentHigh >= position.takeProfit) {
          const pnl = (position.takeProfit - position.entryPrice) * position.qty;
          closeTrade(results, position, position.takeProfit, pnl, 'TP', i);
          position = null;
          closed = true;
        }
      } else {
        if (currentHigh >= position.stopLoss) {
          const pnl = (position.entryPrice - position.stopLoss) * position.qty;
          closeTrade(results, position, position.stopLoss, pnl, 'SL', i);
          position = null;
          closed = true;
        } else if (currentLow <= position.takeProfit) {
          const pnl = (position.entryPrice - position.takeProfit) * position.qty;
          closeTrade(results, position, position.takeProfit, pnl, 'TP', i);
          position = null;
          closed = true;
        }
      }

      if (closed) continue;
    }

    // Run strategy
    const signal = strategy.analyze(windowCandles);

    if (signal.action === 'HOLD') continue;

    // Close opposing position
    if (position && position.side !== signal.action) {
      const pnl = position.side === 'BUY'
        ? (currentPrice - position.entryPrice) * position.qty
        : (position.entryPrice - currentPrice) * position.qty;
      closeTrade(results, position, currentPrice, pnl, 'FLIP', i);
      position = null;
    }

    // Open new position
    if (!position) {
      const qty = config.positionSize / currentPrice;
      const stopLoss = signal.stopLoss || (
        signal.action === 'BUY'
          ? currentPrice * (1 - config.stopLossPercent / 100)
          : currentPrice * (1 + config.stopLossPercent / 100)
      );
      const takeProfit = signal.takeProfit || (
        signal.action === 'BUY'
          ? currentPrice * (1 + config.takeProfitPercent / 100)
          : currentPrice * (1 - config.takeProfitPercent / 100)
      );

      position = {
        side: signal.action,
        entryPrice: currentPrice,
        qty,
        stopLoss,
        takeProfit,
        entryIdx: i,
        reason: signal.reason,
      };
    }
  }

  // Close any remaining position at last price
  if (position) {
    const lastPrice = candles[candles.length - 1][4];
    const pnl = position.side === 'BUY'
      ? (lastPrice - position.entryPrice) * position.qty
      : (position.entryPrice - lastPrice) * position.qty;
    closeTrade(results, position, lastPrice, pnl, 'EOD', candles.length - 1);
  }

  // Print results
  log('info', '');
  log('info', '=== BACKTEST RESULTS ===');
  log('info', `Strategy: ${strategy.name}`);
  log('info', `Period: ${candles.length} candles (${timeframe})`);
  log('info', `Total trades: ${results.trades.length}`);
  log('info', `Wins: ${results.wins} | Losses: ${results.losses}`);

  const winRate = results.trades.length > 0
    ? ((results.wins / results.trades.length) * 100).toFixed(1)
    : '0.0';
  log('info', `Win rate: ${winRate}%`);
  log('info', `Total PnL: $${results.totalPnL.toFixed(2)}`);
  log('info', `Max drawdown: $${results.maxDrawdown.toFixed(2)}`);

  if (results.trades.length > 0) {
    const avgPnL = results.totalPnL / results.trades.length;
    const avgWin = results.wins > 0
      ? results.trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / results.wins
      : 0;
    const avgLoss = results.losses > 0
      ? results.trades.filter(t => t.pnl <= 0).reduce((s, t) => s + t.pnl, 0) / results.losses
      : 0;

    log('info', `Avg PnL per trade: $${avgPnL.toFixed(2)}`);
    log('info', `Avg win: $${avgWin.toFixed(2)} | Avg loss: $${avgLoss.toFixed(2)}`);

    if (avgLoss !== 0) {
      const profitFactor = Math.abs(avgWin * results.wins) / Math.abs(avgLoss * results.losses);
      log('info', `Profit factor: ${profitFactor.toFixed(2)}`);
    }
  }

  log('info', '========================');
  log('info', '');
  log('info', 'PRO backtester features: walk-forward optimization, Monte Carlo simulation, regime-aware parameter tuning.');
  log('info', 'Upgrade at https://mcpintelligence.com.au');

  // Print individual trades
  if (results.trades.length > 0 && results.trades.length <= 50) {
    log('info', '');
    log('info', 'Trade log:');
    for (const t of results.trades) {
      const emoji = t.pnl >= 0 ? '+' : '';
      log('info', `  ${t.side} @ $${t.entryPrice.toFixed(2)} -> $${t.exitPrice.toFixed(2)} | ${emoji}$${t.pnl.toFixed(2)} (${t.exitReason})`);
    }
  }
}

function closeTrade(results, position, exitPrice, pnl, exitReason, exitIdx) {
  results.trades.push({
    side: position.side,
    entryPrice: position.entryPrice,
    exitPrice,
    pnl,
    exitReason,
    reason: position.reason,
  });

  results.totalPnL += pnl;
  if (pnl >= 0) results.wins++;
  else results.losses++;

  // Drawdown tracking
  if (results.totalPnL > results.peakPnL) {
    results.peakPnL = results.totalPnL;
  }
  const drawdown = results.peakPnL - results.totalPnL;
  if (drawdown > results.maxDrawdown) {
    results.maxDrawdown = drawdown;
  }
}

main().catch(err => {
  log('error', `Backtest failed: ${err.message}`);
  log('error', err.stack);
  process.exit(1);
});
