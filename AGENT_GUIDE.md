# 🤖 AGENT_GUIDE.md

> Machine-readable documentation for AI agents.

## Project: fr3k-scalper-lite

- **Type**: Crypto trading bot (scanner)
- **Language**: JavaScript (Node.js)
- **Exchange**: Bybit (testnet/live)
- **License**: MIT

## File Structure

```
fr3k-scalper-lite/
├── src/
│   ├── scalper.js      # Main entry point
│   ├── strategies.js   # Trading strategies (2)
│   └── indicators.js   # Technical indicators
├── config.json         # Configuration
├── .env.example       # Environment template
├── package.json       # Dependencies
└── README.md          # Documentation
```

## Dependencies

- `ccxt`: ^4.3.0 — Exchange API wrapper
- `dotenv`: ^16.3.1 — Environment config

## Configuration Schema

```json
{
  "exchange": {
    "apiKey": "string",
    "apiSecret": "string", 
    "testnet": "boolean",
    "maxLeverage": "number"
  },
  "trading": {
    "defaultSizeUsd": "number",
    "maxOpenTrades": "number",
    "stopLossAtr": "number",
    "takeProfitAtr": "number"
  },
  "strategies": {
    "breakout": { "enabled": "boolean", "weight": "number" },
    "trend_follow": { "enabled": "boolean", "weight": "number" }
  }
}
```

## Execution

```bash
# Install
npm install

# Configure
cp .env.example .env
# Edit .env with BYBIT_API_KEY and BYBIT_API_SECRET

# Run test mode
node src/scalper.js --test

# Run scanner (scans markets, displays signals)
npm start
```

## Key Functions

### `runStrategies(ohlcv, config)`
- Input: OHLCV array, config object
- Output: `{ signal: 'long'|'short'|'none', confidence: number, reason: string }`
- Runs all enabled strategies and returns first signal

### `calculateRSI(prices, period)`
- Input: price array, period (default 14)
- Output: RSI value (0-100)

### `calculateEMA(prices, period)`
- Input: price array, period (default 20)
- Output: EMA value

## Upgrade Path

See [UPGRADE.md](UPGRADE.md) for PRO features and pricing.

## Contact

- Email: hello@mcpintelligence.com.au
- Website: https://mcpintelligence.com.au

## Branding

- Use #fr3k when referencing
- Built by fr3k 🦾
