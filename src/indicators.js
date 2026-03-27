/**
 * indicators.js - Basic technical indicators for scalper-lite
 * Simple RSI, EMA, ATR implementations
 */

// Simple RSI calculation
function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return 50;
  
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// Simple EMA calculation
function calculateEMA(prices, period = 20) {
  if (prices.length < period) return prices[prices.length - 1];
  
  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;
  
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  return ema;
}

// Simple ATR calculation
function calculateATR(highs, lows, closes, period = 14) {
  if (closes.length < period + 1) return 0;
  
  const trs = [];
  for (let i = 1; i < closes.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    trs.push(tr);
  }
  
  return trs.slice(-period).reduce((a, b) => a + b) / period;
}

// Get market regime (simple version)
function getRegime(prices) {
  const ema20 = calculateEMA(prices, 20);
  const ema50 = calculateEMA(prices, 50);
  const current = prices[prices.length - 1];
  
  if (ema20 > ema50 * 1.01) return 'trending_up';
  if (ema20 < ema50 * 0.99) return 'trending_down';
  return 'ranging';
}

module.exports = { calculateRSI, calculateEMA, calculateATR, getRegime };
