/* ==========================================================================
   NeuroEng // Prep OS — Motor de Currículo (Apostila + Exercícios + Corretor)
   - Renderiza a apostila teórica (NE.Theory, definida em js/theory_*.js)
   - Gera exercícios procedurais determinísticos/infinitos (famílias em js/exercise_bank.js)
   - Corrige respostas (números, frações, expressões, listas, binário/hex, booleanas)
   - Monta a "Bancada de Resolução e Verificação" e persiste tudo no Store
   ========================================================================== */
(function (global) {
  "use strict";
  const NE = (global.NE = global.NE || {});
  const U = NE.U, S = NE.Store;
  const esc = U.esc;

  /* ================================ RNG ================================ */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeRng(seed) {
    const nx = mulberry32(seed);
    return {
      next: nx,
      int: function (a, b) { return a + Math.floor(nx() * (b - a + 1)); },
      pick: function (arr) { return arr[Math.floor(nx() * arr.length)]; },
      sign: function () { return nx() < 0.5 ? -1 : 1; }
    };
  }

  /* ============================ racionais =============================== */
  function rat(n, d) {
    if (d < 0) { n = -n; d = -d; }
    const g = U.gcd(n, d) || 1;
    return { n: n / g, d: d / g };
  }
  const ratAdd = function (a, b) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); };
  const ratMul = function (a, b) { return rat(a.n * b.n, a.d * b.d); };
  const ratDiv = function (a, b) { return rat(a.n * b.d, a.d * b.n); };
  const ratStr = function (q) { return q.d === 1 ? String(q.n) : q.n + "/" + q.d; };

  /* ============================ formatação ============================== */
  function trimNum(x, dec) {
    let s = x.toFixed(dec);
    if (s.indexOf(".") !== -1) s = s.replace(/0+$/, "").replace(/\.$/, "");
    return s.replace(".", ",");
  }
  function fmt(x, dec) {
    if (dec == null) dec = 4;
    if (!isFinite(x)) return "—";
    if (Math.abs(x) < 1e-12) return "0";
    const neg = x < 0 ? "−" : "";
    const a = Math.abs(x);
    if (a >= 1e7 || a < 1e-3) {
      let e = Math.floor(Math.log10(a));
      let m = a / Math.pow(10, e);
      if (+m.toFixed(4) >= 10) { m /= 10; e += 1; }
      return neg + trimNum(m, 4) + "×10<sup>" + e + "</sup>";
    }
    return neg + trimNum(a, Number.isInteger(a) ? 0 : dec);
  }

  /* ============================== parser ================================ */
  const UNIT_RE = /^(.*?[\d)])\s*(ohms?|ω|v|volts?|a|amps?|w|hz|khz|mhz|ghz|s|ms|us|µs|μs|ns|j|n|nm|n\*m|m|cm|mm|km|kg|rad|rad\/s|var|va|db|%|graus?|m\/s|m\/s\^2|m\/s2|f|nf|pf|uf|µf|μf|h|mh|ma|µa|μa|mv|kv|mw|kw|kω|mω|kohm|bits?|bytes?)$/;

  function normalizeInput(raw) {
    let s = String(raw).trim().toLowerCase();
    s = s.replace(/[−–—]/g, "-").replace(/[×·⋅]/g, "*").replace(/÷/g, "/")
      .replace(/π/g, "pi").replace(/√/g, "sqrt").replace(/∛/g, "cbrt")
      .replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁻¹/g, "^-1")
      .replace(/\*\*/g, "^").replace(/°/g, "");
    s = s.replace(/(\d)\s*x\s*(?=\d)/g, "$1*");   // 3x10^3
    s = s.replace(/(\d),(\d)/g, "$1.$2");         // vírgula decimal
    return s;
  }

  function evalExpr(raw) {
    let s = normalizeInput(raw);
    const m = UNIT_RE.exec(s);
    if (m) s = m[1];
    let i = 0;
    const peek = function () { while (s[i] === " ") i++; return s[i]; };
    function fail() { throw new Error("parse"); }

    function parseExpression() {
      let v = parseTerm();
      for (;;) {
        const c = peek();
        if (c === "+") { i++; v += parseTerm(); }
        else if (c === "-") { i++; v -= parseTerm(); }
        else return v;
      }
    }
    function parseTerm() {
      let v = parseUnary();
      for (;;) {
        const c = peek();
        if (c === "*") { i++; v *= parseUnary(); }
        else if (c === "/") { i++; v /= parseUnary(); }
        else if (s[i] !== undefined && /[\d.(a-z]/.test(s[i]) && i > 0 && s[i - 1] !== " ") { v *= parseUnary(); }
        else return v;
      }
    }
    function parseUnary() {
      const c = peek();
      if (c === "-") { i++; return -parseUnary(); }
      if (c === "+") { i++; return parseUnary(); }
      return parsePower();
    }
    function parsePower() {
      const b = parseAtom();
      if (peek() === "^") { i++; return Math.pow(b, parseUnary()); }
      return b;
    }
    function parseAtom() {
      const c = peek();
      if (c === "(") {
        i++;
        const v = parseExpression();
        if (peek() !== ")") fail();
        i++;
        return v;
      }
      const rest = s.slice(i);
      const nm = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/.exec(rest);
      if (nm) { i += nm[0].length; return parseFloat(nm[0]); }
      const id = /^[a-z]+/.exec(rest);
      if (id) {
        const w = id[0];
        if (w === "pi") { i += 2; return Math.PI; }
        if (w === "e") { i += 1; return Math.E; }
        const F = { sqrt: Math.sqrt, cbrt: Math.cbrt, sin: Math.sin, cos: Math.cos, tan: Math.tan, ln: Math.log, log: Math.log10, abs: Math.abs };
        if (F[w]) { i += w.length; return F[w](parseAtom()); }
      }
      return fail();
    }

    try {
      const v = parseExpression();
      if (peek() !== undefined) return NaN;
      return isFinite(v) ? v : NaN;
    } catch (e) { return NaN; }
  }

  function parseList(raw) {
    let s = normalizeInput(raw);
    s = s.replace(/[a-zα-ω][a-z0-9₀-₉_]*\s*=\s*/g, "");
    s = s.replace(/^[(\[{]\s*|\s*[)\]}]$/g, "");
    let parts = s.split(/\s*(?:;|\||,)\s*|\s+(?:e|ou)\s+/).filter(function (p) { return p !== ""; });
    if (parts.length === 1 && /\s/.test(parts[0].trim())) parts = parts[0].trim().split(/\s+/);
    return parts.map(evalExpr);
  }

  /* ----------------------- normalização de textos ----------------------- */
  function canonBool(s) {
    s = String(s).toLowerCase().replace(/¬/g, "!").replace(/([a-z])'/g, "!$1").replace(/[\s·*.]/g, "");
    return s.split("+").map(function (t) {
      return (t.match(/!?[a-z]/g) || []).sort().join("");
    }).filter(Boolean).sort().join("+");
  }
  const NORM = {
    bin: function (s) { return String(s).toLowerCase().replace(/[\s_]/g, "").replace(/^0b/, "").replace(/(₂|\(2\)|b)$/, "").replace(/^0+(?=.)/, ""); },
    binx: function (s) { return String(s).toLowerCase().replace(/[\s_]/g, "").replace(/^0b/, "").replace(/(₂|\(2\)|b)$/, ""); },
    hex: function (s) { return String(s).toUpperCase().replace(/[\s_]/g, "").replace(/^0X/, "").replace(/H$/, "").replace(/^0+(?=.)/, ""); },
    str: function (s) { return String(s).toLowerCase().replace(/[\s·*×]/g, "").replace(/²/g, "^2").replace(/³/g, "^3").replace(/\^1(?!\d)/g, ""); },
    expr: canonBool
  };

  /* ============================== corretor ============================== */
  const REL_TOL = 0.005;
  function tolFor(q, v) {
    if (q.tol != null) return Math.max(1e-12, Math.abs(v) * q.tol);
    return Number.isInteger(v) ? Math.max(1e-9, Math.abs(v) * 1e-9) : Math.max(1e-12, Math.abs(v) * REL_TOL);
  }
  const closeTo = function (u, v, q) { return Math.abs(u - v) <= tolFor(q, v); };

  const SIGN_MSG = "Quase! O valor absoluto está certo, mas você errou o SINAL (+/−). Deseja registrar +1 em Erro de Sinal?";
  const FMT_MSG = "Não entendi a resposta. Use número (3,5 ou 3.5), fração (3/4), expressão (2*5, √2) ou, se houver vários valores, separe por ; (ex.: 2 ; 3).";

  function checkScalar(q, input, v) {
    const u = evalExpr(input);
    if (isNaN(u)) return { status: "invalid", msg: FMT_MSG };
    if (closeTo(u, v, q)) {
      const m = /^\s*[-−]?\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(String(input));
      if (m) {
        const n = +m[1], d = +m[2], g = U.gcd(n, d);
        if (g > 1 && d !== 0) {
          return { status: "ok-warn", msg: "Correto! Só faltou simplificar a fração: " + n + "/" + d + " = " + (n / g) + "/" + (d / g) + "." };
        }
      }
      const exact = Math.abs(u - v) <= Math.max(1e-9, Math.abs(v) * 1e-9);
      if (!exact && !Number.isInteger(v)) return { status: "ok-approx", msg: "Correto! (valor aproximado aceito — valor exato: " + answerHTML(q) + ")" };
      return { status: "ok", msg: "Correto! ✓" };
    }
    if (v !== 0 && closeTo(u, -v, q)) return { status: "sign", msg: SIGN_MSG, type: "sign" };
    const traps = q.traps || [];
    for (let k = 0; k < traps.length; k++) {
      if (Math.abs(u - traps[k].v) <= Math.max(1e-9, Math.abs(traps[k].v) * REL_TOL)) {
        return { status: "trap", msg: traps[k].msg, type: traps[k].type || "skip" };
      }
    }
    if (q.recip !== false && v !== 0 && Math.abs(v) !== 1 && u !== 0 && closeTo(u, 1 / v, q)) {
      return { status: "trap", type: "skip", msg: "Você parou no INVERSO (1/x). Falta o último passo: inverter o resultado." };
    }
    if (v !== 0 && u !== 0) {
      const ratio = Math.abs(u / v), lg = Math.log10(ratio);
      if (Math.abs(lg - Math.round(lg)) < 1e-6 && Math.round(lg) !== 0) {
        return { status: "wrong", msg: "O dígito está certo, mas a ordem de grandeza não: confira as potências de 10 e os prefixos (m, μ, k, M)." };
      }
    }
    return { status: "wrong", msg: "Ainda não bateu. Releia os dados, confira cada linha do rascunho e tente de novo — ou abra a resolução linha por linha." };
  }

  function check(q, input) {
    input = String(input == null ? "" : input).trim();
    if (!input) return { status: "empty", msg: "Digite a resposta final antes de verificar." };

    if (q.kind === "num") return checkScalar(q, input, q.value);
    if (q.kind === "frac") return checkScalar(q, input, q.n / q.d);

    if (q.kind === "list") {
      const us = parseList(input);
      const n = q.values.length;
      if (us.length !== n || us.some(isNaN)) return { status: "invalid", msg: "Informe " + n + " valores separados por ; (ponto e vírgula). " + (q.labels ? "Ordem: " + q.labels + "." : "") };
      const a = q.ordered ? us : us.slice().sort(function (x, y) { return x - y; });
      const b = q.ordered ? q.values : q.values.slice().sort(function (x, y) { return x - y; });
      if (a.every(function (x, i) { return closeTo(x, b[i], q); })) return { status: "ok", msg: "Correto! ✓" };
      const neg = (q.ordered ? q.values.map(function (x) { return -x; }) : q.values.map(function (x) { return -x; }).sort(function (x, y) { return x - y; }));
      if (b.some(function (x) { return x !== 0; }) && a.every(function (x, i) { return closeTo(x, neg[i], q); })) return { status: "sign", msg: SIGN_MSG, type: "sign" };
      const hit = a.filter(function (x, i) { return closeTo(x, b[i], q); }).length;
      return { status: "wrong", msg: (hit ? hit + " de " + n + " valores batem. " : "") + "Revise o rascunho linha por linha e tente de novo — ou veja a resolução." };
    }

    // texto (binário, hexadecimal, expressão booleana, fator comum…)
    const norm = NORM[q.norm || "str"];
    if (norm(input) === norm(q.text_answer)) return { status: "ok", msg: "Correto! ✓" };
    return { status: "wrong", msg: "Ainda não. " + (q.norm === "binx" ? "Atenção ao número de bits exigido. " : "") + "Confira o rascunho e tente de novo — ou veja a resolução." };
  }

  function answerHTML(q) {
    if (q.kind === "num") return fmt(q.value) + (q.unit ? " " + q.unit : "");
    if (q.kind === "frac") {
      const v = q.n / q.d;
      return (q.d === 1 ? fmt(q.n) : q.n + "/" + q.d + " ≈ " + fmt(v)) + (q.unit ? " " + q.unit : "");
    }
    if (q.kind === "list") return q.values.map(fmt).join(" ; ") + (q.unit ? " " + q.unit : "");
    return esc(q.text_answer);
  }

  /* ============================== famílias ============================== */
  const FAMILIES = {};
  const BANKS = {};

  const Q = {
    num: function (text, value, unit, steps, o) { return Object.assign({ kind: "num", text: text, value: value, unit: unit || "", steps: steps }, o); },
    frac: function (text, n, d, unit, steps, o) { const r = rat(n, d); return Object.assign({ kind: "frac", text: text, n: r.n, d: r.d, unit: unit || "", steps: steps }, o); },
    list: function (text, values, labels, unit, steps, o) { return Object.assign({ kind: "list", text: text, values: values, labels: labels, unit: unit || "", steps: steps }, o); },
    str: function (text, answer, norm, steps, o) { return Object.assign({ kind: "text", text: text, text_answer: answer, norm: norm, steps: steps }, o); }
  };

  function defineFamily(id, level, fn) { FAMILIES[id] = { id: id, level: level, fn: fn }; }
  function setBank(sessionId, ids) { BANKS[sessionId] = ids; }

  function make(famId, seed) {
    const f = FAMILIES[famId];
    if (!f) return null;
    const q = f.fn(makeRng(seed));
    q.family = famId; q.level = f.level; q.seed = seed;
    return q;
  }

  function fixedSet(sessionId) {
    const bank = BANKS[sessionId] || [];
    const seen = {};
    return bank.map(function (fid, i) {
      let seed = sessionId * 1000 + (i + 1) * 37 + 7, q = make(fid, seed), tries = 0;
      while (q && seen[q.text] && tries++ < 8) { seed += 101; q = make(fid, seed); }
      if (q) { seen[q.text] = 1; q.id = "f" + (i + 1); q.n = i + 1; }
      return q;
    }).filter(Boolean);
  }

  function generate(sessionId, levels, famId, avoidText) {
    const bank = BANKS[sessionId] || [];
    let pool = bank.filter(function (id) { return FAMILIES[id] && levels.indexOf(FAMILIES[id].level) !== -1; });
    if (!pool.length) pool = bank;
    let q = null;
    for (let t = 0; t < 10; t++) {
      const fid = famId || pool[Math.floor(Math.random() * pool.length)];
      q = make(fid, Math.floor(Math.random() * 2147483000) + 1);
      if (q && q.text !== avoidText) break;
    }
    if (q) q.id = "g";
    return q;
  }

  const LEVEL_LABEL = ["", "Nível 1 · Base Mecânica", "Nível 2 · Manipulação Algébrica", "Nível 3 · Aplicação em Engenharia Elétrica (FURB)"];

  /* ============================ apostila teórica ============================ */
  function renderTheory(sessionId) {
    const T = NE.Theory && NE.Theory[sessionId];
    if (!T) {
      return '<div class="note">Apostila desta sessão indisponível. Recarregue o app para baixar o conteúdo.</div>';
    }
    const algo = T.algo.map(function (a, i) { return '<li><span class="step-n mono">Passo ' + (i + 1) + '</span><span>' + a + '</span></li>'; }).join("");
    const ex = T.example ? '<div class="worked"><h5>' + T.example.title + '</h5>' +
      T.example.lines.map(function (l) { return '<div class="worked-line mono">' + l + '</div>'; }).join("") + '</div>' : "";
    const traps = T.traps.map(function (t) { return '<li>' + t + '</li>'; }).join("");
    return '<div class="theory">' +
      '<h3 class="theory-title">Apostila Direta ao Ponto <span class="muted">(Teoria &amp; Engenharia)</span></h3>' +
      '<section class="theory-block tb-logic"><h4><span class="tb-tag mono">A</span> A Lógica Estrutural</h4><div class="prose">' + T.logic + '</div></section>' +
      '<section class="theory-block tb-algo"><h4><span class="tb-tag mono">B</span> Algoritmo Passo a Passo</h4><ol class="recipe">' + algo + '</ol>' + ex + '</section>' +
      '<section class="theory-block tb-traps"><h4><span class="tb-tag mono">C</span> Armadilhas Clássicas de TDAH / Controle Inibitório</h4><ul class="trap-list">' + traps + '</ul></section>' +
      '</div>';
  }

  /* ========================= bancada de resolução ========================= */
  function mountBench(root, opts) {
    const sid = opts.sessionId;
    const levels = opts.levels;
    const fixedQs = fixedSet(sid).filter(function (q) { return levels.indexOf(q.level) !== -1; });
    let saveT = null;
    const lazySave = function () { clearTimeout(saveT); saveT = setTimeout(S.save, 400); };

    function prac() {
      const s = S.session(sid);
      const d = { solved: 0, correct: 0, firstTry: 0, checks: 0, items: {}, gen: null, genCount: 0 };
      if (!s.practice || typeof s.practice !== "object") s.practice = d;
      Object.keys(d).forEach(function (k) { if (!(k in s.practice)) s.practice[k] = d[k]; });
      return s.practice;
    }
    function item(key) {
      const p = prac();
      if (!p.items[key]) p.items[key] = { tries: 0, ok: false, closed: false, scratch: "", answer: "" };
      return p.items[key];
    }

    let curKey = fixedQs.length ? fixedQs[0].id : "g";
    let curQ = null, revealed = 0, lastResult = null;

    root.innerHTML =
      '<div class="bench"><div class="bench-head"><h3>Bancada de Resolução e Verificação</h3>' +
      '<span class="small muted mono" id="bn-stats"></span></div>' +
      '<div class="q-tabs" id="bn-tabs" role="tablist"></div>' +
      '<div class="q-card"><div class="q-meta"><span class="q-level mono" id="bn-level"></span><span class="q-fmt small muted" id="bn-fmt"></span></div>' +
      '<div class="q-text" id="bn-text"></div>' +
      '<label class="field"><span class="small muted">Rascunho estruturado — digite uma linha de raciocínio por passo, antes da resposta</span>' +
      '<textarea id="bn-scratch" class="mono" rows="5" spellcheck="false" placeholder="Linha 1: copiar os dados e as unidades&#10;Linha 2: ...&#10;Linha 3: ..."></textarea></label>' +
      '<label class="field"><span class="small muted">Resposta final</span>' +
      '<div class="row tight"><input type="text" id="bn-answer" class="mono" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ex.: 3/4, 0,75, 12 ou 2 ; 3">' +
      '<button type="button" class="btn primary" id="bn-check">Verificar Resposta</button></div></label>' +
      '<div class="q-feedback" id="bn-fb" role="status" aria-live="polite"></div>' +
      '<div class="row"><button type="button" class="btn ghost small-btn" id="bn-sol">Ver Resolução Linha por Linha</button>' +
      '<button type="button" class="btn small-btn" id="bn-gen">Gerar Novo Exercício Semelhante (Infinito)</button>' +
      '<button type="button" class="btn ghost small-btn" id="bn-other">Outro tipo</button></div>' +
      '<div class="q-solution" id="bn-solution"></div></div></div>';

    const $ = function (s) { return root.querySelector(s); };

    function updateStats() {
      const p = prac();
      $("#bn-stats").textContent = p.solved + " resolvidos · " + p.correct + " corretos" + (p.solved ? " · " + Math.round(100 * p.correct / p.solved) + "%" : "");
    }

    function paintTabs() {
      let h = fixedQs.map(function (q) {
        const it = prac().items[q.id];
        const mark = it ? (it.ok ? "✓" : it.closed ? "◐" : "•") : "";
        return '<button type="button" role="tab" class="q-tab' + (curKey === q.id ? " active" : "") + '" data-k="' + q.id + '"><span class="mono">Q' + q.n + '</span> N' + q.level + ' <span class="mk">' + mark + '</span></button>';
      }).join("");
      h += '<button type="button" role="tab" class="q-tab' + (curKey === "g" ? " active" : "") + '" data-k="g"><span class="mono">∞</span> Gerador</button>';
      $("#bn-tabs").innerHTML = h;
    }

    function resolveQ(key) {
      if (key === "g") {
        const p = prac();
        if (!p.gen) { newGen(null, true); }
        return make(p.gen.family, p.gen.seed);
      }
      return fixedQs.filter(function (q) { return q.id === key; })[0];
    }

    function newGen(famId, silent) {
      const p = prac();
      const prev = curQ && curQ.text;
      const q = generate(sid, levels, famId, prev);
      if (!q) return;
      p.gen = { family: q.family, seed: q.seed };
      p.genCount++;
      p.items.g = { tries: 0, ok: false, closed: false, scratch: "", answer: "" };
      if (!silent) S.save();
    }

    function solutionHTML(q, count) {
      const total = q.steps.length;
      const n = count == null ? total : Math.min(count, total);
      let h = '<ol class="reveal">' + q.steps.slice(0, n).map(function (s, i) {
        return '<li><span class="step-n mono">Passo ' + (i + 1) + '</span><span>' + s + '</span></li>';
      }).join("") + '</ol>';
      if (n < total) {
        h += '<div class="row"><button type="button" class="btn small-btn" id="bn-next">Revelar próximo passo ▸</button>' +
          '<button type="button" class="btn ghost small-btn" id="bn-all">Mostrar tudo</button></div>';
      } else {
        h += '<div class="final-result"><span class="small muted">Resultado Final</span><span class="mono">' + answerHTML(q) + '</span></div>';
      }
      return h;
    }

    function paintSolution() {
      const el = $("#bn-solution");
      if (revealed <= 0) { el.innerHTML = ""; return; }
      el.innerHTML = solutionHTML(curQ, revealed);
      const nx = $("#bn-next"), al = $("#bn-all");
      if (nx) nx.addEventListener("click", function () { revealed++; paintSolution(); });
      if (al) al.addEventListener("click", function () { revealed = 999; paintSolution(); });
    }

    function feedback(r) {
      const fb = $("#bn-fb");
      lastResult = r;
      const ok = r.status.indexOf("ok") === 0;
      fb.className = "q-feedback " + (ok ? "fb-ok" : r.status === "sign" || r.status === "trap" ? "fb-warn" : "fb-no");
      fb.innerHTML = '<p>' + esc(r.msg) + '</p>';
      if ((r.status === "sign" || r.status === "trap") && r.type) {
        const lab = NE.Data.ERROR_TYPES.filter(function (t) { return t.key === r.type; })[0];
        fb.innerHTML += '<button type="button" class="btn small-btn" id="bn-log">Registrar +1 em ' + esc(lab ? lab.long : r.type) + '</button>';
        $("#bn-log").addEventListener("click", function () {
          S.logError(sid, r.type);
          $("#bn-log").disabled = true;
          $("#bn-log").textContent = "Registrado ✓ — agora tente de novo";
          if (opts.onErrorLogged) opts.onErrorLogged(r.type);
        });
      }
    }

    function show(key) {
      curKey = key;
      curQ = resolveQ(key);
      if (!curQ) return;
      const it = item(key);
      revealed = (it.ok || it.closed) ? 999 : 0;
      paintTabs();
      $("#bn-level").textContent = LEVEL_LABEL[curQ.level] + (key === "g" ? " · gerado" : "");
      $("#bn-fmt").textContent = curQ.kind === "list" ? "Vários valores — separe por ;" + (curQ.labels ? " (ordem: " + curQ.labels + ")" : "") : (curQ.fmt || "");
      $("#bn-text").innerHTML = curQ.text;
      $("#bn-scratch").value = it.scratch || "";
      $("#bn-answer").value = it.answer || "";
      $("#bn-fb").className = "q-feedback";
      $("#bn-fb").innerHTML = it.ok ? "<p>Você já acertou este exercício ✓</p>" : "";
      paintSolution();
      updateStats();
    }

    $("#bn-tabs").addEventListener("click", function (e) {
      const b = e.target.closest(".q-tab");
      if (b) show(b.dataset.k);
    });
    $("#bn-scratch").addEventListener("input", function (e) { item(curKey).scratch = e.target.value; lazySave(); });
    $("#bn-answer").addEventListener("input", function (e) { item(curKey).answer = e.target.value; lazySave(); });
    $("#bn-answer").addEventListener("keydown", function (e) { if (e.key === "Enter") $("#bn-check").click(); });

    $("#bn-check").addEventListener("click", function () {
      const it = item(curKey), p = prac();
      const r = check(curQ, $("#bn-answer").value);
      if (r.status !== "empty" && r.status !== "invalid") { it.tries++; p.checks++; }
      const ok = r.status.indexOf("ok") === 0;
      if (ok && !it.ok) {
        it.ok = true; p.correct++;
        if (it.tries === 1) p.firstTry++;
        if (!it.closed) { it.closed = true; p.solved++; }
        revealed = 999;
      }
      S.save();
      feedback(r);
      paintSolution();
      paintTabs();
      updateStats();
    });

    $("#bn-sol").addEventListener("click", function () {
      const it = item(curKey), p = prac();
      if (!it.closed) { it.closed = true; p.solved++; S.save(); }
      revealed = revealed > 0 ? 999 : 1;
      paintSolution(); paintTabs(); updateStats();
    });

    $("#bn-gen").addEventListener("click", function () {
      newGen(curQ.family, false);
      show("g");
      $("#bn-scratch").focus();
    });
    $("#bn-other").addEventListener("click", function () {
      newGen(null, false);
      show("g");
    });

    show(curKey);
    return function () { clearTimeout(saveT); S.save(); };
  }

  /* ============================ estatísticas ============================ */
  function practiceTotals() {
    const t = { solved: 0, correct: 0, firstTry: 0, sessions: 0 };
    const ss = S.state.sessions;
    Object.keys(ss).forEach(function (k) {
      const p = ss[k] && ss[k].practice;
      if (p && (p.solved || p.correct)) { t.solved += p.solved || 0; t.correct += p.correct || 0; t.firstTry += p.firstTry || 0; t.sessions++; }
    });
    return t;
  }

  NE.CE = {
    makeRng: makeRng, rat: rat, ratAdd: ratAdd, ratMul: ratMul, ratDiv: ratDiv, ratStr: ratStr,
    fmt: fmt, evalExpr: evalExpr, parseList: parseList, check: check, answerHTML: answerHTML,
    Q: Q, defineFamily: defineFamily, setBank: setBank, make: make, fixedSet: fixedSet, generate: generate,
    renderTheory: renderTheory, mountBench: mountBench, practiceTotals: practiceTotals,
    families: FAMILIES, banks: BANKS, LEVEL_LABEL: LEVEL_LABEL
  };
})(window);

