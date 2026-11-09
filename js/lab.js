/* ==========================================================================
   NeuroEng // Prep OS — Laboratório Visual Interativo
   1) Funções & Senoides CA   2) Resistores em paralelo & frações   3) Portas lógicas
   ========================================================================== */
(function (global) {
  "use strict";
  const NE = global.NE;
  const U = NE.U;

  const C = { bg: "#121215", grid: "#27272A", axis: "#52525B", text: "#A1A1AA", line: "#F4F4F5", ref: "#71717A" };

  function fmt(n, d) {
    if (d == null) d = 2;
    const v = Math.abs(n) < 1e-9 ? 0 : n;
    return String(+v.toFixed(d)).replace(".", ",");
  }

  /* ------------------------------ canvas helper ------------------------------ */
  function setupCanvas(cv) {
    const dpr = global.devicePixelRatio || 1;
    const r = cv.getBoundingClientRect();
    const w = Math.max(200, r.width), h = r.height || 300;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  function drawPlot(cv, view, curves, marks) {
    const o = setupCanvas(cv), ctx = o.ctx, w = o.w, h = o.h;
    const padL = 36, padB = 22, padT = 10, padR = 12;
    const pw = w - padL - padR, ph = h - padT - padB;
    const X = function (x) { return padL + (x - view.xmin) / (view.xmax - view.xmin) * pw; };
    const Y = function (y) { return padT + (1 - (y - view.ymin) / (view.ymax - view.ymin)) * ph; };

    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textBaseline = "middle";

    ctx.lineWidth = 1;
    for (let x = Math.ceil(view.xmin / view.dx) * view.dx; x <= view.xmax + 1e-9; x += view.dx) {
      ctx.strokeStyle = Math.abs(x) < 1e-9 ? C.axis : C.grid;
      ctx.beginPath(); ctx.moveTo(X(x), padT); ctx.lineTo(X(x), padT + ph); ctx.stroke();
      ctx.fillStyle = C.text; ctx.textAlign = "center";
      ctx.fillText(fmt(x, 1), X(x), h - 9);
    }
    for (let y = Math.ceil(view.ymin / view.dy) * view.dy; y <= view.ymax + 1e-9; y += view.dy) {
      ctx.strokeStyle = Math.abs(y) < 1e-9 ? C.axis : C.grid;
      ctx.beginPath(); ctx.moveTo(padL, Y(y)); ctx.lineTo(padL + pw, Y(y)); ctx.stroke();
      ctx.fillStyle = C.text; ctx.textAlign = "right";
      ctx.fillText(fmt(y, 1), padL - 5, Y(y));
    }

    ctx.save();
    ctx.beginPath(); ctx.rect(padL, padT, pw, ph); ctx.clip();
    curves.forEach(function (c) {
      ctx.strokeStyle = c.color; ctx.lineWidth = c.width || 2;
      ctx.setLineDash(c.dash || []);
      ctx.beginPath();
      const N = Math.max(200, Math.floor(pw));
      for (let i = 0; i <= N; i++) {
        const x = view.xmin + (view.xmax - view.xmin) * i / N;
        const y = c.fn(x);
        if (i === 0) ctx.moveTo(X(x), Y(y)); else ctx.lineTo(X(x), Y(y));
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);
    (marks || []).forEach(function (m) {
      ctx.fillStyle = m.color || C.line;
      ctx.beginPath(); ctx.arc(X(m.x), Y(m.y), 4, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  /* ----------------------------- slider util (HTML) ----------------------------- */
  function slider(id, label, min, max, step, val, unit) {
    return '<label class="slider"><span class="slider-top"><span>' + label + '</span><span class="mono" id="' + id + '-v"></span></span>' +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-unit="' + (unit || "") + '"></label>';
  }

  /* ============================== 1. Funções ============================== */
  function initFunctions(box) {
    box.innerHTML =
      '<div class="lab-head"><h2>1 · Visualizador de Funções & Senoides CA</h2>' +
      '<div class="seg" id="fn-mode"><button type="button" data-m="sin" class="active">Senoide A·sen(ωt+θ)</button><button type="button" data-m="par">Parábola ax²+bx+c</button></div></div>' +
      '<div class="lab-grid"><div><canvas id="fn-cv" class="plot" aria-label="Gráfico da função"></canvas>' +
      '<p class="legend small muted"><span class="dot"></span> sua função &nbsp; <span class="dot ref"></span> referência sen(t)</p></div>' +
      '<div><div id="fn-controls"></div><div class="readout mono" id="fn-out"></div></div></div>';

    let mode = "sin";
    const v = { A: 3, w: 2, th: 0, a: 1, b: 0, c: -4 };
    const cv = box.querySelector("#fn-cv");
    const controls = box.querySelector("#fn-controls");
    const out = box.querySelector("#fn-out");

    function buildControls() {
      controls.innerHTML = mode === "sin"
        ? slider("fn-A", "Amplitude A (V)", 0.5, 5, 0.1, v.A) + slider("fn-w", "Frequência angular ω (rad/s)", 0.5, 5, 0.1, v.w) + slider("fn-th", "Fase θ (graus)", -180, 180, 5, v.th)
        : slider("fn-a", "a", -3, 3, 0.1, v.a) + slider("fn-b", "b", -10, 10, 0.5, v.b) + slider("fn-c", "c", -10, 10, 0.5, v.c);
      Array.prototype.forEach.call(controls.querySelectorAll("input"), function (inp) {
        inp.addEventListener("input", function () {
          const k = inp.id.replace("fn-", "");
          v[k === "w" ? "w" : k] = Number(inp.value);
          draw();
        });
      });
    }

    function draw() {
      if (mode === "sin") {
        const th = v.th * Math.PI / 180;
        const T = 2 * Math.PI / v.w, f = v.w / (2 * Math.PI), shift = -th / v.w;
        drawPlot(cv, { xmin: 0, xmax: 10, ymin: -5, ymax: 5, dx: 1, dy: 1 }, [
          { fn: function (t) { return Math.sin(t); }, color: C.ref, dash: [5, 4], width: 1.5 },
          { fn: function (t) { return v.A * Math.sin(v.w * t + th); }, color: C.line }
        ]);
        controls.querySelector("#fn-A-v").textContent = fmt(v.A, 1) + " V";
        controls.querySelector("#fn-w-v").textContent = fmt(v.w, 1) + " rad/s";
        controls.querySelector("#fn-th-v").textContent = v.th + "°";
        out.innerHTML =
          '<div>f(t) = ' + fmt(v.A, 1) + ' · sen(' + fmt(v.w, 1) + 't ' + (v.th < 0 ? "−" : "+") + ' ' + Math.abs(v.th) + '°)</div>' +
          '<div>T = 2π/ω = ' + fmt(T) + ' s</div><div>f = ω/2π = ' + fmt(f) + ' Hz</div>' +
          '<div>Deslocamento: ' + fmt(shift) + ' s ' + (shift > 0 ? "(atrasada)" : shift < 0 ? "(adiantada)" : "") + '</div>' +
          '<div>Valor de pico = ' + fmt(v.A, 1) + ' V · RMS = A/√2 = ' + fmt(v.A / Math.SQRT2) + ' V</div>';
      } else {
        const a = v.a, b = v.b, c = v.c;
        const f = function (x) { return a * x * x + b * x + c; };
        const marks = [];
        let txt = '<div>f(x) = ' + fmt(a, 1) + 'x² ' + (b < 0 ? "−" : "+") + ' ' + fmt(Math.abs(b), 1) + 'x ' + (c < 0 ? "−" : "+") + ' ' + fmt(Math.abs(c), 1) + '</div>';
        if (Math.abs(a) < 0.05) {
          txt += '<div>a ≈ 0: a função degenera em uma reta.</div>';
        } else {
          const dl = b * b - 4 * a * c, xv = -b / (2 * a), yv = f(xv);
          marks.push({ x: xv, y: yv, color: "#FFFFFF" });
          txt += '<div>Δ = b² − 4ac = ' + fmt(dl) + '</div>';
          if (dl > 0) {
            const r1 = (-b - Math.sqrt(dl)) / (2 * a), r2 = (-b + Math.sqrt(dl)) / (2 * a);
            marks.push({ x: r1, y: 0, color: "#A1A1AA" }, { x: r2, y: 0, color: "#A1A1AA" });
            txt += '<div>Raízes: x₁ = ' + fmt(Math.min(r1, r2)) + ' · x₂ = ' + fmt(Math.max(r1, r2)) + '</div>';
          } else if (dl === 0) { marks.push({ x: xv, y: 0, color: "#A1A1AA" }); txt += '<div>Raiz dupla: x = ' + fmt(xv) + '</div>'; }
          else txt += '<div>Sem raízes reais (Δ &lt; 0)</div>';
          txt += '<div>Vértice: (' + fmt(xv) + '; ' + fmt(yv) + ') — ' + (a > 0 ? "mínimo" : "máximo") + '</div>';
          txt += '<div>Concavidade: ' + (a > 0 ? "para cima" : "para baixo") + '</div>';
        }
        drawPlot(cv, { xmin: -6, xmax: 6, ymin: -10, ymax: 10, dx: 2, dy: 2 }, [{ fn: f, color: C.line }], marks);
        controls.querySelector("#fn-a-v").textContent = fmt(a, 1);
        controls.querySelector("#fn-b-v").textContent = fmt(b, 1);
        controls.querySelector("#fn-c-v").textContent = fmt(c, 1);
        out.innerHTML = txt;
      }
    }

    box.querySelector("#fn-mode").addEventListener("click", function (e) {
      const b = e.target.closest("button");
      if (!b) return;
      mode = b.dataset.m;
      Array.prototype.forEach.call(box.querySelectorAll("#fn-mode button"), function (x) { x.classList.toggle("active", x === b); });
      box.querySelector(".legend").style.visibility = mode === "sin" ? "visible" : "hidden";
      buildControls(); draw();
    });

    buildControls(); draw();
    return draw;
  }

  /* ============================ 2. Resistores ============================ */
  function factorStr(n) {
    const f = {}; let m = n;
    for (let p = 2; p * p <= m; p++) while (m % p === 0) { f[p] = (f[p] || 0) + 1; m /= p; }
    if (m > 1) f[m] = (f[m] || 0) + 1;
    const keys = Object.keys(f);
    if (!keys.length) return "1";
    const sup = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
    return keys.map(function (k) { return k + (f[k] > 1 ? String(f[k]).split("").map(function (d) { return sup[d]; }).join("") : ""); }).join(" · ");
  }

  function initResistors(box) {
    box.innerHTML =
      '<div class="lab-head"><h2>2 · Resistores em Paralelo & Frações</h2></div>' +
      '<div class="lab-grid"><div><div id="rs-svg" class="svg-wrap"></div>' +
      '<p class="small muted">A espessura do fio é proporcional à corrente: veja a corrente total se dividir.</p></div>' +
      '<div>' + slider("rs-r1", "R₁ (Ω)", 1, 60, 1, 12) + slider("rs-r2", "R₂ (Ω)", 1, 60, 1, 20) + slider("rs-vs", "Fonte Vs (V)", 1, 24, 1, 12) +
      '<div class="steps mono" id="rs-steps"></div></div></div>';

    const $ = function (s) { return box.querySelector(s); };

    function draw() {
      const R1 = Number($("#rs-r1").value), R2 = Number($("#rs-r2").value), Vs = Number($("#rs-vs").value);
      $("#rs-r1-v").textContent = R1 + " Ω";
      $("#rs-r2-v").textContent = R2 + " Ω";
      $("#rs-vs-v").textContent = Vs + " V";

      const L = U.lcm(R1, R2), a = L / R1, b = L / R2, num = a + b;
      const g = U.gcd(L, num), rn = L / g, rd = num / g;
      const Req = R1 * R2 / (R1 + R2);
      const I1 = Vs / R1, I2 = Vs / R2, It = I1 + I2;

      $("#rs-steps").innerHTML =
        '<div class="step"><span class="muted">Passo 1</span> 1/Req = 1/R₁ + 1/R₂ = 1/' + R1 + ' + 1/' + R2 + '</div>' +
        '<div class="step"><span class="muted">Passo 2 · MMC</span> ' + R1 + ' = ' + factorStr(R1) + '<br>' + R2 + ' = ' + factorStr(R2) + '<br>MMC(' + R1 + ', ' + R2 + ') = <b>' + L + '</b> = ' + factorStr(L) + '</div>' +
        '<div class="step"><span class="muted">Passo 3 · Frações equivalentes</span> 1/' + R1 + ' = ' + a + '/' + L + ' &nbsp; 1/' + R2 + ' = ' + b + '/' + L + '</div>' +
        '<div class="step"><span class="muted">Passo 4 · Soma</span> 1/Req = (' + a + ' + ' + b + ')/' + L + ' = ' + num + '/' + L + (g > 1 ? ' = ' + (num / g) + '/' + rn : '') + '</div>' +
        '<div class="step"><span class="muted">Passo 5 · Inverter</span> Req = ' + rn + '/' + rd + ' = <b>' + fmt(Req) + ' Ω</b></div>' +
        '<div class="step"><span class="muted">Correntes</span> I₁ = Vs/R₁ = ' + fmt(I1, 3) + ' A · I₂ = ' + fmt(I2, 3) + ' A<br>Itotal = Vs/Req = ' + fmt(It, 3) + ' A<br>Divisor: I₁ = It·R₂/(R₁+R₂) = ' + fmt(It * R2 / (R1 + R2), 3) + ' A ✓</div>';

      const wTot = 3 + 11, w1 = 1.5 + 11 * I1 / It, w2 = 1.5 + 11 * I2 / It;
      const wire = "#A1A1AA";
      $("#rs-svg").innerHTML =
        '<svg viewBox="0 0 480 250" role="img" aria-label="Circuito com dois resistores em paralelo">' +
        '<g fill="none" stroke="' + wire + '" stroke-linecap="butt">' +
        '<path d="M50 30 H200" stroke-width="' + wTot.toFixed(1) + '"/><path d="M200 30 H340" stroke-width="' + w2.toFixed(1) + '"/>' +
        '<path d="M50 220 H200" stroke-width="' + wTot.toFixed(1) + '"/><path d="M200 220 H340" stroke-width="' + w2.toFixed(1) + '"/>' +
        '<path d="M50 30 V100" stroke-width="' + wTot.toFixed(1) + '"/><path d="M50 150 V220" stroke-width="' + wTot.toFixed(1) + '"/>' +
        '<path d="M200 30 V85" stroke-width="' + w1.toFixed(1) + '"/><path d="M200 165 V220" stroke-width="' + w1.toFixed(1) + '"/>' +
        '<path d="M340 30 V85" stroke-width="' + w2.toFixed(1) + '"/><path d="M340 165 V220" stroke-width="' + w2.toFixed(1) + '"/></g>' +
        '<circle cx="50" cy="125" r="25" fill="#18181B" stroke="#F4F4F5" stroke-width="1.5"/>' +
        '<text x="50" y="121" text-anchor="middle" fill="#F4F4F5" font-size="11" font-family="JetBrains Mono, monospace">Vs</text>' +
        '<text x="50" y="136" text-anchor="middle" fill="#A1A1AA" font-size="10" font-family="JetBrains Mono, monospace">' + Vs + ' V</text>' +
        '<rect x="185" y="85" width="30" height="80" fill="#18181B" stroke="#F4F4F5" stroke-width="1.5"/>' +
        '<text x="200" y="130" text-anchor="middle" fill="#F4F4F5" font-size="11" font-family="JetBrains Mono, monospace">' + R1 + 'Ω</text>' +
        '<rect x="325" y="85" width="30" height="80" fill="#18181B" stroke="#F4F4F5" stroke-width="1.5"/>' +
        '<text x="340" y="130" text-anchor="middle" fill="#F4F4F5" font-size="11" font-family="JetBrains Mono, monospace">' + R2 + 'Ω</text>' +
        '<g fill="#F4F4F5" font-size="11" font-family="JetBrains Mono, monospace">' +
        '<text x="110" y="20" text-anchor="middle">It = ' + fmt(It, 2) + ' A</text>' +
        '<text x="228" y="65">I₁ = ' + fmt(I1, 2) + ' A</text>' +
        '<text x="368" y="65">I₂ = ' + fmt(I2, 2) + ' A</text></g>' +
        '<text x="400" y="235" fill="#A1A1AA" font-size="11" font-family="JetBrains Mono, monospace" text-anchor="middle">Req = ' + fmt(Req) + ' Ω</text>' +
        '</svg>';
    }

    Array.prototype.forEach.call(box.querySelectorAll("input[type=range]"), function (i) { i.addEventListener("input", draw); });
    draw();
  }

  /* ============================ 3. Portas lógicas ============================ */
  const GATES = {
    AND:  { f: function (a, b) { return a & b; },       expr: function (a, b) { return "S = A · B = " + a + " · " + b; } },
    OR:   { f: function (a, b) { return a | b; },       expr: function (a, b) { return "S = A + B = " + a + " + " + b; } },
    XOR:  { f: function (a, b) { return a ^ b; },       expr: function (a, b) { return "S = A ⊕ B = A·B̄ + Ā·B = " + a + " ⊕ " + b; } },
    NAND: { f: function (a, b) { return 1 - (a & b); }, expr: function (a, b) { return "S = ¬(A · B) = Ā + B̄ = ¬(" + a + " · " + b + ")"; } }
  };

  function gateSvg(name, a, b, out) {
    const body = {
      AND: '<path d="M30 5 H55 A20 20 0 0 1 55 45 H30 Z"/>',
      NAND: '<path d="M30 5 H55 A20 20 0 0 1 55 45 H30 Z"/><circle cx="79" cy="25" r="4"/>',
      OR: '<path d="M26 5 Q55 5 75 25 Q55 45 26 45 Q38 25 26 5 Z"/>',
      XOR: '<path d="M30 5 Q59 5 79 25 Q59 45 30 45 Q42 25 30 5 Z"/><path d="M22 5 Q34 25 22 45" fill="none"/>'
    }[name];
    const outX1 = name === "NAND" ? 83 : name === "OR" ? 75 : name === "XOR" ? 79 : 75;
    const col = function (v) { return v ? "#F4F4F5" : "#52525B"; };
    return '<svg viewBox="0 0 120 50" class="gate-svg" aria-hidden="true">' +
      '<g stroke="#F4F4F5" stroke-width="1.6" fill="#18181B" stroke-linejoin="round">' + body + '</g>' +
      '<line x1="4" y1="15" x2="28" y2="15" stroke="' + col(a) + '" stroke-width="2.2"/>' +
      '<line x1="4" y1="35" x2="28" y2="35" stroke="' + col(b) + '" stroke-width="2.2"/>' +
      '<line x1="' + outX1 + '" y1="25" x2="116" y2="25" stroke="' + col(out) + '" stroke-width="2.2"/></svg>';
  }

  function initLogic(box) {
    box.innerHTML =
      '<div class="lab-head"><h2>3 · Laboratório de Portas Lógicas</h2></div>' +
      '<div class="logic-inputs"><span class="small muted">Entradas (clique para alternar):</span>' +
      '<button type="button" class="bit" id="lg-a" aria-pressed="false">A = <b class="mono">0</b></button>' +
      '<button type="button" class="bit" id="lg-b" aria-pressed="false">B = <b class="mono">0</b></button></div>' +
      '<div class="gates" id="lg-gates"></div>' +
      '<div class="table-wrap"><table class="truth mono" id="lg-table"></table></div>';

    let A = 0, B = 0;
    function draw() {
      ["a", "b"].forEach(function (k) {
        const el = box.querySelector("#lg-" + k), v = k === "a" ? A : B;
        el.querySelector("b").textContent = v;
        el.classList.toggle("on", v === 1);
        el.setAttribute("aria-pressed", v ? "true" : "false");
      });
      box.querySelector("#lg-gates").innerHTML = Object.keys(GATES).map(function (n) {
        const o = GATES[n].f(A, B);
        return '<div class="gate-card">' + '<div class="gate-top"><span class="mono">' + n + '</span><span class="gate-out mono ' + (o ? "hi" : "lo") + '">' + o + '</span></div>' +
          gateSvg(n, A, B, o) + '<div class="small mono expr">' + GATES[n].expr(A, B) + ' = <b>' + o + '</b></div></div>';
      }).join("");
      let t = "<thead><tr><th>A</th><th>B</th>" + Object.keys(GATES).map(function (n) { return "<th>" + n + "</th>"; }).join("") + "</tr></thead><tbody>";
      [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(function (r) {
        const cur = r[0] === A && r[1] === B;
        t += '<tr class="' + (cur ? "cur" : "") + '"><td>' + r[0] + "</td><td>" + r[1] + "</td>" +
          Object.keys(GATES).map(function (n) { return "<td>" + GATES[n].f(r[0], r[1]) + "</td>"; }).join("") + "</tr>";
      });
      box.querySelector("#lg-table").innerHTML = t + "</tbody>";
    }
    box.querySelector("#lg-a").addEventListener("click", function () { A = 1 - A; draw(); });
    box.querySelector("#lg-b").addEventListener("click", function () { B = 1 - B; draw(); });
    draw();
  }

  /* --------------------------------- montagem --------------------------------- */
  function mount(root) {
    root.innerHTML =
      '<section class="view-lab"><header class="view-head"><p class="eyebrow mono">LABORATÓRIO VISUAL</p>' +
      '<h1>Da abstração à imagem</h1>' +
      '<p class="muted">Mexa nos controles e veja a matemática se mover. Visualizar primeiro, calcular depois.</p></header>' +
      '<div class="card lab" id="lab-fn"></div><div class="card lab" id="lab-rs"></div><div class="card lab" id="lab-lg"></div></section>';

    const redraw = initFunctions(root.querySelector("#lab-fn"));
    initResistors(root.querySelector("#lab-rs"));
    initLogic(root.querySelector("#lab-lg"));

    let t = null;
    const onResize = function () { clearTimeout(t); t = setTimeout(redraw, 120); };
    global.addEventListener("resize", onResize);
    // O canvas só tem largura correta depois de inserido no DOM
    requestAnimationFrame(redraw);
    return function () { global.removeEventListener("resize", onResize); clearTimeout(t); };
  }

  NE.Lab = { mount: mount };
})(window);

