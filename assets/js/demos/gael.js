(function () {
  const data = window.GAEL_SAMPLE;
  const root = document.getElementById("gael-demo");
  if (!root || !data) return;

  const state = { currency: "MXN" };

  function fmt(amountMXN) {
    const value = state.currency === "USD" ? amountMXN / data.fxRate : amountMXN;
    const symbol = state.currency === "USD" ? "$" : "MX$";
    return symbol + value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  function pct(n) {
    const sign = n >= 0 ? "+" : "";
    return sign + (n * 100).toFixed(1) + "%";
  }

  function render() {
    const t = data.totals;
    root.querySelector('[data-field="value"]').textContent = fmt(t.valueMXN);
    root.querySelector('[data-field="cost-basis"]').textContent = fmt(t.costBasisMXN);

    const realizedEl = root.querySelector('[data-field="realized"]');
    realizedEl.textContent = pct(t.realizedPnlMXN / t.costBasisMXN);
    realizedEl.classList.toggle("positive", t.realizedPnlMXN >= 0);
    realizedEl.classList.toggle("negative", t.realizedPnlMXN < 0);

    const unrealizedEl = root.querySelector('[data-field="unrealized"]');
    unrealizedEl.textContent = pct(t.unrealizedPnlMXN / t.costBasisMXN);
    unrealizedEl.classList.toggle("positive", t.unrealizedPnlMXN >= 0);
    unrealizedEl.classList.toggle("negative", t.unrealizedPnlMXN < 0);

    root.querySelector('[data-field="twr"]').textContent = pct(t.twr.allTime);
    root.querySelector('[data-field="spy"]').textContent = pct(t.benchmarks.spy);
    root.querySelector('[data-field="ipc"]').textContent = pct(t.benchmarks.ipc);

    const positionsEl = root.querySelector('[data-field="positions"]');
    positionsEl.innerHTML = data.positions
      .map(
        (p) => `
        <div class="mockup-row">
          <span class="name"><span class="swatch" style="background:${p.color}"></span>${p.name}</span>
          <span class="amount">${fmt(p.valueMXN)} · ${(p.weight * 100).toFixed(0)}%</span>
        </div>`
      )
      .join("");

    const alertsEl = root.querySelector('[data-field="alerts"]');
    alertsEl.innerHTML = data.actionItems
      .map(
        (a) => `
        <div class="mockup-alert">
          <span class="icon">${a.severity === "warn" ? "▲" : "ℹ"}</span>
          <span>${a.text}</span>
        </div>`
      )
      .join("");
  }

  root.querySelectorAll(".mockup-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.currency = btn.dataset.currency;
      root.querySelectorAll(".mockup-toggle button").forEach((b) => {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      render();
    });
  });

  render();
})();
