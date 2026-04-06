# 4h Regime Filter

## Problem
Sell win rate 37.5% — taking shorts in uptrends.

## Solution
```js
// Only allow Sell if 4h EMA bearish + ADX > 25
if (side === 'Sell' && (ema4hCross >= 0 || adx4h < 25)) {
  return decide({ executed: false, reason: 'regime-filter-sell-blocked' });
}
```

## Expected impact: sell win rate 37.5% → 60%+