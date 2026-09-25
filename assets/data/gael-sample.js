// Fabricated sample data for the Gael dashboard demo — illustrative only, not real holdings.
// Mirrors the shape of Gael's real transaction ledger (append-only; positions/P&L are always
// recomputed from this, never stored directly).
window.GAEL_SAMPLE = {
  instruments: {
    VOO: { name: "Vanguard S&P 500 ETF", ccy: "USD", frac: true, broker: "IBKR" },
    QQQ: { name: "Invesco QQQ Trust", ccy: "USD", frac: true, broker: "IBKR" },
    VXUS: { name: "Vanguard Total Intl Stock", ccy: "USD", frac: true, broker: "IBKR" },
    AGG: { name: "iShares Core US Aggregate Bond", ccy: "USD", frac: true, broker: "IBKR" },
    NAFTRAC: { name: "iShares NAFTRAC (IPC)", ccy: "MXN", frac: false, broker: "GBM" },
    FTLIQU: { name: "Fintual Liquidez", ccy: "MXN", frac: false, broker: "FINTUAL" },
  },
  tickers: ["VOO", "QQQ", "VXUS", "AGG", "NAFTRAC", "FTLIQU"],
  brokers: { IBKR: "Interactive Brokers", GBM: "GBM Homebroker", FINTUAL: "Fintual" },
  brokerShort: { IBKR: "IBKR", GBM: "GBM", FINTUAL: "Fintual" },
  strategies: [
    { id: "core", name: "Retirement Core", color: "#b5472b", kind: "Stock Direct", goal: "Globally diversified, held for decades", threshold: 5 },
    { id: "growth", name: "Growth", color: "#d9834f", kind: "Stock Direct", goal: "US large-cap tilt toward tech", threshold: 5 },
    { id: "reserve", name: "Emergency Reserve", color: "#8f8a80", kind: "Fund Allocation", goal: "Six months of expenses, always liquid", threshold: 5 },
  ],
  targets: {
    core: { VOO: 45, VXUS: 20, AGG: 20, NAFTRAC: 15 },
    growth: { QQQ: 80, VOO: 20 },
    reserve: { FTLIQU: 100 },
  },
  startPrices: { VOO: 540, QQQ: 480, VXUS: 66, AGG: 99, NAFTRAC: 60, FTLIQU: 12.5 },
  startFx: 18.4,
  // type, date, strategy, broker, ticker, qty, price, fx, amount (DEPOSIT/WITHDRAWAL use amount only)
  transactions: [
    { id: 1, date: "2025-01-15", type: "DEPOSIT", strat: "core", amt: 700000 },
    { id: 2, date: "2025-01-16", type: "BUY", strat: "core", broker: "IBKR", ticker: "VOO", qty: 30, px: 480, fx: 17.9 },
    { id: 3, date: "2025-01-16", type: "BUY", strat: "core", broker: "IBKR", ticker: "VXUS", qty: 140, px: 58, fx: 17.9 },
    { id: 4, date: "2025-01-16", type: "BUY", strat: "core", broker: "IBKR", ticker: "AGG", qty: 90, px: 96, fx: 17.9 },
    { id: 5, date: "2025-01-20", type: "BUY", strat: "core", broker: "GBM", ticker: "NAFTRAC", qty: 2200, px: 54, fx: 1 },
    { id: 6, date: "2025-02-01", type: "DEPOSIT", strat: "reserve", amt: 140000 },
    { id: 7, date: "2025-02-03", type: "BUY", strat: "reserve", broker: "FINTUAL", ticker: "FTLIQU", qty: 12000, px: 11.6, fx: 1 },
    { id: 8, date: "2025-03-03", type: "DEPOSIT", strat: "growth", amt: 200000 },
    { id: 9, date: "2025-03-04", type: "BUY", strat: "growth", broker: "IBKR", ticker: "QQQ", qty: 20, px: 440, fx: 17.9 },
    { id: 10, date: "2025-03-04", type: "BUY", strat: "growth", broker: "IBKR", ticker: "VOO", qty: 4, px: 490, fx: 17.9 },
    { id: 11, date: "2025-09-10", type: "DEPOSIT", strat: "core", amt: 150000 },
    { id: 12, date: "2025-09-11", type: "BUY", strat: "core", broker: "GBM", ticker: "VOO", qty: 18, px: 505, fx: 18.1 },
    { id: 13, date: "2026-08-03", type: "DEPOSIT", strat: "growth", amt: 45000 },
  ],
};
