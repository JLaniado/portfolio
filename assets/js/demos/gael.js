(function () {
  const DATA = window.GAEL_SAMPLE;
  const root = document.getElementById("gael-demo");
  if (!root || !DATA) return;

  const I = DATA.instruments;
  const TICKERS = DATA.tickers;
  const BROKERS = DATA.brokers;
  const BSHORT = DATA.brokerShort;
  const STRATS = DATA.strategies;
  const TXC = {
    BUY: ["#b5472b", "rgba(181,71,43,0.10)"],
    SELL: ["#a03327", "rgba(160,51,39,0.10)"],
    DEPOSIT: ["#3a7a4e", "rgba(58,122,78,0.10)"],
    WITHDRAWAL: ["#b48a2a", "rgba(180,138,42,0.12)"],
  };

  let nextId = 100;
  const state = {
    tab: "dashboard",
    ccy: "MXN",
    range: "ALL",
    fx: DATA.startFx,
    prices: Object.assign({}, DATA.startPrices),
    moves: {},
    txns: DATA.transactions.map((t) => Object.assign({ fresh: false }, t)),
    targets: JSON.parse(JSON.stringify(DATA.targets)),
    form: { type: "BUY", strat: "growth", broker: "GBM", ticker: "VOO", qty: "2", px: "540", amt: "25000" },
    formMsg: "",
    formErr: false,
    rb: { strat: "core", mode: "DRIFT", amt: "50000", fromCash: false },
    toast: "",
  };
  let toastTimer = null;

  // ---------- helpers ----------
  function today() {
    const d = new Date();
    return ymd(d);
  }
  function ymd(d) {
    const m = d.getMonth() + 1,
      dd = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (dd < 10 ? "0" : "") + dd;
  }
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function prettyDate(s) {
    const p = s.split("-");
    return MONTHS[+p[1] - 1] + " " + +p[2] + ", " + p[0];
  }
  function monthLbl(s) {
    const p = s.split("-");
    return MONTHS[+p[1] - 1] + " '" + p[0].slice(2);
  }
  function num(v, d) {
    return Number(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function money(mxn, opt) {
    opt = opt || {};
    const v0 = state.ccy === "USD" ? mxn / state.fx : mxn;
    const neg = v0 < 0;
    const v = Math.abs(v0);
    const pre = state.ccy === "USD" ? "US$" : "$";
    let body;
    if (opt.compact) body = v >= 1e6 ? (v / 1e6).toFixed(2) + "M" : v >= 1e3 ? Math.round(v / 1e3) + "k" : Math.round(v) + "";
    else body = Math.round(v).toLocaleString("en-US");
    return (neg ? "−" : opt.sign && v > 0.5 ? "+" : "") + pre + body;
  }
  function native(tk, px) {
    const usd = I[tk].ccy === "USD";
    return (usd ? "US$" : "$") + num(px, 2);
  }
  function pct(x, sign) {
    return (sign && x > 0.005 ? "+" : x < -0.005 ? "−" : "") + Math.abs(x).toFixed(1) + "%";
  }
  function posColor(x) {
    return x >= 0 ? "#3a7a4e" : "#a03327";
  }
  function qtyStr(tk, q) {
    return I[tk].frac ? num(q, q % 1 ? 2 : 0) : num(q, 0);
  }
  function flash(msg) {
    state.toast = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      state.toast = "";
      render();
    }, 5200);
  }
  function sname(id) {
    return STRATS.filter((x) => x.id === id)[0];
  }
  function displayTk(tk) {
    return tk === "FTLIQU" ? "FT-LIQU" : tk;
  }

  // ---------- engine: everything derives from the ledger ----------
  function calc() {
    const fx = state.fx;
    const pm = (tk) => state.prices[tk] * (I[tk].ccy === "USD" ? fx : 1);
    const lots = {};
    const cash = { core: 0, growth: 0, reserve: 0 };
    const dep = { core: 0, growth: 0, reserve: 0 };
    const sorted = state.txns.slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id - b.id));
    sorted.forEach((x) => {
      if (x.type === "DEPOSIT") {
        cash[x.strat] += x.amt;
        dep[x.strat] += x.amt;
        return;
      }
      if (x.type === "WITHDRAWAL") {
        cash[x.strat] -= x.amt;
        dep[x.strat] -= x.amt;
        return;
      }
      const k = x.strat + "|" + x.ticker + "|" + x.broker;
      const L = lots[k] || (lots[k] = { strat: x.strat, ticker: x.ticker, broker: x.broker, qty: 0, cost: 0 });
      const gross = x.qty * x.px * (I[x.ticker].ccy === "USD" ? x.fx : 1);
      if (x.type === "BUY") {
        L.qty += x.qty;
        L.cost += gross;
        cash[x.strat] -= gross;
      } else {
        const avg = L.qty > 0 ? L.cost / L.qty : 0;
        const q = Math.min(x.qty, L.qty);
        L.cost -= avg * q;
        L.qty -= q;
        cash[x.strat] += gross;
      }
    });
    const pos = [];
    Object.keys(lots).forEach((k) => {
      const L = lots[k];
      if (L.qty > 1e-6) pos.push({ strat: L.strat, ticker: L.ticker, broker: L.broker, qty: L.qty, cost: L.cost, value: L.qty * pm(L.ticker) });
    });
    const strats = STRATS.map((st) => {
      const P = pos.filter((p) => p.strat === st.id);
      let H = 0,
        cost = 0;
      P.forEach((p) => {
        H += p.value;
        cost += p.cost;
      });
      const tg = state.targets[st.id];
      const tks = Object.keys(tg).slice();
      P.forEach((p) => {
        if (tks.indexOf(p.ticker) < 0) tks.push(p.ticker);
      });
      const rows = tks.map((tk) => {
        let v = 0;
        const br = [];
        P.forEach((p) => {
          if (p.ticker === tk) {
            v += p.value;
            if (br.indexOf(p.broker) < 0) br.push(p.broker);
          }
        });
        const cur = H > 0 ? (v / H) * 100 : 0;
        const t = tg[tk] || 0;
        return { tk, v, cur, tgt: t, drift: cur - t, brokers: br };
      });
      let maxDrift = 0;
      rows.forEach((r) => {
        if (Math.abs(r.drift) > Math.abs(maxDrift)) maxDrift = r.drift;
      });
      let tsum = 0;
      Object.keys(tg).forEach((k) => (tsum += tg[k]));
      const brokers = [];
      P.forEach((p) => {
        if (brokers.indexOf(p.broker) < 0) brokers.push(p.broker);
      });
      return { id: st.id, name: st.name, color: st.color, kind: st.kind, goal: st.goal, thr: st.threshold, H, cost, cash: cash[st.id], total: H + cash[st.id], dep: dep[st.id], rows, maxDrift, drifted: Math.abs(maxDrift) > st.threshold, tsum, brokers, pos: P };
    });
    const t = { total: 0, dep: 0, H: 0, cost: 0, cash: 0 };
    strats.forEach((x) => {
      t.total += x.total;
      t.dep += x.dep;
      t.H += x.H;
      t.cost += x.cost;
      t.cash += x.cash;
    });
    return { pm, pos, strats, total: t.total, dep: t.dep, H: t.H, cost: t.cost, cash: t.cash };
  }

  function plan(c) {
    const rb = state.rb;
    const S = c.strats.filter((x) => x.id === rb.strat)[0];
    const tg = state.targets[rb.strat];
    let A = Math.max(0, parseFloat(String(rb.amt).replace(/[^0-9.]/g, "")) || 0);
    const H = S.H;
    const vals = {};
    const tks = S.rows.map((r) => {
      vals[r.tk] = r.v;
      return r.tk;
    });
    const raw = {};
    if (rb.mode === "DEPOSIT") {
      const N = H + A;
      let sum = 0;
      const need = {};
      tks.forEach((tk) => {
        need[tk] = Math.max(0, ((tg[tk] || 0) / 100) * N - vals[tk]);
        sum += need[tk];
      });
      tks.forEach((tk) => (raw[tk] = sum > 0 ? (need[tk] * A) / sum : (A * (tg[tk] || 0)) / 100));
    } else if (rb.mode === "WITHDRAWAL") {
      A = Math.min(A, H);
      const N2 = H - A;
      let sum2 = 0;
      const exc = {};
      tks.forEach((tk) => {
        exc[tk] = Math.max(0, vals[tk] - ((tg[tk] || 0) / 100) * N2);
        sum2 += exc[tk];
      });
      tks.forEach((tk) => (raw[tk] = -(sum2 > 0 ? (exc[tk] * A) / sum2 : 0)));
    } else {
      tks.forEach((tk) => {
        const d = ((tg[tk] || 0) / 100) * H - vals[tk];
        raw[tk] = Math.abs(d) > H * 0.004 ? d : 0;
      });
    }
    const orders = [];
    tks.forEach((tk) => {
      const amt = raw[tk];
      if (!amt) return;
      const p = c.pm(tk);
      let q = Math.abs(amt) / p;
      q = I[tk].frac ? Math.floor(q * 100) / 100 : Math.floor(q);
      if (q <= 0) return;
      const holds = S.pos.filter((x) => x.ticker === tk).sort((a, b) => b.qty - a.qty);
      if (amt > 0) {
        orders.push({ side: "BUY", tk, broker: holds.length ? holds[0].broker : I[tk].broker, qty: q, amt: q * p });
      } else {
        let rem = q;
        holds.forEach((h) => {
          if (rem <= 1e-9) return;
          let qq = Math.min(rem, h.qty);
          qq = I[tk].frac ? Math.round(qq * 100) / 100 : Math.floor(qq);
          if (qq > 0) {
            orders.push({ side: "SELL", tk, broker: h.broker, qty: qq, amt: qq * p });
            rem -= qq;
          }
        });
      }
    });
    orders.sort((a, b) => (a.side === b.side ? b.amt - a.amt : a.side === "SELL" ? -1 : 1));
    const after = {};
    tks.forEach((tk) => (after[tk] = vals[tk]));
    orders.forEach((o) => (after[o.tk] += o.side === "BUY" ? o.amt : -o.amt));
    let HA = 0;
    tks.forEach((tk) => (HA += after[tk]));
    const rows = tks.map((tk) => ({ tk, before: H > 0 ? (vals[tk] / H) * 100 : 0, tgt: tg[tk] || 0, after: HA > 0 ? (after[tk] / HA) * 100 : 0 }));
    let buys = 0,
      sells = 0;
    orders.forEach((o) => {
      if (o.side === "BUY") buys += o.amt;
      else sells += o.amt;
    });
    let maxAfter = 0;
    rows.forEach((r) => (maxAfter = Math.max(maxAfter, Math.abs(r.after - r.tgt))));
    return { S, A, orders, rows, buys, sells, maxAfter, maxBefore: Math.abs(S.maxDrift) };
  }

  function history(c) {
    const start = new Date(2025, 0, 13),
      end = new Date();
    const dates = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 7)) dates.push(ymd(d));
    dates.push(ymd(end));
    const flows = state.txns.filter((x) => x.type === "DEPOSIT" || x.type === "WITHDRAWAL");
    const n = dates.length;
    const R = c.dep > 0 ? c.total / c.dep - 1 : 0;
    return dates.map((ds, i) => {
      let inv = 0;
      flows.forEach((x) => {
        if (x.date <= ds) inv += x.type === "DEPOSIT" ? x.amt : -x.amt;
      });
      const f = n > 1 ? i / (n - 1) : 1;
      const noise = (0.03 * Math.sin(i * 0.55) + 0.017 * Math.sin(i * 1.7 + 1)) * Math.min(1, (1 - f) * 6);
      const r = R * Math.pow(f, 0.9) + noise;
      if (i === n - 1) return { date: ds, inv: c.dep, val: c.total };
      return { date: ds, inv, val: inv * (1 + r) };
    });
  }

  function chartGeom(pts) {
    const W0 = 60,
      W1 = 632,
      Y0 = 14,
      Y1 = 196;
    let lo = Infinity,
      hi = -Infinity;
    pts.forEach((p) => {
      lo = Math.min(lo, p.val, p.inv);
      hi = Math.max(hi, p.val, p.inv);
    });
    const pad = (hi - lo) * 0.1 || 1;
    lo -= pad;
    hi += pad;
    const n = pts.length;
    const X = (i) => W0 + (W1 - W0) * (n > 1 ? i / (n - 1) : 0);
    const Y = (v) => Y1 - ((v - lo) / (hi - lo)) * (Y1 - Y0);
    let line = "",
      inv = "";
    pts.forEach((p, i) => {
      line += (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(p.val).toFixed(1);
      inv += (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(p.inv).toFixed(1);
    });
    const area = line + "L" + X(n - 1).toFixed(1) + " " + Y1 + "L" + W0 + " " + Y1 + "Z";
    const at = (y) => money(lo + ((Y1 - y) / (Y1 - Y0)) * (hi - lo), { compact: true });
    const xi = (k) => pts[Math.min(n - 1, Math.round((n - 1) * k))].date;
    return {
      line,
      inv,
      area,
      lx: X(n - 1).toFixed(1),
      ly: Y(pts[n - 1].val).toFixed(1),
      y1: at(30),
      y2: at(105),
      y3: at(180),
      x1: monthLbl(xi(0)),
      x2: monthLbl(xi(1 / 3)),
      x3: monthLbl(xi(2 / 3)),
      x4: "Today",
    };
  }

  // ---------- actions ----------
  function simulate(kind) {
    const p = Object.assign({}, state.prices);
    const mv = {};
    const shocks = kind === "rally" ? { VOO: 0.045, QQQ: 0.09, VXUS: 0.01, AGG: -0.004, NAFTRAC: 0.004, FTLIQU: 0.0003 } : null;
    TICKERS.forEach((tk) => {
      const r = shocks ? shocks[tk] : tk === "FTLIQU" ? 0.0003 : (Math.random() - 0.46) * (tk === "AGG" ? 0.008 : 0.028);
      p[tk] = p[tk] * (1 + r);
      mv[tk] = r * 100;
    });
    state.prices = p;
    state.moves = mv;
    state.fx = state.fx * (1 + (Math.random() - 0.5) * 0.006);
    flash(
      kind === "rally"
        ? "US tech rally: QQQ +9.0%, VOO +4.5%. Retirement Core and Growth moved away from their targets."
        : "Simulated one market day. Values, returns and drift now use the new prices."
    );
    render();
  }

  function parseNum(v) {
    return parseFloat(String(v).replace(/[^0-9.]/g, ""));
  }

  function addTxn() {
    const f = state.form;
    const c = calc();
    const S = c.strats.filter((x) => x.id === f.strat)[0];
    const setErr = (m) => {
      state.formMsg = m;
      state.formErr = true;
      render();
    };
    const tx = { id: nextId++, date: today(), type: f.type, strat: f.strat, broker: null, ticker: null, qty: 0, px: 0, fx: state.fx, amt: 0, fresh: true };
    let msg;
    if (f.type === "DEPOSIT" || f.type === "WITHDRAWAL") {
      const a = parseNum(f.amt);
      if (!(a > 0)) return setErr("Enter an amount greater than zero.");
      if (f.type === "WITHDRAWAL" && a > S.cash + 0.5) return setErr(S.name + " only has " + money(S.cash) + " in cash. Sell something first (Rebalance → Need liquidity).");
      tx.amt = a;
      msg = (f.type === "DEPOSIT" ? "Deposited " : "Withdrew ") + money(a) + (f.type === "DEPOSIT" ? " into " : " from ") + S.name + ".";
    } else {
      const q = parseNum(f.qty),
        px = parseNum(f.px);
      if (!(q > 0) || !(px > 0)) return setErr("Enter a quantity and a price.");
      if (!I[f.ticker].frac && q % 1) return setErr(f.ticker + " trades in whole units.");
      const gross = q * px * (I[f.ticker].ccy === "USD" ? state.fx : 1);
      if (f.type === "BUY" && gross > S.cash + 0.5) return setErr("Not enough cash in " + S.name + " (" + money(S.cash) + "). Record a deposit first.");
      if (f.type === "SELL") {
        let held = 0;
        S.pos.forEach((p) => {
          if (p.ticker === f.ticker && p.broker === f.broker) held += p.qty;
        });
        if (q > held + 1e-9) return setErr(S.name + " holds " + qtyStr(f.ticker, held) + " " + f.ticker + " at " + BROKERS[f.broker] + ".");
      }
      tx.broker = f.broker;
      tx.ticker = f.ticker;
      tx.qty = q;
      tx.px = px;
      msg = (f.type === "BUY" ? "Bought " : "Sold ") + qtyStr(f.ticker, q) + " " + f.ticker + " for " + S.name + " at " + BROKERS[f.broker] + ". Holdings updated.";
    }
    state.txns = state.txns.map((x) => Object.assign({}, x, { fresh: false }));
    state.txns.push(tx);
    state.formMsg = msg;
    state.formErr = false;
    render();
  }

  function execute() {
    const c = calc();
    const pl = plan(c);
    const rb = state.rb;
    if (!pl.orders.length) return;
    const d = today();
    const list = state.txns.map((x) => Object.assign({}, x, { fresh: false }));
    const mk = (o) => Object.assign({ id: nextId++, date: d, strat: rb.strat, broker: null, ticker: null, qty: 0, px: 0, fx: state.fx, amt: 0, fresh: true }, o);
    if (rb.mode === "DEPOSIT") {
      const extra = rb.fromCash ? Math.max(0, pl.A - pl.S.cash) : pl.A;
      if (extra > 0.5) list.push(mk({ type: "DEPOSIT", amt: Math.round(extra) }));
    }
    pl.orders.forEach((o) => list.push(mk({ type: o.side, broker: o.broker, ticker: o.tk, qty: o.qty, px: state.prices[o.tk] })));
    if (rb.mode === "WITHDRAWAL") list.push(mk({ type: "WITHDRAWAL", amt: Math.round(pl.sells) }));
    state.txns = list;
    state.rb = Object.assign({}, rb, { amt: rb.mode === "DRIFT" ? rb.amt : "0", fromCash: false });
    const n = pl.orders.length;
    flash("Recorded " + n + " trade" + (n > 1 ? "s" : "") + " in " + pl.S.name + ". Max drift is now " + pl.maxAfter.toFixed(1) + "%. See them in Transactions.");
    render();
  }

  // ---------- DOM helpers ----------
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k.startsWith("on")) node.addEventListener(k.slice(2), attrs[k]);
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach((c) => {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }
  function svgIcon(paths, size) {
    size = size || 14;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    paths.forEach((d) => {
      const p = document.createElementNS(ns, "path");
      p.setAttribute("d", d);
      svg.appendChild(p);
    });
    return svg;
  }
  const ICONS = {
    dashboard: ["M3 3h7v9H3z", "M14 3h7v5h-7z", "M14 12h7v9h-7z", "M3 16h7v5H3z"],
    strategies: ["M22 7 13.5 15.5 8.5 10.5 2 17", "M16 7h6v6"],
    transactions: ["M8 3 4 7l4 4", "M4 7h16", "m16 21 4-4-4-4", "M20 17H4"],
    rebalance: ["M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", "M21 3v5h-5", "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", "M8 16H3v5"],
    brokers: ["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"],
    check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"],
    alert: ["m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z", "M12 9v4", "M12 17h.01"],
    trend: ["M22 7 13.5 15.5 8.5 10.5 2 17", "M16 7h6v6"],
    cash: ["M21 12V7H5a2 2 0 0 1 0-4h14v4", "M3 5v14a2 2 0 0 0 2 2h16v-5", "M18 12a2 2 0 0 0 0 4h4v-4Z"],
    minus: ["M5 12h14"],
    plus: ["M5 12h14", "M12 5v14"],
  };

  // ---------- render ----------
  function render() {
    const c = calc();
    root.innerHTML = "";
    root.appendChild(buildToolbar());
    root.appendChild(buildToast());
    root.appendChild(buildPage(c));
    root.appendChild(buildCaption());
  }

  function buildToolbar() {
    const tabs = [
      ["dashboard", "Dashboard"],
      ["strategies", "Strategies"],
      ["transactions", "Transactions"],
      ["rebalance", "Rebalance"],
      ["brokers", "Brokers"],
    ];
    const tabEls = tabs.map(([id, label]) =>
      el(
        "button",
        {
          class: "mockup-tab",
          role: "tab",
          "aria-selected": String(state.tab === id),
          onclick: () => {
            state.tab = id;
            render();
          },
        },
        [label]
      )
    );
    const toggle = el("div", { class: "mockup-toggle", role: "group", "aria-label": "Currency" }, [
      el("button", { "aria-pressed": String(state.ccy === "MXN"), onclick: () => { state.ccy = "MXN"; render(); } }, ["MXN"]),
      el("button", { "aria-pressed": String(state.ccy === "USD"), onclick: () => { state.ccy = "USD"; render(); } }, ["USD"]),
    ]);
    return el("div", { class: "mockup-toolbar" }, [el("div", { class: "mockup-tabs", role: "tablist", "aria-label": "Gael sections" }, tabEls), toggle]);
  }

  function buildToast() {
    if (!state.toast) return el("div", {}, []);
    return el("div", { class: "mockup-alert", style: "border-left-color:#3a7a4e" }, [el("span", { class: "icon", style: "color:#3a7a4e" }, [svgIcon(ICONS.check, 15)]), el("span", {}, [state.toast])]);
  }

  function buildCaption() {
    return el("p", { class: "placeholder-note", style: "margin-top:12px" }, [
      "Interactive recreation of Gael's UI using a fabricated sample ledger — try recording a transaction, simulating a market move, or rebalancing. The real app is a local-first Electron + FastAPI + SQLite tool that never leaves my machine.",
    ]);
  }

  function buildPage(c) {
    if (state.tab === "dashboard") return buildDashboard(c);
    if (state.tab === "strategies") return buildStrategies(c);
    if (state.tab === "transactions") return buildTransactions(c);
    if (state.tab === "rebalance") return buildRebalance(c);
    return buildBrokers(c);
  }

  function statTile(label, value, sub, subColor) {
    return el("div", { class: "mockup-stat" }, [
      el("div", { class: "label" }, [label]),
      el("div", { class: "value" }, [value]),
      el("div", { class: "amount", style: "margin-top:6px;font-size:.75rem;color:" + (subColor || "var(--color-ink-muted)") }, [sub]),
    ]);
  }

  function buildDashboard(c) {
    const wrap = el("div", {}, []);

    const unrl = c.H - c.cost;
    const unrlPct = c.cost > 0 ? (unrl / c.cost) * 100 : 0;
    const ret = c.dep > 0 ? (c.total / c.dep - 1) * 100 : 0;
    const cashStrats = c.strats.filter((x) => x.cash > 10000);

    const actionsBtnRow = el("div", { style: "display:flex;gap:8px;margin-bottom:16px" }, [
      el("button", { class: "mockup-tab", onclick: () => simulate("day") }, ["Simulate a day"]),
      el("button", { class: "mockup-tab", style: "background:var(--color-ink);color:var(--color-bg)", onclick: () => simulate("rally") }, ["US tech rally"]),
    ]);
    wrap.appendChild(actionsBtnRow);

    wrap.appendChild(
      el("div", { class: "mockup-stat-grid" }, [
        statTile("Total value", money(c.total), money(c.dep) + " invested"),
        statTile("Unrealized P&L", money(unrl, { sign: true }), pct(unrlPct, true) + " on cost basis", posColor(unrl)),
        statTile("Return (all-time)", pct(ret, true), money(c.total - c.dep, { sign: true }) + " since Jan 2025", posColor(ret)),
        statTile("Uninvested cash", money(c.cash), cashStrats.length ? cashStrats.map((x) => x.name).join(", ") + " ready to deploy" : "Fully invested"),
      ])
    );

    // action items
    const actions = [];
    c.strats.forEach((x) => {
      if (x.cash > 10000)
        actions.push({
          icon: ICONS.cash,
          color: "#b48a2a",
          text: money(x.cash) + " uninvested in " + x.name,
          cta: "Deploy →",
          go: () => {
            state.tab = "rebalance";
            state.rb = { strat: x.id, mode: "DEPOSIT", amt: String(Math.floor(x.cash)), fromCash: true };
            render();
          },
        });
    });
    c.strats.forEach((x) => {
      if (x.drifted)
        actions.push({
          icon: ICONS.trend,
          color: "var(--color-accent)",
          text: x.name + " drifted " + pct(Math.abs(x.maxDrift)) + " from target (threshold " + x.thr + ".0%)",
          cta: "Rebalance →",
          go: () => {
            state.tab = "rebalance";
            state.rb = { strat: x.id, mode: "DRIFT", amt: state.rb.amt, fromCash: false };
            render();
          },
        });
    });
    if (actions.length) {
      const panel = el("div", { class: "mockup-panel" }, [el("h4", {}, ["What needs your attention (" + actions.length + ")"])]);
      actions.forEach((a) => {
        panel.appendChild(
          el("div", { class: "mockup-alert" }, [
            el("span", { class: "icon", style: "color:" + a.color }, [svgIcon(a.icon, 15)]),
            el("span", { style: "flex:1" }, [a.text]),
            el("button", { class: "mockup-tab", style: "flex-shrink:0", onclick: a.go }, [a.cta]),
          ])
        );
      });
      wrap.appendChild(panel);
    } else {
      wrap.appendChild(
        el("div", { class: "mockup-alert", style: "border-left-color:#3a7a4e" }, [
          el("span", { class: "icon", style: "color:#3a7a4e" }, [svgIcon(ICONS.check, 15)]),
          el("span", {}, ['Portfolio is on track. Try "US tech rally" to push it off target.']),
        ])
      );
    }

    // chart
    const hist = history(c);
    const take = { "3M": 14, "6M": 27, "1Y": 53, ALL: 9999 }[state.range];
    const pts = hist.slice(Math.max(0, hist.length - take));
    const g = chartGeom(pts);
    const chartPanel = el("div", { class: "mockup-panel" }, []);
    const rangeRow = el("div", { style: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px" }, [
      el("h4", { style: "margin:0" }, ["Portfolio value"]),
      el(
        "div",
        { style: "display:flex;gap:4px" },
        ["3M", "6M", "1Y", "ALL"].map((r) =>
          el(
            "button",
            {
              class: "mockup-tab",
              style: state.range === r ? "" : "background:transparent",
              "aria-selected": String(state.range === r),
              onclick: () => {
                state.range = r;
                render();
              },
            },
            [r]
          )
        )
      ),
    ]);
    chartPanel.appendChild(rangeRow);
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("viewBox", "0 0 640 226");
    svg.style.display = "block";
    const mk = (tag, attrs) => {
      const n = document.createElementNS(svgNS, tag);
      Object.keys(attrs).forEach((k) => n.setAttribute(k, attrs[k]));
      return n;
    };
    svg.appendChild(mk("line", { x1: 60, x2: 632, y1: 30, y2: 30, stroke: "var(--color-border)", "stroke-dasharray": "3 3" }));
    svg.appendChild(mk("line", { x1: 60, x2: 632, y1: 105, y2: 105, stroke: "var(--color-border)", "stroke-dasharray": "3 3" }));
    svg.appendChild(mk("line", { x1: 60, x2: 632, y1: 180, y2: 180, stroke: "var(--color-border)", "stroke-dasharray": "3 3" }));
    [
      [0, 34, g.y1],
      [0, 109, g.y2],
      [0, 184, g.y3],
    ].forEach(([x, y, t]) => {
      const txt = mk("text", { x, y, fill: "var(--color-ink-muted)", "font-size": 11 });
      txt.textContent = t;
      svg.appendChild(txt);
    });
    svg.appendChild(mk("path", { d: g.area, fill: "rgba(181,71,43,0.14)" }));
    svg.appendChild(mk("path", { d: g.inv, fill: "none", stroke: "#c9a98f", "stroke-width": 1.5, "stroke-dasharray": "4 3" }));
    svg.appendChild(mk("path", { d: g.line, fill: "none", stroke: "var(--color-accent)", "stroke-width": 2, "stroke-linejoin": "round" }));
    svg.appendChild(mk("circle", { cx: g.lx, cy: g.ly, r: 4, fill: "var(--color-bg)", stroke: "var(--color-accent)", "stroke-width": 2 }));
    [
      [60, 220, g.x1, "start"],
      [250, 220, g.x2, "middle"],
      [442, 220, g.x3, "middle"],
      [632, 220, g.x4, "end"],
    ].forEach(([x, y, t, anchor]) => {
      const txt = mk("text", { x, y, fill: "var(--color-ink-muted)", "font-size": 11, "text-anchor": anchor });
      txt.textContent = t;
      svg.appendChild(txt);
    });
    chartPanel.appendChild(svg);
    wrap.appendChild(chartPanel);

    // donut allocation
    const tot = c.total || 1;
    const donutPanel = el("div", { class: "mockup-panel" }, [el("h4", {}, ["Allocation by strategy"])]);
    c.strats.forEach((x) => {
      const w = ((Math.max(0, x.total) / tot) * 100).toFixed(0) + "%";
      donutPanel.appendChild(
        el("div", { class: "mockup-row" }, [
          el("span", { class: "name" }, [el("span", { class: "swatch", style: "background:" + x.color }), x.name]),
          el("span", { class: "amount" }, [((x.total / tot) * 100).toFixed(1) + "%"]),
        ])
      );
      donutPanel.appendChild(
        el("div", { class: "mockup-bar-track", style: "margin-bottom:10px" }, [el("div", { class: "mockup-bar-fill", style: "width:" + w + ";background:" + x.color })])
      );
    });
    wrap.appendChild(donutPanel);

    // holdings
    const holdings = TICKERS.map((tk) => {
      let q = 0,
        v = 0,
        cost = 0;
      const br = [];
      c.pos.forEach((p) => {
        if (p.ticker === tk) {
          q += p.qty;
          v += p.value;
          cost += p.cost;
          if (br.indexOf(BSHORT[p.broker]) < 0) br.push(BSHORT[p.broker]);
        }
      });
      if (q <= 0) return null;
      const mv = state.moves[tk];
      return { tk: displayTk(tk), name: I[tk].name, brokers: br.join(" · "), qty: qtyStr(tk, q), px: native(tk, state.prices[tk]), move: mv == null ? "—" : pct(mv, true), moveFg: mv == null ? "var(--color-ink-muted)" : posColor(mv), value: money(v), pnl: pct(cost > 0 ? (v / cost - 1) * 100 : 0, true), pnlFg: posColor(v - cost), v };
    })
      .filter(Boolean)
      .sort((a, b) => b.v - a.v);
    const holdPanel = el("div", { class: "mockup-panel" }, [el("h4", {}, ["Holdings · consolidated across brokers"])]);
    holdings.forEach((h) => {
      holdPanel.appendChild(
        el("div", { class: "mockup-row" }, [
          el("span", { class: "name" }, [el("span", { style: "font-weight:600;color:var(--color-accent);font-size:.75rem" }, [h.tk]), " " + h.name]),
          el("span", { class: "amount" }, [h.qty + " · " + h.px + " · ", el("span", { style: "color:" + h.moveFg }, [h.move]), " · " + h.value + " · ", el("span", { style: "color:" + h.pnlFg }, [h.pnl])]),
        ])
      );
    });
    wrap.appendChild(holdPanel);

    return wrap;
  }

  function buildStrategies(c) {
    const wrap = el("div", {}, []);
    c.strats.forEach((x) => {
      const panel = el("div", { class: "mockup-panel" }, []);
      panel.appendChild(
        el("div", { style: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px" }, [
          el("h4", { style: "margin:0" }, [x.name + " · " + x.kind]),
          el("span", { style: "font-size:.75rem;font-weight:600;color:" + (x.drifted ? "var(--color-accent)" : "#3a7a4e") }, [x.drifted ? "Drifted " + pct(Math.abs(x.maxDrift)) : "On target"]),
        ])
      );
      panel.appendChild(el("div", { style: "font-size:.8125rem;color:var(--color-ink-muted);margin-bottom:10px" }, [x.goal]));
      panel.appendChild(
        el("div", { class: "mockup-row" }, [
          el("span", { class: "name" }, ["Invested value"]),
          el("span", { class: "amount" }, [money(x.H) + " · cash " + money(x.cash)]),
        ])
      );
      x.rows.forEach((r) => {
        const alert = Math.abs(r.drift) > x.thr;
        const step = (dlt) => () => {
          const t = state.targets[x.id];
          t[r.tk] = Math.max(0, Math.min(100, (t[r.tk] || 0) + dlt));
          render();
        };
        const row = el("div", { class: "mockup-slider-row" }, [
          el("label", {}, [displayTk(r.tk) + "  (target " + r.tgt + "%)"]),
          el("div", { class: "mockup-bar-track" }, [el("div", { class: "mockup-bar-fill", style: "width:" + Math.min(100, r.cur).toFixed(0) + "%;background:" + (alert ? "var(--color-accent)" : x.color) })]),
          el("button", { class: "mockup-tab", "aria-label": "Lower target", onclick: step(-5) }, ["−"]),
          el("span", { class: "readout" }, [r.cur.toFixed(1) + "%"]),
          el("button", { class: "mockup-tab", "aria-label": "Raise target", onclick: step(5) }, ["+"]),
        ]);
        panel.appendChild(row);
      });
      panel.appendChild(
        el("button", {
          class: "mockup-tab",
          onclick: () => {
            state.tab = "rebalance";
            state.rb = { strat: x.id, mode: "DRIFT", amt: state.rb.amt, fromCash: false };
            render();
          },
        }, ["Rebalance →"])
      );
      wrap.appendChild(panel);
    });
    return wrap;
  }

  function buildTransactions(c) {
    const wrap = el("div", { style: "display:grid;grid-template-columns:minmax(240px,300px) 1fr;gap:16px" }, []);
    const f = state.form;
    const isTrade = f.type === "BUY" || f.type === "SELL";
    const FS = c.strats.filter((x) => x.id === f.strat)[0];

    const form = el("div", { class: "mockup-panel" }, [el("h4", {}, ["Record a transaction"])]);

    const typeRow = el("div", { style: "display:flex;gap:4px;margin-bottom:12px" }, []);
    ["BUY", "SELL", "DEPOSIT", "WITHDRAWAL"].forEach((t) => {
      typeRow.appendChild(
        el(
          "button",
          {
            class: "mockup-tab",
            "aria-selected": String(f.type === t),
            onclick: () => {
              state.form = Object.assign({}, f, { type: t });
              state.formMsg = "";
              render();
            },
          },
          [t === "WITHDRAWAL" ? "WITHDRAW" : t]
        )
      );
    });
    form.appendChild(typeRow);

    function selectField(label, value, options, onChange) {
      const wrap2 = el("div", { style: "margin-bottom:10px" }, [el("label", { style: "display:block;font-size:.75rem;color:var(--color-ink-muted);margin-bottom:4px" }, [label])]);
      const sel = el("select", { style: "width:100%;padding:8px;border-radius:6px;border:1px solid var(--color-border-strong);background:var(--color-bg);color:var(--color-ink)" }, []);
      options.forEach(([v, l]) => {
        const opt = el("option", { value: v }, [l]);
        if (v === value) opt.setAttribute("selected", "selected");
        sel.appendChild(opt);
      });
      sel.addEventListener("change", (e) => onChange(e.target.value));
      wrap2.appendChild(sel);
      return wrap2;
    }
    function textField(label, value, onChange) {
      const wrap2 = el("div", { style: "margin-bottom:10px" }, [el("label", { style: "display:block;font-size:.75rem;color:var(--color-ink-muted);margin-bottom:4px" }, [label])]);
      const inp = el("input", { type: "text", value: value, style: "width:100%;padding:8px;border-radius:6px;border:1px solid var(--color-border-strong);background:var(--color-bg);color:var(--color-ink);box-sizing:border-box" }, []);
      inp.value = value;
      inp.addEventListener("change", (e) => onChange(e.target.value));
      wrap2.appendChild(inp);
      return wrap2;
    }

    form.appendChild(
      selectField(
        "Strategy",
        f.strat,
        STRATS.map((s) => [s.id, s.name]),
        (v) => {
          state.form = Object.assign({}, f, { strat: v });
          render();
        }
      )
    );

    if (isTrade) {
      form.appendChild(
        selectField(
          "Ticker",
          f.ticker,
          TICKERS.map((t) => [t, displayTk(t)]),
          (v) => {
            state.form = Object.assign({}, f, { ticker: v, px: String(Math.round(state.prices[v] * 100) / 100) });
            render();
          }
        )
      );
      form.appendChild(
        selectField(
          "Broker",
          f.broker,
          Object.keys(BROKERS).map((b) => [b, BROKERS[b]]),
          (v) => {
            state.form = Object.assign({}, f, { broker: v });
            render();
          }
        )
      );
      form.appendChild(
        textField("Quantity", f.qty, (v) => {
          state.form = Object.assign({}, f, { qty: v });
          render();
        })
      );
      form.appendChild(
        textField("Price (" + I[f.ticker].ccy + ")", f.px, (v) => {
          state.form = Object.assign({}, f, { px: v });
          render();
        })
      );
    } else {
      form.appendChild(
        textField("Amount (MXN)", f.amt, (v) => {
          state.form = Object.assign({}, f, { amt: v });
          render();
        })
      );
    }

    let preview;
    if (isTrade) {
      const g = parseNum(f.qty) * parseNum(f.px) * (I[f.ticker].ccy === "USD" ? state.fx : 1);
      preview = "Total ≈ " + money(g || 0) + " · " + FS.name + " cash: " + money(FS.cash);
    } else {
      const a = parseNum(f.amt) || 0;
      preview = FS.name + " cash: " + money(FS.cash) + " → " + money(FS.cash + (f.type === "DEPOSIT" ? a : -a));
    }
    form.appendChild(el("div", { style: "font-size:.8125rem;color:var(--color-ink-muted);padding:10px;border:1px dashed var(--color-border-strong);border-radius:6px;margin-bottom:12px" }, [preview]));
    form.appendChild(el("button", { class: "mockup-tab", style: "width:100%;justify-content:center;background:var(--color-ink);color:var(--color-bg)", onclick: addTxn }, ["Add transaction"]));
    if (state.formMsg) form.appendChild(el("div", { style: "margin-top:10px;font-size:.8125rem;color:" + (state.formErr ? "var(--color-accent)" : "#3a7a4e") }, [state.formMsg]));

    wrap.appendChild(form);

    const ledgerPanel = el("div", { class: "mockup-panel" }, [el("h4", {}, ["Ledger · append-only (" + state.txns.length + " entries)"])]);
    const ledger = state.txns
      .slice()
      .sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : b.id - a.id));
    ledger.forEach((t) => {
      const st = sname(t.strat);
      const col = TXC[t.type];
      const trade = t.type === "BUY" || t.type === "SELL";
      const tot = trade ? t.qty * t.px * (I[t.ticker].ccy === "USD" ? t.fx : 1) : t.amt;
      ledgerPanel.appendChild(
        el("div", { class: "mockup-row", style: t.fresh ? "background:rgba(181,71,43,0.05)" : "" }, [
          el("span", { class: "name" }, [
            el("span", { style: "font-size:.6875rem;font-weight:600;padding:2px 7px;border-radius:20px;background:" + col[1] + ";color:" + col[0] }, [t.type === "WITHDRAWAL" ? "WITHDRAW" : t.type]),
            el("span", { class: "swatch", style: "background:" + st.color }),
            prettyDate(t.date) + " · " + st.name + (trade ? " · " + displayTk(t.ticker) + " · " + qtyStr(t.ticker, t.qty) : ""),
          ]),
          el("span", { class: "amount" }, [money(tot)]),
        ])
      );
    });
    wrap.appendChild(ledgerPanel);

    return wrap;
  }

  function buildRebalance(c) {
    const wrap = el("div", {}, []);
    const rb = state.rb;
    const controls = el("div", { class: "mockup-panel" }, [el("h4", {}, ["Rebalance"])]);

    function selectField(label, value, options, onChange) {
      const wrap2 = el("div", { style: "margin-bottom:10px" }, [el("label", { style: "display:block;font-size:.75rem;color:var(--color-ink-muted);margin-bottom:4px" }, [label])]);
      const sel = el("select", { style: "width:100%;padding:8px;border-radius:6px;border:1px solid var(--color-border-strong);background:var(--color-bg);color:var(--color-ink)" }, []);
      options.forEach(([v, l]) => {
        const opt = el("option", { value: v }, [l]);
        if (v === value) opt.setAttribute("selected", "selected");
        sel.appendChild(opt);
      });
      sel.addEventListener("change", (e) => onChange(e.target.value));
      wrap2.appendChild(sel);
      return wrap2;
    }

    controls.appendChild(
      selectField(
        "Strategy",
        rb.strat,
        STRATS.map((s) => [s.id, s.name]),
        (v) => {
          state.rb = Object.assign({}, rb, { strat: v, fromCash: false });
          render();
        }
      )
    );
    controls.appendChild(
      selectField(
        "Action",
        rb.mode,
        [
          ["DEPOSIT", "Deposit (Buy)"],
          ["WITHDRAWAL", "Need liquidity (Sell)"],
          ["DRIFT", "Check drift"],
        ],
        (v) => {
          const nr = Object.assign({}, rb, { mode: v, fromCash: false });
          state.rb = nr;
          render();
        }
      )
    );
    if (rb.mode !== "DRIFT") {
      const inp = el("input", { type: "text", value: rb.amt, style: "width:100%;padding:8px;border-radius:6px;border:1px solid var(--color-border-strong);background:var(--color-bg);color:var(--color-ink);box-sizing:border-box" }, []);
      inp.value = rb.amt;
      inp.addEventListener("change", (e) => {
        state.rb = Object.assign({}, rb, { amt: e.target.value, fromCash: false });
        render();
      });
      controls.appendChild(el("div", { style: "margin-bottom:10px" }, [el("label", { style: "display:block;font-size:.75rem;color:var(--color-ink-muted);margin-bottom:4px" }, [rb.mode === "DEPOSIT" ? "Amount to invest (MXN)" : "Amount you need (MXN)"]), inp]));
    }
    wrap.appendChild(controls);

    const pl = plan(c);
    const RS = pl.S;
    const showCash = RS.cash > 10000 && !(rb.mode === "DEPOSIT" && rb.fromCash);
    if (showCash) {
      wrap.appendChild(
        el("div", { class: "mockup-alert" }, [
          el("span", { class: "icon", style: "color:#b48a2a" }, [svgIcon(ICONS.cash, 16)]),
          el("span", { style: "flex:1" }, [money(RS.cash) + " on cash in " + RS.name + " — Gael can invest it in positions below target."]),
          el(
            "button",
            {
              class: "mockup-tab",
              onclick: () => {
                state.rb = { strat: RS.id, mode: "DEPOSIT", amt: String(Math.floor(RS.cash)), fromCash: true };
                render();
              },
            },
            ["Deploy " + money(RS.cash)]
          ),
        ])
      );
    }

    const headline =
      rb.mode === "DEPOSIT"
        ? rb.fromCash
          ? "Deploy " + money(pl.A) + " of uninvested cash into " + RS.name
          : "Invest " + money(pl.A) + " of new money in " + RS.name + " using buys only"
        : rb.mode === "WITHDRAWAL"
        ? "Raise " + money(pl.A) + " from " + RS.name + " by trimming overweight positions first"
        : "Bring " + RS.name + " back to target, using sales to pay for the buys";

    const summary = el("div", { class: "mockup-stat-grid" }, [
      statTile("Orders", String(pl.orders.length), headline),
      statTile("Total buys", money(pl.buys), " "),
      statTile("Total sells", money(pl.sells), " "),
      statTile("Max drift", pl.maxBefore.toFixed(1) + "% → " + pl.maxAfter.toFixed(1) + "%", "before → after", "#3a7a4e"),
    ]);
    wrap.appendChild(summary);

    const ordersPanel = el("div", { class: "mockup-panel" }, [el("h4", {}, ["Orders"])]);
    if (!pl.orders.length) {
      ordersPanel.appendChild(el("div", { style: "font-size:.8125rem;color:var(--color-ink-muted)" }, [rb.mode === "DRIFT" ? RS.name + " is within 0.4% of every target." : "Enter an amount to see the orders."]));
    } else {
      pl.orders.forEach((o) => {
        ordersPanel.appendChild(
          el("div", { class: "mockup-row" }, [
            el("span", { class: "name" }, [
              el("span", { style: "font-size:.6875rem;font-weight:700;padding:3px 9px;border-radius:20px;background:" + (o.side === "BUY" ? "rgba(181,71,43,0.10)" : "rgba(160,51,39,0.10)") + ";color:" + (o.side === "BUY" ? "var(--color-accent)" : "#a03327") }, [o.side]),
              displayTk(o.tk) + " · " + BROKERS[o.broker],
            ]),
            el("span", { class: "amount" }, [qtyStr(o.tk, o.qty) + " @ " + native(o.tk, state.prices[o.tk]) + " = " + money(o.amt)]),
          ])
        );
      });
      ordersPanel.appendChild(
        el("button", { class: "mockup-tab", style: "margin-top:10px;background:var(--color-ink);color:var(--color-bg)", onclick: execute }, ["Record " + pl.orders.length + " trade" + (pl.orders.length === 1 ? "" : "s")])
      );
      ordersPanel.appendChild(el("div", { style: "font-size:.75rem;color:var(--color-ink-muted);margin-top:8px" }, ["Gael never trades for you. Place these at your broker, then record them here."]));
    }
    wrap.appendChild(ordersPanel);

    return wrap;
  }

  function buildBrokers(c) {
    const wrap = el("div", {}, []);
    wrap.appendChild(
      el("div", { style: "font-size:.8125rem;color:var(--color-ink-muted);margin-bottom:12px" }, [
        "Each broker lists what it holds and which strategy owns it. VOO, for example, is split across two strategies and two brokers, and Gael tracks each part with its own cost basis.",
      ])
    );
    ["IBKR", "GBM", "FINTUAL"].forEach((b) => {
      const P = c.pos.filter((p) => p.broker === b).sort((a, b2) => b2.value - a.value);
      let v = 0,
        cost = 0;
      P.forEach((p) => {
        v += p.value;
        cost += p.cost;
      });
      const panel = el("div", { class: "mockup-panel" }, [
        el("h4", {}, [BROKERS[b] + " · " + P.length + " position" + (P.length === 1 ? "" : "s")]),
        el("div", { class: "mockup-row" }, [el("span", { class: "name" }, ["Value"]), el("span", { class: "amount" }, [money(v)])]),
        el("div", { class: "mockup-row" }, [el("span", { class: "name" }, ["Unrealized P&L"]), el("span", { class: "amount", style: "color:" + posColor(v - cost) }, [money(v - cost, { sign: true }) + " · " + pct(cost > 0 ? (v / cost - 1) * 100 : 0, true)])]),
      ]);
      P.forEach((p) => {
        const st = sname(p.strat);
        panel.appendChild(
          el("div", { class: "mockup-row" }, [
            el("span", { class: "name" }, [el("span", { class: "swatch", style: "background:" + st.color }), displayTk(p.ticker) + " · " + qtyStr(p.ticker, p.qty) + " sh · " + st.name]),
            el("span", { class: "amount" }, [money(p.value)]),
          ])
        );
      });
      wrap.appendChild(panel);
    });
    return wrap;
  }

  render();
})();
