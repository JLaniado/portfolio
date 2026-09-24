// Fabricated sample data for the Gael dashboard mockup — illustrative only, not real holdings.
window.GAEL_SAMPLE = {
  fxRate: 18.42, // MXN per USD
  totals: {
    valueMXN: 1842650,
    costBasisMXN: 1512300,
    realizedPnlMXN: 48200,
    unrealizedPnlMXN: 330350,
    twr: { allTime: 0.221, ytd: 0.084, oneYear: 0.146 },
    benchmarks: { spy: 0.118, ipc: 0.062 },
  },
  positions: [
    { name: "HAYEK (Fintual)", currency: "MXN", valueMXN: 612400, weight: 0.332, color: "#b5472b" },
    { name: "VOO", currency: "USD", valueMXN: 498900, weight: 0.271, color: "#2451e0" },
    { name: "BTC", currency: "USD", valueMXN: 274100, weight: 0.149, color: "#d9a441" },
    { name: "CETES 28d", currency: "MXN", valueMXN: 231800, weight: 0.126, color: "#3a7a4e" },
    { name: "GLD", currency: "USD", valueMXN: 225450, weight: 0.122, color: "#6b6862" },
  ],
  actionItems: [
    { text: "Uninvested cash of $38,400 MXN sitting in Broker XYZ — deploy per Fund Allocation target.", severity: "warn" },
    { text: "Stock Direct strategy has drifted 6.2% from target weights — rebalance suggested.", severity: "warn" },
    { text: "USD/MXN spot moved +3.1% this month — dual-currency exposure worth a check-in.", severity: "info" },
  ],
};
