/* ==========================================================================
   NeuroEng // Prep OS — Diagramas Visuais SVG para Conceitos Abstratos
   - Funções puras que geram SVGs vetoriais leves, sem dependências externas
   - Paleta estritamente neutra (#09090B, #121215, #27272A, #A1A1AA, #F4F4F5, #10B981)
   - Aplicado APENAS onde há relação espacial, geométrica, funcional ou de circuito
   ========================================================================== */
(function (global) {
  "use strict";
  const NE = (global.NE = global.NE || {});
  const U = NE.U;
  const esc = U.esc;

  const BG = "#09090B";
  const GRID = "#27272A";
  const AXIS = "#52525B";
  const MUTED = "#A1A1AA";
  const FG = "#F4F4F5";
  const HI = "#FFFFFF";
  const OK = "#10B981";
  const MONO = "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

  function wrapSvg(w, h, aria, inner) {
    return '<svg class="vd-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(aria) + '" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="0.5" y="0.5" width="' + (w - 1) + '" height="' + (h - 1) + '" rx="8" fill="' + BG + '" stroke="' + GRID + '"/>' +
      inner + '</svg>';
  }

  function txt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.fill || FG) + '" font-family="' + MONO + '" font-size="' + (o.size || 11) + '" font-weight="' + (o.w || 500) + '" text-anchor="' + (o.anchor || "start") + '">' + esc(s) + '</text>';
  }

  function resBox(x, y, w, h, label, sub) {
    let out = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="#18181B" stroke="' + FG + '" stroke-width="1.5"/>';
    out += txt(x + w / 2, y + h / 2 + 4, label, { anchor: "middle", size: 11, fill: HI, w: 600 });
    if (sub) out += txt(x + w / 2, y - 6, sub, { anchor: "middle", size: 10, fill: MUTED });
    return out;
  }

  /* ==========================================================================
     1. CIRCUITOS RESISTIVOS (SÉRIE VS. PARALELO / ESQUEMAS PARAMÉTRICOS)
     ========================================================================== */
  function svgSeriesVsParallel() {
    let g = "";
    // Painel esquerdo: Série
    g += txt(130, 24, "SÉRIE (1 único caminho)", { anchor: "middle", size: 11, fill: HI, w: 600 });
    g += '<line x1="26" y1="90" x2="58" y2="90" stroke="' + FG + '" stroke-width="1.5"/>';
    g += resBox(58, 76, 56, 28, "R₁");
    g += '<line x1="114" y1="90" x2="146" y2="90" stroke="' + FG + '" stroke-width="1.5"/>';
    g += resBox(146, 76, 56, 28, "R₂");
    g += '<line x1="202" y1="90" x2="234" y2="90" stroke="' + FG + '" stroke-width="1.5"/>';
    // Seta de corrente I
    g += '<line x1="40" y1="54" x2="220" y2="54" stroke="' + OK + '" stroke-width="1.4" stroke-dasharray="4 3"/>';
    g += '<polygon points="220,54 212,50 212,58" fill="' + OK + '"/>';
    g += txt(130, 46, "mesma corrente I", { anchor: "middle", size: 10, fill: OK });
    g += txt(130, 134, "V_total = V₁ + V₂", { anchor: "middle", size: 10.5, fill: MUTED });
    g += txt(130, 154, "Req = R₁ + R₂", { anchor: "middle", size: 11.5, fill: HI, w: 600 });

    // Divisória
    g += '<line x1="260" y1="18" x2="260" y2="176" stroke="' + GRID + '" stroke-width="1" stroke-dasharray="4 4"/>';

    // Painel direito: Paralelo
    g += txt(390, 24, "PARALELO (ramos dividem I)", { anchor: "middle", size: 11, fill: HI, w: 600 });
    g += '<line x1="286" y1="90" x2="324" y2="90" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<circle cx="324" cy="90" r="3" fill="' + HI + '"/>';
    g += '<polyline points="324,90 324,58 358,58" fill="none" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<polyline points="324,90 324,122 358,122" fill="none" stroke="' + FG + '" stroke-width="1.5"/>';
    g += resBox(358, 44, 64, 28, "R₁");
    g += resBox(358, 108, 64, 28, "R₂");
    g += '<polyline points="422,58 456,58 456,90" fill="none" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<polyline points="422,122 456,122 456,90" fill="none" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<circle cx="456" cy="90" r="3" fill="' + HI + '"/>';
    g += '<line x1="456" y1="90" x2="494" y2="90" stroke="' + FG + '" stroke-width="1.5"/>';
    g += txt(303, 82, "I", { anchor: "middle", size: 10.5, fill: OK });
    g += txt(341, 52, "I₁", { anchor: "middle", size: 10, fill: OK });
    g += txt(341, 136, "I₂", { anchor: "middle", size: 10, fill: OK });
    g += txt(390, 158, "mesma tensão V  |  1/Req = 1/R₁ + 1/R₂", { anchor: "middle", size: 10.5, fill: HI });

    return {
      title: "Topologia Elétrica: Série vs. Paralelo",
      svg: wrapSvg(520, 186, "Comparação entre associação de resistores em série e em paralelo", g),
      caption: "Em série, a mesma corrente I passa por todos os resistores (resistências somam). Em paralelo, os nós compartilham a mesma tensão V e a corrente se divide em caminhos extras (Req fica sempre menor que o menor resistor)."
    };
  }

  function svgParallelParam(R1, R2, R3) {
    let g = "";
    const three = R3 != null;
    const ys = three ? [44, 96, 148] : [58, 128];
    const rs = three ? [R1, R2, R3] : [R1, R2];
    const midY = three ? 96 : 93;
    g += txt(260, 22, three ? "ASSOCIAÇÃO PARALELA (3 RAMOS)" : "ASSOCIAÇÃO PARALELA (2 RAMOS)", { anchor: "middle", size: 11, fill: MUTED });
    g += '<line x1="62" y1="' + midY + '" x2="140" y2="' + midY + '" stroke="' + FG + '" stroke-width="1.6"/>';
    g += '<circle cx="140" cy="' + midY + '" r="3.5" fill="' + HI + '"/>';
    g += '<circle cx="380" cy="' + midY + '" r="3.5" fill="' + HI + '"/>';
    g += '<line x1="380" y1="' + midY + '" x2="458" y2="' + midY + '" stroke="' + FG + '" stroke-width="1.6"/>';
    g += '<line x1="140" y1="' + ys[0] + '" x2="140" y2="' + ys[ys.length - 1] + '" stroke="' + FG + '" stroke-width="1.6"/>';
    g += '<line x1="380" y1="' + ys[0] + '" x2="380" y2="' + ys[ys.length - 1] + '" stroke="' + FG + '" stroke-width="1.6"/>';
    ys.forEach(function (y, i) {
      g += '<line x1="140" y1="' + y + '" x2="210" y2="' + y + '" stroke="' + FG + '" stroke-width="1.5"/>';
      g += resBox(210, y - 14, 100, 28, "R" + (i + 1) + " = " + rs[i] + " Ω");
      g += '<line x1="310" y1="' + y + '" x2="380" y2="' + y + '" stroke="' + FG + '" stroke-width="1.5"/>';
    });
    g += txt(96, midY - 8, "I_total →", { anchor: "middle", size: 10, fill: OK });
    g += txt(422, midY - 8, "Req = ?", { anchor: "middle", size: 11, fill: HI, w: 600 });
    return {
      title: "Esquema do Circuito em Paralelo",
      svg: wrapSvg(520, three ? 186 : 176, "Esquema de resistores em paralelo", g),
      caption: three
        ? "Com 3 ramos em paralelo, some as condutâncias 1/R₁ + 1/R₂ + 1/R₃ via MMC e inverta no final. Req será obrigatoriamente menor que " + Math.min(R1, R2, R3) + " Ω."
        : "Os 2 ramos compartilham a mesma tensão. Req será obrigatoriamente menor que " + Math.min(R1, R2) + " Ω (você pode usar 1/Req ou o atalho R₁·R₂/(R₁+R₂))."
    };
  }

  function svgReqSP(R1, R2, R3) {
    let g = "";
    g += txt(260, 22, "ASSOCIAÇÃO MISTA: R₁ EM SÉRIE COM (R₂ ‖ R₃)", { anchor: "middle", size: 11, fill: MUTED });
    g += '<line x1="32" y1="96" x2="72" y2="96" stroke="' + FG + '" stroke-width="1.6"/>';
    g += resBox(72, 82, 92, 28, "R₁ = " + R1 + " Ω");
    g += '<line x1="164" y1="96" x2="224" y2="96" stroke="' + FG + '" stroke-width="1.6"/>';
    g += '<circle cx="224" cy="96" r="3.5" fill="' + HI + '"/>';
    g += '<line x1="224" y1="62" x2="224" y2="130" stroke="' + FG + '" stroke-width="1.6"/>';
    g += '<line x1="224" y1="62" x2="274" y2="62" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<line x1="224" y1="130" x2="274" y2="130" stroke="' + FG + '" stroke-width="1.5"/>';
    g += resBox(274, 48, 96, 28, "R₂ = " + R2 + " Ω");
    g += resBox(274, 116, 96, 28, "R₃ = " + R3 + " Ω");
    g += '<line x1="370" y1="62" x2="420" y2="62" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<line x1="370" y1="130" x2="420" y2="130" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<line x1="420" y1="62" x2="420" y2="130" stroke="' + FG + '" stroke-width="1.6"/>';
    g += '<circle cx="420" cy="96" r="3.5" fill="' + HI + '"/>';
    g += '<line x1="420" y1="96" x2="484" y2="96" stroke="' + FG + '" stroke-width="1.6"/>';
    // Caixa pontilhada indicando o bloco a resolver primeiro
    g += '<rect x="210" y="38" width="224" height="118" rx="6" fill="none" stroke="' + OK + '" stroke-width="1.2" stroke-dasharray="5 4"/>';
    g += txt(322, 170, "1º reduza o paralelo (R₂ ‖ R₃) → 2º some com R₁", { anchor: "middle", size: 10, fill: OK });
    return {
      title: "Esquema Misto Série + Paralelo",
      svg: wrapSvg(520, 184, "Resistor em série com dois resistores em paralelo", g),
      caption: "Resolva sempre de dentro para fora: reduza primeiro o bloco paralelo R₂ ‖ R₃ a um único resistor equivalente e só depois some em série com R₁."
    };
  }

  function svgVoltageDivider(Vin, R1, R2, askR2) {
    let g = "";
    g += txt(260, 22, "DIVISOR DE TENSÃO RESISTIVO", { anchor: "middle", size: 11, fill: MUTED });
    // Fonte à esquerda
    g += '<circle cx="110" cy="100" r="24" fill="#18181B" stroke="' + FG + '" stroke-width="1.5"/>';
    g += txt(110, 94, "+", { anchor: "middle", size: 12, fill: HI });
    g += txt(110, 114, "−", { anchor: "middle", size: 12, fill: MUTED });
    g += txt(62, 104, Vin + " V", { anchor: "middle", size: 11.5, fill: HI, w: 600 });
    // Fio superior e inferior
    g += '<polyline points="110,76 110,44 260,44 260,54" fill="none" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<polyline points="110,124 110,162 260,162 260,148" fill="none" stroke="' + FG + '" stroke-width="1.5"/>';
    // R1 vertical superior e R2 vertical inferior
    g += resBox(222, 54, 76, 32, "R₁=" + R1 + "k");
    g += '<line x1="260" y1="86" x2="260" y2="116" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<circle cx="260" cy="101" r="3.5" fill="' + OK + '"/>';
    g += resBox(222, 116, 76, 32, askR2 ? "R₂ = ?" : "R₂=" + R2 + "k");
    // Saída Vout
    g += '<line x1="260" y1="101" x2="364" y2="101" stroke="' + OK + '" stroke-width="1.5"/>';
    g += '<circle cx="364" cy="101" r="3" fill="' + OK + '"/>';
    g += '<line x1="260" y1="162" x2="364" y2="162" stroke="' + MUTED + '" stroke-width="1.2" stroke-dasharray="4 3"/>';
    g += '<circle cx="364" cy="162" r="3" fill="' + MUTED + '"/>';
    g += txt(422, 134, askR2 ? "Vout = " + R2 + " V" : "Vout = V₂ = ?", { anchor: "middle", size: 11, fill: OK, w: 600 });
    g += txt(422, 152, "V₂ = Vin·R₂/(R₁+R₂)", { anchor: "middle", size: 10, fill: MUTED });
    return {
      title: "Esquema do Divisor de Tensão",
      svg: wrapSvg(520, 182, "Circuito divisor de tensão com R1 e R2 em série", g),
      caption: "A mesma corrente percorre R₁ e R₂. A tensão de saída Vout é tomada sobre o resistor inferior R₂ e corresponde à fração R₂/(R₁ + R₂) da tensão da fonte."
    };
  }

  /* ==========================================================================
     2. ESCALA LOGARÍTMICA DE PREFIXOS SI & LEI DE COULOMB
     ========================================================================== */
  function svgSiScale() {
    const items = [["p", "−12"], ["n", "−9"], ["μ", "−6"], ["m", "−3"], ["base", "0"], ["k", "+3"], ["M", "+6"], ["G", "+9"]];
    let g = txt(260, 22, "RÉGUA DE PREFIXOS SI (DEGRAUS DE 10³ EM 10³)", { anchor: "middle", size: 11, fill: MUTED });
    g += '<line x1="34" y1="88" x2="486" y2="88" stroke="' + AXIS + '" stroke-width="2"/>';
    items.forEach(function (it, i) {
      const x = 48 + i * 60;
      const isBase = it[1] === "0";
      g += '<circle cx="' + x + '" cy="88" r="' + (isBase ? 5.5 : 4) + '" fill="' + (isBase ? HI : "#18181B") + '" stroke="' + (isBase ? HI : FG) + '" stroke-width="1.5"/>';
      g += txt(x, 72, it[0], { anchor: "middle", size: isBase ? 11 : 13, fill: isBase ? HI : FG, w: 600 });
      g += txt(x, 112, "10" + it[1], { anchor: "middle", size: 10.5, fill: MUTED });
    });
    // Arcos de cancelamento
    g += '<path d="M 228 52 Q 288 26 348 52" fill="none" stroke="' + OK + '" stroke-width="1.3" stroke-dasharray="4 3"/>';
    g += txt(288, 36, "mA × kΩ = 10⁰ = V", { anchor: "middle", size: 10, fill: OK });
    g += '<path d="M 108 124 Q 228 158 348 124" fill="none" stroke="' + MUTED + '" stroke-width="1.2" stroke-dasharray="4 3"/>';
    g += txt(228, 156, "nF (10⁻⁹) × kΩ (10³) = μs (10⁻⁶)", { anchor: "middle", size: 10, fill: FG });
    return {
      title: "Escala de Potências de 10 e Prefixos de Engenharia",
      svg: wrapSvg(520, 174, "Régua de prefixos do Sistema Internacional de pico a giga", g),
      caption: "Cada salto de prefixo na engenharia muda o expoente em 3 unidades (fator 1000). Prefixos simétricos em torno da base (como m e k) se cancelam no produto."
    };
  }

  function svgCoulomb(q1, q2, rCm) {
    let g = txt(260, 22, "LEI DE COULOMB: FORÇA CAI COM O QUADRADO DA DISTÂNCIA (1/r²)", { anchor: "middle", size: 10.5, fill: MUTED });
    // Esquerda: duas cargas
    g += '<circle cx="62" cy="92" r="18" fill="#18181B" stroke="' + FG + '" stroke-width="1.6"/>';
    g += txt(62, 96, q1 ? q1 + "μC" : "+q₁", { anchor: "middle", size: 10.5, fill: HI });
    g += '<circle cx="196" cy="92" r="18" fill="#18181B" stroke="' + FG + '" stroke-width="1.6"/>';
    g += txt(196, 96, q2 ? q2 + "μC" : "+q₂", { anchor: "middle", size: 10.5, fill: HI });
    g += '<line x1="82" y1="92" x2="176" y2="92" stroke="' + OK + '" stroke-width="1.4" stroke-dasharray="4 3"/>';
    g += txt(129, 84, rCm ? "r = " + rCm + " cm" : "distância r", { anchor: "middle", size: 10.5, fill: OK });
    g += txt(129, 134, "F = k·|q₁·q₂| / r²", { anchor: "middle", size: 11, fill: HI, w: 600 });
    g += txt(129, 152, "Converta: cm → m, μC → 10⁻⁶ C", { anchor: "middle", size: 9.5, fill: MUTED });

    // Direita: gráfico 1/r²
    g += '<line x1="286" y1="148" x2="486" y2="148" stroke="' + AXIS + '" stroke-width="1.4"/>';
    g += '<line x1="286" y1="148" x2="286" y2="42" stroke="' + AXIS + '" stroke-width="1.4"/>';
    g += txt(486, 162, "r", { anchor: "end", size: 10.5, fill: MUTED });
    g += txt(280, 48, "F", { anchor: "end", size: 10.5, fill: MUTED });
    // Curva F = 1/r²
    let pts = [];
    for (let i = 0; i <= 30; i++) {
      const rr = 0.85 + (i / 30) * 2.4;
      const x = 286 + (rr - 0.5) * 68;
      const y = 148 - (72 / (rr * rr));
      pts.push(x.toFixed(1) + "," + Math.max(46, y).toFixed(1));
    }
    g += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + FG + '" stroke-width="1.8"/>';
    g += '<circle cx="320" cy="76" r="3.5" fill="' + HI + '"/>';
    g += txt(328, 74, "(r, F)", { size: 10, fill: HI });
    g += '<circle cx="388" cy="130" r="3.5" fill="' + OK + '"/>';
    g += txt(396, 126, "(2r, F/4)", { size: 10, fill: OK });
    return {
      title: "Interação Eletrostática e Decaimento 1/r²",
      svg: wrapSvg(520, 174, "Duas cargas pontuais e gráfico de força inversamente proporcional ao quadrado da distância", g),
      caption: "Como a distância r está ao quadrado no denominador, dobrar r reduz a força elétrica a 1/4 do valor original (e reduzir r pela metade multiplica a força por 4)."
    };
  }

  /* ==========================================================================
     3. BINÁRIO / NIBBLES HEXA & PORTAS LÓGICAS
     ========================================================================== */
  function svgBinaryNibble() {
    let g = txt(260, 22, "AGRUPAMENTO NIBBLE (4 BITS = 1 DÍGITO HEXADECIMAL)", { anchor: "middle", size: 10.5, fill: MUTED });
    const weights = [128, 64, 32, 16, 8, 4, 2, 1];
    const bits = [1, 0, 1, 0, 0, 1, 0, 1];
    const nib = [8, 4, 2, 1, 8, 4, 2, 1];
    for (let i = 0; i < 8; i++) {
      const gap = i >= 4 ? 22 : 0;
      const x = 44 + i * 52 + gap;
      g += txt(x + 22, 46, String(weights[i]), { anchor: "middle", size: 9.5, fill: MUTED });
      g += '<rect x="' + x + '" y="54" width="44" height="36" rx="4" fill="' + (bits[i] ? "#18181B" : BG) + '" stroke="' + (bits[i] ? HI : GRID) + '" stroke-width="1.4"/>';
      g += txt(x + 22, 77, String(bits[i]), { anchor: "middle", size: 15, fill: bits[i] ? HI : AXIS, w: 600 });
      g += txt(x + 22, 106, "×" + nib[i], { anchor: "middle", size: 9.5, fill: OK });
    }
    g += '<path d="M 46 116 L 46 126 L 244 126 L 244 116" fill="none" stroke="' + OK + '" stroke-width="1.2"/>';
    g += txt(145, 144, "8 + 2 = 10 → 0xA", { anchor: "middle", size: 11.5, fill: HI, w: 600 });
    g += '<path d="M 276 116 L 276 126 L 474 126 L 474 116" fill="none" stroke="' + OK + '" stroke-width="1.2"/>';
    g += txt(375, 144, "4 + 1 = 5 → 0x5", { anchor: "middle", size: 11.5, fill: HI, w: 600 });
    g += txt(260, 168, "Exemplo: 1010 0101₂ = 0xA5 = 165₁₀", { anchor: "middle", size: 10.5, fill: MUTED });
    return {
      title: "Mapeamento Posicional de 8 Bits e Conversão Direta para Hexadecimal",
      svg: wrapSvg(520, 182, "Tabela visual de 8 bits divididos em dois nibbles de 4 bits para conversão hexadecimal", g),
      caption: "Cada grupo de 4 bits (nibble) usa os pesos 8-4-2-1 e gera exatamente um dígito hexadecimal (0 a F). Isso elimina a necessidade de converter para decimal no meio do caminho."
    };
  }

  function svgDeMorganGates() {
    let g = txt(260, 22, "EQUIVALÊNCIA DE DE MORGAN: PORTA NAND = OR COM ENTRADAS INVERTIDAS", { anchor: "middle", size: 10, fill: MUTED });
    // Esquerda: NAND
    g += txt(42, 68, "A", { size: 11, fill: FG }); g += '<line x1="56" y1="64" x2="100" y2="64" stroke="' + FG + '" stroke-width="1.5"/>';
    g += txt(42, 108, "B", { size: 11, fill: FG }); g += '<line x1="56" y1="104" x2="100" y2="104" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<path d="M 100 48 L 136 48 A 36 36 0 0 1 136 120 L 100 120 Z" fill="#18181B" stroke="' + FG + '" stroke-width="1.6"/>';
    g += '<circle cx="177" cy="84" r="5" fill="' + BG + '" stroke="' + OK + '" stroke-width="1.6"/>';
    g += '<line x1="182" y1="84" x2="218" y2="84" stroke="' + FG + '" stroke-width="1.5"/>';
    g += txt(136, 146, "¬(A · B)", { anchor: "middle", size: 12, fill: HI, w: 600 });

    // Sinal de equivalência
    g += txt(258, 90, "≡", { anchor: "middle", size: 22, fill: OK, w: 600 });

    // Direita: OR com bolinhas nas entradas
    g += txt(294, 68, "A", { size: 11, fill: FG }); g += '<line x1="308" y1="64" x2="342" y2="64" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<circle cx="347" cy="64" r="5" fill="' + BG + '" stroke="' + OK + '" stroke-width="1.6"/>';
    g += txt(294, 108, "B", { size: 11, fill: FG }); g += '<line x1="308" y1="104" x2="342" y2="104" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<circle cx="347" cy="104" r="5" fill="' + BG + '" stroke="' + OK + '" stroke-width="1.6"/>';
    g += '<path d="M 352 48 Q 370 84 352 120 L 386 120 Q 422 116 436 84 Q 422 52 386 48 Z" fill="#18181B" stroke="' + FG + '" stroke-width="1.6"/>';
    g += '<line x1="436" y1="84" x2="478" y2="84" stroke="' + FG + '" stroke-width="1.5"/>';
    g += txt(392, 146, "¬A + ¬B", { anchor: "middle", size: 12, fill: HI, w: 600 });
    return {
      title: "Visão de Hardware das Leis de De Morgan",
      svg: wrapSvg(520, 166, "Equivalência entre porta NAND e porta OR com entradas negadas", g),
      caption: "Empurrar a bolinha de negação (NOT) da saída para as entradas troca o corpo da porta (AND ↔ OR). É exatamente o significado físico de ¬(A·B) = ¬A + ¬B."
    };
  }

  /* ==========================================================================
     4. PROVA GEOMÉTRICA DE (x + a)²
     ========================================================================== */
  function svgAreaSquare() {
    let g = txt(260, 22, "POR QUE (x + a)² ≠ x² + a²?  (ÁREA DO QUADRADO DE LADO x + a)", { anchor: "middle", size: 10.5, fill: MUTED });
    // Quadrado principal (x=90, a=44)
    g += '<rect x="80" y="44" width="90" height="90" fill="#18181B" stroke="' + FG + '" stroke-width="1.5"/>';
    g += txt(125, 93, "x²", { anchor: "middle", size: 14, fill: HI, w: 600 });
    g += '<rect x="170" y="44" width="44" height="90" fill="#121215" stroke="' + OK + '" stroke-width="1.5"/>';
    g += txt(192, 93, "a·x", { anchor: "middle", size: 11, fill: OK, w: 600 });
    g += '<rect x="80" y="134" width="90" height="44" fill="#121215" stroke="' + OK + '" stroke-width="1.5"/>';
    g += txt(125, 160, "a·x", { anchor: "middle", size: 11, fill: OK, w: 600 });
    g += '<rect x="170" y="134" width="44" height="44" fill="#18181B" stroke="' + FG + '" stroke-width="1.5"/>';
    g += txt(192, 160, "a²", { anchor: "middle", size: 12, fill: HI, w: 600 });
    // Cotas
    g += txt(125, 38, "x", { anchor: "middle", size: 11, fill: MUTED });
    g += txt(192, 38, "a", { anchor: "middle", size: 11, fill: OK });
    g += txt(68, 93, "x", { anchor: "end", size: 11, fill: MUTED });
    g += txt(68, 160, "a", { anchor: "end", size: 11, fill: OK });
    // Explicação à direita
    g += txt(258, 76, "Área total = (x + a)²", { size: 12, fill: HI, w: 600 });
    g += txt(258, 104, "= x² + a² + 2·a·x", { size: 12.5, fill: OK, w: 600 });
    g += txt(258, 134, "Os dois retângulos verdes (a·x)", { size: 10.5, fill: MUTED });
    g += txt(258, 152, "são o termo 2ax que desaparece", { size: 10.5, fill: MUTED });
    g += txt(258, 170, "quando o cérebro distribui errado.", { size: 10.5, fill: MUTED });
    return {
      title: "Interpretação Geométrica do Quadrado da Soma",
      svg: wrapSvg(520, 194, "Quadrado de lado x+a dividido em quatro áreas x², ax, ax e a²", g),
      caption: "Visualizar as 4 áreas impede o erro clássico de esquecer o termo cruzado 2ax ao expandir (x + a)²."
    };
  }

  /* ==========================================================================
     5. KIRCHHOFF (LKC E MALHAS LKT)
     ========================================================================== */
  function svgKirchhoff(opts) {
    opts = opts || {};
    let g = "";
    if (opts.mode === "mesh") {
      const V1 = opts.V1 || "V₁", R1 = opts.R1 || "R₁", R2 = opts.R2 || "R₂", R3 = opts.R3 || "R₃";
      g += txt(260, 22, "CIRCUITO DE DUAS MALHAS ACOPLADAS (CORRENTES I₁ E I₂)", { anchor: "middle", size: 10.5, fill: MUTED });
      // Malha esquerda e direita
      g += '<rect x="92" y="48" width="168" height="114" fill="none" stroke="' + FG + '" stroke-width="1.5"/>';
      g += '<rect x="260" y="48" width="168" height="114" fill="none" stroke="' + FG + '" stroke-width="1.5"/>';
      // Fonte V1 na esquerda
      g += '<circle cx="92" cy="105" r="19" fill="#18181B" stroke="' + HI + '" stroke-width="1.5"/>';
      g += txt(92, 100, "+", { anchor: "middle", size: 11, fill: HI });
      g += txt(92, 116, "−", { anchor: "middle", size: 11, fill: MUTED });
      g += txt(54, 109, V1 + " V", { anchor: "middle", size: 11, fill: HI, w: 600 });
      // R1 no topo esq, R2 no topo dir, R3 no centro
      g += resBox(138, 36, 76, 24, "R₁=" + R1 + "Ω");
      g += resBox(306, 36, 76, 24, "R₂=" + R2 + "Ω");
      g += resBox(224, 92, 72, 26, "R₃=" + R3 + "Ω");
      // Laços horários I1 e I2
      g += '<path d="M 152 128 A 24 24 0 1 1 186 128" fill="none" stroke="' + OK + '" stroke-width="1.4"/>';
      g += '<polygon points="188,125 180,127 185,134" fill="' + OK + '"/>';
      g += txt(168, 114, "I₁", { anchor: "middle", size: 12, fill: OK, w: 600 });
      g += '<path d="M 332 128 A 24 24 0 1 1 366 128" fill="none" stroke="' + OK + '" stroke-width="1.4"/>';
      g += '<polygon points="368,125 360,127 365,134" fill="' + OK + '"/>';
      g += txt(348, 114, "I₂", { anchor: "middle", size: 12, fill: OK, w: 600 });
      return {
        title: "Diagrama das Duas Malhas (LKT)",
        svg: wrapSvg(520, 180, "Circuito com duas malhas compartilhando o resistor R3", g),
        caption: "No ramo central (R₃), as correntes de malha I₁ e I₂ passam em sentidos opostos — por isso a equação de cada malha tem +(R próprios) e −R₃ da malha vizinha."
      };
    }
    // Modo geral: Nó LKC + Malha LKT
    g += txt(130, 24, "LKC (NÓ: Σ entram = Σ saem)", { anchor: "middle", size: 10.5, fill: HI, w: 600 });
    g += '<circle cx="130" cy="98" r="6" fill="' + HI + '"/>';
    g += '<line x1="48" y1="68" x2="122" y2="94" stroke="' + OK + '" stroke-width="1.6"/>';
    g += '<line x1="48" y1="128" x2="122" y2="102" stroke="' + OK + '" stroke-width="1.6"/>';
    g += '<line x1="138" y1="94" x2="212" y2="68" stroke="' + FG + '" stroke-width="1.6"/>';
    g += '<line x1="138" y1="102" x2="212" y2="128" stroke="' + FG + '" stroke-width="1.6"/>';
    g += txt(62, 64, opts.i1 ? opts.i1 + " A →" : "I₁ →", { size: 10.5, fill: OK });
    g += txt(62, 144, opts.i2 ? opts.i2 + " A →" : "I₂ →", { size: 10.5, fill: OK });
    g += txt(176, 64, opts.i3 ? "→ " + opts.i3 + " A" : "→ I₃", { size: 10.5, fill: FG });
    g += txt(176, 144, opts.i3 ? "→ I₄ = ?" : "→ I₄", { size: 10.5, fill: HI, w: 600 });
    g += '<line x1="260" y1="18" x2="260" y2="168" stroke="' + GRID + '" stroke-dasharray="4 4"/>';
    g += txt(390, 24, "LKT (MALHA: ΣV = 0)", { anchor: "middle", size: 10.5, fill: HI, w: 600 });
    g += '<rect x="308" y="48" width="164" height="98" fill="none" stroke="' + FG + '" stroke-width="1.5"/>';
    g += '<circle cx="308" cy="97" r="15" fill="#18181B" stroke="' + HI + '" stroke-width="1.5"/>';
    g += txt(308, 101, "Vs", { anchor: "middle", size: 10, fill: HI });
    g += resBox(362, 36, 56, 22, "V₁");
    g += resBox(444, 84, 56, 24, "V₂");
    g += resBox(362, 134, 56, 22, "V₃");
    g += txt(390, 100, "Vs = V₁+V₂+V₃", { anchor: "middle", size: 10, fill: OK });
    return {
      title: "Leis de Kirchhoff: Conservação de Carga (LKC) e de Energia (LKT)",
      svg: wrapSvg(520, 178, "Diagrama de nó LKC e malha fechada LKT", g),
      caption: "A carga não se acumula em um nó (tudo o que entra precisa sair), e a energia numa volta fechada fecha em zero (soma das elevações = soma das quedas)."
    };
  }

  /* ==========================================================================
     6. GRÁFICO DE FUNÇÃO AFIM (INCLINAÇÃO m = Δy/Δx)
     ========================================================================== */
  function svgLinearSlope(xLabel, yLabel, p1, p2) {
    let g = txt(260, 22, "COEFICIENTE ANGULAR m = Δy / Δx (TAXA DE VARIAÇÃO CONSTANTE)", { anchor: "middle", size: 10.5, fill: MUTED });
    g += '<line x1="64" y1="156" x2="466" y2="156" stroke="' + AXIS + '" stroke-width="1.4"/>';
    g += '<line x1="94" y1="170" x2="94" y2="38" stroke="' + AXIS + '" stroke-width="1.4"/>';
    g += txt(466, 170, xLabel || "x", { anchor: "end", size: 10.5, fill: MUTED });
    g += txt(86, 46, yLabel || "y", { anchor: "end", size: 10.5, fill: MUTED });
    // Reta
    g += '<line x1="112" y1="146" x2="424" y2="54" stroke="' + HI + '" stroke-width="2"/>';
    // Triângulo Δx, Δy
    g += '<polyline points="174,128 362,128 362,72" fill="none" stroke="' + OK + '" stroke-width="1.5" stroke-dasharray="5 3"/>';
    g += '<circle cx="174" cy="128" r="4" fill="' + HI + '"/>';
    g += '<circle cx="362" cy="72" r="4" fill="' + HI + '"/>';
    g += txt(168, 120, p1 || "(x₁, y₁)", { anchor: "end", size: 10.5, fill: FG });
    g += txt(372, 70, p2 || "(x₂, y₂)", { anchor: "start", size: 10.5, fill: FG });
    g += txt(268, 144, "Δx = x₂ − x₁", { anchor: "middle", size: 10.5, fill: OK });
    g += txt(372, 104, "Δy = y₂ − y₁", { anchor: "start", size: 10.5, fill: OK });
    return {
      title: "Interpretação Geométrica da Reta e da Inclinação",
      svg: wrapSvg(520, 182, "Gráfico de reta com triângulo de variação Δx e Δy", g),
      caption: "O coeficiente angular m é sempre a razão entre o degrau vertical (Δy) e o avanço horizontal (Δx). Em V × I de um resistor ôhmico, essa inclinação é exatamente a resistência R."
    };
  }

  /* ==========================================================================
     7. PARÁBOLA (VÉRTICE, RAÍZES, MA-CA-MA) & MÁXIMA POTÊNCIA
     ========================================================================== */
  function svgParabola(mode) {
    let g = "";
    if (mode === "pmax") {
      g += txt(260, 22, "CURVA DE POTÊNCIA NA CARGA P(RL): PICO EXATO EM RL = Rs", { anchor: "middle", size: 10.5, fill: MUTED });
      g += '<line x1="68" y1="154" x2="466" y2="154" stroke="' + AXIS + '" stroke-width="1.4"/>';
      g += '<line x1="68" y1="154" x2="68" y2="38" stroke="' + AXIS + '" stroke-width="1.4"/>';
      g += txt(466, 170, "RL (Ω)", { anchor: "end", size: 10.5, fill: MUTED });
      g += txt(62, 46, "P (W)", { anchor: "end", size: 10.5, fill: MUTED });
      let pts = [];
      for (let i = 0; i <= 50; i++) {
        const u = (i / 50) * 4.5; // u = RL/Rs
        const p = (4 * u) / Math.pow(1 + u, 2); // normalizado para pico = 1 em u = 1
        pts.push((68 + u * 84).toFixed(1) + "," + (154 - p * 98).toFixed(1));
      }
      g += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + HI + '" stroke-width="2"/>';
      const px = 68 + 84, py = 56;
      g += '<line x1="' + px + '" y1="' + py + '" x2="' + px + '" y2="154" stroke="' + OK + '" stroke-dasharray="4 3"/>';
      g += '<circle cx="' + px + '" cy="' + py + '" r="4.5" fill="' + OK + '"/>';
      g += txt(px + 10, py + 4, "P_máx = V²/(4Rs)", { size: 11, fill: OK, w: 600 });
      g += txt(px, 169, "RL = Rs", { anchor: "middle", size: 10.5, fill: OK, w: 600 });
      return {
        title: "Teorema da Máxima Transferência de Potência",
        svg: wrapSvg(520, 182, "Curva de potência em função da resistência de carga com máximo em RL igual a Rs", g),
        caption: "Se RL = 0 (curto), a tensão na carga é zero; se RL → ∞ (aberto), a corrente é zero. A potência útil na carga atinge o máximo exato quando RL = Rs."
      };
    }
    const down = mode === "down";
    g += txt(260, 22, down ? "PARÁBOLA COM a < 0 (PONTO DE MÁXIMO NO VÉRTICE)" : "PARÁBOLA COM a > 0 (VÉRTICE, RAÍZES E REGRA MA-CA-MA)", { anchor: "middle", size: 10.5, fill: MUTED });
    g += '<line x1="56" y1="108" x2="464" y2="108" stroke="' + AXIS + '" stroke-width="1.4"/>';
    g += '<line x1="260" y1="36" x2="260" y2="168" stroke="' + GRID + '" stroke-dasharray="4 4"/>';
    let pts = [];
    for (let i = -30; i <= 30; i++) {
      const t = i / 15; // -2..2
      const x = 260 + t * 82;
      const y = down ? (48 + t * t * 32) : (156 - t * t * 32);
      pts.push(x.toFixed(1) + "," + y.toFixed(1));
    }
    g += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + HI + '" stroke-width="2"/>';
    const vy = down ? 48 : 156;
    g += '<circle cx="260" cy="' + vy + '" r="4.5" fill="' + OK + '"/>';
    g += txt(270, down ? 46 : 168, "Vértice: xv = −b/(2a)", { size: 10.5, fill: OK, w: 600 });
    // Raízes aproximadas
    const rx = down ? Math.sqrt((108 - 48) / 32) * 82 : Math.sqrt((156 - 108) / 32) * 82;
    g += '<circle cx="' + (260 - rx).toFixed(1) + '" cy="108" r="3.5" fill="' + HI + '"/>';
    g += '<circle cx="' + (260 + rx).toFixed(1) + '" cy="108" r="3.5" fill="' + HI + '"/>';
    g += txt((260 - rx - 10).toFixed(1), 124, "x₁", { anchor: "end", size: 10.5, fill: FG });
    g += txt((260 + rx + 10).toFixed(1), 124, "x₂", { anchor: "start", size: 10.5, fill: FG });
    if (!down) {
      g += txt(260, 134, "CA (−)", { anchor: "middle", size: 10, fill: MUTED });
      g += txt(124, 96, "MA (+)", { anchor: "middle", size: 10, fill: MUTED });
      g += txt(396, 96, "MA (+)", { anchor: "middle", size: 10, fill: MUTED });
    }
    return {
      title: down ? "Trajetória Parabólica & Ponto de Máximo" : "Anatomia da Função Quadrática (Vértice e Sinais)",
      svg: wrapSvg(520, 182, "Gráfico de parábola mostrando raízes e vértice", g),
      caption: "O eixo de simetria passa exatamente no ponto médio das raízes (xv = −b/2a). Entre as raízes a parábola tem o sinal contrário de 'a' (CA) e fora delas o mesmo sinal de 'a' (MA)."
    };
  }

  /* ==========================================================================
     8. CURVA RC (CARGA E DESCARGA EXPONENCIAL 1τ..5τ)
     ========================================================================== */
  function svgRcCurve(mode, Vf, tau) {
    let g = "";
    const chg = mode !== "discharge";
    g += txt(260, 22, chg ? "CARGA DO CAPACITOR RC: v(t) = Vf·(1 − e^(−t/τ))" : "DESCARGA DO CAPACITOR RC: v(t) = V₀·e^(−t/τ)", { anchor: "middle", size: 10.5, fill: MUTED });
    g += '<line x1="68" y1="156" x2="472" y2="156" stroke="' + AXIS + '" stroke-width="1.4"/>';
    g += '<line x1="68" y1="156" x2="68" y2="38" stroke="' + AXIS + '" stroke-width="1.4"/>';
    g += '<line x1="68" y1="52" x2="466" y2="52" stroke="' + GRID + '" stroke-dasharray="5 4"/>';
    g += txt(62, 56, Vf ? Vf + "V" : (chg ? "Vf" : "V₀"), { anchor: "end", size: 10.5, fill: HI });
    g += txt(472, 171, tau ? "t (" + tau + " ms/τ)" : "t (em τ)", { anchor: "end", size: 10, fill: MUTED });

    let pts = [];
    for (let i = 0; i <= 50; i++) {
      const tt = (i / 50) * 5;
      const val = chg ? (1 - Math.exp(-tt)) : Math.exp(-tt);
      pts.push((68 + tt * 76).toFixed(1) + "," + (156 - val * 104).toFixed(1));
    }
    g += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + HI + '" stroke-width="2"/>';
    [1, 2, 3, 5].forEach(function (k) {
      const x = 68 + k * 76;
      const val = chg ? (1 - Math.exp(-k)) : Math.exp(-k);
      const y = 156 - val * 104;
      g += '<line x1="' + x + '" y1="' + y.toFixed(1) + '" x2="' + x + '" y2="156" stroke="' + GRID + '" stroke-dasharray="3 3"/>';
      g += '<circle cx="' + x + '" cy="' + y.toFixed(1) + '" r="3.5" fill="' + (k === 1 ? OK : FG) + '"/>';
      g += txt(x, 170, k + "τ", { anchor: "middle", size: 10, fill: k === 1 ? OK : MUTED });
      if (k === 1 || k === 3) {
        g += txt(x + 6, y - 6, Math.round(val * 1000) / 10 + "%", { size: 9.5, fill: k === 1 ? OK : MUTED });
      }
    });
    return {
      title: "Resposta Transitória Exponencial (Circuito RC)",
      svg: wrapSvg(520, 184, "Curva exponencial de carga ou descarga de capacitor em função da constante de tempo tau", g),
      caption: chg
        ? "Em t = 1τ o capacitor atinge 63,2% de Vf; em 3τ chega a 95%; em 5τ (99,3%) considera-se regime permanente (capacitor como circuito aberto)."
        : "A cada constante de tempo τ = R·C, a tensão restante cai para 36,8% (1/e) do valor anterior, aproximando-se assintoticamente de zero."
    };
  }

  function svgExpLogInverse() {
    let g = txt(260, 22, "FUNÇÕES INVERSAS: bˣ E log_b(x) SÃO ESPELHADAS NA RETA y = x", { anchor: "middle", size: 10.5, fill: MUTED });
    g += '<line x1="80" y1="126" x2="440" y2="126" stroke="' + AXIS + '" stroke-width="1.2"/>';
    g += '<line x1="220" y1="36" x2="220" y2="168" stroke="' + AXIS + '" stroke-width="1.2"/>';
    // Bissetriz y = x
    g += '<line x1="176" y1="168" x2="310" y2="36" stroke="' + GRID + '" stroke-dasharray="5 4"/>';
    g += txt(314, 46, "y = x", { size: 10, fill: MUTED });
    // y = e^x
    let p1 = [], p2 = [];
    for (let i = 0; i <= 35; i++) {
      const x = -2.2 + (i / 35) * 3.8;
      const y = Math.exp(x);
      if (y < 4.5) p1.push((220 + x * 34).toFixed(1) + "," + (126 - y * 20).toFixed(1));
      const lx = 0.15 + (i / 35) * 5.2;
      const ly = Math.log(lx);
      if (ly > -2.1) p2.push((220 + lx * 34).toFixed(1) + "," + (126 - ly * 20).toFixed(1));
    }
    g += '<polyline points="' + p1.join(" ") + '" fill="none" stroke="' + HI + '" stroke-width="2"/>';
    g += '<polyline points="' + p2.join(" ") + '" fill="none" stroke="' + OK + '" stroke-width="2"/>';
    g += '<circle cx="220" cy="106" r="3.5" fill="' + HI + '"/>';
    g += txt(166, 102, "(0, 1)", { size: 10, fill: HI });
    g += txt(248, 56, "y = eˣ", { size: 11, fill: HI, w: 600 });
    g += '<circle cx="254" cy="126" r="3.5" fill="' + OK + '"/>';
    g += txt(258, 142, "(1, 0)", { size: 10, fill: OK });
    g += txt(354, 100, "y = ln(x)", { size: 11, fill: OK, w: 600 });
    return {
      title: "Simetria entre Exponencial e Logaritmo",
      svg: wrapSvg(520, 180, "Gráficos de e elevado a x e ln de x simétricos em relação à reta y=x", g),
      caption: "A exponencial passa por (0, 1) e cresce sempre positiva; o logaritmo passa por (1, 0) e só existe para x > 0. Um desfaz exatamente a operação do outro."
    };
  }

  /* ==========================================================================
     9. TRIÂNGULO RETÂNGULO, PLANO INCLINADO & TRIÂNGULO DE POTÊNCIAS CA
     ========================================================================== */
  function svgRightTriangle(opts) {
    opts = opts || {};
    let g = "";
    if (opts.mode === "incline") {
      const ang = opts.ang || "θ", m = opts.m ? opts.m + " kg" : "m";
      g += txt(260, 22, "DECOMPOSIÇÃO DO PESO NO PLANO INCLINADO", { anchor: "middle", size: 10.5, fill: MUTED });
      // Rampa
      g += '<polygon points="84,158 430,158 430,52" fill="#121215" stroke="' + AXIS + '" stroke-width="1.5"/>';
      g += txt(150, 150, ang, { size: 11, fill: OK, w: 600 });
      // Bloco rotacionado sobre a hipotenusa
      g += '<g transform="translate(274,100) rotate(-17)">';
      g += '<rect x="-24" y="-24" width="48" height="24" rx="3" fill="#18181B" stroke="' + HI + '" stroke-width="1.5"/>';
      g += txt(0, -8, m, { anchor: "middle", size: 10, fill: HI });
      // Vetor Px (descendo) e Py (perpendicular)
      g += '<line x1="0" y1="-12" x2="-74" y2="-12" stroke="' + OK + '" stroke-width="1.8"/>';
      g += '<polygon points="-74,-12 -65,-16 -65,-8" fill="' + OK + '"/>';
      g += txt(-78, -18, "Px = P·sen " + ang, { anchor: "end", size: 10, fill: OK, w: 600 });
      g += '<line x1="0" y1="-12" x2="0" y2="54" stroke="' + FG + '" stroke-width="1.5" stroke-dasharray="4 3"/>';
      g += txt(8, 48, "Py = N = P·cos " + ang, { size: 10, fill: FG });
      g += '</g>';
      // Peso vertical
      g += '<line x1="274" y1="88" x2="274" y2="156" stroke="' + MUTED + '" stroke-width="1.5"/>';
      g += '<polygon points="274,156 270,147 278,147" fill="' + MUTED + '"/>';
      g += txt(282, 154, "P = m·g", { size: 10.5, fill: MUTED });
      return {
        title: "Diagrama de Forças no Plano Inclinado",
        svg: wrapSvg(520, 180, "Bloco em plano inclinado com peso decomposto em Px paralelo e Py perpendicular", g),
        caption: "A componente que puxa o bloco ao longo da rampa é P·sen θ (oposta ao ângulo θ); a normal equilibra a componente perpendicular P·cos θ."
      };
    }

    if (opts.mode === "power") {
      const P = opts.P != null ? opts.P + " W" : "P (Ativa · W)";
      const Qr = opts.Q != null ? opts.Q + " var" : "Q (Reativa · var)";
      const S = opts.S != null ? opts.S + " VA" : "S = √(P²+Q²) (VA)";
      g += txt(260, 22, "TRIÂNGULO DE POTÊNCIAS EM CORRENTE ALTERNADA (CA)", { anchor: "middle", size: 10.5, fill: MUTED });
      g += '<polygon points="118,148 368,148 368,54" fill="#121215" stroke="' + FG + '" stroke-width="1.6"/>';
      g += '<polyline points="354,148 354,134 368,134" fill="none" stroke="' + AXIS + '" stroke-width="1.2"/>';
      g += '<line x1="118" y1="148" x2="368" y2="54" stroke="' + OK + '" stroke-width="2"/>';
      g += txt(243, 166, P, { anchor: "middle", size: 11, fill: HI, w: 600 });
      g += txt(378, 106, Qr, { anchor: "start", size: 11, fill: FG });
      g += txt(226, 86, S, { anchor: "end", size: 11.5, fill: OK, w: 600 });
      g += txt(162, 140, "φ  (FP = cos φ = P/S)", { size: 10, fill: MUTED });
      return {
        title: "Triângulo Retângulo de Potências (P, Q e S)",
        svg: wrapSvg(520, 180, "Triângulo de potências P ativa, Q reativa e S aparente", g),
        caption: "Potência ativa P (W) e reativa Q (var) são perpendiculares entre si. A potência aparente S (VA) é a hipotenusa e o fator de potência é o cosseno do ângulo φ."
      };
    }

    const opp = opts.opp || "Cateto Oposto", adj = opts.adj || "Cateto Adjacente", hyp = opts.hyp || "Hipotenusa";
    const ang = opts.ang || "θ";
    g += txt(260, 22, "TRIÂNGULO RETÂNGULO: PITÁGORAS & SOH-CAH-TOA", { anchor: "middle", size: 10.5, fill: MUTED });
    g += '<polygon points="124,148 364,148 364,52" fill="#121215" stroke="' + FG + '" stroke-width="1.6"/>';
    g += '<polyline points="350,148 350,134 364,134" fill="none" stroke="' + OK + '" stroke-width="1.4"/>';
    g += txt(244, 166, adj, { anchor: "middle", size: 11, fill: FG });
    g += txt(374, 104, opp, { anchor: "start", size: 11, fill: OK, w: 600 });
    g += txt(232, 88, hyp, { anchor: "end", size: 11, fill: HI, w: 600 });
    g += txt(160, 140, ang, { size: 11.5, fill: OK, w: 600 });
    return {
      title: "Relação Espacial dos Catetos em Relação ao Ângulo",
      svg: wrapSvg(520, 180, "Triângulo retângulo com cateto oposto, cateto adjacente, hipotenusa e ângulo", g),
      caption: "O cateto OPOSTO fica de frente para o ângulo " + ang + " (usa seno); o cateto ADJACENTE encosta no ângulo " + ang + " (usa cosseno)."
    };
  }

  /* ==========================================================================
     10. CICLO TRIGONOMÉTRICO → SENOIDE CA & FASORES
     ========================================================================== */
  function svgUnitCircleSine(VpLabel, fLabel) {
    let g = txt(260, 22, "PROJEÇÃO DO CICLO TRIGONOMÉTRICO NA ONDA SENOIDAL CA", { anchor: "middle", size: 10.5, fill: MUTED });
    // Esquerda: círculo unitário (cx=106, cy=104, r=52)
    const cx = 106, cy = 104, r = 52;
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#121215" stroke="' + AXIS + '" stroke-width="1.4"/>';
    g += '<line x1="44" y1="' + cy + '" x2="168" y2="' + cy + '" stroke="' + GRID + '"/>';
    g += '<line x1="' + cx + '" y1="42" x2="' + cx + '" y2="166" stroke="' + GRID + '"/>';
    const px = cx + r * Math.cos(Math.PI / 4), py = cy - r * Math.sin(Math.PI / 4);
    g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + HI + '" stroke-width="1.8"/>';
    g += '<line x1="' + px.toFixed(1) + '" y1="' + py.toFixed(1) + '" x2="' + px.toFixed(1) + '" y2="' + cy + '" stroke="' + OK + '" stroke-width="1.5"/>';
    g += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="3.5" fill="' + OK + '"/>';
    g += txt(124, 98, "ωt", { size: 10, fill: MUTED });
    g += txt(cx, 174, "cos θ (eixo x) · sen θ (eixo y)", { anchor: "middle", size: 9.5, fill: MUTED });

    // Direita: senoide (x=210..482)
    g += '<line x1="210" y1="' + cy + '" x2="486" y2="' + cy + '" stroke="' + AXIS + '" stroke-width="1.3"/>';
    g += '<line x1="210" y1="44" x2="210" y2="164" stroke="' + AXIS + '" stroke-width="1.3"/>';
    // Linha tracejada Vrms
    const rmsY = cy - r * 0.7071;
    g += '<line x1="210" y1="' + rmsY.toFixed(1) + '" x2="478" y2="' + rmsY.toFixed(1) + '" stroke="' + OK + '" stroke-dasharray="4 4" stroke-width="1.1"/>';
    g += txt(480, rmsY + 3, "Vrms", { anchor: "end", size: 9.5, fill: OK });
    let pts = [];
    for (let i = 0; i <= 60; i++) {
      const a = (i / 60) * 2 * Math.PI;
      pts.push((210 + (i / 60) * 260).toFixed(1) + "," + (cy - r * Math.sin(a)).toFixed(1));
    }
    g += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + HI + '" stroke-width="2"/>';
    // Marcações T/4, T/2, 3T/4, T
    [["T/4", 0.25], ["T/2", 0.5], ["3T/4", 0.75], ["T", 1]].forEach(function (mk) {
      const mx = 210 + mk[1] * 260;
      g += '<line x1="' + mx + '" y1="100" x2="' + mx + '" y2="108" stroke="' + FG + '"/>';
      g += txt(mx, 120, mk[0], { anchor: "middle", size: 9.5, fill: MUTED });
    });
    g += txt(275, 48, VpLabel ? "+Vp = " + VpLabel : "+Vp", { anchor: "middle", size: 10.5, fill: HI, w: 600 });
    if (fLabel) g += txt(350, 174, fLabel, { anchor: "middle", size: 10, fill: OK });
    return {
      title: "Geração da Onda Senoidal CA pelo Vetor Girante",
      svg: wrapSvg(520, 184, "Ciclo trigonométrico projetado em onda senoidal com período T e nível RMS", g),
      caption: "Uma volta completa no círculo (2π rad = 360°) gera exatamente um período T = 1/f da senoide. O valor eficaz Vrms = Vp/√2 fica a 70,7% da altura do pico."
    };
  }

  /* ==========================================================================
     11. CIRCUNFERÊNCIA, POLAR / FASORES & VETORES 2D/3D
     ========================================================================== */
  function svgPolarComplex(xVal, yVal) {
    let g = txt(260, 22, "PLANO COMPLEXO / POLAR: RETANGULAR (x + jy) ↔ POLAR (|Z| ∠ θ)", { anchor: "middle", size: 10, fill: MUTED });
    const ox = 200, oy = 112;
    g += '<line x1="76" y1="' + oy + '" x2="344" y2="' + oy + '" stroke="' + AXIS + '" stroke-width="1.3"/>';
    g += '<line x1="' + ox + '" y1="36" x2="' + ox + '" y2="172" stroke="' + AXIS + '" stroke-width="1.3"/>';
    g += txt(346, oy + 4, "Re (x)", { size: 10, fill: MUTED });
    g += txt(ox + 6, 46, "Im (jy)", { size: 10, fill: MUTED });
    const sx = (xVal != null && xVal < 0) ? -1 : 1;
    const sy = (yVal != null && yVal < 0) ? -1 : 1;
    const px = ox + sx * (xVal === 0 ? 0 : 88), py = oy - sy * (yVal === 0 ? 0 : 54);
    g += '<line x1="' + px + '" y1="' + py + '" x2="' + px + '" y2="' + oy + '" stroke="' + GRID + '" stroke-dasharray="4 3"/>';
    g += '<line x1="' + ox + '" y1="' + oy + '" x2="' + px + '" y2="' + py + '" stroke="' + OK + '" stroke-width="2"/>';
    g += '<circle cx="' + px + '" cy="' + py + '" r="4" fill="' + HI + '"/>';
    g += txt(px + (sx > 0 ? 8 : -8), py + (sy > 0 ? -6 : 14), xVal != null ? "(" + xVal + ", " + yVal + ")" : "Z = x + jy", { anchor: sx > 0 ? "start" : "end", size: 10.5, fill: HI, w: 600 });
    g += txt(426, 78, "|Z| = √(x² + y²)", { anchor: "middle", size: 11, fill: HI });
    g += txt(426, 102, "x = |Z|·cos θ", { anchor: "middle", size: 10.5, fill: MUTED });
    g += txt(426, 122, "y = |Z|·sen θ", { anchor: "middle", size: 10.5, fill: MUTED });
    g += txt(426, 146, "Confira o quadrante!", { anchor: "middle", size: 10, fill: OK });
    return {
      title: "Representação Polar e Retangular no Plano",
      svg: wrapSvg(520, 182, "Plano cartesiano e polar mostrando módulo r e ângulo theta", g),
      caption: "O módulo |Z| é a distância da origem até o ponto (x, y). Olhe sempre os sinais de x e y para posicionar o ângulo θ no quadrante correto."
    };
  }

  function svgCircle(h, k, R) {
    let g = txt(260, 22, "CIRCUNFERÊNCIA: (x − xc)² + (y − yc)² = R²", { anchor: "middle", size: 10.5, fill: MUTED });
    const cx = 200, cy = 104, r = 56;
    g += '<line x1="76" y1="156" x2="340" y2="156" stroke="' + AXIS + '"/>';
    g += '<line x1="108" y1="36" x2="108" y2="170" stroke="' + AXIS + '"/>';
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#121215" stroke="' + HI + '" stroke-width="1.8"/>';
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="' + OK + '"/>';
    g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 42) + '" y2="' + (cy - 37) + '" stroke="' + OK + '" stroke-width="1.6"/>';
    g += txt(cx + 28, cy - 22, R != null ? "R = " + R : "R", { size: 11, fill: OK, w: 600 });
    g += txt(cx, cy + 16, h != null ? "C(" + h + ", " + k + ")" : "C(xc, yc)", { anchor: "middle", size: 10.5, fill: HI });
    g += txt(424, 88, "Centro: sinal oposto", { anchor: "middle", size: 10.5, fill: FG });
    g += txt(424, 108, "ao de dentro de ( )", { anchor: "middle", size: 10.5, fill: MUTED });
    g += txt(424, 134, "Raio = √(lado direito)", { anchor: "middle", size: 10.5, fill: OK });
    return {
      title: "Geometria da Equação da Circunferência",
      svg: wrapSvg(520, 180, "Circunferência com centro xc, yc e raio R", g),
      caption: "Todos os pontos (x, y) da borda estão à distância constante R do centro C(xc, yc) — a equação é apenas o Teorema de Pitágoras aplicado à distância."
    };
  }

  function svgCrossProduct3D() {
    let g = txt(260, 22, "PRODUTO VETORIAL u × v: VETOR PERPENDICULAR AO PLANO DE u E v", { anchor: "middle", size: 10, fill: MUTED });
    // Plano inclinado (paralelogramo)
    g += '<polygon points="156,142 294,142 356,96 218,96" fill="#121215" stroke="' + GRID + '" stroke-width="1.3"/>';
    // Vetores u e v
    g += '<line x1="156" y1="142" x2="294" y2="142" stroke="' + FG + '" stroke-width="2"/>';
    g += '<polygon points="294,142 284,137 284,147" fill="' + FG + '"/>';
    g += txt(298, 154, "u", { size: 12, fill: HI, w: 600 });
    g += '<line x1="156" y1="142" x2="218" y2="96" stroke="' + FG + '" stroke-width="2"/>';
    g += '<polygon points="218,96 208,98 214,105" fill="' + FG + '"/>';
    g += txt(224, 92, "v", { size: 12, fill: HI, w: 600 });
    // Vetor u × v perpendicular pra cima
    g += '<line x1="156" y1="142" x2="156" y2="44" stroke="' + OK + '" stroke-width="2.2"/>';
    g += '<polygon points="156,44 151,54 161,54" fill="' + OK + '"/>';
    g += '<polyline points="156,128 170,128 170,142" fill="none" stroke="' + OK + '" stroke-width="1.2"/>';
    g += txt(166, 54, "u × v  (90° com u e v)", { size: 11, fill: OK, w: 600 });
    // Notas à direita
    g += txt(378, 80, "Teste obrigatório:", { size: 10.5, fill: HI });
    g += txt(378, 100, "(u × v) · u = 0", { size: 11, fill: OK });
    g += txt(378, 120, "(u × v) · v = 0", { size: 11, fill: OK });
    g += txt(378, 146, "F = q·(v × B)", { size: 10.5, fill: MUTED });
    return {
      title: "Ortogonalidade do Produto Vetorial (Regra da Mão Direita)",
      svg: wrapSvg(520, 176, "Vetores u e v em um plano e produto vetorial u x v perpendicular ao plano", g),
      caption: "Enquanto o produto escalar u·v gera um número, o produto vetorial u×v gera um novo vetor 3D ortogonal tanto a u quanto a v (base da força magnética de Lorentz)."
    };
  }

  /* ==========================================================================
     12. LIMITES (BURACO 0/0 E ASSÍNTOTA) & DERIVADA (RETA TANGENTE)
     ========================================================================== */
  function svgLimitHole() {
    let g = txt(260, 22, "INTERPRETAÇÃO GRÁFICA DO LIMITE: INDETERMINAÇÃO REMOVÍVEL 0/0", { anchor: "middle", size: 10, fill: MUTED });
    g += '<line x1="68" y1="154" x2="454" y2="154" stroke="' + AXIS + '"/>';
    g += '<line x1="94" y1="38" x2="94" y2="168" stroke="' + AXIS + '"/>';
    // Curva linear/suave com buraco em (250, 92)
    g += '<line x1="120" y1="138" x2="244" y2="94" stroke="' + HI + '" stroke-width="2"/>';
    g += '<line x1="256" y1="90" x2="390" y2="44" stroke="' + HI + '" stroke-width="2"/>';
    g += '<circle cx="250" cy="92" r="5" fill="' + BG + '" stroke="' + OK + '" stroke-width="2"/>';
    // Projeções tracejadas
    g += '<line x1="250" y1="98" x2="250" y2="154" stroke="' + GRID + '" stroke-dasharray="4 3"/>';
    g += '<line x1="94" y1="92" x2="244" y2="92" stroke="' + GRID + '" stroke-dasharray="4 3"/>';
    g += txt(250, 169, "x → a", { anchor: "middle", size: 10.5, fill: OK, w: 600 });
    g += txt(88, 96, "L", { anchor: "end", size: 11, fill: OK, w: 600 });
    g += txt(264, 108, "Buraco em x = a (0/0),", { size: 10, fill: FG });
    g += txt(264, 124, "mas ambos os lados → L", { size: 10, fill: OK });
    return {
      title: "O Que Acontece no Gráfico Quando Surge 0/0",
      svg: wrapSvg(520, 180, "Gráfico com descontinuidade removível mostrando limite L quando x tende a a", g),
      caption: "O limite não pergunta o valor exato EM x = a (onde existe o buraco 0/0), mas sim para qual altura L a curva aponta ao se aproximar pela esquerda e pela direita."
    };
  }

  function svgDerivativeTangent() {
    let g = txt(260, 22, "DERIVADA f'(x₀) = INCLINAÇÃO DA RETA TANGENTE NO PONTO", { anchor: "middle", size: 10.5, fill: MUTED });
    g += '<line x1="68" y1="156" x2="458" y2="156" stroke="' + AXIS + '"/>';
    g += '<line x1="94" y1="38" x2="94" y2="168" stroke="' + AXIS + '"/>';
    // Curva f(x)
    let pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40; // 0..1
      const x = 112 + t * 290;
      const y = 148 - t * t * 102;
      pts.push(x.toFixed(1) + "," + y.toFixed(1));
    }
    g += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + FG + '" stroke-width="1.8"/>';
    // Ponto x0 (t=0.55 → x=271.5, y=117.1) e tangente
    const x0 = 271.5, y0 = 117.1;
    // Derivada dy/dx = (-2*0.55*102)/290 = -0.3869
    g += '<line x1="156" y1="162" x2="408" y2="64" stroke="' + OK + '" stroke-width="2"/>';
    g += '<circle cx="' + x0 + '" cy="' + y0 + '" r="4.5" fill="' + OK + '"/>';
    g += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="156" stroke="' + GRID + '" stroke-dasharray="4 3"/>';
    g += txt(x0, 170, "x₀", { anchor: "middle", size: 10.5, fill: HI });
    g += txt(396, 56, "Tangente: m = f'(x₀)", { anchor: "end", size: 10.5, fill: OK, w: 600 });
    g += txt(138, 86, "f(x)", { size: 11, fill: FG });
    return {
      title: "Interpretação Geométrica da Derivada",
      svg: wrapSvg(520, 182, "Curva suave com reta tangente destacando inclinação f'(x0)", g),
      caption: "Derivar uma função em x₀ calcula a taxa instantânea de variação — geometricamente, é o coeficiente angular m da única reta que tangencia a curva naquele ponto."
    };
  }

  /* ==========================================================================
     MAPEAMENTO SELETIVO: SESSÕES DA APOSTILA & FAMÍLIAS DE EXERCÍCIOS
     (Retorna null em tópicos puramente mecânicos — zero diagramas forçados!)
     ========================================================================== */
  function forSession(sid) {
    if (sid === 1 || sid === 2 || sid === 3) return svgSeriesVsParallel();
    if (sid === 4) return svgVoltageDivider(12, 1, 3, false);
    if (sid === 5 || sid === 7) return svgSiScale();
    if (sid === 8) return svgCoulomb();
    if (sid === 9 || sid === 10) return svgBinaryNibble();
    if (sid === 11 || sid === 12) return svgDeMorganGates();
    if (sid === 13) return svgAreaSquare();
    if (sid === 16 || sid === 49 || sid === 50 || sid === 52) return svgLimitHole();
    if (sid === 19 || sid === 20) return svgKirchhoff();
    if (sid === 21 || sid === 37 || sid === 38) return svgLinearSlope("x (ou I)", "y (ou V)");
    if (sid === 22 || sid === 23) return svgParabola("up");
    if (sid === 24) return svgParabola("pmax");
    if (sid === 25 || sid === 26) return svgExpLogInverse();
    if (sid === 28 || sid === 51) return svgRcCurve("charge");
    if (sid === 29 || sid === 30) return svgRightTriangle({});
    if (sid === 31) return svgRightTriangle({ mode: "power" });
    if (sid === 32) return svgRightTriangle({ mode: "incline" });
    if (sid === 33 || sid === 34 || sid === 35) return svgUnitCircleSine();
    if (sid === 36 || sid === 40 || sid === 41) return svgPolarComplex();
    if (sid === 39) return svgCircle();
    if (sid === 42 || sid === 43 || sid === 44) return svgCrossProduct3D();
    if (sid === 53 || sid === 54 || sid === 55 || sid === 56) return svgDerivativeTangent();
    return null;
  }

  function forQuestion(q) {
    if (!q || !q.family) return null;
    const f = q.family, t = q.text || "";
    let m;

    if (f === "parallel2") {
      m = /R₁\s*=\s*(\d+)\s*Ω\s*e\s*R₂\s*=\s*(\d+)/.exec(t);
      if (m) return svgParallelParam(+m[1], +m[2]);
    }
    if (f === "parallel3") {
      m = /(\d+)\s*Ω,\s*(\d+)\s*Ω\s*e\s*(\d+)\s*Ω/.exec(t);
      if (m) return svgParallelParam(+m[1], +m[2], +m[3]);
    }
    if (f === "reqSP") {
      m = /R₁\s*=\s*(\d+)\s*Ω[\s\S]*R₂\s*=\s*(\d+)\s*Ω\s*e\s*R₃\s*=\s*(\d+)/.exec(t);
      if (m) return svgReqSP(+m[1], +m[2], +m[3]);
    }
    if (f === "voltDiv") {
      m = /fonte de (\d+)\s*V[\s\S]*R₁\s*=\s*(\d+)\s*kΩ[\s\S]*R₂\s*=\s*(\d+)\s*kΩ/.exec(t);
      if (m) return svgVoltageDivider(+m[1], +m[2], +m[3], false);
    }
    if (f === "dividerDesign") {
      m = /Vs\s*=\s*(\d+)\s*V\s*e\s*R₁\s*=\s*(\d+)\s*kΩ[\s\S]*Vout\s*=\s*([\d,]+)\s*V/.exec(t);
      if (m) return svgVoltageDivider(+m[1], +m[2], m[3], true);
    }
    if (f === "coulomb") {
      m = /(\d+)\s*μC\s*e\s*(\d+)\s*μC\s*estão a\s*(\d+)\s*cm/.exec(t);
      if (m) return svgCoulomb(+m[1], +m[2], +m[3]);
    }
    if (f === "lkc") {
      m = /entram (\d+)\s*A e (\d+)\s*A e saem (\d+)\s*A/.exec(t);
      if (m) return svgKirchhoff({ i1: +m[1], i2: +m[2], i3: +m[3] });
    }
    if (f === "meshSolve") {
      m = /R₃\s*=\s*(\d+)\s*Ω[\s\S]*fonte de (\d+)\s*V,\s*R₁\s*=\s*(\d+)\s*Ω[\s\S]*R₂\s*=\s*(\d+)/.exec(t);
      if (m) return svgKirchhoff({ mode: "mesh", R3: +m[1], V1: +m[2], R1: +m[3], R2: +m[4] });
    }
    if (f === "ohmLine") return svgLinearSlope("I (mA)", "V (V)", "(0, 0)", "(I, V)");
    if (f === "lineTwoPoints") return svgLinearSlope("x", "y");
    if (f === "projectile") return svgParabola("down");
    if (f === "maxPowerI" || f === "maxPowerP" || f === "pmaxDesign") return svgParabola("pmax");
    if (f === "rcDischarge") return svgRcCurve("discharge");
    if (f === "rcCharge" || f === "rcTimeTo" || f === "rcSteady") return svgRcCurve("charge");
    if (f === "pythHyp") {
      m = /catetos (\d+)\s*e\s*(\d+)/.exec(t);
      if (m) return svgRightTriangle({ opp: "b = " + m[1], adj: "c = " + m[2], hyp: "a = ?", ang: "θ" });
    }
    if (f === "pythLeg") {
      m = /hipotenusa (\d+)\s*e um cateto (\d+)/.exec(t);
      if (m) return svgRightTriangle({ opp: "b = " + m[2], adj: "c = ?", hyp: "a = " + m[1], ang: "θ" });
    }
    if (f === "cableGuy") {
      m = /torre de (\d+)\s*m[\s\S]*a (\d+)\s*m da base/.exec(t);
      if (m) return svgRightTriangle({ opp: "Torre = " + m[1] + " m", adj: "Base = " + m[2] + " m", hyp: "Cabo L = ?", ang: "θ" });
    }
    if (f === "rampHeight") {
      m = /rampa de (\d+)\s*m faz (\d+)°/.exec(t);
      if (m) return svgRightTriangle({ opp: "h = ?", adj: "base", hyp: "L = " + m[1] + " m", ang: m[2] + "°" });
    }
    if (f === "incline") {
      m = /bloco de (\d+)\s*kg[\s\S]*(\d+)°/.exec(t);
      if (m) return svgRightTriangle({ mode: "incline", m: +m[1], ang: m[2] + "°" });
    }
    if (f === "powerTriangle") {
      m = /P\s*=\s*(\d+)\s*W\s*e\s*Q\s*=\s*(\d+)\s*var/.exec(t);
      if (m) return svgRightTriangle({ mode: "power", P: +m[1], Q: +m[2], S: "S = ?" });
    }
    if (f === "sinParams" || f === "sinEval" || f === "rmsPeak") return svgUnitCircleSine();
    if (f === "circleFromEq" || f === "completeSquareCircle") return svgCircle();
    if (f === "polarToRect" || f === "rectToPolar" || f === "phasorSum") return svgPolarComplex();
    if (f === "cross3" || f === "lorentzCross") return svgCrossProduct3D();
    if (f === "limFactor" || f === "limCancel" || f === "limConj") return svgLimitHole();
    if (f === "derivDef" || f === "tangentLine") return svgDerivativeTangent();
    return null;
  }

  function renderBlock(vis, badge) {
    if (!vis) return "";
    return '<figure class="vd-box">' +
      '<div class="vd-head"><span class="vd-badge mono">' + esc(badge || "Visualização do Conceito") + '</span>' +
      '<strong class="vd-title">' + esc(vis.title) + '</strong></div>' +
      '<div class="vd-canvas">' + vis.svg + '</div>' +
      '<figcaption class="vd-caption">' + esc(vis.caption) + '</figcaption>' +
      '</figure>';
  }

  NE.Visuals = {
    forSession: forSession,
    forQuestion: forQuestion,
    renderBlock: renderBlock
  };
})(window);
