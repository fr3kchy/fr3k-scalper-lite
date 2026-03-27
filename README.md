# 🚀 fr3k-scalper-lite

<p align="center">
  <a href="https://mcpintelligence.com.au"><img src="https://img.shields.io/badge/UPGRADE-PRO-orange?style=for-the-badge&logo=stripe" alt="Upgrade to PRO"></a>
  <img src="https://img.shields.io/github/license/fr3kchy/fr3k-scalper-lite" alt="License">
  <img src="https://img.shields.io/github/stars/fr3kchy/fr3k-scalper-lite" alt="Stars">
</p>

> ⚠️ **This is the FREE version** — limited to 2 strategies and market scanning only.  
> **[Upgrade to PRO](https://mcpintelligence.com.au)** for live trading, 7 strategies, and advanced features.

A lightweight crypto scalper for Bybit futures. Get started with algorithmic trading in minutes.

## ⚡ Quick Start

```bash
# 1. Clone
git clone https://github.com/fr3kchy/fr3k-scalper-lite.git
cd fr3k-scalper-lite

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# Edit .env with your Bybit API keys

# 4. Run test mode
node src/scalper.js --test
```

## 📋 Requirements

- Node.js 18+
- Bybit account with API keys (futures enabled)
- Testnet recommended for first run

## 🔧 Configuration

Edit `config.json`:

```json
{
  "exchange": {
    "testnet": true
  },
  "trading": {
    "defaultSizeUsd": 10,
    "maxOpenTrades": 2
  }
}
```

## 📊 Strategies (Lite vs PRO)

| Feature | Lite (Free) | PRO |
|---------|-------------|-----|
| Strategies | 2 | 7 |
| Live Trading | ❌ Scan only | ✅ Full automation |
| Position Sizing | Fixed | Dynamic Kelly |
| TradeMemory | ❌ | ✅ |
| Regime Detection | ❌ | ✅ |
| Self-Evolution | ❌ | ✅ |
| Support | Community | Priority |

## 🔄 Available Strategies

### Lite (this repo)
1. **breakout** — Volume breakout above resistance
2. **trend_follow** — EMA crossover

### PRO (upgrade required)
1. **breakout_vol** — Volume-weighted breakout
2. **recovery_swing** — Mean reversion after drops
3. **anti_chop** — Trend-following with RSI filter
4. **defensive_carry** — Low-volatility carry
5. **momentum_htf** — Higher timeframe alignment
6. **gann** — Gann angle analysis
7. **baseline** — Default fallback

## 🚨 Upgrade to PRO

**Why upgrade?**

- Live trading with automatic position management
- 7 sophisticated strategies (not just 2)
- TradeMemory integration for outcome-weighted recall
- Dynamic Kelly sizing for optimal bet sizing
- Regime-aware position management
- Self-evolution engine that improves over time
- Auto-restart on server reboot
- Priority support

**Pricing:**
- Scalper Ops Pack: $3,000 AUD
- Custom AI Agent System: $10,000-$25,000 AUD

👉 **[Upgrade at mcpintelligence.com.au](https://mcpintelligence.com.au)**

## 📖 Documentation

- [SETUP.md](SETUP.md) — Full setup guide
- [UPGRADE.md](UPGRADE.md) — What's included in PRO

## 🤖 For AI Agents

See [AGENT_GUIDE.md](AGENT_GUIDE.md) for machine-readable documentation.

## 💻 Usage

```bash
# Start the scalper
npm start

# Or run test mode with simulated data
node src/scalper.js --test
```

The scalper will:
1. Connect to Bybit (testnet or live)
2. Scan markets every 60 seconds
3. Display signals (Lite version only scans, doesn't trade)

## 🔐 Security

- Never commit your `.env` file
- Use testnet first
- Start with small position sizes
- Monitor always

## 📞 Support

- **Community**: Open an issue
- **PRO**: Priority support at mcpintelligence.com.au

## 🏷️ Tags

`crypto` `trading` `bybit` `scalper` `algorithmic-trading` `fr3k`

---

<p align="center">
  <sub>Built by <a href="https://mcpintelligence.com.au">fr3k</a> 🦾</sub>
</p>
