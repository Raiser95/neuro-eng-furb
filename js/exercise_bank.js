/* ==========================================================================
   NeuroEng // Prep OS — Banco de exercícios (parte 1: Semanas 1–6)
   Cada família gera uma questão a partir de um RNG com semente, calculando o
   gabarito EXATO e a resolução passo a passo em tempo real.
   ========================================================================== */
(function (global) {
  "use strict";
  const NE = global.NE, CE = NE.CE, Q = CE.Q;
  const fmt = CE.fmt, rat = CE.rat, ratAdd = CE.ratAdd, ratMul = CE.ratMul, ratDiv = CE.ratDiv, ratStr = CE.ratStr;
  const lcm = NE.U.lcm, gcd = NE.U.gcd;
  const D = CE.defineFamily;

  /* ------------------------------- helpers -------------------------------- */
  const sup = function (x) { return "<sup>" + x + "</sup>"; };
  const sub = function (x) { return "<sub>" + x + "</sub>"; };
  const b = function (x) { return "<b>" + x + "</b>"; };
  const par = function (x) { return x < 0 ? "(" + fmt(x) + ")" : fmt(x); };
  const sgn = function (x) { return x < 0 ? "−" : "+"; };
  const ex = function (n) { return n === 1 ? "" : sup(n); };

  function poly(a, bb, c) {
    const t = [];
    const term = function (k, sym) {
      if (k === 0) return;
      const abs = Math.abs(k);
      t.push((k < 0 ? "− " : "+ ") + ((abs === 1 && sym) ? sym : fmt(abs) + sym));
    };
    term(a, "x²"); term(bb, "x"); term(c, "");
    return (t.join(" ").replace(/^\+ /, "").replace(/^− /, "−")) || "0";
  }
  function fstr(n) {
    const f = {}; let m = n;
    for (let p = 2; p * p <= m; p++) while (m % p === 0) { f[p] = (f[p] || 0) + 1; m /= p; }
    if (m > 1) f[m] = (f[m] || 0) + 1;
    return Object.keys(f).map(function (k) { return k + (f[k] > 1 ? sup(f[k]) : ""); }).join(" · ") || "1";
  }
  function plainDec(mant100, e) {   // mant100 = mantissa*100 inteiro; valor = mant100 × 10^(e−2)
    let digits = String(mant100);
    const shift = e - 2;
    if (shift >= 0) return digits + new Array(shift + 1).join("0");
    const k = -shift;
    while (digits.length < k + 1) digits = "0" + digits;
    return (digits.slice(0, digits.length - k) + "," + digits.slice(digits.length - k));
  }
  function det3(m) {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  }
  CE.kit = { sup: sup, sub: sub, b: b, par: par, sgn: sgn, ex: ex, poly: poly, fstr: fstr, plainDec: plainDec, det3: det3 };

  /* ================================ SEMANA 1 =============================== */
  D("ops1", 1, function (r) {
    const a = r.int(2, 9), bb = r.int(2, 9), c = r.int(2, 9), d = r.int(1, a + bb * c - 1), bc = bb * c;
    return Q.num("Calcule: " + a + " + " + bb + " × " + c + " − " + d, a + bc - d, "", [
      "Multiplicação antes de soma e subtração: " + bb + " × " + c + " = " + b(bc),
      "Reescreva a expressão: " + a + " + " + bc + " − " + d,
      a + " + " + bc + " = " + (a + bc),
      (a + bc) + " − " + d + " = " + b(a + bc - d)]);
  });
  D("ops2", 2, function (r) {
    const a = r.int(2, 9), bb = r.int(2, 9), c = r.int(2, 6), f = r.int(2, 5), e = f * r.int(2, 6);
    const v = (a + bb) * c - e / f;
    return Q.num("Calcule: (" + a + " + " + bb + ") × " + c + " − " + e + " ÷ " + f, v, "", [
      "Parênteses primeiro: " + a + " + " + bb + " = " + (a + bb),
      "Multiplicação e divisão (esquerda → direita): " + (a + bb) + " × " + c + " = " + (a + bb) * c + " e " + e + " ÷ " + f + " = " + e / f,
      "Reescreva: " + (a + bb) * c + " − " + e / f,
      "Subtraia: " + b(v)]);
  });
  D("ops3", 2, function (r) {
    const a = r.int(10, 30), bb = r.int(2, 6), c = r.int(1, 9);
    let d = r.int(1, 9); if (d === c) d += 1;
    const v = a - bb * (c - d);
    return Q.num("Calcule: " + a + " − " + bb + " × (" + c + " − " + d + ")", v, "", [
      "Parênteses: " + c + " − " + d + " = " + b(par(c - d)),
      "Multiplicação: " + bb + " × " + par(c - d) + " = " + b(par(bb * (c - d))),
      "Reescreva: " + a + " − " + par(bb * (c - d)) + (c - d < 0 ? " → <b>menos × menos = mais</b>: " + a + " + " + bb * (d - c) : ""),
      "Resultado: " + b(v)]);
  });
  D("reqSP", 3, function (r) {
    const pr = r.pick([[6, 3, 2], [12, 4, 3], [20, 5, 4], [30, 60, 20], [40, 10, 8], [15, 10, 6], [60, 20, 15], [30, 20, 12]]);
    const R1 = r.pick([10, 15, 20, 25, 30]);
    return Q.num("O resistor R₁ = " + R1 + " Ω está em série com a associação em paralelo de R₂ = " + pr[0] + " Ω e R₃ = " + pr[1] + " Ω. Calcule a resistência equivalente Req.", R1 + pr[2], "Ω", [
      "Dados: R₁ = " + R1 + " Ω; R₂ ‖ R₃ com " + pr[0] + " Ω e " + pr[1] + " Ω",
      "Paralelo: R₂·R₃/(R₂+R₃) = " + pr[0] * pr[1] + "/" + (pr[0] + pr[1]) + " = " + b(pr[2] + " Ω"),
      "Série: Req = R₁ + (R₂‖R₃) = " + R1 + " + " + pr[2],
      "Req = " + b((R1 + pr[2]) + " Ω")]);
  });
  D("fracSimp", 1, function (r) {
    let a, c; do { a = r.int(1, 9); c = r.int(2, 11); } while (gcd(a, c) !== 1 || a === c);
    const k = r.int(2, 9), n = a * k, d = c * k;
    return Q.frac("Simplifique a fração " + n + "/" + d + " até a forma irredutível.", a, c, "", [
      "Fatore: " + n + " = " + fstr(n) + " e " + d + " = " + fstr(d),
      "MDC(" + n + ", " + d + ") = " + b(k),
      "Divida numerador e denominador por " + k + ": " + n + "÷" + k + " = " + a + " e " + d + "÷" + k + " = " + c,
      "Fração irredutível: " + b(a + "/" + c)], { fmt: "Responda como fração irredutível (ex.: 3/4)" });
  });
  D("fracAdd", 1, function (r) {
    let d1, d2; do { d1 = r.pick([2, 3, 4, 5, 6, 8]); d2 = r.pick([2, 3, 4, 5, 6, 8]); } while (d1 === d2);
    const a = r.int(1, d1 - 1), c = r.int(1, d2 - 1), L = lcm(d1, d2), n = a * (L / d1) + c * (L / d2), res = rat(n, L);
    return Q.frac("Calcule " + a + "/" + d1 + " + " + c + "/" + d2 + " e simplifique.", res.n, res.d, "", [
      "Denominadores diferentes → <b>MMC</b>(" + d1 + ", " + d2 + ") = " + b(L),
      "Converta: " + a + "/" + d1 + " = " + a * (L / d1) + "/" + L + " e " + c + "/" + d2 + " = " + c * (L / d2) + "/" + L,
      "Some só os numeradores: (" + a * (L / d1) + " + " + c * (L / d2) + ")/" + L + " = " + n + "/" + L,
      "Simplifique: " + b(ratStr(res))],
      { traps: [{ v: (a + c) / (d1 + d2), type: "fraction", msg: "Você somou numeradores com numeradores E denominadores com denominadores. Isso não vale: primeiro iguale os denominadores com o MMC." }] });
  });
  D("fracAdd3", 2, function (r) {
    const ds = [r.pick([2, 3, 4]), r.pick([6, 8, 9]), r.pick([12, 18, 24])];
    const ns = ds.map(function (d) { return r.int(1, d - 1); });
    const L = lcm(lcm(ds[0], ds[1]), ds[2]);
    const parts = ds.map(function (d, i) { return ns[i] * (L / d); });
    const n = parts[0] + parts[1] + parts[2], res = rat(n, L);
    return Q.frac("Calcule " + ns[0] + "/" + ds[0] + " + " + ns[1] + "/" + ds[1] + " + " + ns[2] + "/" + ds[2] + " e simplifique.", res.n, res.d, "", [
      "<b>MMC</b>(" + ds.join(", ") + ") = " + b(L),
      "Converta cada fração para denominador " + L + ": " + parts.map(function (p) { return p + "/" + L; }).join(" , "),
      "Some os numeradores: " + parts.join(" + ") + " = " + n,
      "Resultado: " + n + "/" + L + " = " + b(ratStr(res))],
      { traps: [{ v: (ns[0] + ns[1] + ns[2]) / (ds[0] + ds[1] + ds[2]), type: "fraction", msg: "Você somou os denominadores. Use o MMC em vez de somar denominadores." }] });
  });
  D("fracMul", 2, function (r) {
    const a = r.int(1, 7), bb = r.int(2, 9), c = r.int(1, 7), d = r.int(2, 9), e = r.int(1, 7), f = r.int(2, 9);
    const q = ratMul(ratDiv(rat(a, bb), rat(c, d)), rat(e, f));
    return Q.frac("Calcule (" + a + "/" + bb + ") ÷ (" + c + "/" + d + ") × (" + e + "/" + f + ") e simplifique.", q.n, q.d, "", [
      "Divisão = multiplicar pelo <b>inverso</b>: " + a + "/" + bb + " × " + b(d + "/" + c) + " × " + e + "/" + f,
      "Multiplique numeradores: " + a + "·" + d + "·" + e + " = " + a * d * e,
      "Multiplique denominadores: " + bb + "·" + c + "·" + f + " = " + bb * c * f,
      "Simplifique " + a * d * e + "/" + bb * c * f + " = " + b(ratStr(q))]);
  });
  D("fracComplex", 2, function (r) {
    const a = r.int(1, 5), bb = r.int(2, 6), c = r.int(1, 5), d = r.int(2, 6), e = r.int(1, 5), f = r.int(2, 6);
    const s = ratAdd(rat(a, bb), rat(c, d)), q = ratDiv(s, rat(e, f));
    return Q.frac("Calcule (" + a + "/" + bb + " + " + c + "/" + d + ") ÷ (" + e + "/" + f + ") e simplifique.", q.n, q.d, "", [
      "Resolva primeiro o parêntese com MMC(" + bb + ", " + d + ") = " + lcm(bb, d),
      a + "/" + bb + " + " + c + "/" + d + " = " + b(ratStr(s)),
      "Divida pela fração: " + ratStr(s) + " × " + f + "/" + e + " (inverter e multiplicar)",
      "Resultado: " + b(ratStr(q))]);
  });
  D("parallel3", 3, function (r) {
    const t = r.pick([[12, 20, 30, 6], [6, 12, 4, 2], [10, 15, 30, 5], [20, 30, 60, 10], [8, 8, 4, 2], [24, 12, 8, 4]]);
    const L = lcm(lcm(t[0], t[1]), t[2]);
    return Q.num("Três resistores de " + t[0] + " Ω, " + t[1] + " Ω e " + t[2] + " Ω estão em paralelo. Calcule a resistência equivalente.", t[3], "Ω", [
      "Fórmula: 1/Req = 1/R₁ + 1/R₂ + 1/R₃",
      "MMC(" + t.slice(0, 3).join(", ") + ") = " + b(L),
      "1/Req = " + L / t[0] + "/" + L + " + " + L / t[1] + "/" + L + " + " + L / t[2] + "/" + L + " = " + (L / t[0] + L / t[1] + L / t[2]) + "/" + L,
      "Inverta: Req = " + L + "/" + (L / t[0] + L / t[1] + L / t[2]) + " = " + b(t[3] + " Ω")]);
  });
  D("lcm", 1, function (r) {
    let x, y; do { x = r.pick([4, 6, 8, 9, 10, 12, 14, 15, 18, 20, 21, 24]); y = r.pick([4, 6, 8, 9, 10, 12, 14, 15, 18, 20, 21, 24]); } while (x === y);
    return Q.num("Calcule o MMC(" + x + ", " + y + ").", lcm(x, y), "", [
      "Fatore: " + x + " = " + fstr(x) + " e " + y + " = " + fstr(y),
      "MMC = produto dos fatores primos com o <b>maior</b> expoente de cada um",
      "MMC(" + x + ", " + y + ") = " + b(lcm(x, y))]);
  });
  D("gcd", 1, function (r) {
    const g = r.int(2, 12); let x, y; do { x = r.int(2, 9); y = r.int(2, 9); } while (gcd(x, y) !== 1 || x === y);
    const A = g * x, B = g * y;
    return Q.num("Calcule o MDC(" + A + ", " + B + ").", g, "", [
      "Fatore: " + A + " = " + fstr(A) + " e " + B + " = " + fstr(B),
      "MDC = produto dos fatores primos <b>comuns</b> com o menor expoente",
      "MDC(" + A + ", " + B + ") = " + b(g)]);
  });
  D("fracAddLcm", 2, function (r) {
    let d1, d2; do { d1 = r.pick([6, 8, 9, 10, 12, 14, 15, 18, 20, 24]); d2 = r.pick([6, 8, 9, 10, 12, 14, 15, 18, 20, 24]); } while (d1 === d2);
    const a = r.int(1, d1 - 1), c = r.int(1, d2 - 1), L = lcm(d1, d2), n = a * (L / d1) + c * (L / d2), res = rat(n, L);
    return Q.frac("Calcule " + a + "/" + d1 + " + " + c + "/" + d2 + " usando o MMC e simplifique.", res.n, res.d, "", [
      "Fatore: " + d1 + " = " + fstr(d1) + " ; " + d2 + " = " + fstr(d2) + " → MMC = " + b(L),
      "Multiplicadores: " + L + "÷" + d1 + " = " + L / d1 + " e " + L + "÷" + d2 + " = " + L / d2,
      "Numeradores novos: " + a + "·" + L / d1 + " = " + a * (L / d1) + " e " + c + "·" + L / d2 + " = " + c * (L / d2),
      "Soma: " + n + "/" + L + " → simplificada: " + b(ratStr(res))],
      { traps: [{ v: (a + c) / (d1 + d2), type: "fraction", msg: "Você somou os denominadores. O denominador comum vem do MMC." }] });
  });
  D("periodAlign", 2, function (r) {
    let x, y; do { x = r.pick([4, 6, 10, 12, 14, 15, 18, 20]); y = r.pick([4, 6, 10, 12, 14, 15, 18, 20]); } while (x === y);
    return Q.num("Dois sinais periódicos têm períodos de " + x + " ms e " + y + " ms e começam juntos em t = 0. Em qual menor instante voltam a começar juntos?", lcm(x, y), "ms", [
      "Instantes de reinício: múltiplos de " + x + " e de " + y,
      "Procuramos o menor múltiplo comum → MMC(" + x + ", " + y + ")",
      x + " = " + fstr(x) + " ; " + y + " = " + fstr(y),
      "MMC = " + b(lcm(x, y) + " ms")]);
  });
  D("parallel2", 3, function (r) {
    let R1, R2; do { R1 = r.pick([6, 10, 12, 15, 18, 20, 24, 30, 40, 60]); R2 = r.pick([6, 10, 12, 15, 18, 20, 24, 30, 40, 60]); } while (R1 === R2);
    const L = lcm(R1, R2), a = L / R1, c = L / R2, res = rat(L, a + c);
    return Q.frac("Os resistores R₁ = " + R1 + " Ω e R₂ = " + R2 + " Ω estão em paralelo. Calcule Req (use MMC; pode responder como fração ou decimal).", res.n, res.d, "Ω", [
      "1/Req = 1/" + R1 + " + 1/" + R2,
      "MMC(" + R1 + ", " + R2 + ") = " + b(L),
      "1/Req = " + a + "/" + L + " + " + c + "/" + L + " = " + (a + c) + "/" + L,
      "<b>Inverta</b>: Req = " + L + "/" + (a + c) + " = " + b(ratStr(res) + " Ω ≈ " + fmt(L / (a + c)) + " Ω")]);
  });
  D("signs1", 1, function (r) {
    const a = r.int(2, 12), bb = r.int(2, 9), c = r.int(2, 9);
    if (r.next() < 0.5) {
      return Q.num("Calcule: " + a + " − (−" + bb + ") × " + c, a + bb * c, "", [
        "Multiplicação primeiro: (−" + bb + ") × " + c + " = " + b("−" + bb * c),
        "Reescreva: " + a + " − (" + "−" + bb * c + ")",
        "<b>Menos de um negativo vira mais</b>: " + a + " + " + bb * c,
        "Resultado: " + b(a + bb * c)]);
    }
    return Q.num("Calcule: (−" + a + ") × (−" + bb + ") − " + c, a * bb - c, "", [
      "<b>Menos × menos = mais</b>: (−" + a + ") × (−" + bb + ") = " + b("+" + a * bb),
      "Reescreva: " + a * bb + " − " + c,
      "Resultado: " + b(a * bb - c)]);
  });
  D("signDistrib", 2, function (r) {
    const a = r.int(2, 12), bb = r.int(2, 12), c = r.int(2, 12), d = r.int(2, 12);
    return Q.num("Calcule: −(" + a + " − " + bb + ") − (" + c + " − " + d + ")", -a + bb - c + d, "", [
      "Distribua o sinal do primeiro menos: −(" + a + " − " + bb + ") = " + b("−" + a + " + " + bb),
      "Distribua o segundo menos: −(" + c + " − " + d + ") = " + b("−" + c + " + " + d),
      "Junte tudo: −" + a + " + " + bb + " − " + c + " + " + d,
      "Resultado: " + b(-a + bb - c + d)]);
  });
  D("signFrac", 2, function (r) {
    const c = r.int(2, 6), k = r.int(2, 6), a = c * k, bb = r.int(2, 9);
    return Q.num("Calcule: (−" + a + " × " + bb + ") ÷ (−" + c + ")", a * bb / c, "", [
      "Numerador: −" + a + " × " + bb + " = " + b("−" + a * bb),
      "Divisão de dois negativos: <b>(−) ÷ (−) = (+)</b>",
      a * bb + " ÷ " + c + " = " + b(a * bb / c)]);
  });
  D("voltDiv", 3, function (r) {
    const Vin = r.pick([5, 9, 12, 15, 24]), R1 = r.pick([1, 2, 3, 4, 6]), R2 = r.pick([1, 2, 3, 4, 6, 8]);
    const v = Vin * R2 / (R1 + R2);
    return Q.num("Uma fonte de " + Vin + " V alimenta R₁ = " + R1 + " kΩ em série com R₂ = " + R2 + " kΩ. Qual a tensão sobre R₂?", v, "V", [
      "Divisor de tensão: V₂ = Vin · R₂/(R₁ + R₂)",
      "V₂ = " + Vin + " · " + R2 + "/(" + R1 + " + " + R2 + ") = " + Vin + " · " + R2 + "/" + (R1 + R2),
      "V₂ = " + b(fmt(v) + " V")],
      { traps: [{ v: Vin * R1 / (R1 + R2), type: "reading", msg: "Esse é o valor sobre R₁. O enunciado pede a tensão sobre R₂." }] });
  });

  /* ================================ SEMANA 2 =============================== */
  D("powRules", 1, function (r) {
    const base = r.pick([2, 3, 5, 10]), a = r.int(2, 5), bb = r.int(2, 4), c = r.int(1, a + bb - 1);
    return Q.num("Calcule " + base + sup(a) + " · " + base + sup(bb) + " ÷ " + base + sup(c), Math.pow(base, a + bb - c), "", [
      "Produto de mesma base: <b>soma</b> os expoentes: " + a + " + " + bb + " = " + (a + bb),
      "Divisão de mesma base: <b>subtrai</b> os expoentes: " + (a + bb) + " − " + c + " = " + (a + bb - c),
      base + sup(a + bb - c) + " = " + b(Math.pow(base, a + bb - c))]);
  });
  D("powNeg", 1, function (r) {
    const base = r.pick([2, 3, 5, 10]), n = r.int(2, 4);
    return Q.frac("Calcule " + base + sup("−" + n) + " (responda como fração).", 1, Math.pow(base, n), "", [
      "Expoente negativo = <b>inverso</b>: a" + sup("−n") + " = 1/aⁿ",
      base + sup("−" + n) + " = 1/" + base + sup(n),
      base + sup(n) + " = " + Math.pow(base, n),
      "Resultado: " + b("1/" + Math.pow(base, n))]);
  });
  D("powTen", 2, function (r) {
    const a = r.int(2, 9), bb = r.int(2, 9), m = r.int(-6, 6), n = r.int(-6, 6);
    return Q.num("Calcule (" + a + "×10" + sup(m) + ") · (" + bb + "×10" + sup(n) + ") (valor decimal ou notação científica, ex.: 6e5).", a * bb * Math.pow(10, m + n), "", [
      "Separe coeficientes e potências de 10",
      "Coeficientes: " + a + " × " + bb + " = " + a * bb,
      "Potências de 10: 10" + sup(m) + " · 10" + sup(n) + " = 10" + sup("(" + m + ") + (" + n + ")") + " = 10" + sup(m + n),
      "Resultado: " + b(fmt(a * bb * Math.pow(10, m + n)))], { fmt: "Aceita 6e5, 6×10^5 ou o número por extenso" });
  });
  D("powOfPow", 2, function (r) {
    const base = r.pick([2, 3]), m = r.int(2, 3), n = r.int(2, 3), k = r.int(1, m * n - 1);
    return Q.num("Calcule (" + base + sup(m) + ")" + sup(n) + " ÷ " + base + sup(k), Math.pow(base, m * n - k), "", [
      "Potência de potência: <b>multiplica</b> os expoentes: " + m + " × " + n + " = " + m * n,
      "Divisão: subtraia os expoentes: " + m * n + " − " + k + " = " + (m * n - k),
      base + sup(m * n - k) + " = " + b(Math.pow(base, m * n - k))]);
  });
  D("ohmPrefix", 3, function (r) {
    const R = r.pick([1, 2.2, 3.3, 4.7, 10]), I = r.pick([1, 2, 2.5, 5, 10]), V = R * I;
    return Q.num("Um resistor de " + fmt(R) + " kΩ é percorrido por uma corrente de " + fmt(I) + " mA. Qual a tensão sobre ele?", V, "V", [
      "Converta: " + fmt(R) + " kΩ = " + fmt(R) + "×10³ Ω e " + fmt(I) + " mA = " + fmt(I) + "×10⁻³ A",
      "Lei de Ohm: V = R · I = (" + fmt(R) + "×10³)(" + fmt(I) + "×10⁻³)",
      "Potências de 10: 10³ · 10⁻³ = 10⁰ = 1",
      "V = " + fmt(R) + " × " + fmt(I) + " = " + b(fmt(V) + " V")]);
  });
  D("sqrtPerfect", 1, function (r) {
    if (r.next() < 0.6) { const k = r.int(2, 15); return Q.num("Calcule √" + k * k, k, "", ["Procure o número que ao quadrado dá " + k * k, k + "² = " + k * k, "√" + k * k + " = " + b(k)]); }
    const k = r.int(2, 9);
    return Q.num("Calcule ∛" + k * k * k + " (raiz cúbica)", k, "", ["Procure o número que ao cubo dá " + k * k * k, k + "³ = " + k * k * k, "∛" + k * k * k + " = " + b(k)]);
  });
  D("sqrtSimplify", 1, function (r) {
    const a = r.int(2, 6), bb = r.pick([2, 3, 5, 6, 7]), n = a * a * bb;
    return Q.list("Simplifique √" + n + " na forma a√b (b sem fatores quadrados). Informe a ; b.", [a, bb], "a ; b", "", [
      "Fatore: " + n + " = " + fstr(n),
      "Extraia os quadrados perfeitos: " + n + " = " + a * a + " · " + bb,
      "√" + n + " = √" + a * a + " · √" + bb + " = " + b(a + "√" + bb)], { ordered: true });
  });
  D("fracExp", 2, function (r) {
    const t = r.pick([[8, 2, 3], [27, 2, 3], [16, 3, 4], [4, 3, 2], [81, 3, 4], [125, 2, 3], [32, 3, 5], [64, 2, 3], [9, 3, 2]]);
    const v = Math.round(Math.pow(t[0], t[1] / t[2]));
    return Q.num("Calcule " + t[0] + sup(t[1] + "/" + t[2]), v, "", [
      "Expoente fracionário m/n = <b>raiz n-ésima</b> elevada a m",
      "Raiz de índice " + t[2] + " de " + t[0] + " = " + Math.round(Math.pow(t[0], 1 / t[2])),
      "Eleve a " + t[1] + ": " + Math.round(Math.pow(t[0], 1 / t[2])) + sup(t[1]) + " = " + b(v)]);
  });
  D("sqrtOps", 2, function (r) {
    if (r.next() < 0.5) {
      const t = r.pick([[12, 3, 6], [8, 2, 4], [18, 2, 6], [50, 2, 10], [27, 3, 9], [45, 5, 15]]);
      return Q.num("Calcule √" + t[0] + " · √" + t[1], t[2], "", ["Produto de raízes: √a · √b = √(a·b)", "√(" + t[0] + "·" + t[1] + ") = √" + t[0] * t[1], "√" + t[0] * t[1] + " = " + b(t[2])]);
    }
    const t = r.pick([[50, 2, 5], [72, 2, 6], [98, 2, 7], [48, 3, 4], [75, 3, 5]]);
    return Q.num("Calcule √" + t[0] + " ÷ √" + t[1], t[2], "", ["Quociente de raízes: √a ÷ √b = √(a÷b)", "√(" + t[0] + "÷" + t[1] + ") = √" + t[0] / t[1], "√" + t[0] / t[1] + " = " + b(t[2])]);
  });
  D("resonance", 3, function (r) {
    const k = r.pick([1, 4, 16, 25, 100]), w = 1000 / Math.sqrt(k);
    return Q.num("Um circuito LC tem L = " + k + " mH e C = 1 mF. Calcule a frequência angular de ressonância ω₀ = 1/√(LC).", w, "rad/s", [
      "Converta: L = " + k + "×10⁻³ H e C = 1×10⁻³ F",
      "LC = " + k + "×10⁻⁶",
      "√(LC) = √" + k + " · 10⁻³ = " + fmt(Math.sqrt(k)) + "×10⁻³",
      "ω₀ = 1/(" + fmt(Math.sqrt(k)) + "×10⁻³) = " + b(fmt(w) + " rad/s")]);
  });
  D("vrms", 3, function (r) {
    const vp = r.pick([100, 170, 311, 325]), v = vp / Math.SQRT2;
    return Q.num("Uma tensão senoidal tem pico Vp = " + vp + " V. Qual o valor eficaz (RMS)?", v, "V", [
      "Relação: Vrms = Vp/√2",
      "Vrms = " + vp + "/1,4142",
      "Vrms = " + b(fmt(v) + " V")]);
  });
  D("sciConv", 1, function (r) {
    const m100 = r.int(101, 999) * (r.next() < 0.5 ? 1 : 1), e = r.int(-6, 6);
    const mant = m100 / 100, plain = plainDec(m100, e);
    return Q.list("Escreva " + plain + " em notação científica a×10ⁿ (1 ≤ a < 10). Informe a ; n.", [mant, e], "a ; n", "", [
      "Mova a vírgula até sobrar um único dígito não nulo antes dela",
      "Mantissa: a = " + fmt(mant),
      "Contei " + Math.abs(e) + " casas " + (e >= 0 ? "para a esquerda → expoente <b>positivo</b>" : "para a direita → expoente <b>negativo</b>"),
      "Resultado: " + b(fmt(mant) + "×10" + sup(e))], { ordered: true });
  });
  D("prefixConv", 1, function (r) {
    const p = r.pick([["k", 3], ["M", 6], ["m", -3], ["μ", -6], ["n", -9], ["p", -12]]), u = r.pick(["Ω", "A", "V", "F", "s"]);
    const v = r.pick([2.2, 4.7, 10, 47, 100, 330]);
    return Q.num("Converta " + fmt(v) + " " + p[0] + u + " para " + u + " (unidade base).", v * Math.pow(10, p[1]), u, [
      "Prefixo " + p[0] + " = 10" + sup(p[1]),
      fmt(v) + " " + p[0] + u + " = " + fmt(v) + " × 10" + sup(p[1]) + " " + u,
      "Resultado: " + b(fmt(v * Math.pow(10, p[1])) + " " + u)], { fmt: "Aceita 0,0047 ou 4,7e-3" });
  });
  D("sciDiv", 2, function (r) {
    const bb = r.int(2, 5), qq = r.int(2, 9), a = bb * qq, m = r.int(-5, 8), n = r.int(-5, 8);
    return Q.num("Calcule (" + a + "×10" + sup(m) + ") ÷ (" + bb + "×10" + sup(n) + ").", qq * Math.pow(10, m - n), "", [
      "Divida os coeficientes: " + a + " ÷ " + bb + " = " + qq,
      "Subtraia os expoentes: " + m + " − (" + n + ") = " + b(m - n),
      "Resultado: " + b(qq + "×10" + sup(m - n) + " = " + fmt(qq * Math.pow(10, m - n)))]);
  });
  D("tauRC", 3, function (r) {
    const R = r.pick([10, 22, 47, 100]), C = r.pick([100, 220, 470]);
    return Q.num("Calcule a constante de tempo τ = R·C para R = " + R + " kΩ e C = " + C + " nF, em milissegundos.", R * C / 1000, "ms", [
      "R = " + R + "×10³ Ω ; C = " + C + "×10⁻⁹ F",
      "τ = " + R + "×10³ · " + C + "×10⁻⁹ = " + R * C + "×10⁻⁶ s",
      "Em milissegundos (÷10⁻³): τ = " + b(fmt(R * C / 1000) + " ms")]);
  });
  D("rationalize1", 1, function (r) {
    const a = r.int(2, 12), bb = r.pick([2, 3, 5, 6, 7]);
    return Q.num("Racionalize " + a + "/√" + bb + " e dê o valor decimal (3 casas).", a / Math.sqrt(bb), "", [
      "Multiplique numerador e denominador por √" + bb,
      a + "/√" + bb + " · √" + bb + "/√" + bb + " = " + a + "√" + bb + "/" + bb,
      "Valor: " + a + " · " + fmt(Math.sqrt(bb), 4) + " ÷ " + bb + " = " + b(fmt(a / Math.sqrt(bb), 3))], { fmt: "Aceita decimal ou forma exata (ex.: 2√3)" });
  });
  D("ohm1", 1, function (r) {
    const V = r.pick([5, 9, 12, 24]), R = r.pick([1, 2, 3, 4, 6, 8, 10]);
    return Q.num("Um resistor de " + R + " kΩ está sob " + V + " V. Qual a corrente em mA?", V / R, "mA", [
      "Lei de Ohm: I = V/R",
      "I = " + V + "/(" + R + "×10³) = " + fmt(V / R) + "×10⁻³ A",
      "I = " + b(fmt(V / R) + " mA")]);
  });
  D("rationalConj", 2, function (r) {
    const a = r.pick([5, 6, 7, 10]), bb = r.pick([2, 3]);
    return Q.num("Racionalize 1/(√" + a + " + √" + bb + ") e calcule o valor decimal (3 casas).", 1 / (Math.sqrt(a) + Math.sqrt(bb)), "", [
      "Multiplique pelo <b>conjugado</b> (√" + a + " − √" + bb + "): denominador vira " + a + " − " + bb + " = " + (a - bb),
      "Expressão: (√" + a + " − √" + bb + ")/" + (a - bb),
      "Numérico: (" + fmt(Math.sqrt(a), 4) + " − " + fmt(Math.sqrt(bb), 4) + ")/" + (a - bb) + " = " + b(fmt(1 / (Math.sqrt(a) + Math.sqrt(bb)), 3))]);
  });
  D("coulomb", 2, function (r) {
    const q1 = r.pick([1, 2, 3, 4, 5]), q2 = r.pick([1, 2, 3, 5]), rc = r.pick([10, 20, 30, 50]);
    const F = 9e9 * q1 * 1e-6 * q2 * 1e-6 / Math.pow(rc / 100, 2);
    return Q.num("Duas cargas de " + q1 + " μC e " + q2 + " μC estão a " + rc + " cm no vácuo (k = 9×10⁹ N·m²/C²). Qual a força entre elas?", F, "N", [
      "Converta: " + q1 + " μC = " + q1 + "×10⁻⁶ C ; " + q2 + " μC = " + q2 + "×10⁻⁶ C ; " + rc + " cm = " + fmt(rc / 100) + " m",
      "F = k·q₁q₂/r² = 9×10⁹ · (" + q1 + "×10⁻⁶)(" + q2 + "×10⁻⁶)/(" + fmt(rc / 100) + ")²",
      "Numerador: 9×10⁹ · " + q1 * q2 + "×10⁻¹² = " + fmt(9e9 * q1 * q2 * 1e-12) + " ; denominador: " + fmt(Math.pow(rc / 100, 2)),
      "F = " + b(fmt(F) + " N")]);
  });
  D("ohmPower", 3, function (r) {
    const V = r.pick([6, 12, 24, 48]), R = r.pick([4, 6, 8, 12]);
    return Q.num("Um aquecedor resistivo de " + R + " Ω é ligado a " + V + " V. Qual a potência dissipada?", V * V / R, "W", [
      "Potência: P = V²/R",
      "V² = " + V + "² = " + V * V,
      "P = " + V * V + "/" + R + " = " + b(fmt(V * V / R) + " W")]);
  });

  /* ================================ SEMANA 3 =============================== */
  function bitsStr(r, n) { let s = "1"; for (let i = 1; i < n; i++) s += r.int(0, 1); return s; }
  D("bin2dec", 1, function (r) {
    const s = bitsStr(r, r.int(5, 8)), v = parseInt(s, 2), n = s.length;
    const terms = s.split("").map(function (c, i) { return c === "1" ? Math.pow(2, n - 1 - i) : null; }).filter(function (x) { return x !== null; });
    return Q.num("Converta " + s + sub(2) + " para decimal.", v, "", [
      "Pesos (da direita p/ esquerda): 1, 2, 4, 8, 16, 32, 64, 128",
      "Some os pesos dos bits iguais a 1: " + terms.join(" + "),
      "Resultado: " + b(v)]);
  });
  D("dec2bin", 1, function (r) {
    const v = r.int(10, 200), s = v.toString(2);
    let n = v; const st = [];
    while (n > 0) { st.push(n + " ÷ 2 = " + Math.floor(n / 2) + " resto " + (n % 2)); n = Math.floor(n / 2); }
    return Q.str("Converta " + v + " (decimal) para binário.", s, "bin", [
      "Divisões sucessivas por 2:<br>" + st.join("<br>"),
      "Leia os restos de <b>baixo para cima</b>",
      "Resultado: " + b(s + sub(2))], { fmt: "Apenas 0 e 1" });
  });
  D("binAdd", 2, function (r) {
    const x = r.int(5, 15), y = r.int(5, 15), s = (x + y).toString(2);
    return Q.str("Some em binário: " + x.toString(2) + sub(2) + " + " + y.toString(2) + sub(2) + " (responda em binário).", s, "bin", [
      "Converta: " + x.toString(2) + " = " + x + " e " + y.toString(2) + " = " + y,
      "Some: " + x + " + " + y + " = " + (x + y),
      "Converta de volta: " + (x + y) + " = " + b(s + sub(2)),
      "Dica de conferência: 1+1 = 10₂ (vai-um)"], { fmt: "Apenas 0 e 1" });
  });
  D("nbits", 2, function (r) {
    const n = r.int(4, 12);
    if (r.next() < 0.5) return Q.num("Quantos valores distintos podem ser representados com " + n + " bits?", Math.pow(2, n), "", ["Cada bit dobra as combinações", "2" + sup(n) + " = " + b(Math.pow(2, n))]);
    return Q.num("Qual o maior valor decimal sem sinal representável com " + n + " bits?", Math.pow(2, n) - 1, "", ["Todos os bits em 1 = 2" + sup(n) + " − 1", "2" + sup(n) + " = " + Math.pow(2, n), "Maior valor = " + b(Math.pow(2, n) - 1)]);
  });
  D("adcRes", 3, function (r) {
    const n = r.pick([8, 10, 12]), vr = r.pick([3.3, 5]), v = vr * 1000 / Math.pow(2, n);
    return Q.num("Um ADC de " + n + " bits mede de 0 a " + fmt(vr) + " V. Qual a resolução (mV por passo)?", v, "mV", [
      "Níveis: 2" + sup(n) + " = " + Math.pow(2, n),
      "Resolução = Vref/2ⁿ = " + fmt(vr) + "/" + Math.pow(2, n) + " V",
      "Em mV: " + b(fmt(v, 3) + " mV")]);
  });
  D("hex2dec", 1, function (r) {
    const h = r.int(16, 255), s = h.toString(16).toUpperCase(), d1 = parseInt(s[0], 16), d2 = parseInt(s[1], 16);
    return Q.num("Converta 0x" + s + " para decimal.", h, "", [
      "Cada dígito hexa vale 16ⁿ: dígito esquerdo ×16, direito ×1",
      s[0] + " = " + d1 + " e " + s[1] + " = " + d2,
      d1 + " × 16 + " + d2 + " = " + d1 * 16 + " + " + d2,
      "Resultado: " + b(h)]);
  });
  D("bin2hex", 1, function (r) {
    const v = r.int(16, 255), bin = ("00000000" + v.toString(2)).slice(-8), h = v.toString(16).toUpperCase();
    return Q.str("Converta " + bin.slice(0, 4) + " " + bin.slice(4) + sub(2) + " para hexadecimal.", h, "hex", [
      "Agrupe de 4 em 4 bits: " + bin.slice(0, 4) + " | " + bin.slice(4),
      bin.slice(0, 4) + " = " + parseInt(bin.slice(0, 4), 2) + " = " + h[0] + " ; " + bin.slice(4) + " = " + parseInt(bin.slice(4), 2) + " = " + h[1],
      "Resultado: " + b("0x" + h)], { fmt: "Dígitos 0–9 e A–F" });
  });
  D("dec2hex", 2, function (r) {
    const v = r.int(32, 255), h = v.toString(16).toUpperCase();
    return Q.str("Converta " + v + " (decimal) para hexadecimal.", h, "hex", [
      v + " ÷ 16 = " + Math.floor(v / 16) + " resto " + v % 16,
      "Dígitos: " + Math.floor(v / 16) + " → " + h[0] + " ; " + v % 16 + " → " + h[1] + " (10=A, 11=B, 12=C, 13=D, 14=E, 15=F)",
      "Resultado: " + b("0x" + h)], { fmt: "Dígitos 0–9 e A–F" });
  });
  D("twosComp", 2, function (r) {
    const n = r.int(5, 120), pos = ("00000000" + n.toString(2)).slice(-8);
    const inv = pos.split("").map(function (c) { return c === "1" ? "0" : "1"; }).join("");
    const res = ("00000000" + ((256 - n) & 255).toString(2)).slice(-8);
    return Q.str("Represente −" + n + " em 8 bits, em complemento de 2 (exatamente 8 bits).", res, "binx", [
      "+" + n + " em 8 bits: " + pos,
      "<b>Inverta todos os bits</b>: " + inv,
      "<b>Some 1</b>: " + inv + " + 1 = " + res,
      "Resultado: " + b(res)], { fmt: "Exatamente 8 bits" });
  });
  D("memAddr", 3, function (r) {
    const size = r.pick([256, 512, 1024, 2048, 4096]), start = r.pick([0x1000, 0x2000, 0x4000, 0x8000]), end = start + size - 1;
    return Q.num("Uma região de memória vai de 0x" + start.toString(16).toUpperCase() + " até 0x" + end.toString(16).toUpperCase() + " (inclusive). Quantos bytes ela possui?", size, "bytes", [
      "Converta: 0x" + start.toString(16).toUpperCase() + " = " + start + " e 0x" + end.toString(16).toUpperCase() + " = " + end,
      "Quantidade = fim − início + 1 (extremos incluídos)",
      end + " − " + start + " + 1 = " + b(size + " bytes")]);
  });

  const BOOL = [
    { s: "A·B + ¬C", f: function (A, B, C) { return (A & B) | (1 - C); } },
    { s: "A·(B + C)", f: function (A, B, C) { return A & (B | C); } },
    { s: "(A + B)·¬C", f: function (A, B, C) { return (A | B) & (1 - C); } },
    { s: "(A ⊕ B)·C", f: function (A, B, C) { return (A ^ B) & C; } },
    { s: "¬A·B + A·C", f: function (A, B, C) { return ((1 - A) & B) | (A & C); } },
    { s: "¬(A·B) + C", f: function (A, B, C) { return (1 - (A & B)) | C; } },
    { s: "(A + B)·(¬B + C)", f: function (A, B, C) { return (A | B) & ((1 - B) | C); } }
  ];
  D("truthOut", 1, function (r) {
    const e = r.pick(BOOL), A = r.int(0, 1), B = r.int(0, 1), C = r.int(0, 1), v = e.f(A, B, C);
    return Q.num("Para A = " + A + ", B = " + B + " e C = " + C + ", calcule S = " + e.s + ". (Convenção: · = AND, + = OR, ¬ = NOT.)", v, "", [
      "Substitua: A = " + A + ", B = " + B + ", C = " + C,
      "Resolva primeiro os NOT e os parênteses, depois AND, por último OR",
      "S = " + b(v)], { fmt: "Responda 0 ou 1", recip: false });
  });
  D("gateEval", 1, function (r) {
    const g = r.pick([["NAND", function (a, c) { return 1 - (a & c); }], ["NOR", function (a, c) { return 1 - (a | c); }], ["XOR", function (a, c) { return a ^ c; }], ["XNOR", function (a, c) { return 1 - (a ^ c); }]]);
    const A = r.int(0, 1), B = r.int(0, 1), v = g[1](A, B);
    return Q.num("Qual a saída da porta " + g[0] + " para A = " + A + " e B = " + B + "?", v, "", [
      "NAND = NOT(AND) ; NOR = NOT(OR) ; XOR = 1 só quando as entradas são diferentes ; XNOR = 1 quando são iguais",
      "Entradas: (" + A + ", " + B + ")",
      "Saída " + g[0] + " = " + b(v)], { fmt: "Responda 0 ou 1", recip: false });
  });
  D("countOnes", 2, function (r) {
    const e = r.pick(BOOL); let cnt = 0; const ones = [];
    for (let i = 0; i < 8; i++) { const A = (i >> 2) & 1, B = (i >> 1) & 1, C = i & 1; if (e.f(A, B, C)) { cnt++; ones.push("" + A + B + C); } }
    return Q.num("Em quantas das 8 combinações de (A, B, C) a expressão S = " + e.s + " vale 1?", cnt, "", [
      "Monte a tabela-verdade de 8 linhas (ABC = 000 … 111)",
      "Avalie S em cada linha",
      "Linhas com S = 1: " + (ones.length ? ones.join(", ") : "nenhuma"),
      "Total: " + b(cnt)], { recip: false });
  });
  D("alarmMulti", 3, function (r) {
    const t = r.pick([
      { s: "A·(B + C)", d: "O alarme dispara se a porta (A) estiver aberta E (a janela (B) aberta OU o modo noite (C) ativo)", f: function (A, B, C) { return A & (B | C); } },
      { s: "A·B + C", d: "O alarme dispara se (porta A E janela B abertas) OU o botão de pânico (C) for pressionado", f: function (A, B, C) { return (A & B) | C; } },
      { s: "(A + B)·¬C", d: "O alarme dispara se (A OU B) detectar movimento E o sistema NÃO estiver desarmado (¬C)", f: function (A, B, C) { return (A | B) & (1 - C); } }]);
    let cnt = 0; const ones = [];
    for (let i = 0; i < 8; i++) { const A = (i >> 2) & 1, B = (i >> 1) & 1, C = i & 1; if (t.f(A, B, C)) { cnt++; ones.push("" + A + B + C); } }
    return Q.num(t.d + ". Logo S = " + t.s + ". Em quantas das 8 combinações de entrada o alarme dispara?", cnt, "", [
      "Expressão: S = " + t.s,
      "Tabela-verdade completa (ABC): avalie as 8 linhas",
      "Linhas com S = 1: " + ones.join(", "),
      "Total de combinações que disparam: " + b(cnt)], { recip: false });
  });
  D("demorgan", 1, function (r) {
    const and = r.next() < 0.5, A = r.int(0, 1), B = r.int(0, 1), v = and ? 1 - (A & B) : 1 - (A | B);
    return Q.num("Calcule S = ¬(A " + (and ? "·" : "+") + " B) para A = " + A + " e B = " + B + ".", v, "", [
      "De Morgan: " + (and ? "¬(A·B) = ¬A + ¬B" : "¬(A + B) = ¬A · ¬B"),
      "Substitua: ¬" + A + " = " + (1 - A) + " e ¬" + B + " = " + (1 - B),
      (and ? (1 - A) + " + " + (1 - B) : (1 - A) + " · " + (1 - B)) + " = " + b(v)], { fmt: "Responda 0 ou 1", recip: false });
  });
  D("simplify", 2, function (r) {
    const L = [
      ["A·B + A·¬B", "A", ["Evidência: A·B + A·¬B = A·(B + ¬B)", "B + ¬B = 1", "A·1 = A"]],
      ["A + ¬A·B", "A+B", ["Distributiva: A + ¬A·B = (A + ¬A)·(A + B)", "A + ¬A = 1", "Resultado: A + B"]],
      ["A·(A + B)", "A", ["Distribua: A·A + A·B = A + A·B", "Absorção: A + A·B = A·(1 + B) = A"]],
      ["(A + B)·(A + ¬B)", "A", ["Distribua: A·A + A·¬B + B·A + B·¬B", "A·A = A e B·¬B = 0 → A + A·¬B + A·B", "A·(1 + ¬B + B) = A"]],
      ["¬A·B + A·B", "B", ["Evidência: B·(¬A + A)", "¬A + A = 1", "B·1 = B"]],
      ["A + A·B", "A", ["Evidência: A·(1 + B)", "1 + B = 1", "A·1 = A"]],
      ["A·B + A·¬B + ¬A·B", "A+B", ["Agrupe os dois primeiros: A·(B + ¬B) = A", "Fica A + ¬A·B", "Absorção/distributiva: A + ¬A·B = A + B"]]];
    const t = r.pick(L);
    return Q.str("Simplifique S = " + t[0] + " ao menor número de termos. (Use ! para NÃO e + para OU; ex.: A+B.)", t[1], "expr", t[2].concat(["Resultado: " + b(t[1].replace("+", " + "))]), { fmt: "Escreva a expressão mínima (ex.: A+B)" });
  });
  D("nandCount", 3, function (r) {
    const t = r.pick([["NOT", 1], ["AND", 2], ["OR", 3], ["NOR", 4], ["XOR", 4]]);
    const how = { NOT: "NOT A = NAND(A, A) → 1 porta", AND: "AND = NAND seguido de NOT(NAND) → 1 + 1 = 2 portas", OR: "OR = NAND(¬A, ¬B) → 2 NANDs de inversão + 1 = 3 portas", NOR: "NOR = NOT(OR) → 3 + 1 = 4 portas", XOR: "XOR clássico: N1 = NAND(A,B); N2 = NAND(A,N1); N3 = NAND(B,N1); N4 = NAND(N2,N3) → 4 portas" }[t[0]];
    return Q.num("Qual o número mínimo (construção clássica) de portas NAND de 2 entradas para implementar uma porta " + t[0] + "?", t[1], "portas", [
      "NAND é universal: dá para construir qualquer porta com ela",
      how,
      "Total: " + b(t[1])], { recip: false });
  });

  /* ================================ SEMANA 4 =============================== */
  D("expandSq", 1, function (r) {
    const a = r.int(2, 9), s = r.sign();
    return Q.list("Expanda (x " + sgn(s) + " " + a + ")² = x² + bx + c. Informe b ; c.", [s * 2 * a, a * a], "b ; c", "", [
      "Quadrado da " + (s > 0 ? "soma" : "diferença") + ": (x " + sgn(s) + " a)² = x² " + sgn(s) + " 2ax + a²",
      "2·a = 2·" + a + " = " + 2 * a + " → b = " + b(par(s * 2 * a)),
      "a² = " + a + "² = " + b(a * a) + " (sempre positivo)",
      "Resultado: x² " + sgn(s) + " " + 2 * a + "x + " + a * a], { ordered: true });
  });
  D("diffSq", 1, function (r) {
    const a = r.int(2, 12);
    return Q.num("Expanda (x + " + a + ")(x − " + a + "). Qual é o termo independente (sem x)?", -a * a, "", [
      "Produto da soma pela diferença: (x + a)(x − a) = x² − a²",
      "a² = " + a * a,
      "Termo independente: " + b("−" + a * a)]);
  });
  D("expandNum", 2, function (r) {
    if (r.next() < 0.5) {
      const k = r.int(1, 9), n = 100 + k;
      return Q.num("Calcule " + n + "² usando (a + b)² com a = 100 e b = " + k + ".", n * n, "", [
        "(100 + " + k + ")² = 100² + 2·100·" + k + " + " + k + "²",
        "= 10000 + " + 200 * k + " + " + k * k,
        "Resultado: " + b(n * n)]);
    }
    const k = r.int(1, 9);
    return Q.num("Calcule " + (100 - k) + " × " + (100 + k) + " usando diferença de quadrados.", 10000 - k * k, "", [
      "(100 − " + k + ")(100 + " + k + ") = 100² − " + k + "²",
      "= 10000 − " + k * k,
      "Resultado: " + b(10000 - k * k)]);
  });
  D("cubeExpand", 2, function (r) {
    const a = r.int(2, 5);
    return Q.list("Expanda (x + " + a + ")³ = x³ + px² + qx + c. Informe p ; q.", [3 * a, 3 * a * a], "p ; q", "", [
      "(x + a)³ = x³ + 3a·x² + 3a²·x + a³",
      "p = 3a = 3·" + a + " = " + b(3 * a),
      "q = 3a² = 3·" + a * a + " = " + b(3 * a * a)], { ordered: true });
  });
  D("diffQuot", 3, function (r) {
    const a = r.int(2, 9), h = r.pick([0.1, 0.01]);
    return Q.num("Calcule [(x + h)² − x²]/h para x = " + a + " e h = " + fmt(h) + ". (Esse é o primeiro passo da definição de derivada.)", 2 * a + h, "", [
      "Expanda: (x+h)² = x² + 2xh + h²",
      "Subtraia x²: sobra 2xh + h²",
      "Divida por h (evidência): <b>2x + h</b>",
      "Com x = " + a + " e h = " + fmt(h) + ": " + b(fmt(2 * a + h))], { tol: 1e-6 });
  });
  D("commonFactor", 1, function (r) {
    const g = r.pick([2, 3, 4, 5, 6]);
    let k1, k2; do { k1 = r.int(1, 5); k2 = r.int(1, 5); } while (gcd(k1, k2) !== 1 || k1 === k2);
    const p2 = r.int(1, 2), p1 = p2 + r.int(1, 2);
    const ans = (g === 1 ? "" : g) + "x" + (p2 === 1 ? "" : "^" + p2);
    return Q.str("Fatore pondo o fator comum em evidência: " + g * k1 + "x" + ex(p1) + " + " + g * k2 + "x" + ex(p2) + ". Informe o fator comum.", ans, "str", [
      "MDC dos coeficientes: MDC(" + g * k1 + ", " + g * k2 + ") = " + g,
      "Menor potência de x presente nos dois termos: x" + ex(p2),
      "Fator comum: " + b(ans),
      "Forma fatorada: " + ans.replace("^" + p2, "") + (p2 > 1 ? sup(p2) : "") + "(" + k1 + "x" + ex(p1 - p2) + " + " + k2 + ")"], { fmt: "Ex.: 6x^2" });
  });
  D("evalFactored", 2, function (r) {
    const a = r.int(2, 6), bb = r.int(2, 6), x = r.int(2, 7), y = r.int(2, 7);
    const v = a * x + a * y + bb * x + bb * y;
    return Q.num("Fatore por agrupamento ax + ay + bx + by e calcule o valor para a = " + a + ", b = " + bb + ", x = " + x + ", y = " + y + ".", v, "", [
      "Agrupe: a(x + y) + b(x + y)",
      "Evidência de (x + y): <b>(a + b)(x + y)</b>",
      "(" + a + " + " + bb + ")(" + x + " + " + y + ") = " + (a + bb) + " × " + (x + y),
      "Resultado: " + b(v)]);
  });
  D("grouping", 2, function (r) {
    const a = r.int(1, 6), bb = r.int(1, 6), x = r.int(2, 9);
    return Q.num("Fatore x² + " + (a + bb) + "x + " + a * bb + " e calcule seu valor em x = " + x + ".", (x + a) * (x + bb), "", [
      "Procure dois números com soma " + (a + bb) + " e produto " + a * bb + ": " + b(a + " e " + bb),
      "Forma fatorada: (x + " + a + ")(x + " + bb + ")",
      "Em x = " + x + ": " + (x + a) + " × " + (x + bb),
      "Resultado: " + b((x + a) * (x + bb))]);
  });
  D("powerSeries", 3, function (r) {
    const I = r.pick([0.5, 1, 2, 3]), Rs = [r.pick([10, 20, 30]), r.pick([40, 50, 60]), r.pick([20, 25, 70])];
    const P = I * I * (Rs[0] + Rs[1] + Rs[2]);
    return Q.num("Três resistores de " + Rs.join(" Ω, ") + " Ω estão em série e são percorridos por " + fmt(I) + " A. Use P = I²R₁ + I²R₂ + I²R₃ = I²(R₁+R₂+R₃) e calcule a potência total.", P, "W", [
      "Coloque I² em evidência: P = I²·(R₁ + R₂ + R₃)",
      "Soma: " + Rs.join(" + ") + " = " + (Rs[0] + Rs[1] + Rs[2]) + " Ω",
      "I² = " + fmt(I) + "² = " + fmt(I * I),
      "P = " + b(fmt(P) + " W")]);
  });
  D("quadRoots", 1, function (r) {
    let r1, r2; do { r1 = r.int(-6, 6); r2 = r.int(-6, 6); } while (!r1 || !r2 || r1 === r2);
    return Q.list("Resolva " + poly(1, -(r1 + r2), r1 * r2) + " = 0. Informe as duas raízes separadas por ;", [r1, r2], "x₁ ; x₂", "", [
      "Soma das raízes = −b/a = " + (r1 + r2) + " ; produto = c/a = " + r1 * r2,
      "Quais dois números têm soma " + (r1 + r2) + " e produto " + r1 * r2 + "? " + b(par(r1) + " e " + par(r2)),
      "Forma fatorada: (x − " + par(r1) + ")(x − " + par(r2) + ") = 0",
      "Raízes: " + b("x = " + r1 + " ou x = " + r2)]);
  });
  D("diffSquaresRoots", 1, function (r) {
    const n = r.int(2, 12);
    return Q.list("Resolva x² − " + n * n + " = 0. Informe as duas raízes separadas por ;", [n, -n], "x₁ ; x₂", "", [
      "Isole: x² = " + n * n,
      "Raiz quadrada tem <b>dois sinais</b>: x = ±√" + n * n,
      "Raízes: " + b(n + " e −" + n)]);
  });
  D("quadRoots2", 2, function (r) {
    let r1, k; do { r1 = r.int(-4, 4); k = r.pick([-7, -5, -3, -1, 1, 3, 5, 7]); } while (!r1);
    const bb = -(2 * r1 + k), c = r1 * k;
    return Q.list("Resolva " + poly(2, bb, c) + " = 0. Informe as duas raízes separadas por ; (frações aceitas).", [r1, k / 2], "x₁ ; x₂", "", [
      "Δ = b² − 4ac = " + bb * bb + " − " + 4 * 2 * c + " = " + (bb * bb - 8 * c),
      "√Δ = " + Math.sqrt(bb * bb - 8 * c),
      "x = (−b ± √Δ)/(2a) = (" + (-bb) + " ± " + Math.sqrt(bb * bb - 8 * c) + ")/4",
      "Raízes: " + b(r1 + " e " + fmt(k / 2))]);
  });
  D("perfSquareRoot", 2, function (r) {
    const p = r.int(2, 5), q = r.int(1, 7);
    return Q.frac("O trinômio " + poly(p * p, -2 * p * q, q * q) + " é um quadrado perfeito. Qual sua raiz dupla?", q, p, "", [
      "Reconheça: (" + p + "x)² − 2·(" + p + "x)·" + q + " + " + q + "²",
      "Forma fatorada: (" + p + "x − " + q + ")²",
      "Raiz dupla: " + p + "x − " + q + " = 0 → x = " + b(q + "/" + p)]);
  });
  D("poles", 3, function (r) {
    let a, bb; do { a = r.int(1, 8); bb = r.int(1, 8); } while (a === bb);
    return Q.list("Uma função de transferência tem denominador s² + " + (a + bb) + "s + " + a * bb + ". Calcule os polos (raízes do denominador). Informe os dois valores separados por ;", [-a, -bb], "p₁ ; p₂", "", [
      "Soma das raízes = −" + (a + bb) + " ; produto = " + a * bb,
      "Números com soma −" + (a + bb) + " e produto " + a * bb + ": " + b("−" + a + " e −" + bb),
      "Fatorado: (s + " + a + ")(s + " + bb + ")",
      "Polos: " + b("s = −" + a + " e s = −" + bb + " (sistema estável: polos negativos)")]);
  });
  D("domainExcl", 1, function (r) {
    const k = r.int(2, 9);
    return Q.list("Para quais valores de x a expressão 1/(x² − " + k * k + ") NÃO existe? Informe os dois valores separados por ;", [k, -k], "x₁ ; x₂", "", [
      "Denominador não pode ser zero: x² − " + k * k + " ≠ 0",
      "x² = " + k * k + " → x = ±" + k,
      "Excluídos: " + b(k + " e −" + k)]);
  });
  D("simpAlg1", 1, function (r) {
    const a = r.int(2, 9), n = r.int(10, 20);
    return Q.num("Simplifique (x² − " + a * a + ")/(x − " + a + ") e calcule o valor em x = " + n + ".", n + a, "", [
      "Fatore o numerador: x² − " + a * a + " = (x − " + a + ")(x + " + a + ")",
      "Cancele (x − " + a + "): sobra x + " + a,
      "Em x = " + n + ": " + n + " + " + a + " = " + b(n + a)]);
  });
  D("limFactor", 2, function (r) {
    let a, bb; do { a = r.int(1, 6); bb = r.int(1, 6); } while (a === bb);
    return Q.num("Calcule lim<sub>x→" + a + "</sub> (" + poly(1, -(a + bb), a * bb) + ")/(x − " + a + ").", a - bb, "", [
      "Substituindo direto: 0/0 (indeterminação) → fatore",
      "Numerador: (x − " + a + ")(x − " + bb + ")",
      "Cancele (x − " + a + "): sobra (x − " + bb + ")",
      "x → " + a + ": " + a + " − " + bb + " = " + b(par(a - bb))]);
  });
  D("algFracAdd", 2, function (r) {
    const a = r.int(1, 5), n = r.int(a + 1, a + 8);
    const s = ratAdd(rat(1, n - a), rat(1, n + a));
    return Q.frac("Calcule 1/(x − " + a + ") + 1/(x + " + a + ") em x = " + n + " (responda como fração simplificada).", s.n, s.d, "", [
      "MMC dos denominadores: (x − " + a + ")(x + " + a + ")",
      "Soma: [(x + " + a + ") + (x − " + a + ")]/[(x − " + a + ")(x + " + a + ")] = 2x/(x² − " + a * a + ")",
      "Em x = " + n + ": " + 2 * n + "/" + (n * n - a * a),
      "Simplificado: " + b(ratStr(s))]);
  });
  D("limCancel", 3, function (r) {
    let p, q; do { p = r.int(1, 6); q = r.int(1, 6); } while (p === q);
    return Q.num("Um sistema tem H(s) = (s² − " + (p + q) + "s + " + p * q + ")/(s − " + p + "). Calcule lim<sub>s→" + p + "</sub> H(s).", p - q, "", [
      "Em s = " + p + " dá 0/0 → fatore o numerador",
      "s² − " + (p + q) + "s + " + p * q + " = (s − " + p + ")(s − " + q + ")",
      "Cancele (s − " + p + "): H(s) = s − " + q,
      "lim = " + p + " − " + q + " = " + b(par(p - q))]);
  });

  /* ================================ SEMANA 5 =============================== */
  D("lin1", 1, function (r) {
    let x; do { x = r.int(-9, 9); } while (!x);
    const a = r.int(2, 9), bb = r.int(-12, 12), c = a * x + bb;
    return Q.num("Resolva " + a + "x " + sgn(bb) + " " + Math.abs(bb) + " = " + fmt(c), x, "", [
      "Isole o termo com x: " + a + "x = " + fmt(c) + " " + (bb >= 0 ? "−" : "+") + " " + Math.abs(bb) + " = " + b(fmt(c - bb)),
      "Divida por " + a + ": x = " + fmt(c - bb) + "/" + a,
      "x = " + b(x)], { fmt: "Valor de x" });
  });
  D("lin2", 1, function (r) {
    let x; do { x = r.int(-8, 8); } while (!x);
    let a, c; do { a = r.int(2, 9); c = r.int(1, 8); } while (a === c);
    const bb = r.int(-9, 9), d = a * x + bb - c * x;
    return Q.num("Resolva " + a + "x " + sgn(bb) + " " + Math.abs(bb) + " = " + c + "x " + sgn(d) + " " + Math.abs(d), x, "", [
      "Passe os termos em x para a esquerda (troca de lado = <b>troca de sinal</b>): " + (a - c) + "x = " + fmt(d - bb),
      "Termos numéricos para a direita: " + d + " − (" + bb + ") = " + (d - bb),
      "Divida por " + (a - c) + ": x = " + b(x)]);
  });
  D("linFrac", 2, function (r) {
    let a, bb; do { a = r.pick([2, 3, 4, 5, 6]); bb = r.pick([2, 3, 4, 5, 6]); } while (a === bb);
    const L = lcm(a, bb), k = r.int(1, 4), x = L * k, c = x / a + x / bb;
    return Q.num("Resolva x/" + a + " + x/" + bb + " = " + c, x, "", [
      "MMC(" + a + ", " + bb + ") = " + L + ". Multiplique tudo por " + L,
      (L / a) + "x + " + (L / bb) + "x = " + L * c,
      (L / a + L / bb) + "x = " + L * c,
      "x = " + L * c + "/" + (L / a + L / bb) + " = " + b(x)]);
  });
  D("solveFormula", 2, function (r) {
    const t = r.pick([[12, 9, 16], [24, 36, 16], [120, 240, 60], [10, 20, 5]]);
    return Q.num("Em P = V²/R, isole R e calcule para V = " + t[0] + " V e P = " + t[1] + " W.", t[2], "Ω", [
      "P = V²/R → multiplique por R: P·R = V²",
      "Divida por P: <b>R = V²/P</b>",
      "R = " + t[0] + "²/" + t[1] + " = " + t[0] * t[0] + "/" + t[1],
      "R = " + b(t[2] + " Ω")]);
  });
  D("dividerDesign", 3, function (r) {
    let Vs, R1, R2, tries = 0, vo;
    do { Vs = r.pick([6, 9, 10, 12, 15]); R1 = r.pick([1, 2, 3, 4, 6]); R2 = r.pick([1, 2, 3, 4, 6]); vo = Vs * R2 / (R1 + R2); tries++; } while (vo !== Math.round(vo * 100) / 100 && tries < 50);
    return Q.num("Um divisor de tensão tem Vs = " + Vs + " V e R₁ = " + R1 + " kΩ. Para obter Vout = " + fmt(vo) + " V sobre R₂, qual o valor de R₂ (em kΩ)?", R2, "kΩ", [
      "Divisor: Vout = Vs·R₂/(R₁ + R₂)",
      "Vout·(R₁ + R₂) = Vs·R₂ → Vout·R₁ = R₂·(Vs − Vout)",
      "<b>R₂ = Vout·R₁/(Vs − Vout)</b> = " + fmt(vo) + "·" + R1 + "/(" + Vs + " − " + fmt(vo) + ")",
      "R₂ = " + b(R2 + " kΩ")]);
  });
  D("ineqCount", 1, function (r) {
    const a = r.int(2, 5), bb = r.int(-6, 6), c = r.int(8, 30);
    let cnt = 0; for (let x = 1; x < 500; x++) if (a * x + bb < c) cnt++;
    return Q.num("Quantos números inteiros positivos satisfazem " + a + "x " + sgn(bb) + " " + Math.abs(bb) + " < " + c + "?", cnt, "", [
      "Isole x: " + a + "x < " + (c - bb) + " → x < " + fmt((c - bb) / a),
      "Inteiros positivos estritamente menores que " + fmt((c - bb) / a) + ": 1, 2, …",
      "Quantidade: " + b(cnt)]);
  });
  D("abs1", 1, function (r) {
    const a = r.int(-5, 8), bb = r.int(1, 6);
    return Q.list("Resolva |x " + (a >= 0 ? "−" : "+") + " " + Math.abs(a) + "| = " + bb + ". Informe as duas soluções separadas por ;", [a - bb, a + bb], "x₁ ; x₂", "", [
      "|u| = " + bb + " significa u = " + bb + " ou u = −" + bb,
      "x " + (a >= 0 ? "−" : "+") + " " + Math.abs(a) + " = " + bb + " → x = " + (a + bb),
      "x " + (a >= 0 ? "−" : "+") + " " + Math.abs(a) + " = −" + bb + " → x = " + (a - bb),
      "Soluções: " + b((a - bb) + " e " + (a + bb))]);
  });
  D("absIneqCount", 2, function (r) {
    const a = r.int(-4, 6), bb = r.int(2, 6);
    let cnt = 0; for (let x = -100; x <= 100; x++) if (Math.abs(x - a) < bb) cnt++;
    return Q.num("Quantos inteiros satisfazem |x " + (a >= 0 ? "−" : "+") + " " + Math.abs(a) + "| < " + bb + "?", cnt, "", [
      "|u| < " + bb + " ⇔ −" + bb + " < u < " + bb,
      "−" + bb + " < x " + (a >= 0 ? "−" : "+") + " " + Math.abs(a) + " < " + bb + " → " + (a - bb) + " < x < " + (a + bb),
      "Inteiros estritamente entre " + (a - bb) + " e " + (a + bb) + ": " + b(cnt)]);
  });
  D("ineqNeg", 2, function (r) {
    const a = r.int(2, 5), bb = r.int(5, 20), c = r.int(-10, 6);
    let best = null; for (let x = -200; x <= 200; x++) if (-a * x + bb > c) best = x;
    return Q.num("Qual o maior inteiro x que satisfaz −" + a + "x + " + bb + " > " + fmt(c) + "?", best, "", [
      "Isole: −" + a + "x > " + fmt(c - bb),
      "Divida por −" + a + ": <b>o sinal da desigualdade INVERTE</b> → x < " + fmt((c - bb) / -a),
      "Maior inteiro estritamente menor que " + fmt((c - bb) / -a) + ": " + b(best)]);
  });
  D("tolerance", 3, function (r) {
    const R0 = r.pick([100, 470, 1000, 4700]), p = r.pick([1, 5, 10]);
    return Q.num("Um resistor de " + R0 + " Ω com tolerância de ±" + p + "% pode chegar a qual valor MÁXIMO?", R0 * (1 + p / 100), "Ω", [
      "|R − R₀| ≤ " + p + "%·R₀ → |R − " + R0 + "| ≤ " + fmt(R0 * p / 100),
      "Faixa: " + fmt(R0 - R0 * p / 100) + " ≤ R ≤ " + fmt(R0 + R0 * p / 100),
      "Máximo: " + b(fmt(R0 * (1 + p / 100)) + " Ω")]);
  });
  D("sys2a", 1, function (r) {
    const x = r.int(-9, 9), y = r.int(-9, 9);
    return Q.list("Resolva o sistema: x + y = " + fmt(x + y) + " e x − y = " + fmt(x - y) + ". Informe x ; y.", [x, y], "x ; y", "", [
      "Some as equações (y cancela): 2x = " + fmt(2 * x),
      "x = " + b(x),
      "Substitua em x + y = " + fmt(x + y) + ": y = " + fmt(x + y) + " − " + par(x) + " = " + b(y)], { ordered: true });
  });
  function sysGen(r) {
    let x, y, a1, b1, a2, b2;
    do { x = r.int(-6, 6); y = r.int(-6, 6); a1 = r.int(1, 5); b1 = r.int(-5, 5); a2 = r.int(-5, 5); b2 = r.int(1, 5); } while (a1 * b2 - a2 * b1 === 0 || !b1 || !a2);
    return { x: x, y: y, a1: a1, b1: b1, c1: a1 * x + b1 * y, a2: a2, b2: b2, c2: a2 * x + b2 * y };
  }
  const eqStr = function (a, bb, c, v1, v2) { return (a === 1 ? "" : a === -1 ? "−" : a) + v1 + " " + sgn(bb) + " " + (Math.abs(bb) === 1 ? "" : Math.abs(bb)) + v2 + " = " + fmt(c); };
  D("sys2c", 2, function (r) {
    const s = sysGen(r), det = s.a1 * s.b2 - s.a2 * s.b1;
    return Q.list("Resolva: " + eqStr(s.a1, s.b1, s.c1, "x", "y") + " e " + eqStr(s.a2, s.b2, s.c2, "x", "y") + ". Informe x ; y.", [s.x, s.y], "x ; y", "", [
      "Determinante D = a₁b₂ − a₂b₁ = " + s.a1 + "·" + par(s.b2) + " − " + par(s.a2) + "·" + par(s.b1) + " = " + b(det),
      "Dx = c₁b₂ − c₂b₁ = " + (s.c1 * s.b2 - s.c2 * s.b1) + " → x = Dx/D = " + b(s.x),
      "Dy = a₁c₂ − a₂c₁ = " + (s.a1 * s.c2 - s.a2 * s.c1) + " → y = Dy/D = " + b(s.y),
      "Verifique na 1ª equação: " + s.a1 + "·" + par(s.x) + " + " + par(s.b1) + "·" + par(s.y) + " = " + s.c1 + " ✓"], { ordered: true });
  });
  D("sys2cur", 3, function (r) {
    const s = sysGen(r);
    return Q.list("A análise de duas malhas de um circuito gerou: " + eqStr(s.a1, s.b1, s.c1, "I₁", "I₂") + " e " + eqStr(s.a2, s.b2, s.c2, "I₁", "I₂") + " (correntes em A). Calcule I₁ ; I₂.", [s.x, s.y], "I₁ ; I₂", "A", [
      "Sistema 2×2 → regra de Cramer",
      "D = " + (s.a1 * s.b2 - s.a2 * s.b1),
      "I₁ = Dx/D = " + (s.c1 * s.b2 - s.c2 * s.b1) + "/" + (s.a1 * s.b2 - s.a2 * s.b1) + " = " + b(s.x + " A"),
      "I₂ = Dy/D = " + (s.a1 * s.c2 - s.a2 * s.c1) + "/" + (s.a1 * s.b2 - s.a2 * s.b1) + " = " + b(s.y + " A"),
      "Sinal negativo indicaria corrente no sentido oposto ao arbitrado"], { ordered: true });
  });
  D("sys3a", 1, function (r) {
    const x = r.int(-5, 8), y = r.int(-5, 8), z = r.int(-5, 8);
    return Q.list("Resolva: x + y + z = " + fmt(x + y + z) + " ; y + z = " + fmt(y + z) + " ; z = " + fmt(z) + ". Informe x ; y ; z.", [x, y, z], "x ; y ; z", "", [
      "Já está escalonado: comece pela última equação, z = " + b(z),
      "Substitua em y + z = " + fmt(y + z) + ": y = " + fmt(y + z) + " − " + par(z) + " = " + b(y),
      "Substitua na primeira: x = " + fmt(x + y + z) + " − " + par(y) + " − " + par(z) + " = " + b(x)], { ordered: true });
  });
  D("sys3b", 2, function (r) {
    let m, x, y, z;
    do {
      m = [0, 1, 2].map(function () { return [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)]; });
    } while (det3(m) === 0);
    x = r.int(-4, 5); y = r.int(-4, 5); z = r.int(-4, 5);
    const rhs = m.map(function (row) { return row[0] * x + row[1] * y + row[2] * z; });
    const D0 = det3(m);
    const rep = function (col) { return m.map(function (row, i) { const c = row.slice(); c[col] = rhs[i]; return c; }); };
    const eq = function (row, c) { return eqStr3(row, c); };
    function eqStr3(row, c) {
      return ["x", "y", "z"].map(function (v, i) { const k = row[i]; return k === 0 ? "" : (k < 0 ? "− " : "+ ") + (Math.abs(k) === 1 ? "" : Math.abs(k)) + v; }).filter(Boolean).join(" ").replace(/^\+ /, "").replace(/^− /, "−") + " = " + fmt(c);
    }
    return Q.list("Resolva o sistema: " + eq(m[0], rhs[0]) + " ; " + eq(m[1], rhs[1]) + " ; " + eq(m[2], rhs[2]) + ". Informe x ; y ; z.", [x, y, z], "x ; y ; z", "", [
      "Regra de Cramer: D = det da matriz dos coeficientes = " + b(D0),
      "Dx (troca a coluna de x pelos termos independentes) = " + det3(rep(0)) + " → x = " + b(x),
      "Dy = " + det3(rep(1)) + " → y = " + b(y),
      "Dz = " + det3(rep(2)) + " → z = " + b(z),
      "Confira substituindo na 1ª equação: " + m[0][0] + "·" + par(x) + " + " + m[0][1] + "·" + par(y) + " + " + m[0][2] + "·" + par(z) + " = " + rhs[0] + " ✓"], { ordered: true });
  });
  D("lkc", 1, function (r) {
    const i1 = r.int(2, 9), i2 = r.int(2, 9), i3 = r.int(1, i1 + i2 - 1), i4 = i1 + i2 - i3;
    return Q.num("Em um nó, entram " + i1 + " A e " + i2 + " A e saem " + i3 + " A e uma corrente I₄. Calcule I₄.", i4, "A", [
      "LKC: Σ correntes que entram = Σ correntes que saem",
      i1 + " + " + i2 + " = " + i3 + " + I₄",
      "I₄ = " + (i1 + i2) + " − " + i3 + " = " + b(i4 + " A")]);
  });
  D("lkt", 2, function (r) {
    const vs1 = r.int(10, 30), vs2 = r.int(0, 8), v1 = r.int(2, 9), v2 = r.int(2, 9), vx = vs1 - vs2 - v1 - v2;
    return Q.num("Em uma malha, a fonte de " + vs1 + " V (sentido horário) e uma fonte oposta de " + vs2 + " V alimentam três quedas: V₁ = " + v1 + " V, V₂ = " + v2 + " V e V₃ = ?. Calcule V₃ por LKT.", vx, "V", [
      "LKT: Σ elevações = Σ quedas na malha",
      vs1 + " − " + vs2 + " = " + v1 + " + " + v2 + " + V₃",
      "V₃ = " + (vs1 - vs2) + " − " + (v1 + v2) + " = " + b(par(vx) + " V")]);
  });
  D("meshSolve", 3, function (r) {
    const R3 = r.pick([2, 4, 5]), R2 = R3, R1 = r.pick([2, 4, 6]), k = r.int(1, 3);
    const I2 = k, I1 = 2 * k, V1 = (R1 + R3) * I1 - R3 * I2;
    return Q.list("Duas malhas compartilham R₃ = " + R3 + " Ω. Malha 1: fonte de " + V1 + " V, R₁ = " + R1 + " Ω. Malha 2 (sem fonte): R₂ = " + R2 + " Ω. Resolva as correntes de malha I₁ ; I₂.", [I1, I2], "I₁ ; I₂", "A", [
      "Malha 1: (R₁+R₃)I₁ − R₃I₂ = V₁ → " + (R1 + R3) + "I₁ − " + R3 + "I₂ = " + V1,
      "Malha 2: −R₃I₁ + (R₂+R₃)I₂ = 0 → −" + R3 + "I₁ + " + (R2 + R3) + "I₂ = 0 → I₁ = " + fmt((R2 + R3) / R3) + "·I₂",
      "Substitua na malha 1: " + (R1 + R3) * 2 + "I₂ − " + R3 + "I₂ = " + V1 + " → " + ((R1 + R3) * 2 - R3) + "I₂ = " + V1,
      "I₂ = " + b(I2 + " A") + " e I₁ = " + b(I1 + " A")], { ordered: true });
  });

  /* ================================ SEMANA 6 =============================== */
  D("linFn", 1, function (r) {
    let a; do { a = r.int(-5, 5); } while (!a);
    const bb = r.int(-9, 9), x0 = r.int(-6, 6);
    return Q.num("Dada f(x) = " + (a === 1 ? "" : a === -1 ? "−" : a) + "x " + sgn(bb) + " " + Math.abs(bb) + ", calcule f(" + x0 + ").", a * x0 + bb, "", [
      "Substitua x = " + x0 + ": " + a + "·" + par(x0) + " " + sgn(bb) + " " + Math.abs(bb),
      a + "·" + par(x0) + " = " + a * x0,
      "f(" + x0 + ") = " + a * x0 + " " + sgn(bb) + " " + Math.abs(bb) + " = " + b(a * x0 + bb)]);
  });
  D("linRoot", 1, function (r) {
    const a = r.int(2, 6), bb = r.int(-12, 12);
    const q = rat(-bb, a);
    return Q.frac("Qual a raiz (zero) de f(x) = " + a + "x " + sgn(bb) + " " + Math.abs(bb) + "? (fração ou decimal)", q.n, q.d, "", [
      "Raiz: f(x) = 0",
      a + "x " + sgn(bb) + " " + Math.abs(bb) + " = 0 → " + a + "x = " + (-bb),
      "x = " + b(ratStr(q))]);
  });
  D("lineTwoPoints", 2, function (r) {
    let x1 = r.int(-5, 5), x2, y1 = r.int(-6, 6), y2;
    do { x2 = r.int(-5, 5); } while (x2 === x1); y2 = r.int(-6, 6);
    const q = rat(y2 - y1, x2 - x1);
    return Q.frac("Calcule o coeficiente angular da reta que passa por (" + x1 + ", " + y1 + ") e (" + x2 + ", " + y2 + ").", q.n, q.d, "", [
      "m = Δy/Δx = (y₂ − y₁)/(x₂ − x₁)",
      "m = (" + y2 + " − " + par(y1) + ")/(" + x2 + " − " + par(x1) + ") = " + (y2 - y1) + "/" + (x2 - x1),
      "m = " + b(ratStr(q))]);
  });
  D("mru", 2, function (r) {
    const t = r.int(2, 20), v = r.int(2, 9), s0 = r.int(0, 20), S = s0 + v * t;
    return Q.num("Um móvel segue s = " + s0 + " + " + v + "t (m, s). Em que instante a posição é " + S + " m?", t, "s", [
      "Iguale: " + S + " = " + s0 + " + " + v + "t",
      v + "t = " + S + " − " + s0 + " = " + (S - s0),
      "t = " + (S - s0) + "/" + v + " = " + b(t + " s")]);
  });
  D("ohmLine", 3, function (r) {
    const I = r.pick([1, 2, 4, 5]), V = r.pick([2, 4, 5, 10, 12]);
    return Q.num("Medições em um resistor: (0 mA, 0 V) e (" + I + " mA, " + V + " V). A reta V(I) tem inclinação igual a R. Calcule R em kΩ.", V / I, "kΩ", [
      "Inclinação m = ΔV/ΔI = " + V + " V / " + I + " mA",
      "V/mA = kΩ",
      "R = " + b(fmt(V / I) + " kΩ")]);
  });
  function quadStr(a, bb, c) { return poly(a, bb, c); }
  D("vertexX", 1, function (r) {
    const a = r.pick([1, 2, -1, -2, 3]), xv = r.int(-5, 5), bb = -2 * a * xv, c = r.int(-8, 8);
    return Q.num("Calcule a abscissa do vértice de f(x) = " + quadStr(a, bb, c) + ".", xv, "", [
      "Fórmula: xv = −b/(2a)",
      "xv = −(" + bb + ")/(2·" + a + ") = " + (-bb) + "/" + 2 * a,
      "xv = " + b(xv)]);
  });
  D("vertexY", 2, function (r) {
    const a = r.pick([1, 2, -1, -2]), xv = r.int(-4, 4), bb = -2 * a * xv, c = r.int(-8, 8), yv = a * xv * xv + bb * xv + c;
    return Q.num("Calcule o valor extremo (ordenada do vértice) de f(x) = " + quadStr(a, bb, c) + ".", yv, "", [
      "xv = −b/(2a) = " + xv,
      "yv = f(xv) = " + a + "·" + par(xv) + "² + " + par(bb) + "·" + par(xv) + " + " + par(c),
      "yv = " + a * xv * xv + " + " + par(bb * xv) + " + " + par(c) + " = " + b(yv)]);
  });
  D("quadDelta", 2, function (r) {
    const a = r.int(1, 4), bb = r.int(-8, 8), c = r.int(-6, 6), dl = bb * bb - 4 * a * c;
    return Q.num("Calcule o discriminante Δ = b² − 4ac de " + quadStr(a, bb, c) + ".", dl, "", [
      "Identifique: a = " + a + ", b = " + bb + ", c = " + c,
      "b² = " + par(bb) + "² = " + bb * bb + " (sempre positivo)",
      "4ac = 4·" + a + "·" + par(c) + " = " + 4 * a * c,
      "Δ = " + bb * bb + " − " + par(4 * a * c) + " = " + b(dl)]);
  });
  D("projectile", 3, function (r) {
    const v0 = r.pick([10, 20, 30, 40]);
    return Q.num("Uma bola é lançada verticalmente: h(t) = " + v0 + "t − 5t² (m, s). Qual a altura máxima?", v0 * v0 / 20, "m", [
      "Parábola com a = −5 < 0 → tem máximo no vértice",
      "tv = −b/(2a) = " + (-v0) + "/(−10) = " + v0 / 10 + " s",
      "h(" + v0 / 10 + ") = " + v0 + "·" + v0 / 10 + " − 5·" + (v0 / 10) * (v0 / 10) + " = " + b(fmt(v0 * v0 / 20) + " m")]);
  });
  D("signAffRoot", 1, function (r) {
    const a = r.int(2, 6), bb = r.int(-12, 12), q = rat(-bb, a);
    return Q.frac("Em que valor de x a função " + a + "x " + sgn(bb) + " " + Math.abs(bb) + " muda de sinal?", q.n, q.d, "", [
      "Muda de sinal na raiz: " + a + "x " + sgn(bb) + " " + Math.abs(bb) + " = 0",
      "x = " + b(ratStr(q)),
      "Como a > 0, é negativa antes e positiva depois"]);
  });
  D("quadIneqCount", 1, function (r) {
    let r1, r2; do { r1 = r.int(-6, 4); r2 = r.int(r1 + 2, r1 + 9); } while (false);
    return Q.num("Quantos inteiros satisfazem " + poly(1, -(r1 + r2), r1 * r2) + " < 0?", r2 - r1 - 1, "", [
      "Raízes: " + b(r1 + " e " + r2) + " (soma " + (r1 + r2) + ", produto " + r1 * r2 + ")",
      "Parábola com a > 0 fica <b>negativa entre as raízes</b>: " + r1 + " < x < " + r2,
      "Inteiros estritamente entre: " + b(r2 - r1 - 1)]);
  });
  D("quotIneqCount", 2, function (r) {
    const a = r.int(-4, 4), c = r.int(1, 5);
    let cnt = 0; for (let x = -10; x <= 10; x++) if (x + c !== 0 && (x - a) / (x + c) >= 0) cnt++;
    return Q.num("Quantos inteiros x de −10 a 10 satisfazem (x " + sgn(-a) + " " + Math.abs(a) + ")/(x + " + c + ") ≥ 0?", cnt, "", [
      "Zero do numerador: x = " + a + " (incluído) ; denominador zero: x = " + (-c) + " (excluído)",
      "Quadro de sinais: positivo para x &lt; " + Math.min(a, -c) + " e x &gt; " + Math.max(a, -c) + " (com cuidado nos extremos)",
      "Conte os inteiros válidos de −10 a 10: " + b(cnt)]);
  });
  D("gainRegion", 3, function (r) {
    const r1 = r.int(0, 4), r2 = r.int(r1 + 2, r1 + 10);
    return Q.num("A potência líquida de um painel é P(t) = " + poly(-1, r1 + r2, -r1 * r2) + " (kW, t em h). Por quanto tempo (h) P(t) &gt; 0?", r2 - r1, "h", [
      "Raízes de P(t) = 0: t = " + r1 + " e t = " + r2,
      "Parábola com a = −1 &lt; 0: positiva <b>entre</b> as raízes",
      "Duração = " + r2 + " − " + r1 + " = " + b((r2 - r1) + " h")]);
  });
  D("maxPowerI", 1, function (r) {
    const V = r.pick([9, 12, 24, 48]), Rs = r.pick([2, 4, 6, 8]);
    return Q.num("P(I) = " + V + "·I − " + Rs + "·I² (W, A). Para qual corrente I a potência é máxima?", V / (2 * Rs), "A", [
      "Vértice: Iv = −b/(2a) com a = −" + Rs + " e b = " + V,
      "Iv = −" + V + "/(2·(−" + Rs + ")) = " + V + "/" + 2 * Rs,
      "Iv = " + b(fmt(V / (2 * Rs)) + " A")]);
  });
  D("maxPowerP", 2, function (r) {
    const V = r.pick([9, 12, 24, 48]), Rs = r.pick([2, 4, 6, 8]);
    return Q.num("Uma fonte de " + V + " V com resistência interna " + Rs + " Ω entrega à carga P(I) = " + V + "I − " + Rs + "I². Qual a potência máxima?", V * V / (4 * Rs), "W", [
      "Iv = V/(2Rs) = " + fmt(V / (2 * Rs)) + " A",
      "Pmax = " + V + "·" + fmt(V / (2 * Rs)) + " − " + Rs + "·" + fmt(Math.pow(V / (2 * Rs), 2)),
      "Pmax = V²/(4Rs) = " + b(fmt(V * V / (4 * Rs)) + " W")]);
  });
  D("powerAtRL", 2, function (r) {
    const V = r.pick([12, 24]), Rs = r.pick([4, 6]), RL = r.pick([1, 2, 3, 6, 8, 12]);
    const P = V * V * RL / Math.pow(RL + Rs, 2);
    return Q.num("Fonte de " + V + " V, Rs = " + Rs + " Ω, carga RL = " + RL + " Ω. Calcule a potência na carga P = V²·RL/(RL + Rs)².", P, "W", [
      "RL + Rs = " + (RL + Rs) + " → (RL + Rs)² = " + Math.pow(RL + Rs, 2),
      "V²·RL = " + V * V + "·" + RL + " = " + V * V * RL,
      "P = " + V * V * RL + "/" + Math.pow(RL + Rs, 2) + " = " + b(fmt(P) + " W")]);
  });
  D("pmaxDesign", 3, function (r) {
    const V = r.pick([12, 24, 48]), Rs = r.pick([2, 4, 6, 8]);
    return Q.list("Fonte de " + V + " V com Rs = " + Rs + " Ω. Qual RL maximiza a potência na carga e qual é essa potência máxima? Informe RL ; Pmax.", [Rs, V * V / (4 * Rs)], "RL (Ω) ; Pmax (W)", "", [
      "Máxima transferência de potência: <b>RL = Rs</b> = " + Rs + " Ω",
      "Corrente: I = V/(Rs + RL) = " + V + "/" + 2 * Rs + " = " + fmt(V / (2 * Rs)) + " A",
      "Pmax = I²·RL = " + fmt(Math.pow(V / (2 * Rs), 2)) + "·" + Rs,
      "Resultado: RL = " + b(Rs + " Ω") + " ; Pmax = " + b(fmt(V * V / (4 * Rs)) + " W")], { ordered: true });
  });

  /* ================================ SEMANA 7 =============================== */
  D("expEq1", 1, function (r) {
    const base = r.pick([2, 3, 5]), a = r.int(1, 3), x = r.int(-2, 5), c = r.int(-3, 3), k = a * x + c;
    const rhs = k >= 0 ? String(Math.pow(base, k)) : "1/" + Math.pow(base, -k);
    return Q.num("Resolva " + base + sup(a === 1 ? "x " + sgn(c) + " " + Math.abs(c) : a + "x " + sgn(c) + " " + Math.abs(c)) + " = " + rhs, x, "", [
      "Reescreva o lado direito na base " + base + ": " + rhs + " = " + base + sup(k),
      "Iguale os expoentes: " + (a === 1 ? "" : a) + "x " + sgn(c) + " " + Math.abs(c) + " = " + k,
      "x = " + b(x)]);
  });
  D("halfLife", 2, function (r) {
    const k = r.int(2, 5), N0 = (1 << k) * r.pick([5, 10, 25]), T = r.pick([2, 3, 4, 5]), t = k * T, N = N0 / (1 << k);
    return Q.num("Uma grandeza decai pela metade a cada " + T + " s, partindo de " + N0 + ". Quanto resta após " + t + " s?", N, "", [
      "Número de meias-vidas: n = " + t + "/" + T + " = " + k,
      "Fator: (1/2)" + sup(k) + " = 1/" + (1 << k),
      "Valor final: " + N0 + "/" + (1 << k) + " = " + b(N)]);
  });
  D("expEqQuad", 2, function (r) {
    const e1 = r.int(0, 3), e2 = e1 + r.int(1, 2), u1 = 1 << e1, u2 = 1 << e2;
    return Q.list("Resolva 2" + sup("2x") + " − " + (u1 + u2) + "·2" + sup("x") + " + " + u1 * u2 + " = 0. Informe as duas soluções x₁ ; x₂.", [e1, e2], "x₁ ; x₂", "", [
      "Substitua u = 2" + sup("x") + ": u² − " + (u1 + u2) + "u + " + u1 * u2 + " = 0",
      "Raízes em u: u = " + u1 + " = 2" + sup(e1) + " e u = " + u2 + " = 2" + sup(e2),
      "Volte para x: x = " + b(e1 + " e " + e2)]);
  });
  D("expGrowth", 3, function (r) {
    const k = r.int(2, 5), P0 = r.pick([2, 3, 5, 10]), T = r.pick([3, 4, 5]);
    return Q.num("A potência de um sinal dobra a cada " + T + " km de amplificação. Partindo de " + P0 + " mW, em quantos km atinge " + P0 * (1 << k) + " mW?", k * T, "km", [
      P0 + "·2" + sup("d/" + T) + " = " + P0 * (1 << k) + " → 2" + sup("d/" + T) + " = " + (1 << k) + " = 2" + sup(k),
      "d/" + T + " = " + k,
      "d = " + b(k * T + " km")]);
  });
  D("logBasic", 1, function (r) {
    const base = r.pick([2, 3, 5, 10]), k = r.int(-3, 4);
    const arg = k >= 0 ? String(Math.pow(base, k)) : "1/" + Math.pow(base, -k);
    return Q.num("Calcule log" + sub(base) + "(" + arg + ").", k, "", [
      "Pergunta do log: \"" + base + " elevado a quanto dá " + arg + "?\"",
      arg + " = " + base + sup(k),
      "log" + sub(base) + "(" + arg + ") = " + b(k)]);
  });
  D("logCombo", 2, function (r) {
    const base = r.pick([2, 3, 5]), k = r.int(1, 4), bVal = r.int(2, 6), aVal = bVal * Math.pow(base, k);
    return Q.num("Simplifique e calcule: log" + sub(base) + "(" + aVal + ") − log" + sub(base) + "(" + bVal + ").", k, "", [
      "Propriedade do quociente: log(A) − log(B) = log(A/B)",
      "A/B = " + aVal + "/" + bVal + " = " + Math.pow(base, k) + " = " + base + sup(k),
      "log" + sub(base) + "(" + base + sup(k) + ") = " + b(k)]);
  });
  D("logChange", 2, function (r) {
    const p = r.pick([2, 3]), m = r.int(2, 3), n = r.int(1, 4), q = rat(n, m);
    return Q.frac("Calcule log" + sub(Math.pow(p, m)) + "(" + Math.pow(p, n) + ") mudando para a base " + p + ".", q.n, q.d, "", [
      "Mudança de base: log" + sub(Math.pow(p, m)) + "(" + Math.pow(p, n) + ") = log" + sub(p) + "(" + p + sup(n) + ") / log" + sub(p) + "(" + p + sup(m) + ")",
      "= " + n + "/" + m,
      "Simplificado: " + b(ratStr(q))]);
  });
  D("bitsCount", 3, function (r) {
    const n = r.int(4, 12), N = (1 << (n - 1)) + r.int(1, (1 << (n - 1)) - 1);
    return Q.num("Quantos bits são necessários no mínimo para codificar " + N + " estados distintos?", n, "bits", [
      "Condição: 2" + sup("n") + " ≥ " + N,
      "2" + sup(n - 1) + " = " + (1 << (n - 1)) + " &lt; " + N + " ≤ 2" + sup(n) + " = " + (1 << n),
      "Mínimo: " + b(n + " bits")], { recip: false });
  });
  D("lnExp", 1, function (r) {
    const k = r.int(-5, 8);
    return Q.num("Simplifique: ln(e" + sup(k) + ") + e" + sup("ln(" + Math.abs(k || 2) + ")") + ".", k + Math.abs(k || 2), "", [
      "Funções inversas: ln(e" + sup("x") + ") = x e e" + sup("ln(a)") + " = a",
      "ln(e" + sup(k) + ") = " + k + " ; e" + sup("ln(" + Math.abs(k || 2) + ")") + " = " + Math.abs(k || 2),
      "Soma = " + b(k + Math.abs(k || 2))]);
  });
  D("dbPower", 1, function (r) {
    const k = r.int(-3, 4), ratio = k >= 0 ? String(Math.pow(10, k)) : "1/" + Math.pow(10, -k);
    return Q.num("Calcule o ganho de potência G(dB) = 10·log₁₀(P₂/P₁) para P₂/P₁ = " + ratio + ".", 10 * k, "dB", [
      "P₂/P₁ = 10" + sup(k) + " → log₁₀(P₂/P₁) = " + k,
      "G = 10 × " + par(k) + " = " + b(10 * k + " dB")]);
  });
  D("dbVolt", 2, function (r) {
    const k = r.int(-2, 3), ratio = k >= 0 ? String(Math.pow(10, k)) : "1/" + Math.pow(10, -k);
    return Q.num("Calcule o ganho de tensão G(dB) = 20·log₁₀(V₂/V₁) para V₂/V₁ = " + ratio + ".", 20 * k, "dB", [
      "Para tensão/corrente o fator é <b>20</b> (pois P ∝ V²)",
      "log₁₀(" + ratio + ") = " + k,
      "G = 20 × " + par(k) + " = " + b(20 * k + " dB")]);
  });
  D("dbCascade", 3, function (r) {
    const g1 = r.pick([10, 20, -6, 14]), g2 = r.pick([6, -3, 10, -10]), g3 = r.pick([3, 6, -4, 10]);
    const tot = g1 + g2 + g3;
    return Q.num("Três estágios em cascata têm ganhos de " + g1 + " dB, " + g2 + " dB e " + g3 + " dB. Qual o ganho total em dB?", tot, "dB", [
      "Em dB, produtos de ganhos viram <b>soma</b>: G_total = G₁ + G₂ + G₃",
      par(g1) + " + " + par(g2) + " + " + par(g3),
      "G_total = " + b(tot + " dB")]);
  });
  D("rcDischarge", 1, function (r) {
    const V0 = r.pick([5, 10, 12, 20]), k = r.int(1, 3), v = V0 * Math.exp(-k);
    return Q.num("Um capacitor descarrega segundo v(t) = " + V0 + "·e" + sup("−t/τ") + " V. Calcule v(" + k + "τ) com 2 casas decimais.", v, "V", [
      "Em t = " + k + "τ: v = " + V0 + "·e" + sup("−" + k),
      "e" + sup("−" + k) + " ≈ " + fmt(Math.exp(-k), 4),
      "v ≈ " + b(fmt(v, 3) + " V")], { tol: 0.02 });
  });
  D("rcCharge", 2, function (r) {
    const Vf = r.pick([5, 10, 12, 24]), k = r.int(1, 4), v = Vf * (1 - Math.exp(-k));
    return Q.num("Carga de capacitor: v(t) = " + Vf + "(1 − e" + sup("−t/τ") + ") V. Calcule v(" + k + "τ).", v, "V", [
      "Em t = " + k + "τ: 1 − e" + sup("−" + k) + " ≈ 1 − " + fmt(Math.exp(-k), 4) + " = " + fmt(1 - Math.exp(-k), 4),
      "v = " + Vf + " × " + fmt(1 - Math.exp(-k), 4),
      "v ≈ " + b(fmt(v, 3) + " V")], { tol: 0.02 });
  });
  D("rcTimeTo", 3, function (r) {
    const tau = r.pick([2, 4, 5, 10]), pct = r.pick([[50, 0.5], [75, 0.25], [80, 0.2], [90, 0.1], [95, 0.05]]);
    const t = -tau * Math.log(pct[1]);
    return Q.num("Em um circuito RC com τ = " + tau + " ms, em quanto tempo (ms) o capacitor atinge " + pct[0] + "% de Vf, partindo descarregado?", t, "ms", [
      "v(t)/Vf = 1 − e" + sup("−t/τ") + " = " + fmt(pct[0] / 100) + " → e" + sup("−t/τ") + " = " + fmt(pct[1]),
      "Aplique ln: −t/τ = ln(" + fmt(pct[1]) + ") ≈ " + fmt(Math.log(pct[1]), 4),
      "t = −τ·ln(" + fmt(pct[1]) + ") ≈ " + b(fmt(t, 3) + " ms")], { tol: 0.03 });
  });

  /* ================================ SEMANA 8 =============================== */
  const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [12, 16, 20]];
  D("pythHyp", 1, function (r) {
    const t = r.pick(TRI);
    return Q.num("Em um triângulo retângulo de catetos " + t[0] + " e " + t[1] + ", calcule a hipotenusa.", t[2], "", [
      "Pitágoras: a² = b² + c² = " + t[0] + "² + " + t[1] + "² = " + (t[0] * t[0] + t[1] * t[1]),
      "a = √" + (t[0] * t[0] + t[1] * t[1]) + " = " + b(t[2])]);
  });
  D("pythLeg", 1, function (r) {
    const t = r.pick(TRI);
    return Q.num("Em um triângulo retângulo de hipotenusa " + t[2] + " e um cateto " + t[0] + ", calcule o outro cateto.", t[1], "", [
      "Isolando o cateto: c² = a² − b² = " + t[2] + "² − " + t[0] + "² = " + (t[2] * t[2] - t[0] * t[0]),
      "c = √" + (t[2] * t[2] - t[0] * t[0]) + " = " + b(t[1])]);
  });
  D("similarTri", 2, function (r) {
    const a = r.int(3, 8), bb = r.int(4, 10), k = r.pick([1.5, 2, 2.5, 3, 4]);
    return Q.num("Dois triângulos são semelhantes. Os lados correspondentes medem " + a + " e " + fmt(a * k) + ". Se outro lado do primeiro mede " + bb + ", quanto mede o correspondente no segundo?", bb * k, "", [
      "Razão de semelhança k = " + fmt(a * k) + "/" + a + " = " + fmt(k),
      "Lado correspondente = " + bb + " × " + fmt(k) + " = " + b(fmt(bb * k))]);
  });
  D("cableGuy", 3, function (r) {
    const t = r.pick(TRI);
    return Q.num("Uma torre de " + t[1] + " m é sustentada por um cabo preso no solo a " + t[0] + " m da base. Qual o comprimento do cabo?", t[2], "m", [
      "Torre (vertical) e solo (horizontal) formam 90°",
      "L = √(" + t[0] + "² + " + t[1] + "²) = √" + (t[0] * t[0] + t[1] * t[1]),
      "L = " + b(t[2] + " m")]);
  });
  D("sohcahtoa", 1, function (r) {
    const t = r.pick(TRI), which = r.pick([["sen θ", t[0], t[2], "cateto oposto / hipotenusa"], ["cos θ", t[1], t[2], "cateto adjacente / hipotenusa"], ["tg θ", t[0], t[1], "cateto oposto / cateto adjacente"]]);
    const q = rat(which[1], which[2]);
    return Q.frac("Em um triângulo retângulo, cateto oposto a θ = " + t[0] + ", cateto adjacente = " + t[1] + ", hipotenusa = " + t[2] + ". Calcule " + which[0] + ".", q.n, q.d, "", [
      "Definição: " + which[0] + " = " + which[3],
      "= " + which[1] + "/" + which[2],
      "Simplificado: " + b(ratStr(q))]);
  });
  D("notableTrig", 1, function (r) {
    const L = [
      ["2·sen(30°) + cos(60°)", 1.5, "2·(1/2) + 1/2 = 3/2"],
      ["4·cos²(30°) + sen(30°)", 3.5, "4·(3/4) + 1/2 = 7/2"],
      ["tg(45°) + 2·sen(30°)", 2, "1 + 2·(1/2) = 2"],
      ["4·sen²(60°) − tg(45°)", 2, "4·(3/4) − 1 = 2"],
      ["2·cos(60°) + 4·sen²(45°)", 3, "2·(1/2) + 4·(2/4) = 1 + 2 = 3"]];
    const t = r.pick(L);
    return Q.num("Usando a tabela de ângulos notáveis (30°, 45°, 60°), calcule: " + t[0] + ".", t[1], "", [
      "sen 30° = 1/2, cos 30° = √3/2, sen 45° = √2/2, cos 60° = 1/2, tg 45° = 1",
      t[2],
      "Resultado: " + b(fmt(t[1]))]);
  });
  D("trigId", 2, function (r) {
    const t = r.pick(TRI), q = rat(t[1], t[2]);
    return Q.frac("Sabendo que θ é agudo e sen θ = " + t[0] + "/" + t[2] + ", calcule cos θ pela identidade fundamental.", q.n, q.d, "", [
      "sen²θ + cos²θ = 1 → cos²θ = 1 − (" + t[0] + "/" + t[2] + ")² = " + (t[2] * t[2] - t[0] * t[0]) + "/" + (t[2] * t[2]),
      "Como θ é agudo, cos θ &gt; 0: cos θ = " + t[1] + "/" + t[2],
      "Simplificado: " + b(ratStr(q))]);
  });
  D("rampHeight", 2, function (r) {
    const L = r.pick([6, 8, 10, 12, 20]), ang = r.pick([[30, 0.5], [45, Math.SQRT1_2], [60, Math.sqrt(3) / 2]]);
    const h = L * ang[1];
    return Q.num("Uma rampa de " + L + " m faz " + ang[0] + "° com a horizontal. Qual a altura atingida?", h, "m", [
      "Altura = cateto oposto = L·sen(" + ang[0] + "°)",
      "h = " + L + " × " + fmt(ang[1], 4),
      "h ≈ " + b(fmt(h, 3) + " m")], { tol: 0.02 });
  });
  D("decompForce", 1, function (r) {
    const F = r.pick([20, 40, 50, 100, 120]), a = r.pick([[0, 1, 0], [30, Math.sqrt(3) / 2, 0.5], [60, 0.5, Math.sqrt(3) / 2], [90, 0, 1]]);
    return Q.list("Decomponha uma força de " + F + " N a " + a[0] + "° acima do eixo +x. Informe Fx ; Fy (em N).", [F * a[1], F * a[2]], "Fx ; Fy", "N", [
      "Fx = F·cos θ = " + F + "·cos(" + a[0] + "°) ≈ " + b(fmt(F * a[1], 3) + " N"),
      "Fy = F·sen θ = " + F + "·sen(" + a[0] + "°) ≈ " + b(fmt(F * a[2], 3) + " N")], { ordered: true, tol: 0.03 });
  });
  D("incline", 2, function (r) {
    const m = r.pick([2, 4, 5, 8, 10]);
    return Q.list("Um bloco de " + m + " kg está em um plano inclinado sem atrito de 30° (use g = 10 m/s²). Calcule a componente do peso paralela ao plano (Px) e a normal (N). Informe Px ; N.", [m * 10 * 0.5, m * 10 * Math.sqrt(3) / 2], "Px ; N", "N", [
      "Peso P = m·g = " + m * 10 + " N",
      "No plano inclinado: <b>Px = P·sen θ</b> = " + m * 10 + "·(1/2) = " + b(m * 5 + " N"),
      "<b>N = Py = P·cos θ</b> = " + m * 10 + "·(√3/2) ≈ " + b(fmt(m * 10 * Math.sqrt(3) / 2, 3) + " N")], { ordered: true, tol: 0.05 });
  });
  D("powerTriangle", 3, function (r) {
    const t = r.pick(TRI), k = r.pick([10, 100, 200]), P = t[0] * k, Qr = t[1] * k, S = t[2] * k;
    return Q.list("Uma carga absorve P = " + P + " W e Q = " + Qr + " var. Calcule a potência aparente S (VA) e o fator de potência cos φ. Informe S ; cos φ.", [S, P / S], "S (VA) ; cos φ", "", [
      "Triângulo de potências: S = √(P² + Q²) = " + b(S + " VA"),
      "Fator de potência: cos φ = P/S = " + P + "/" + S + " = " + b(fmt(P / S))]);
  });

  /* ================================ SEMANA 9 =============================== */
  const ANGS = [[30, 1, 6], [45, 1, 4], [60, 1, 3], [90, 1, 2], [120, 2, 3], [135, 3, 4], [150, 5, 6], [180, 1, 1], [210, 7, 6], [225, 5, 4], [240, 4, 3], [270, 3, 2], [300, 5, 3], [315, 7, 4], [330, 11, 6], [360, 2, 1]];
  D("degToRad", 1, function (r) {
    const a = r.pick(ANGS), q = rat(a[1], a[2]);
    return Q.frac("Converta " + a[0] + "° para radianos na forma k·π. Informe apenas o fator racional k (ex.: 1/6 para π/6).", q.n, q.d, "·π rad", [
      "Regra: rad = graus × π/180 → k = " + a[0] + "/180",
      "Simplifique dividindo por MDC(" + a[0] + ", 180) = " + gcd(a[0], 180),
      "k = " + b(ratStr(q)) + " (ou seja, " + (q.d === 1 ? q.n + "π" : q.n + "π/" + q.d) + " rad)"], { fmt: "Apenas o coeficiente de π (ex.: 3/4)" });
  });
  D("radToDeg", 1, function (r) {
    const a = r.pick(ANGS);
    return Q.num("Converta " + (a[1] === 1 ? "" : a[1]) + "π/" + a[2] + " rad para graus.", a[0], "°", [
      "Substitua π rad = 180°",
      a[1] + " × 180° / " + a[2] + " = " + b(a[0] + "°")]);
  });
  D("unitCircle", 2, function (r) {
    const L = [
      ["sen(150°)", 1, 2, "2º quadrante (180° − 30°): sen positivo → +sen 30° = 1/2"],
      ["cos(120°)", -1, 2, "2º quadrante (180° − 60°): cos negativo → −cos 60° = −1/2"],
      ["cos(240°)", -1, 2, "3º quadrante (180° + 60°): cos negativo → −cos 60° = −1/2"],
      ["sen(210°)", -1, 2, "3º quadrante (180° + 30°): sen negativo → −sen 30° = −1/2"],
      ["tg(135°)", -1, 1, "2º quadrante (180° − 45°): tg negativa → −tg 45° = −1"],
      ["tg(225°)", 1, 1, "3º quadrante (180° + 45°): tg positiva → +tg 45° = 1"],
      ["cos(300°)", 1, 2, "4º quadrante (360° − 60°): cos positivo → +cos 60° = 1/2"],
      ["sen(330°)", -1, 2, "4º quadrante (360° − 30°): sen negativo → −sen 30° = −1/2"]];
    const t = r.pick(L);
    return Q.frac("Calcule o valor exato de " + t[0] + " reduzindo ao 1º quadrante.", t[1], t[2], "", [
      t[3],
      "Resultado: " + b(ratStr(rat(t[1], t[2])))]);
  });
  D("arcLen", 2, function (r) {
    const R = r.pick([2, 3, 4, 5, 6]), a = r.pick([[60, Math.PI / 3, "π/3"], [90, Math.PI / 2, "π/2"], [120, 2 * Math.PI / 3, "2π/3"], [180, Math.PI, "π"]]);
    return Q.num("Calcule o comprimento do arco s = R·θ para R = " + R + " m e θ = " + a[0] + "°.", R * a[1], "m", [
      "Em s = R·θ, θ DEVE estar em radianos: " + a[0] + "° = " + a[2] + " rad ≈ " + fmt(a[1], 4),
      "s = " + R + " × " + fmt(a[1], 4) + " ≈ " + b(fmt(R * a[1], 3) + " m")]);
  });
  D("omegaRpm", 3, function (r) {
    const rpm = r.pick([600, 1200, 1800, 3000, 3600]), f = rpm / 60, w = 2 * Math.PI * f;
    return Q.list("Um motor gira a " + rpm + " rpm. Calcule a frequência f (Hz) e a velocidade angular ω (rad/s). Informe f ; ω.", [f, w], "f (Hz) ; ω (rad/s)", "", [
      "f = rpm/60 = " + rpm + "/60 = " + b(f + " Hz"),
      "ω = 2πf = 2π·" + f + " ≈ " + b(fmt(w, 2) + " rad/s")], { ordered: true });
  });
  D("sinParams", 1, function (r) {
    const A = r.pick([10, 20, 100, 127, 220, 311]), f = r.pick([50, 60, 100, 400]);
    return Q.list("No sinal v(t) = " + A + "·sen(2π·" + f + "·t), informe a amplitude Vp, a frequência f (Hz) e o período T (ms). Formato: Vp ; f ; T(ms).", [A, f, 1000 / f], "Vp ; f ; T(ms)", "", [
      "Amplitude Vp = " + b(A),
      "Como ω = 2πf = 2π·" + f + ", temos f = " + b(f + " Hz"),
      "Período T = 1/f = " + fmt(1 / f, 5) + " s = " + b(fmt(1000 / f) + " ms")], { ordered: true });
  });
  D("sinEval", 2, function (r) {
    const Vp = r.pick([10, 20, 100, 200]), f = 50; // T = 20 ms
    const subT = r.pick([[5, 1, "T/4 → ωt = π/2 → sen = 1"], [10, 0, "T/2 → ωt = π → sen = 0"], [15, -1, "3T/4 → ωt = 3π/2 → sen = −1"]]);
    return Q.num("Dado v(t) = " + Vp + "·sen(100π·t) V (f = 50 Hz, T = 20 ms), calcule v(" + subT[0] + " ms).", Vp * subT[1], "V", [
      "t = " + subT[0] + " ms = " + subT[2],
      "v = " + Vp + " × " + par(subT[1]) + " = " + b(Vp * subT[1] + " V")]);
  });
  D("rmsPeak", 2, function (r) {
    const Vrms = r.pick([110, 127, 220, 380]), Vp = Vrms * Math.SQRT2;
    return Q.num("Uma rede CA tem tensão eficaz V_rms = " + Vrms + " V. Qual é a tensão de pico Vp = V_rms·√2?", Vp, "V", [
      "Para senoide pura: Vp = V_rms × √2",
      "Vp = " + Vrms + " × 1,4142 ≈ " + b(fmt(Vp, 2) + " V")], { tol: 0.2 });
  });
  D("phaseLead", 3, function (r) {
    const f = r.pick([50, 60, 100]), dt = r.pick([1, 2, 2.5, 5]), T = 1000 / f, deg = 360 * dt / T;
    return Q.num("Em f = " + f + " Hz, o sinal A passa pelo pico " + fmt(dt) + " ms antes do sinal B. Qual a defasagem Δφ em graus?", deg, "°", [
      "Período T = 1000/" + f + " = " + fmt(T) + " ms (equivale a 360°)",
      "Δφ = 360° × (Δt/T) = 360° × " + fmt(dt) + "/" + fmt(T),
      "Δφ = " + b(fmt(deg) + "°")]);
  });
  D("doubleAngle", 1, function (r) {
    const t = r.pick(TRI), s2 = rat(2 * t[0] * t[1], t[2] * t[2]);
    return Q.frac("Se θ é agudo com sen θ = " + t[0] + "/" + t[2] + " e cos θ = " + t[1] + "/" + t[2] + ", calcule sen(2θ).", s2.n, s2.d, "", [
      "Identidade do arco duplo: sen(2θ) = 2·sen θ·cos θ",
      "= 2·(" + t[0] + "/" + t[2] + ")·(" + t[1] + "/" + t[2] + ") = " + 2 * t[0] * t[1] + "/" + t[2] * t[2],
      "Simplificado: " + b(ratStr(s2))]);
  });
  D("cosSum", 2, function (r) {
    const L = [
      ["cos(75°)", "cos(45° + 30°)", (Math.SQRT2 / 2) * (Math.sqrt(3) / 2) - (Math.SQRT2 / 2) * 0.5, "cos45·cos30 − sen45·sen30 = (√6 − √2)/4"],
      ["sen(75°)", "sen(45° + 30°)", (Math.SQRT2 / 2) * (Math.sqrt(3) / 2) + (Math.SQRT2 / 2) * 0.5, "sen45·cos30 + cos45·sen30 = (√6 + √2)/4"],
      ["cos(15°)", "cos(45° − 30°)", (Math.SQRT2 / 2) * (Math.sqrt(3) / 2) + (Math.SQRT2 / 2) * 0.5, "cos45·cos30 + sen45·sen30 = (√6 + √2)/4"],
      ["sen(15°)", "sen(45° − 30°)", (Math.SQRT2 / 2) * (Math.sqrt(3) / 2) - (Math.SQRT2 / 2) * 0.5, "sen45·cos30 − cos45·sen30 = (√6 − √2)/4"]];
    const t = r.pick(L);
    return Q.num("Calcule " + t[0] + " abrindo como " + t[1] + " (aceita expressão com sqrt ou decimal).", t[2], "", [
      "Atenção: no cosseno da soma o sinal no meio <b>inverte</b>: cos(a+b) = cos a·cos b − sen a·sen b",
      t[3],
      "Valor: " + b(fmt(t[2], 4))], { tol: 0.005 });
  });
  D("instPowerAvg", 3, function (r) {
    const Vp = r.pick([100, 200, 311]), Ip = r.pick([2, 4, 10]), ang = r.pick([[0, 1], [30, Math.sqrt(3) / 2], [60, 0.5], [90, 0]]);
    const P = 0.5 * Vp * Ip * ang[1];
    return Q.num("Tensão de pico Vp = " + Vp + " V e corrente de pico Ip = " + Ip + " A estão defasadas de φ = " + ang[0] + "°. Pela identidade trigonométrica, a potência média é P = (Vp·Ip/2)·cos φ. Calcule P.", P, "W", [
      "v(t)·i(t) usa cos a·cos b = ½[cos(a−b) + cos(a+b)]: o termo em 2ω tem média zero",
      "Sobra P = (Vp·Ip/2)·cos φ = (" + Vp + "·" + Ip + "/2)·cos(" + ang[0] + "°)",
      "P ≈ " + b(fmt(P, 2) + " W")], { tol: 0.2 });
  });
  D("lawCosines", 2, function (r) {
    const a = r.int(3, 8), bb = r.int(3, 8), ang = r.pick([[60, 0.5], [120, -0.5]]);
    const c2 = a * a + bb * bb - 2 * a * bb * ang[1];
    return Q.num("Em um triângulo, lados a = " + a + " e b = " + bb + " formam θ = " + ang[0] + "°. Calcule o terceiro lado c pela Lei dos Cossenos.", Math.sqrt(c2), "", [
      "Lei dos Cossenos: c² = a² + b² − 2ab·cos θ",
      "cos(" + ang[0] + "°) = " + fmt(ang[1]) + " → c² = " + a * a + " + " + bb * bb + " − 2·" + a + "·" + bb + "·(" + fmt(ang[1]) + ") = " + c2,
      "c = √" + c2 + " ≈ " + b(fmt(Math.sqrt(c2), 3))], { tol: 0.01 });
  });
  D("phasorSum", 3, function (r) {
    const V1 = r.pick([10, 12, 20]), V2 = r.pick([10, 12, 20]), ang = r.pick([[60, 0.5], [90, 0], [120, -0.5]]);
    const V = Math.sqrt(V1 * V1 + V2 * V2 + 2 * V1 * V2 * ang[1]);
    return Q.num("Dois sinais de mesma frequência têm amplitudes " + V1 + " V (0°) e " + V2 + " V (" + ang[0] + "°). Qual a amplitude da soma?", V, "V", [
      "Pela regra do paralelogramo: V² = V₁² + V₂² + 2·V₁·V₂·cos(Δφ)",
      "V² = " + V1 * V1 + " + " + V2 * V2 + " + 2·" + V1 + "·" + V2 + "·(" + fmt(ang[1]) + ") = " + (V1 * V1 + V2 * V2 + 2 * V1 * V2 * ang[1]),
      "V ≈ " + b(fmt(V, 3) + " V")], { tol: 0.02 });
  });

  /* ================================ SEMANA 10 ============================== */
  D("dist2d", 1, function (r) {
    const t = r.pick(TRI), x1 = r.int(-5, 5), y1 = r.int(-5, 5), s1 = r.sign(), s2 = r.sign();
    const x2 = x1 + s1 * t[0], y2 = y1 + s2 * t[1];
    return Q.num("Calcule a distância entre A(" + x1 + ", " + y1 + ") e B(" + x2 + ", " + y2 + ").", t[2], "", [
      "Δx = " + x2 + " − " + par(x1) + " = " + (x2 - x1) + " ; Δy = " + y2 + " − " + par(y1) + " = " + (y2 - y1),
      "d = √(Δx² + Δy²) = √(" + t[0] * t[0] + " + " + t[1] * t[1] + ")",
      "d = " + b(t[2])]);
  });
  D("midpoint", 1, function (r) {
    const x1 = r.int(-8, 8), y1 = r.int(-8, 8), x2 = r.int(-8, 8), y2 = r.int(-8, 8);
    return Q.list("Calcule o ponto médio do segmento de A(" + x1 + ", " + y1 + ") a B(" + x2 + ", " + y2 + "). Informe xm ; ym.", [(x1 + x2) / 2, (y1 + y2) / 2], "xm ; ym", "", [
      "M = ((x₁ + x₂)/2 , (y₁ + y₂)/2)",
      "xm = (" + x1 + " + " + par(x2) + ")/2 = " + b(fmt((x1 + x2) / 2)),
      "ym = (" + y1 + " + " + par(y2) + ")/2 = " + b(fmt((y1 + y2) / 2))], { ordered: true });
  });
  D("lineYintercept", 2, function (r) {
    const m = r.int(-4, 4) || 2, x0 = r.int(-5, 5), y0 = r.int(-6, 6), n = y0 - m * x0;
    return Q.list("A reta de inclinação m = " + m + " passa por (" + x0 + ", " + y0 + "). Escreva na forma y = mx + n e informe m ; n.", [m, n], "m ; n", "", [
      "Ponto-inclinação: y − " + par(y0) + " = " + m + "(x − " + par(x0) + ")",
      "y = " + m + "x + (" + y0 + " − " + m * x0 + ")",
      "m = " + b(m) + " ; n = " + b(n)], { ordered: true });
  });
  D("perpSlope", 2, function (r) {
    let p, q; do { p = r.int(-5, 5); q = r.int(1, 5); } while (!p);
    const ans = rat(-q, p);
    return Q.frac("Uma reta tem coeficiente angular m₁ = " + ratStr(rat(p, q)) + ". Qual é o coeficiente angular m₂ de uma reta perpendicular a ela?", ans.n, ans.d, "", [
      "Retas perpendiculares: m₁ · m₂ = −1",
      "m₂ = −1/m₁ (inverta a fração e troque o sinal)",
      "m₂ = " + b(ratStr(ans))]);
  });
  D("distPointLine", 3, function (r) {
    const t = r.pick([[3, 4, 5], [4, -3, 5], [5, 12, 13], [12, -5, 13]]);
    const x0 = r.int(-4, 4), y0 = r.int(-4, 4), k = r.int(1, 4), c = k * t[2] - (t[0] * x0 + t[1] * y0);
    return Q.num("Calcule a distância do ponto (" + x0 + ", " + y0 + ") à reta " + t[0] + "x " + sgn(t[1]) + " " + Math.abs(t[1]) + "y " + sgn(c) + " " + Math.abs(c) + " = 0.", k, "", [
      "d = |ax₀ + by₀ + c| / √(a² + b²)",
      "|ax₀ + by₀ + c| = |" + (t[0] * x0 + t[1] * y0 + c) + "| = " + k * t[2],
      "√(a² + b²) = " + t[2] + " → d = " + k * t[2] + "/" + t[2] + " = " + b(k)]);
  });
  D("circleFromEq", 1, function (r) {
    const h = r.int(-6, 6), k = r.int(-6, 6), R = r.int(2, 9);
    const sx = h === 0 ? "x²" : "(x " + (h > 0 ? "− " + h : "+ " + (-h)) + ")²";
    const sy = k === 0 ? "y²" : "(y " + (k > 0 ? "− " + k : "+ " + (-k)) + ")²";
    return Q.list("Na circunferência " + sx + " + " + sy + " = " + R * R + ", informe o centro e o raio: xc ; yc ; R.", [h, k, R], "xc ; yc ; R", "", [
      "Forma padrão: (x − xc)² + (y − yc)² = R² (note o sinal trocado dentro dos parênteses)",
      "Centro = (" + b(h) + ", " + b(k) + ")",
      "Raio R = √" + R * R + " = " + b(R)], { ordered: true });
  });
  D("completeSquareCircle", 2, function (r) {
    const h = r.int(-5, 5), k = r.int(-5, 5), R = r.int(2, 7), c = h * h + k * k - R * R;
    return Q.list("Complete os quadrados em x² + y² " + sgn(-2 * h) + " " + Math.abs(2 * h) + "x " + sgn(-2 * k) + " " + Math.abs(2 * k) + "y " + sgn(c) + " " + Math.abs(c) + " = 0 e informe xc ; yc ; R.", [h, k, R], "xc ; yc ; R", "", [
      "Agrupe: (x² " + sgn(-2 * h) + " " + Math.abs(2 * h) + "x + " + h * h + ") + (y² " + sgn(-2 * k) + " " + Math.abs(2 * k) + "y + " + k * k + ") = " + (-c) + " + " + h * h + " + " + k * k,
      "(x − " + par(h) + ")² + (y − " + par(k) + ")² = " + R * R,
      "Centro (" + b(h) + ", " + b(k) + ") e raio R = " + b(R)], { ordered: true });
  });
  D("conicFoci", 2, function (r) {
    const t = r.pick(TRI); // t[0]^2 + t[1]^2 = t[2]^2 → a = t[2], b = t[1], c = t[0]
    return Q.num("Na elipse x²/" + (t[2] * t[2]) + " + y²/" + (t[1] * t[1]) + " = 1, calcule a distância focal 2c (distância entre os dois focos).", 2 * t[0], "", [
      "Na elipse: a² = " + t[2] * t[2] + ", b² = " + t[1] * t[1] + " e <b>c² = a² − b²</b> = " + t[0] * t[0],
      "Semidistância focal c = " + t[0],
      "Distância entre focos 2c = " + b(2 * t[0])]);
  });
  D("polarToRect", 2, function (r) {
    const Rm = r.pick([4, 6, 8, 10, 20]), a = r.pick([[0, 1, 0], [30, Math.sqrt(3) / 2, 0.5], [45, Math.SQRT1_2, Math.SQRT1_2], [60, 0.5, Math.sqrt(3) / 2], [90, 0, 1], [180, -1, 0]]);
    return Q.list("Converta o ponto polar (r, θ) = (" + Rm + ", " + a[0] + "°) para coordenadas cartesianas x ; y.", [Rm * a[1], Rm * a[2]], "x ; y", "", [
      "x = r·cos θ = " + Rm + "·cos(" + a[0] + "°) ≈ " + b(fmt(Rm * a[1], 3)),
      "y = r·sen θ = " + Rm + "·sen(" + a[0] + "°) ≈ " + b(fmt(Rm * a[2], 3))], { ordered: true, tol: 0.02 });
  });
  D("rectToPolar", 3, function (r) {
    const k = r.pick([2, 3, 5, 10]), a = r.pick([[1, 0, 0], [0, 1, 90], [-1, 0, 180], [0, -1, -90], [1, 1, 45], [-1, 1, 135], [-1, -1, -135], [1, -1, -45]]);
    const x = k * a[0], y = k * a[1], mod = Math.hypot(x, y);
    return Q.list("Converta Z = " + x + " " + sgn(y) + " j·" + Math.abs(y) + " para a forma polar |Z| ; θ° (use θ em (−180°, 180°]).", [mod, a[2]], "|Z| ; θ (graus)", "", [
      "|Z| = √(x² + y²) = √(" + x * x + " + " + y * y + ") ≈ " + b(fmt(mod, 3)),
      "Atenção ao quadrante de (" + x + ", " + y + ") usando atan2(y, x): θ = " + b(a[2] + "°")], { ordered: true, tol: 0.02 });
  });

  /* ================================ SEMANA 11 ============================== */
  D("vec2Op", 1, function (r) {
    const ux = r.int(-6, 6), uy = r.int(-6, 6), vx = r.int(-6, 6), vy = r.int(-6, 6), a = r.int(2, 4), bb = r.int(-3, -1);
    return Q.list("Dados u = (" + ux + ", " + uy + ") e v = (" + vx + ", " + vy + "), calcule w = " + a + "u " + sgn(bb) + " " + Math.abs(bb) + "v. Informe wx ; wy.", [a * ux + bb * vx, a * uy + bb * vy], "wx ; wy", "", [
      a + "u = (" + a * ux + ", " + a * uy + ") ; " + bb + "v = (" + bb * vx + ", " + bb * vy + ")",
      "Some componente a componente: wx = " + b(a * ux + bb * vx) + " ; wy = " + b(a * uy + bb * vy)], { ordered: true });
  });
  D("unitVec2", 2, function (r) {
    const t = r.pick(TRI), s1 = r.sign(), s2 = r.sign(), ux = s1 * t[0], uy = s2 * t[1];
    return Q.list("Determine o versor û = u/|u| do vetor u = (" + ux + ", " + uy + "). Informe ûx ; ûy.", [ux / t[2], uy / t[2]], "ûx ; ûy", "", [
      "|u| = √(" + ux * ux + " + " + uy * uy + ") = " + t[2],
      "Divida cada componente por " + t[2] + ": û = (" + b(ux + "/" + t[2]) + ", " + b(uy + "/" + t[2]) + ")"], { ordered: true });
  });
  D("vec3Norm", 1, function (r) {
    const L = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [3, 4, 12, 13], [4, 4, 2, 6]];
    const t = r.pick(L), s1 = r.sign(), s2 = r.sign(), s3 = r.sign();
    return Q.num("Calcule o módulo |v| do vetor 3D v = (" + s1 * t[0] + ", " + s2 * t[1] + ", " + s3 * t[2] + ").", t[3], "", [
      "|v| = √(vx² + vy² + vz²) = √(" + t[0] * t[0] + " + " + t[1] * t[1] + " + " + t[2] * t[2] + ") = √" + t[3] * t[3],
      "|v| = " + b(t[3])]);
  });
  D("vecAB3", 2, function (r) {
    const a = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)], bb = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
    const ab = [bb[0] - a[0], bb[1] - a[1], bb[2] - a[2]];
    return Q.list("Dados A(" + a.join(", ") + ") e B(" + bb.join(", ") + "), calcule o vetor AB = B − A. Informe x ; y ; z.", ab, "x ; y ; z", "", [
      "Regra: AB = <b>ponta − origem = B − A</b> (nunca A − B)",
      "AB = (" + bb[0] + " − " + par(a[0]) + ", " + bb[1] + " − " + par(a[1]) + ", " + bb[2] + " − " + par(a[2]) + ")",
      "AB = (" + b(ab.join(", ")) + ")"], { ordered: true });
  });
  D("dot3", 1, function (r) {
    const u = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)], v = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
    const d = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    return Q.num("Calcule o produto escalar u · v para u = (" + u.join(", ") + ") e v = (" + v.join(", ") + ").", d, "", [
      "u · v = ux·vx + uy·vy + uz·vz (resultado é um <b>escalar</b>, número)",
      "= " + (u[0] * v[0]) + " + " + par(u[1] * v[1]) + " + " + par(u[2] * v[2]),
      "u · v = " + b(d)]);
  });
  D("orthoK", 2, function (r) {
    let u1 = r.int(-5, 5), u2 = r.int(-5, 5), v1 = r.int(-5, 5), v3 = r.int(1, 5);
    if (!u1 && !u2) u1 = 2;
    const k = r.int(-5, 5), u3 = -(u1 * v1 + u2 * k) / v3;
    if (u3 !== Math.round(u3)) return CE.make("orthoK", (r.int(1, 9999)));
    return Q.num("Para qual valor de k os vetores u = (" + u1 + ", " + u2 + ", " + u3 + ") e v = (" + v1 + ", k, " + v3 + ") são ortogonais (90°)?", k, "", [
      "Vetores ortogonais ⇔ u · v = 0",
      (u1 * v1) + " + " + u2 + "k + " + (u3 * v3) + " = 0",
      "k = " + b(k)]);
  });
  D("workDot", 3, function (r) {
    const F = [r.int(-6, 8), r.int(-6, 8), r.int(-4, 6)], d = [r.int(-5, 6), r.int(-5, 6), r.int(-4, 5)];
    const W = F[0] * d[0] + F[1] * d[1] + F[2] * d[2];
    return Q.num("Uma força F = (" + F.join(", ") + ") N realiza um deslocamento d = (" + d.join(", ") + ") m. Calcule o trabalho W = F · d.", W, "J", [
      "W = Fx·dx + Fy·dy + Fz·dz",
      "= " + F[0] * d[0] + " + " + par(F[1] * d[1]) + " + " + par(F[2] * d[2]),
      "W = " + b(W + " J")]);
  });
  D("cross3", 2, function (r) {
    const u = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)], v = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)];
    const c = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    return Q.list("Calcule o produto vetorial u × v para u = (" + u.join(", ") + ") e v = (" + v.join(", ") + "). Informe x ; y ; z.", c, "x ; y ; z", "", [
      "x = uy·vz − uz·vy = " + u[1] + "·" + par(v[2]) + " − " + par(u[2]) + "·" + par(v[1]) + " = " + b(c[0]),
      "y = <b>−(ux·vz − uz·vx)</b> = " + b(c[1]) + " (cuidado com o sinal negativo da componente j!)",
      "z = ux·vy − uy·vx = " + b(c[2]),
      "Teste rápido: (u × v) · u = " + (c[0] * u[0] + c[1] * u[1] + c[2] * u[2]) + " ✓"], { ordered: true });
  });
  D("lorentzCross", 3, function (r) {
    const q = r.pick([1, 2, -1, -2]), v = [r.int(1, 5), 0, 0], B = [0, r.int(1, 5), r.int(-4, 4)];
    const vxB = [v[1] * B[2] - v[2] * B[1], v[2] * B[0] - v[0] * B[2], v[0] * B[1] - v[1] * B[0]];
    const F = vxB.map(function (c) { return q * c; });
    return Q.list("Uma carga q = " + q + " C move-se com v = (" + v.join(", ") + ") m/s em um campo B = (" + B.join(", ") + ") T. Calcule a força magnética F = q(v × B). Informe Fx ; Fy ; Fz (N).", F, "Fx ; Fy ; Fz", "N", [
      "v × B = (" + vxB.join(", ") + ")",
      "Multiplique por q = " + q + ": F = (" + b(F.join(", ")) + ") N"], { ordered: true });
  });

  /* ================================ SEMANA 12 ============================== */
  D("domainSqrt", 1, function (r) {
    const a = r.int(2, 5), bb = r.int(-15, 15), q = rat(-bb, a);
    return Q.frac("Qual é o menor valor de x no domínio real de f(x) = √(" + a + "x " + sgn(bb) + " " + Math.abs(bb) + ")?", q.n, q.d, "", [
      "Condição de existência da raiz par: radicando ≥ 0",
      a + "x " + sgn(bb) + " " + Math.abs(bb) + " ≥ 0 → x ≥ " + b(ratStr(q))]);
  });
  D("compFn", 1, function (r) {
    const a = r.int(2, 5), bb = r.int(-6, 6), c = r.int(1, 4), x0 = r.int(-3, 4);
    const gx = x0 * x0 + c, fg = a * gx + bb;
    return Q.num("Dadas f(x) = " + a + "x " + sgn(bb) + " " + Math.abs(bb) + " e g(x) = x² + " + c + ", calcule (f ∘ g)(" + x0 + ") = f(g(" + x0 + ")).", fg, "", [
      "De dentro para fora: g(" + x0 + ") = " + par(x0) + "² + " + c + " = " + gx,
      "f(" + gx + ") = " + a + "·" + gx + " " + sgn(bb) + " " + Math.abs(bb) + " = " + b(fg)]);
  });
  D("invFn", 2, function (r) {
    const a = r.int(2, 6), bb = r.int(-10, 10), x0 = r.int(-5, 6), y0 = a * x0 + bb;
    return Q.num("Dada f(x) = " + a + "x " + sgn(bb) + " " + Math.abs(bb) + ", calcule f⁻¹(" + y0 + ").", x0, "", [
      "f⁻¹(" + y0 + ") é o x tal que f(x) = " + y0,
      a + "x " + sgn(bb) + " " + Math.abs(bb) + " = " + y0 + " → " + a + "x = " + (y0 - bb),
      "x = " + b(x0)]);
  });
  D("polyDivRem", 2, function (r) {
    const a = r.int(-3, 3) || 1, bb = r.int(-5, 5), c = r.int(-6, 6), d = r.int(-8, 8), r0 = r.int(-3, 3) || 2;
    const val = a * r0 * r0 * r0 + bb * r0 * r0 + c * r0 + d;
    return Q.num("Pelo Teorema do Resto, qual é o resto da divisão de P(x) = " + a + "x³ " + sgn(bb) + " " + Math.abs(bb) + "x² " + sgn(c) + " " + Math.abs(c) + "x " + sgn(d) + " " + Math.abs(d) + " por (x " + (r0 > 0 ? "− " + r0 : "+ " + (-r0)) + ")?", val, "", [
      "Teorema do Resto: o resto da divisão de P(x) por (x − r) é <b>P(r)</b>",
      "Calcule P(" + r0 + ") = " + a + "·(" + r0 + ")³ + (" + bb + ")·(" + r0 + ")² + (" + c + ")·(" + r0 + ") + (" + d + ")",
      "Resto = " + b(val)]);
  });
  D("briotRoot", 3, function (r) {
    const r1 = r.int(1, 3), r2 = r.int(-4, -1), r3 = r.int(2, 5);
    const bCoef = -(r1 + r2 + r3), cCoef = r1 * r2 + r1 * r3 + r2 * r3, dCoef = -r1 * r2 * r3;
    return Q.list("Sabendo que x = " + r1 + " é raiz de x³ " + sgn(bCoef) + " " + Math.abs(bCoef) + "x² " + sgn(cCoef) + " " + Math.abs(cCoef) + "x " + sgn(dCoef) + " " + Math.abs(dCoef) + " = 0, baixe o grau por Briot-Ruffini e encontre as outras duas raízes.", [r2, r3], "x₂ ; x₃", "", [
      "Dividindo por (x − " + r1 + ") via Briot-Ruffini: quociente x² " + sgn(-(r2 + r3)) + " " + Math.abs(r2 + r3) + "x " + sgn(r2 * r3) + " " + Math.abs(r2 * r3),
      "Resolva o 2º grau (soma = " + (r2 + r3) + ", produto = " + r2 * r3 + ")",
      "Outras raízes: " + b(r2 + " e " + r3)]);
  });
  D("partialFrac", 2, function (r) {
    let p, q; do { p = r.int(-4, 4); q = r.int(-4, 4); } while (p === q);
    const A = r.int(1, 5), B = r.int(1, 5);
    const num1 = A + B, num0 = -(A * q + B * p);
    return Q.list("Decomponha (" + num1 + "s " + sgn(num0) + " " + Math.abs(num0) + ")/[(s − " + par(p) + ")(s − " + par(q) + ")] = A/(s − " + par(p) + ") + B/(s − " + par(q) + "). Informe A ; B.", [A, B], "A ; B", "", [
      "Multiplique pelo denominador comum: " + num1 + "s " + sgn(num0) + " " + Math.abs(num0) + " = A(s − " + par(q) + ") + B(s − " + par(p) + ")",
      "Truque de Heaviside (substitua as raízes):",
      "Em s = " + p + ": " + (num1 * p + num0) + " = A·(" + (p - q) + ") → A = " + b(A),
      "Em s = " + q + ": " + (num1 * q + num0) + " = B·(" + (q - p) + ") → B = " + b(B)], { ordered: true });
  });
  D("sensorScale", 3, function (r) {
    const Tmin = 0, Tmax = r.pick([100, 150, 200]), Vmin = r.pick([0, 1]), Vmax = r.pick([5, 10]);
    const T = r.pick([25, 50, 75, 100]), V = Vmin + (Vmax - Vmin) * (T - Tmin) / (Tmax - Tmin);
    return Q.num("Um sensor converte linearmente " + Tmin + " °C.." + Tmax + " °C em " + Vmin + " V.." + Vmax + " V. Se o ADC lê " + fmt(V) + " V, qual é a temperatura (função inversa)?", T, "°C", [
      "V(T) = " + Vmin + " + (" + (Vmax - Vmin) + "/" + Tmax + ")·T",
      "Inversa T(V) = (V − " + Vmin + ")·" + Tmax + "/" + (Vmax - Vmin),
      "T = " + b(T + " °C")]);
  });

  /* ================================ SEMANA 13 ============================== */
  D("limPoly", 1, function (r) {
    const a = r.int(1, 3), bb = r.int(-5, 5), c = r.int(-6, 6), x0 = r.int(-3, 4);
    const v = a * x0 * x0 + bb * x0 + c;
    return Q.num("Calcule lim" + sub("x→" + x0) + " (" + poly(a, bb, c) + ").", v, "", [
      "Polinômios são contínuos em toda parte → substituição direta",
      "= " + a + "·" + par(x0) + "² + " + par(bb) + "·" + par(x0) + " + " + par(c) + " = " + b(v)]);
  });
  D("limConj", 2, function (r) {
    const a = r.int(1, 6), q = rat(1, 2 * a);
    return Q.frac("Calcule lim" + sub("x→" + a * a) + " (√x − " + a + ")/(x − " + a * a + ").", q.n, q.d, "", [
      "Substituição dá 0/0. Fatore x − " + a * a + " = (√x − " + a + ")(√x + " + a + ") (ou multiplique pelo conjugado)",
      "Cancele (√x − " + a + "): sobra 1/(√x + " + a + ")",
      "Em x = " + a * a + ": 1/(" + a + " + " + a + ") = " + b(ratStr(q))]);
  });
  D("limInf", 1, function (r) {
    const a = r.int(2, 9), bb = r.int(2, 9), c = r.int(-8, 8), d = r.int(-8, 8), p = r.pick([2, 3]), q = rat(a, bb);
    return Q.frac("Calcule lim" + sub("x→∞") + " (" + a + "x" + sup(p) + " " + sgn(c) + " " + Math.abs(c) + "x)/(" + bb + "x" + sup(p) + " " + sgn(d) + " " + Math.abs(d) + ").", q.n, q.d, "", [
      "Mesmo grau no numerador e no denominador (" + p + ")",
      "Divida tudo por x" + sup(p) + ": os termos menores vão a 0",
      "Limite = razão dos coeficientes líderes = " + b(ratStr(q))]);
  });
  D("limTrig", 2, function (r) {
    const a = r.int(2, 9), bb = r.int(2, 9), q = rat(a, bb);
    return Q.frac("Usando o limite fundamental lim" + sub("u→0") + " sen(u)/u = 1, calcule lim" + sub("x→0") + " sen(" + a + "x)/(" + bb + "x).", q.n, q.d, "", [
      "Ajuste o argumento multiplicando e dividindo por " + a + ": (" + a + "/" + bb + ")·[sen(" + a + "x)/(" + a + "x)]",
      "Quando x → 0, u = " + a + "x → 0 e sen(u)/u → 1",
      "Resultado: " + b(ratStr(q))]);
  });
  D("contPiece", 2, function (r) {
    const a = r.int(1, 4), x0 = r.int(1, 4), m = r.int(2, 5), k = a * x0 * x0 - m * x0;
    return Q.num("Para qual valor de k a função f(x) = { " + a + "x² se x ≤ " + x0 + " ; " + m + "x + k se x &gt; " + x0 + " } é contínua em x = " + x0 + "?", k, "", [
      "Continuidade exige lim" + sub("x→" + x0 + "⁻") + " f(x) = lim" + sub("x→" + x0 + "⁺") + " f(x)",
      a + "·" + x0 + "² = " + m + "·" + x0 + " + k → " + a * x0 * x0 + " = " + m * x0 + " + k",
      "k = " + b(k)]);
  });
  D("rcSteady", 3, function (r) {
    const Vf = r.pick([5, 12, 24]), R = r.pick([2, 4, 6]), i0 = Vf / R;
    return Q.list("Na carga de um capacitor (v(t) = " + Vf + "(1 − e" + sup("−t/τ") + "), i(t) = (" + Vf + "/" + R + ")e" + sup("−t/τ") + "), calcule lim" + sub("t→0⁺") + " i(t) e lim" + sub("t→∞") + " v(t). Informe i(0⁺) ; v(∞).", [i0, Vf], "i(0⁺) (A) ; v(∞) (V)", "", [
      "Em t → 0⁺: e⁰ = 1 → capacitor descarregado age como curto → i(0⁺) = " + Vf + "/" + R + " = " + b(fmt(i0) + " A"),
      "Em t → ∞: e" + sup("−∞") + " = 0 → capacitor carregado age como aberto → v(∞) = " + b(Vf + " V")], { ordered: true });
  });

  /* ================================ SEMANA 14 ============================== */
  D("derivDef", 1, function (r) {
    const a = r.int(1, 5), bb = r.int(-6, 6), x0 = r.int(-4, 5), d = 2 * a * x0 + bb;
    return Q.num("Calcule a derivada f'(" + x0 + ") de f(x) = " + poly(a, bb, 0) + " (coeficiente angular da reta tangente em x = " + x0 + ").", d, "", [
      "f'(x) = lim" + sub("h→0") + " [f(x+h) − f(x)]/h = 2·" + a + "x " + sgn(bb) + " " + Math.abs(bb),
      "Em x = " + x0 + ": f'(" + x0 + ") = " + 2 * a + "·" + par(x0) + " " + sgn(bb) + " " + Math.abs(bb) + " = " + b(d)]);
  });
  D("derivPoly", 1, function (r) {
    const a = r.int(1, 4), bb = r.int(-5, 5), c = r.int(-6, 6), d = r.int(-9, 9), x0 = r.int(-3, 3);
    const val = 3 * a * x0 * x0 + 2 * bb * x0 + c;
    return Q.num("Pela regra do tombo, derive f(x) = " + a + "x³ " + sgn(bb) + " " + Math.abs(bb) + "x² " + sgn(c) + " " + Math.abs(c) + "x " + sgn(d) + " " + Math.abs(d) + " e calcule f'(" + x0 + ").", val, "", [
      "Regra da potência: (x" + sup("n") + ")' = n·x" + sup("n−1") + " e derivada de constante é 0",
      "f'(x) = " + 3 * a + "x² " + sgn(2 * bb) + " " + Math.abs(2 * bb) + "x " + sgn(c) + " " + Math.abs(c),
      "f'(" + x0 + ") = " + b(val)]);
  });
  D("tangentLine", 2, function (r) {
    const a = r.int(1, 3), bb = r.int(-4, 4), c = r.int(-5, 5), x0 = r.int(-3, 3);
    const y0 = a * x0 * x0 + bb * x0 + c, m = 2 * a * x0 + bb, n = y0 - m * x0;
    return Q.list("Determine a reta tangente y = mx + n ao gráfico de f(x) = " + poly(a, bb, c) + " em x = " + x0 + ". Informe m ; n.", [m, n], "m ; n", "", [
      "Ponto: y₀ = f(" + x0 + ") = " + y0,
      "Inclinação: m = f'(" + x0 + ") = 2·" + a + "·" + par(x0) + " + " + par(bb) + " = " + b(m),
      "y − " + par(y0) + " = " + m + "(x − " + par(x0) + ") → n = " + b(n)], { ordered: true });
  });
  D("prodRule", 2, function (r) {
    const a = r.int(1, 4), bb = r.int(1, 5), x0 = r.int(0, 2);
    // f(x) = (x + a)(x² + b) → f'(x) = (x² + b) + (x + a)(2x)
    const val = (x0 * x0 + bb) + (x0 + a) * (2 * x0);
    return Q.num("Derive f(x) = (x + " + a + ")(x² + " + bb + ") pela regra do produto (u·v)' = u'v + uv' e calcule f'(" + x0 + ").", val, "", [
      "u = x + " + a + " (u' = 1) ; v = x² + " + bb + " (v' = 2x)",
      "f'(x) = 1·(x² + " + bb + ") + (x + " + a + ")·(2x)",
      "Em x = " + x0 + ": " + (x0 * x0 + bb) + " + " + (x0 + a) * (2 * x0) + " = " + b(val)]);
  });
  D("quotRule", 2, function (r) {
    const a = r.int(1, 5), x0 = r.int(1, 4);
    // f(x) = x/(x + a) → f'(x) = a/(x + a)²
    const q = rat(a, (x0 + a) * (x0 + a));
    return Q.frac("Derive f(x) = x/(x + " + a + ") pela regra do quociente (u/v)' = (u'v − uv')/v² e calcule f'(" + x0 + ").", q.n, q.d, "", [
      "u = x (u' = 1), v = x + " + a + " (v' = 1)",
      "f'(x) = [1·(x + " + a + ") − x·1]/(x + " + a + ")² = " + a + "/(x + " + a + ")²",
      "Em x = " + x0 + ": " + b(ratStr(q))]);
  });
  D("chainRule", 2, function (r) {
    const a = r.int(2, 4), bb = r.int(1, 5), n = r.pick([2, 3]), x0 = r.int(0, 2);
    const u = a * x0 + bb, val = n * Math.pow(u, n - 1) * a;
    return Q.num("Pela regra da cadeia, derive f(x) = (" + a + "x + " + bb + ")" + sup(n) + " e calcule f'(" + x0 + ").", val, "", [
      "Derivada da externa × derivada da interna: f'(x) = " + n + "(" + a + "x + " + bb + ")" + sup(n - 1) + " · <b>" + a + "</b>",
      "Em x = " + x0 + ": " + n + "·" + u + sup(n - 1) + "·" + a + " = " + b(val)]);
  });
  D("kinDeriv", 1, function (r) {
    const a = r.int(1, 3), bb = r.int(-4, 4), c = r.int(0, 8), t0 = r.int(1, 4);
    const v = 3 * a * t0 * t0 + 2 * bb * t0 + c, acc = 6 * a * t0 + 2 * bb;
    return Q.list("A posição de uma partícula é s(t) = " + a + "t³ " + sgn(bb) + " " + Math.abs(bb) + "t² " + sgn(c) + " " + Math.abs(c) + "t (m, s). Calcule a velocidade v(" + t0 + ") e a aceleração a(" + t0 + "). Informe v ; a.", [v, acc], "v (m/s) ; a (m/s²)", "", [
      "v(t) = ds/dt = " + 3 * a + "t² " + sgn(2 * bb) + " " + Math.abs(2 * bb) + "t + " + c + " → v(" + t0 + ") = " + b(v + " m/s"),
      "a(t) = dv/dt = " + 6 * a + "t " + sgn(2 * bb) + " " + Math.abs(2 * bb) + " → a(" + t0 + ") = " + b(acc + " m/s²")], { ordered: true });
  });
  D("capCurrent", 3, function (r) {
    const C = r.pick([2, 5, 10]), Vp = r.pick([10, 20, 100]), w = r.pick([100, 200, 500]);
    // C em mF, v(t) = Vp sen(wt) → i(0) = C Vp w (C em F)
    const Ip = (C * 1e-3) * Vp * w;
    return Q.num("Em um capacitor de C = " + C + " mF submetido a v(t) = " + Vp + "·sen(" + w + "t) V, a corrente é i(t) = C·dv/dt. Qual o valor de i(0)?", Ip, "A", [
      "Pela regra da cadeia: dv/dt = " + Vp + "·" + w + "·cos(" + w + "t)",
      "Em t = 0, cos(0) = 1 → i(0) = C·Vp·ω",
      "Com C = " + C + "×10⁻³ F: i(0) = " + C * 1e-3 + " × " + Vp + " × " + w + " = " + b(fmt(Ip) + " A")]);
  });
  D("indVolt", 3, function (r) {
    const L = r.pick([2, 4, 5]), a = r.int(2, 5), bb = r.int(1, 6), t0 = r.int(1, 3);
    const didt = 2 * a * t0 + bb, vL = L * didt;
    return Q.num("Em um indutor de L = " + L + " H, a corrente varia como i(t) = " + a + "t² + " + bb + "t (A). Calcule a tensão induzida v_L = L·di/dt em t = " + t0 + " s.", vL, "V", [
      "di/dt = " + 2 * a + "t + " + bb + " → em t = " + t0 + ": di/dt = " + didt + " A/s",
      "v_L = L · di/dt = " + L + " × " + didt + " = " + b(vL + " V")]);
  });

  /* ================== MAPEAMENTO DAS 56 SESSÕES (5 QUESTÕES) ============== */
  const B = CE.setBank;
  // Semana 1
  B(1,  ["ops1", "signs1", "ops2", "signDistrib", "voltDiv"]);
  B(2,  ["lcm", "gcd", "fracAddLcm", "periodAlign", "parallel2"]);
  B(3,  ["fracSimp", "fracAdd", "fracMul", "fracComplex", "voltDiv"]);
  B(4,  ["fracSimp", "fracAdd3", "parallel2", "parallel3", "reqSP"]);
  // Semana 2
  B(5,  ["powRules", "powNeg", "powOfPow", "powTen", "ohmPrefix"]);
  B(6,  ["sqrtPerfect", "sqrtSimplify", "fracExp", "sqrtOps", "resonance"]);
  B(7,  ["sciConv", "prefixConv", "powTen", "sciDiv", "tauRC"]);
  B(8,  ["rationalize1", "ohm1", "rationalConj", "coulomb", "ohmPower"]);
  // Semana 3
  B(9,  ["bin2dec", "dec2bin", "nbits", "binAdd", "adcRes"]);
  B(10, ["hex2dec", "bin2hex", "dec2hex", "twosComp", "memAddr"]);
  B(11, ["truthOut", "gateEval", "countOnes", "gateEval", "alarmMulti"]);
  B(12, ["demorgan", "gateEval", "simplify", "countOnes", "nandCount"]);
  // Semana 4
  B(13, ["expandSq", "diffSq", "expandNum", "cubeExpand", "diffQuot"]);
  B(14, ["commonFactor", "evalFactored", "grouping", "expandNum", "powerSeries"]);
  B(15, ["quadRoots", "diffSquaresRoots", "quadRoots2", "perfSquareRoot", "poles"]);
  B(16, ["domainExcl", "simpAlg1", "limFactor", "algFracAdd", "limCancel"]);
  // Semana 5
  B(17, ["lin1", "lin2", "linFrac", "solveFormula", "dividerDesign"]);
  B(18, ["ineqCount", "abs1", "absIneqCount", "ineqNeg", "tolerance"]);
  B(19, ["sys2a", "lin2", "sys2c", "sys2c", "sys2cur"]);
  B(20, ["lkc", "sys3a", "lkt", "sys3b", "meshSolve"]);
  // Semana 6
  B(21, ["linFn", "linRoot", "lineTwoPoints", "mru", "ohmLine"]);
  B(22, ["vertexX", "quadRoots", "vertexY", "quadDelta", "projectile"]);
  B(23, ["signAffRoot", "quadIneqCount", "quotIneqCount", "absIneqCount", "gainRegion"]);
  B(24, ["maxPowerI", "vertexY", "maxPowerP", "powerAtRL", "pmaxDesign"]);
  // Semana 7
  B(25, ["expEq1", "powOfPow", "halfLife", "expEqQuad", "expGrowth"]);
  B(26, ["logBasic", "logCombo", "logChange", "expEq1", "bitsCount"]);
  B(27, ["lnExp", "dbPower", "dbVolt", "logCombo", "dbCascade"]);
  B(28, ["rcDischarge", "tauRC", "rcCharge", "halfLife", "rcTimeTo"]);
  // Semana 8
  B(29, ["pythHyp", "pythLeg", "similarTri", "vrms", "cableGuy"]);
  B(30, ["sohcahtoa", "notableTrig", "trigId", "rampHeight", "cableGuy"]);
  B(31, ["sohcahtoa", "trigId", "rampHeight", "decompForce", "powerTriangle"]);
  B(32, ["decompForce", "notableTrig", "incline", "rampHeight", "powerTriangle"]);
  // Semana 9
  B(33, ["degToRad", "radToDeg", "unitCircle", "arcLen", "omegaRpm"]);
  B(34, ["sinParams", "sinEval", "rmsPeak", "omegaRpm", "phaseLead"]);
  B(35, ["doubleAngle", "trigId", "cosSum", "unitCircle", "instPowerAvg"]);
  B(36, ["pythHyp", "lawCosines", "decompForce", "phasorSum", "powerTriangle"]);
  // Semana 10
  B(37, ["dist2d", "midpoint", "lineTwoPoints", "lineYintercept", "ohmLine"]);
  B(38, ["lineYintercept", "perpSlope", "sys2c", "lineTwoPoints", "distPointLine"]);
  B(39, ["circleFromEq", "dist2d", "completeSquareCircle", "conicFoci", "distPointLine"]);
  B(40, ["degToRad", "polarToRect", "unitCircle", "rectToPolar", "phasorSum"]);
  // Semana 11
  B(41, ["vec2Op", "dist2d", "unitVec2", "decompForce", "phasorSum"]);
  B(42, ["vec3Norm", "vec2Op", "vecAB3", "unitVec2", "cableGuy"]);
  B(43, ["dot3", "vec3Norm", "orthoK", "vecAB3", "workDot"]);
  B(44, ["dot3", "orthoK", "cross3", "workDot", "lorentzCross"]);
  // Semana 12
  B(45, ["domainExcl", "domainSqrt", "absIneqCount", "quotIneqCount", "tolerance"]);
  B(46, ["compFn", "linFn", "invFn", "rcTimeTo", "sensorScale"]);
  B(47, ["quadRoots", "polyDivRem", "grouping", "briotRoot", "poles"]);
  B(48, ["simpAlg1", "algFracAdd", "partialFrac", "limFactor", "limCancel"]);
  // Semana 13
  B(49, ["limPoly", "simpAlg1", "limFactor", "diffQuot", "limCancel"]);
  B(50, ["limPoly", "limFactor", "limConj", "algFracAdd", "limCancel"]);
  B(51, ["limInf", "sciConv", "rcDischarge", "rcCharge", "rcSteady"]);
  B(52, ["limPoly", "limTrig", "contPiece", "limConj", "rcSteady"]);
  // Semana 14
  B(53, ["derivDef", "lineTwoPoints", "diffQuot", "tangentLine", "mru"]);
  B(54, ["derivPoly", "derivDef", "prodRule", "quotRule", "tangentLine"]);
  B(55, ["derivPoly", "chainRule", "prodRule", "quotRule", "capCurrent"]);
  B(56, ["kinDeriv", "derivPoly", "chainRule", "capCurrent", "indVolt"]);
})(window);


