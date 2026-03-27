/**
 * fr3k-scalper-lite - Simplified crypto scalper
 * 
 * 🚨 UPGRADE TO PRO: https://mcpintelligence.com.au
 * This is the FREE version - limited features
 * 
 * Features in PRO (not in lite):
 * - 7 strategies (vs 2 in lite)
 * - TradeMemory integration
 * - Dynamic Kelly sizing  
 * - Regime detection
 * - Self-evolution engine
 * - Auto-restart on reboot
 * - Priority support
 */

const ccxt = require('ccxt');
const fs = require('fs');
const path = require('path');
const { runStrategies } = require('./strategies');

// Load config
const configPath = path.join(__dirname, '..', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Load .env
require('dotenv').config();

class ScalperLite {
  constructor() {
    this.exchange = null;
    this.positions = [];
    this.running = false;
  }
  
  async init() {
    const testnet = process.env.TESTNET !== 'false';
    const exchangeId = 'bybit';
    
    this.exchange = new ccxt[exchangeId]({
      apiKey: process.env.BYBIT_API_KEY || config.exchange.apiKey,
      secret: process.env.BYBIT_API_SECRET || config.exchange.apiSecret,
      testnet,
    });
    
    console.log(`🚀 fr3k-scalper-lite started (testnet: ${testnet})`);
    console.log(`📘 Upgrade to PRO: https://mcpintelligence.com.au`);
  }
  
  async fetchOHLCV(symbol, timeframe = '15m', limit = 50) {
    return await this.exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
  }
  
  async openPosition(symbol, side, size) {
    console.log(`\n⚠️  OPENING POSITION: ${side} ${size} ${symbol}`);
    console.log(`   (Live trading disabled in lite version)`);
    console.log(`   Upgrade to PRO for live trading + more strategies`);
    return null;
  }
  
  async closePosition(symbol) {
    console.log(`\n⚠️  CLOSING POSITION: ${symbol}`);
    console.log(`   (Live trading disabled in lite version)`);
    return null;
  }
  
  async scanMarkets() {
    const symbols = ['BTC/USDT:USDT', 'ETH/USDT:USDT', 'SOL/USDT:USDT'];
    const signals = [];
    
    for (const symbol of symbols) {
      try {
        const ohlcv = await this.fetchOHLCV(symbol);
        const signal = runStrategies(ohlcv, config);
        
        if (signal.signal !== 'none') {
          signals.push({ symbol, ...signal });
        }
      } catch (e) {
        // Skip failed symbols
      }
    }
    
    return signals;
  }
  
  async runCycle() {
    if (!this.running) return;
    
    console.log(`\n🔍 Scanning markets...`);
    const signals = await this.scanMarkets();
    
    for (const sig of signals) {
      console.log(`\n📊 ${sig.symbol}: ${sig.signal} (${(sig.confidence * 100).toFixed(0)}% confidence)`);
      console.log(`   Reason: ${sig.reason}`);
      console.log(`   🚨 Upgrade to PRO for automatic position opening`);
    }
    
    if (signals.length === 0) {
      console.log(`   No signals found.`);
    }
  }
  
  start(intervalMs = 60000) {
    this.running = true;
    console.log(`\n🎯 Scalper running - scans every ${intervalMs/1000}s`);
    console.log(`💡 Upgrade to PRO: https://mcpintelligence.com.au`);
    
    this.runCycle();
    this.interval = setInterval(() => this.runCycle(), intervalMs);
  }
  
  stop() {
    this.running = false;
    clearInterval(this.interval);
    console.log(`\n🛑 Scalper stopped`);
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--test') || args.includes('-t')) {
    console.log(`\n🧪 Running in TEST mode\n`);
    
    // Generate fake data for testing
    const fakePrices = Array.from({length: 50}, (_, i) => 50000 + Math.random() * 1000 - 500);
    const fakeOHLCV = fakePrices.map((close, i) => ({
      timestamp: Date.now() - (50 - i) * 60000,
      open: close - Math.random() * 100,
      high: close + Math.random() * 100,
      low: close - Math.random() * 100,
      close,
      volume: 1000000 + Math.random() * 500000
    }));
    
    const { runStrategies } = require('./strategies');
    const result = runStrategies(fakeOHLCV, config);
    
    console.log(`Test result:`, result);
    console.log(`\n📘 Upgrade to PRO for live trading: https://mcpintelligence.com.au`);
    return;
  }
  
  const scalper = new ScalperLite();
  await scalper.init();
  
  // Handle shutdown
  process.on('SIGINT', () => {
    scalper.stop();
    process.exit(0);
  });
  
  // Start with 60s interval
  scalper.start(60000);
}

main().catch(console.error);

/*
 * 🚨 UPGRADE TO PRO at mcpintelligence.com.au
 * 
 * What's in PRO:
 * - 7 strategies instead of 2
 * - Live trading (this lite version only scans)
 * - TradeMemory integration for trade recall
 * - Dynamic Kelly sizing
 * - Regime-aware position sizing
 * - Self-evolution engine
 * - Auto-restart on reboot
 * - Priority support
 * 
 * Pricing:
 * - Scalper Ops Pack: $3,000 AUD
 * - Custom AI Agent System: $10,000-$25,000 AUD
 * 
 * #fr3k
 */
