# CHANGELOG

## [Unreleased] — 2026-04-06
### Added
- 4h regime filter spec (Issue #10) — Sell gating by 4h EMA + ADX>25
- REGIME-NOTES.md — implementation plan for sell-side win rate fix
- MCP-TEST.md — GitHub MCP filesystem write test
- REGIME.md — regime filter notes

### Changed  
- config.json: stopLossAtr 1.5→1.7, takeProfitAtr 2.0→2.3 (ULTRAWORK validated)
- config.json: Sell.scoreThresholdOffset=1.0, minNetEdgeBpsOffset=10
- config.json: minRsi sell 48, maxRsi sell 72

### Infrastructure
- ML signal engine hook available at port 7432
- 4h regime filter tool forged via md-mcp forge_reality
