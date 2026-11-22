/* ==========================================================================
   NeuroEng // Prep OS — Módulo Independente "Tabuada" (1 a 12 · 144 Contas)
   - 100% isolado das métricas das 56 sessões do cronograma FURB
   - Sub-aba 1: Tabela Completa Interativa (Grade 12×12 + Cards + Mapa de Calor)
   - Sub-aba 2: Jogo de Reflexo & Memorização Adaptativa (performance.now())
   - Persistência em state.tabuada + sincronização automática via GitHub Gist
   ========================================================================== */
(function (global) {
  "use strict";
  const NE = (global.NE = global.NE || {});
  const S = NE.Store, U = NE.U;
  const esc = U.esc;

  const FAST_THRESHOLD_MS = 3000; // < 3.0s = Automatizado
  const MAX_HISTORY = 120;

  /* ------------------------ acesso ao estado isolado ------------------------ */
  function getTabState() {
    if (!S.state.tabuada || typeof S.state.tabuada !== "object") {
      S.state.tabuada = { stats: {}, history: [] };
    }
    if (!S.state.tabuada.stats || typeof S.state.tabuada.stats !== "object") {
      S.state.tabuada.stats = {};
    }
    if (!Array.isArray(S.state.tabuada.history)) {
      S.state.tabuada.history = [];
    }
    return S.state.tabuada;
  }

  function keyFor(a, b) { return a + "x" + b; }

  function getPairStat(a, b) {
    const st = getTabState().stats[keyFor(a, b)];
    return st || null;
  }

  function statusOf(st) {
    if (!st || !st.attempts) return "untrained";
    if (st.errors > 0 && (!st.lastOk || st.errors >= st.hits)) return "hard";
    if (st.hits > 0 && st.avgTimeMs > 0 && st.avgTimeMs < FAST_THRESHOLD_MS && st.lastOk) return "mastered";
    if (st.errors > 0 && st.avgTimeMs >= 4200) return "hard";
    return "slow";
  }

  const STATUS_META = {
    untrained: { label: "Não treinado", short: "—", cls: "tb-st-untrained" },
    slow:      { label: "Lento / Em treino (≥ 3,0s)", short: "Lento", cls: "tb-st-slow" },
    hard:      { label: "Difícil / Errou", short: "Difícil", cls: "tb-st-hard" },
    mastered:  { label: "Automatizado (< 3,0s)", short: "Auto ✓", cls: "tb-st-mastered" }
  };

  function fmtSec(ms) {
    if (!ms || ms <= 0) return "—";
    return (ms / 1000).toFixed(1).replace(".", ",") + "s";
  }

  function recordAttempt(a, b, ok, timeMs) {
    const tab = getTabState();
    const k = keyFor(a, b);
    const cur = tab.stats[k] || { a: a, b: b, attempts: 0, hits: 0, errors: 0, avgTimeMs: 0, lastTimeMs: 0, lastOk: true, weight: 1 };
    const clampedMs = Math.max(150, Math.min(30000, Math.round(timeMs)));

    cur.a = a;
    cur.b = b;
    cur.attempts = (cur.attempts || 0) + 1;
    cur.lastTimeMs = clampedMs;
    cur.lastOk = !!ok;

    if (ok) {
      cur.hits = (cur.hits || 0) + 1;
      cur.avgTimeMs = cur.avgTimeMs > 0
        ? Math.round(cur.avgTimeMs * 0.65 + clampedMs * 0.35)
        : clampedMs;
      if (clampedMs < FAST_THRESHOLD_MS) {
        cur.weight = Math.max(0.4, (cur.weight || 1) * 0.65);
      } else {
        cur.weight = Math.min(12, Math.max(2.2, (cur.weight || 1) * 1.25 + (clampedMs / 2500)));
      }
    } else {
      cur.errors = (cur.errors || 0) + 1;
      cur.avgTimeMs = cur.avgTimeMs > 0
        ? Math.round(cur.avgTimeMs * 0.7 + Math.max(clampedMs, 4500) * 0.3)
        : Math.max(clampedMs, 4500);
      cur.weight = Math.min(20, (cur.weight || 1) + 4.5);
    }

    tab.stats[k] = cur;
    tab.history.unshift({ k: k, a: a, b: b, ok: !!ok, ms: clampedMs, t: Date.now() });
    if (tab.history.length > MAX_HISTORY) tab.history.length = MAX_HISTORY;
    S.save();
    return cur;
  }

  /* ------------------------ métricas globais (144 contas) ------------------- */
  function computeSummary() {
    const stats = getTabState().stats;
    let mastered = 0, trained = 0, sumMs = 0, countMs = 0;
    const allPairs = [];

    for (let a = 1; a <= 12; a++) {
      for (let b = 1; b <= 12; b++) {
        const k = keyFor(a, b);
        const st = stats[k] || null;
        const status = statusOf(st);
        if (st && st.attempts > 0) {
          trained++;
          if (st.avgTimeMs > 0) { sumMs += st.avgTimeMs; countMs++; }
        }
        if (status === "mastered") mastered++;

        // Score de dificuldade para ranking Top 5 Gargalos
        let score = 0;
        if (st && st.attempts > 0) {
          score = (st.errors * 3500) + (st.avgTimeMs || 0) + (st.lastOk ? 0 : 2500) - (status === "mastered" ? 4000 : 0);
        }
        allPairs.push({ a: a, b: b, k: k, st: st, status: status, score: score });
      }
    }

    // Top 5 contas mais difíceis/lentas entre as já tentadas (ou gargalos clássicos se < 5 tentadas)
    const attemptedBottlenecks = allPairs
      .filter(function (p) { return p.st && p.st.attempts > 0 && p.status !== "mastered"; })
      .sort(function (x, y) { return y.score - x.score; });

    const slowestMastered = allPairs
      .filter(function (p) { return p.st && p.st.attempts > 0 && p.status === "mastered"; })
      .sort(function (x, y) { return (y.st.avgTimeMs || 0) - (x.st.avgTimeMs || 0); });

    const classicFallbacks = [[7, 8], [8, 7], [6, 9], [12, 7], [9, 8], [12, 8], [7, 9]];
    const top5 = attemptedBottlenecks.concat(slowestMastered).slice(0, 5);
    const seen = {};
    top5.forEach(function (p) { seen[p.k] = true; });

    for (let i = 0; i < classicFallbacks.length && top5.length < 5; i++) {
      const ca = classicFallbacks[i][0], cb = classicFallbacks[i][1], ck = keyFor(ca, cb);
      if (!seen[ck]) {
        seen[ck] = true;
        top5.push({ a: ca, b: cb, k: ck, st: stats[ck] || null, status: statusOf(stats[ck]), isFallback: true });
      }
    }

    return {
      mastered: mastered,
      trained: trained,
      total: 144,
      pctMastered: Math.round((mastered / 144) * 100),
      avgMs: countMs > 0 ? Math.round(sumMs / countMs) : 0,
      top5: top5,
      allPairs: allPairs
    };
  }

  /* ---------------------- seletor adaptativo de questões -------------------- */
  function pickNextPair(mode, baseFilter, top5List, lastKey) {
    let pool = [];
    if (mode === "top5" && top5List && top5List.length) {
      pool = top5List.map(function (p) { return { a: p.a, b: p.b, k: p.k }; });
    } else if (mode === "specific" && baseFilter >= 1 && baseFilter <= 12) {
      for (let b = 1; b <= 12; b++) {
        pool.push({ a: baseFilter, b: b, k: keyFor(baseFilter, b) });
      }
    } else {
      for (let a = 1; a <= 12; a++) {
        for (let b = 1; b <= 12; b++) {
          pool.push({ a: a, b: b, k: keyFor(a, b) });
        }
      }
    }

    if (pool.length > 1 && lastKey) {
      pool = pool.filter(function (p) { return p.k !== lastKey; });
    }

    if (mode === "random") {
      return pool[Math.floor(Math.random() * pool.length)];
    }

    // Pesos adaptativos (prioriza erros, lentas e tabuada 6..12 não treinada)
    const stats = getTabState().stats;
    let totalW = 0;
    const weighted = pool.map(function (p) {
      const st = stats[p.k];
      let w = 1.0;
      if (!st || !st.attempts) {
        // Prioriza levemente bases 3..12 sobre 1 e 10
        w = (p.a >= 3 && p.b >= 3 && p.a !== 10 && p.b !== 10) ? 2.4 : 1.1;
      } else {
        const status = statusOf(st);
        if (status === "hard") w = 9.0 + Math.min(10, st.errors * 2.5);
        else if (status === "slow") w = 4.5 + Math.min(5, (st.avgTimeMs - 2500) / 1000);
        else w = 0.45; // Automatizada: aparece raramente só para manutenção
      }
      totalW += w;
      return { pair: p, w: w };
    });

    let r = Math.random() * totalW;
    for (let i = 0; i < weighted.length; i++) {
      r -= weighted[i].w;
      if (r <= 0) return weighted[i].pair;
    }
    return weighted[weighted.length - 1].pair;
  }

  /* ==========================================================================
     MONTAGEM DA VISÃO "#/tabuada"
     ========================================================================== */
  function mount(root) {
    let activeTab = "table";       // "table" (Sub-aba 1) ou "game" (Sub-aba 2)
    let tableLayout = "matrix";    // "matrix" (Grade 12×12) ou "cards" (Cards 1 a 12)
    let tableBase = 0;             // 0 = Todas, 1..12 = filtro por número base
    let gameMode = "adaptive";     // "adaptive" | "random" | "specific" | "top5"
    let gameBase = 7;              // base padrão quando gameMode === "specific"
    let curPair = null;
    let shownAt = 0;
    let sessionCount = 0;
    let sessionHits = 0;
    let lastFeedback = null;

    root.innerHTML =
      '<section class="view-tabuada">' +
      '<header class="view-head">' +
      '<p class="eyebrow mono">MÓDULO INDEPENDENTE · AUTOMAÇÃO ARITMÉTICA</p>' +
      '<h1>Tabuada Completa (1 a 12)</h1>' +
      '<p class="muted">Automatizar de 1×1 até 12×12 libera sua Memória Operacional (IMO 111) para focar 100% na álgebra, nos sinais e na física. Dados isolados do cronograma FURB.</p>' +
      '</header>' +

      '<div id="tb-top-summary"></div>' +

      '<div class="card tb-nav-card">' +
      '<div class="seg tb-subtabs" id="tb-subtabs" role="tablist">' +
      '<button type="button" role="tab" data-tab="table" class="active">1 · Tabela Completa Interativa (1 a 12)</button>' +
      '<button type="button" role="tab" data-tab="game">2 · Jogo de Reflexo &amp; Memorização Adaptativa</button>' +
      '</div>' +
      '<div id="tb-panel"></div>' +
      '</div>' +
      '</section>';

    const $ = function (sel) { return root.querySelector(sel); };

    function renderSummary() {
      const sum = computeSummary();
      const top5HTML = sum.top5.map(function (p) {
        const meta = STATUS_META[p.status];
        const timeLbl = p.st && p.st.avgTimeMs ? fmtSec(p.st.avgTimeMs) : "nova";
        const errLbl = p.st && p.st.errors ? " · " + p.st.errors + " err" : "";
        return '<span class="mono tb-bottleneck ' + meta.cls + '" title="' + esc(meta.label) + '">' +
          p.a + '×' + p.b + '=' + (p.a * p.b) + ' <small>(' + timeLbl + errLbl + ')</small></span>';
      }).join("");

      $("#tb-top-summary").innerHTML =
        '<div class="tb-summary-grid">' +
        '<div class="card metric">' +
        '<span class="mono num">' + sum.pctMastered + '% <small class="muted">(' + sum.mastered + '/144)</small></span>' +
        '<span class="small muted">tabuada automatizada (&lt; 3,0s)</span>' +
        '<div class="bar' + (sum.mastered === 144 ? " done" : "") + '" style="margin-top:.35rem"><div class="bar-fill" style="width:' + sum.pctMastered + '%"></div></div>' +
        '</div>' +

        '<div class="card metric">' +
        '<span class="mono num">' + (sum.avgMs ? fmtSec(sum.avgMs) : "—") + '</span>' +
        '<span class="small muted">tempo médio geral (' + sum.trained + '/144 treinadas)</span>' +
        '</div>' +

        '<div class="card tb-top5-card">' +
        '<div class="tb-top5-head">' +
        '<span class="small muted mono">TOP 5 CONTAS MAIS DIFÍCEIS / LENTAS</span>' +
        '<button type="button" class="btn small-btn primary" id="tb-btn-train-top5">Treinar Só Essas 5</button>' +
        '</div>' +
        '<div class="tb-top5-list">' + top5HTML + '</div>' +
        '</div>' +
        '</div>';

      const btnTop5 = $("#tb-btn-train-top5");
      if (btnTop5) {
        btnTop5.onclick = function () {
          activeTab = "game";
          gameMode = "top5";
          curPair = null;
          lastFeedback = null;
          paintSubtabs();
          renderPanel();
        };
      }
    }

    function paintSubtabs() {
      Array.prototype.forEach.call(root.querySelectorAll("#tb-subtabs button"), function (b) {
        const on = b.dataset.tab === activeTab;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
    }

    /* ---------------- SUB-ABA 1: TABELA COMPLETA INTERATIVA ---------------- */
    function renderTableTab() {
      const panel = $("#tb-panel");
      let basePills = '<button type="button" class="fm-pill' + (tableBase === 0 ? " active" : "") + '" data-base="0">Todas (1–12)</button>';
      for (let n = 1; n <= 12; n++) {
        basePills += '<button type="button" class="fm-pill mono' + (tableBase === n ? " active" : "") + '" data-base="' + n + '">×' + n + '</button>';
      }

      let contentHTML = "";
      if (tableLayout === "matrix" && tableBase === 0) {
        // Grade Matricial 12×12
        let headCells = '<th class="mono">×</th>';
        for (let b = 1; b <= 12; b++) headCells += '<th class="mono">' + b + '</th>';
        let rows = "";
        for (let a = 1; a <= 12; a++) {
          let cells = '<th class="mono">' + a + '</th>';
          for (let b = 1; b <= 12; b++) {
            const st = getPairStat(a, b);
            const status = statusOf(st);
            const meta = STATUS_META[status];
            const tip = a + " × " + b + " = " + (a * b) + " | " + meta.label + (st && st.avgTimeMs ? " | Média: " + fmtSec(st.avgTimeMs) + " (" + st.hits + "✓ / " + st.errors + "✗)" : "");
            cells += '<td class="mono tb-cell ' + meta.cls + '" data-a="' + a + '" data-b="' + b + '" title="' + esc(tip) + '">' +
              '<span class="tb-cell-val">' + (a * b) + '</span>' +
              '<span class="tb-cell-ms">' + (st && st.avgTimeMs ? fmtSec(st.avgTimeMs) : "") + '</span>' +
              '</td>';
          }
          rows += '<tr>' + cells + '</tr>';
        }
        contentHTML =
          '<div class="table-wrap"><table class="tb-matrix" aria-label="Grade Matricial da Tabuada 1 a 12">' +
          '<thead><tr>' + headCells + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
      } else {
        // Cards por número base (1 a 12 ou filtrada)
        const bases = tableBase > 0 ? [tableBase] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        contentHTML = '<div class="tb-cards-grid">' + bases.map(function (a) {
          let masteredInBase = 0;
          const items = [];
          for (let b = 1; b <= 12; b++) {
            const st = getPairStat(a, b);
            const status = statusOf(st);
            if (status === "mastered") masteredInBase++;
            const meta = STATUS_META[status];
            const tip = a + " × " + b + " = " + (a * b) + " — " + meta.label + (st && st.avgTimeMs ? " — Média: " + fmtSec(st.avgTimeMs) : "");
            items.push(
              '<li class="mono tb-card-row ' + meta.cls + '" data-a="' + a + '" data-b="' + b + '" title="' + esc(tip) + '">' +
              '<span>' + a + ' × ' + U.pad(b) + ' = <strong>' + (a * b) + '</strong></span>' +
              '<span class="tb-row-meta">' + (st && st.avgTimeMs ? fmtSec(st.avgTimeMs) : meta.short) + '</span>' +
              '</li>'
            );
          }
          return '<article class="card tb-base-card">' +
            '<div class="tb-base-head"><h3 class="mono">Tabuada do ' + a + '</h3>' +
            '<div class="row tight"><span class="small muted mono">' + masteredInBase + '/12 ✓</span>' +
            '<button type="button" class="btn ghost small-btn" data-train-base="' + a + '">Treinar ×' + a + '</button></div></div>' +
            '<ul class="tb-card-list">' + items.join("") + '</ul>' +
            '</article>';
        }).join("") + '</div>';
      }

      panel.innerHTML =
        '<div class="tb-table-controls">' +
        '<div class="tb-filter-row">' +
        '<div class="fm-pills" id="tb-base-pills">' + basePills + '</div>' +
        '<div class="seg" id="tb-layout-seg">' +
        '<button type="button" data-lay="matrix"' + (tableLayout === "matrix" && tableBase === 0 ? ' class="active"' : '') + '>Grade 12×12</button>' +
        '<button type="button" data-lay="cards"' + (tableLayout === "cards" || tableBase > 0 ? ' class="active"' : '') + '>Cards 1 a 12</button>' +
        '</div>' +
        '</div>' +
        '<div class="tb-legend-row">' +
        '<div class="tb-legend">' +
        '<span class="tb-leg-item tb-st-untrained"><i></i> Não treinado</span>' +
        '<span class="tb-leg-item tb-st-slow"><i></i> Lento / Em treino (≥ 3,0s)</span>' +
        '<span class="tb-leg-item tb-st-hard"><i></i> Difícil / Errou</span>' +
        '<span class="tb-leg-item tb-st-mastered"><i></i> Automatizado (&lt; 3,0s)</span>' +
        '</div>' +
        '<div class="mono small muted" id="tb-inspect">Passe o mouse ou toque em qualquer conta para inspecionar seu tempo médio.</div>' +
        '</div>' +
        '</div>' +
        contentHTML;

      $("#tb-base-pills").onclick = function (e) {
        const b = e.target.closest("button[data-base]");
        if (!b) return;
        tableBase = Number(b.dataset.base);
        if (tableBase > 0) tableLayout = "cards";
        renderTableTab();
      };
      $("#tb-layout-seg").onclick = function (e) {
        const b = e.target.closest("button[data-lay]");
        if (!b) return;
        tableLayout = b.dataset.lay;
        if (tableLayout === "matrix") tableBase = 0;
        renderTableTab();
      };

      function showInspect(el) {
        if (!el) return;
        const a = Number(el.dataset.a), b = Number(el.dataset.b);
        if (!a || !b) return;
        const st = getPairStat(a, b);
        const status = statusOf(st);
        const meta = STATUS_META[status];
        const box = $("#tb-inspect");
        if (!box) return;
        if (!st || !st.attempts) {
          box.innerHTML = '<strong>' + a + ' × ' + b + ' = ' + (a * b) + '</strong> · Status: ' + meta.label + ' (clique em "Jogo de Reflexo" para medir seu tempo).';
        } else {
          box.innerHTML = '<strong>' + a + ' × ' + b + ' = ' + (a * b) + '</strong> · Status: <strong>' + meta.label + '</strong> · Tempo médio: <strong>' + fmtSec(st.avgTimeMs) + '</strong> (Último: ' + fmtSec(st.lastTimeMs) + ' · ' + st.hits + ' acertos / ' + st.errors + ' erros)';
        }
      }

      panel.onmouseover = function (e) {
        const cell = e.target.closest("[data-a][data-b]");
        if (cell) showInspect(cell);
      };
      panel.onclick = function (e) {
        const trainBtn = e.target.closest("[data-train-base]");
        if (trainBtn) {
          activeTab = "game";
          gameMode = "specific";
          gameBase = Number(trainBtn.dataset.trainBase);
          curPair = null;
          lastFeedback = null;
          paintSubtabs();
          renderPanel();
          return;
        }
        const cell = e.target.closest("[data-a][data-b]");
        if (cell) showInspect(cell);
      };
    }

    /* --------- SUB-ABA 2: JOGO DE REFLEXO & MEMORIZAÇÃO ADAPTATIVA --------- */
    function nextGameQuestion() {
      const sum = computeSummary();
      curPair = pickNextPair(gameMode, gameBase, sum.top5, curPair ? curPair.k : null);
      shownAt = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
    }

    function renderGameTab() {
      const panel = $("#tb-panel");
      if (!curPair) nextGameQuestion();

      const st = getPairStat(curPair.a, curPair.b);
      const status = statusOf(st);
      const meta = STATUS_META[status];

      let baseSelector = "";
      if (gameMode === "specific") {
        let pills = "";
        for (let n = 1; n <= 12; n++) {
          pills += '<button type="button" class="fm-pill mono' + (gameBase === n ? " active" : "") + '" data-gbase="' + n + '">×' + n + '</button>';
        }
        baseSelector = '<div class="fm-pills tb-game-bases" id="tb-game-bases">' + pills + '</div>';
      }

      const fbHTML = lastFeedback
        ? '<div class="tb-feedback ' + lastFeedback.cls + '" role="status" aria-live="polite">' +
          '<strong>' + esc(lastFeedback.title) + '</strong>' +
          '<span>' + esc(lastFeedback.detail) + '</span>' +
          '</div>'
        : '<div class="tb-feedback tb-fb-neutral"><span class="muted small">Digite o resultado e pressione Enter. O cronômetro é silencioso para manter seu foco calmo.</span></div>';

      panel.innerHTML =
        '<div class="tb-game-wrap">' +
        '<div class="tb-game-modes">' +
        '<span class="small muted mono">MODO DE TREINO</span>' +
        '<div class="seg" id="tb-mode-seg">' +
        '<button type="button" data-mode="adaptive"' + (gameMode === "adaptive" ? ' class="active"' : '') + '>Adaptativo (Foco nos Gargalos)</button>' +
        '<button type="button" data-mode="random"' + (gameMode === "random" ? ' class="active"' : '') + '>Completo (1 a 12 Aleatório)</button>' +
        '<button type="button" data-mode="specific"' + (gameMode === "specific" ? ' class="active"' : '') + '>Tabuada Específica</button>' +
        '<button type="button" data-mode="top5"' + (gameMode === "top5" ? ' class="active"' : '') + '>Só Top 5 Difíceis</button>' +
        '</div>' +
        baseSelector +
        '</div>' +

        '<div class="card tb-arena">' +
        '<div class="tb-arena-top">' +
        '<span class="mono tb-badge ' + meta.cls + '">Status desta conta: ' + esc(meta.short) + (st && st.avgTimeMs ? " · Média " + fmtSec(st.avgTimeMs) : "") + '</span>' +
        '<span class="mono small muted">Sessão atual: ' + sessionHits + '/' + sessionCount + ' acertos</span>' +
        '</div>' +

        '<div class="tb-prompt mono" id="tb-prompt">' + curPair.a + ' × ' + curPair.b + ' = ?</div>' +

        '<form class="tb-input-row" id="tb-form" autocomplete="off">' +
        '<input type="text" id="tb-ans" class="mono tb-ans-input" inputmode="numeric" pattern="[0-9]*" placeholder="?" autocomplete="off" spellcheck="false" aria-label="Resposta de ' + curPair.a + ' vezes ' + curPair.b + '">' +
        '<button type="submit" class="btn primary tb-submit-btn">Confirmar ↵</button>' +
        '<button type="button" class="btn ghost small-btn" id="tb-skip" title="Pular e ver resposta">Ver / Pular</button>' +
        '</form>' +

        fbHTML +
        '</div>' +
        '</div>';

      $("#tb-mode-seg").onclick = function (e) {
        const b = e.target.closest("button[data-mode]");
        if (!b) return;
        gameMode = b.dataset.mode;
        curPair = null;
        lastFeedback = null;
        renderGameTab();
      };

      const basesBox = $("#tb-game-bases");
      if (basesBox) {
        basesBox.onclick = function (e) {
          const b = e.target.closest("button[data-gbase]");
          if (!b) return;
          gameBase = Number(b.dataset.gbase);
          curPair = null;
          lastFeedback = null;
          renderGameTab();
        };
      }

      const input = $("#tb-ans");
      if (input) {
        setTimeout(function () { try { input.focus(); } catch (e) {} }, 10);
      }

      function handleSubmission(rawVal, skipped) {
        const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
        const elapsedMs = Math.max(150, Math.round(now - shownAt));
        const expected = curPair.a * curPair.b;
        const userNum = skipped ? NaN : parseInt(String(rawVal).trim(), 10);

        if (!skipped && isNaN(userNum)) return;

        sessionCount++;
        const ok = !skipped && userNum === expected;
        if (ok) sessionHits++;

        recordAttempt(curPair.a, curPair.b, ok, elapsedMs);
        const secStr = fmtSec(elapsedMs);

        if (ok && elapsedMs < FAST_THRESHOLD_MS) {
          lastFeedback = {
            cls: "tb-fb-ok",
            title: "✓ Automatizado (" + secStr + ") — " + curPair.a + " × " + curPair.b + " = " + expected,
            detail: "Resposta abaixo de 3,0s registrada como domínio automático."
          };
        } else if (ok) {
          lastFeedback = {
            cls: "tb-fb-slow",
            title: "✓ Correto (" + secStr + ") — vamos acelerar essa (" + curPair.a + " × " + curPair.b + " = " + expected + ")",
            detail: "Marcada para revisão mais frequente até baixar de 3,0s."
          };
        } else {
          lastFeedback = {
            cls: "tb-fb-err",
            title: curPair.a + " × " + curPair.b + " = " + expected + (skipped ? " (revelada)" : " (você digitou " + userNum + ")"),
            detail: "Peso de prioridade aumentado — essa conta voltará em breve na fila adaptativa."
          };
        }

        renderSummary();
        nextGameQuestion();
        renderGameTab();
      }

      $("#tb-form").onsubmit = function (e) {
        e.preventDefault();
        handleSubmission(input.value, false);
      };
      $("#tb-skip").onclick = function () {
        handleSubmission("", true);
      };
    }

    function renderPanel() {
      if (activeTab === "table") renderTableTab();
      else renderGameTab();
    }

    $("#tb-subtabs").addEventListener("click", function (e) {
      const b = e.target.closest("button[data-tab]");
      if (!b) return;
      activeTab = b.dataset.tab;
      if (activeTab === "game") curPair = null;
      paintSubtabs();
      renderPanel();
    });

    renderSummary();
    renderPanel();
    return function () {};
  }

  NE.Tabuada = {
    mount: mount,
    getTabState: getTabState,
    recordAttempt: recordAttempt,
    computeSummary: computeSummary,
    statusOf: statusOf
  };
})(window);
