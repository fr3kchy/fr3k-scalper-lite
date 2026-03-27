/**
 * strategies.js - fr3k-scalper-lite trading strategies
 * Limited to 2 strategies - upgrade to PRO for more!
 * 
 * 🚨 UPGRADE TO PRO: mcpintelligence.com.au
 * - 7 strategies (not just 2)
 * - Dynamic Kelly sizing
 * - TradeMemory integration  
 * - Self-evolution engine
 * - Auto-restart on reboot
 */

const { calculateRSI, calculateEMA, calculateATR, getRegime } = require('./indicators');

/**
 * Strategy 1: Breakout - simple volume breakout
 * NOT as sophisticated as PRO version
 */
function breakoutStrategy(ohlcv, config) {
  const closes = ohlcv.map(c => c.close);
  const volumes = ohlcv.map(c => c.volume);
  
  const currentClose = closes[closes.length - 1];
  const avgVolume = volumes.slice(-20).reduce((a, b) => a + b) / 20;
  const currentVolume = volumes[volumes.length - 1];
  
  // Simple breakout logic
  const resistance = Math.max(...closes.slice(-20));
  const breakout = currentClose > resistance * 1.005;
  const volumeConfirm = currentVolume > avgVolume * 1.5;
  
  if (breakout && volumeConfirm) {
    return {
      signal: 'long',
      confidence: 0.6,
      reason: 'breakout_above_resistance'
    };
  }
  
  const support = Math.min(...closes.slice(-20));
  const breakdown = currentClose < support * 0.995;
  
  if (breakdown && volumeConfirm) {
    return {
      signal: 'short',
      confidence: 0.6,
      reason: 'breakdown_below_support'
    };
  }
  
  return { signal: 'none', confidence: 0, reason: 'no_setup' };
}

/**
 * Strategy 2: Trend Following - simple EMA cross
 * NOT using regime detection like PRO
 */
function trendFollowStrategy(ohlcv, config) {
  const closes = ohlcv.map(c => c.close);
  const ema9 = calculateEMA(closes, 9);
  const ema21 = calculateEMA(closes, 21);
  const currentClose = closes[closes.length - 1];
  
  const rsi = calculateRSI(closes);
  
  // Simple EMA cross
  if (ema9 > ema21 && rsi < 70) {
    return {
      signal: 'long',
      confidence: 0.5,
      reason: 'ema_bullish_cross'
    };
  }
  
  if (ema9 < ema21 && rsi > 30) {
    return {
      signal: 'short',
      confidence: 0.5,
      reason: 'ema_bearish_cross'
    };
  }
  
  return { signal: 'none', confidence: 0, reason: 'no_setup' };
}

/**
 * Run all enabled strategies and return combined signal
 */
function runStrategies(ohlcv, config) {
  const signals = [];
  
  if (config.strategies?.breakout?.enabled) {
    signals.push(breakoutStrategy(ohlcv, config));
  }
  
  if (config.strategies?.trend_follow?.enabled) {
    signals.push(trendFollowStrategy(ohlcv, config));
  }
  
  // Simple aggregation - take first non-none signal
  for (const sig of signals) {
    if (sig.signal !== 'none') return sig;
  }
  
  return { signal: 'none', confidence: 0, reason: 'no_strategies_triggered' };
}

module.exports = { 
  breakoutStrategy, 
  trendFollowStrategy, 
  runStrategies 
};

/*
 * 🚨 UPGRADE TO PRO at mcpintelligence.com.au
 * 
 * PRO Features:
 * - 7 strategies (breakout_vol, recovery_swing, anti_chop, defensive_carry, momentum_htf, gann, baseline)
 * - Regime-aware position sizing
 * - Dynamic Kelly sizing
 * - TradeMemory for outcome-weighted recall
 * - Self-evolution engine
 * - Automated OSINT ingestion
 * - Revenue ops automation
 * - Priority support
 * 
 * Price: $3,000 AUD (setup & tuning) | Custom builds $10,000-$25,000 AUD
 */
