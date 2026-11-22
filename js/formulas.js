/* ==========================================================================
   NeuroEng // Prep OS — Módulo de Fórmulas Prontas (Contextualizadas por Seção)
   - Exibe apenas as fórmulas relevantes à sessão/semana ativa por padrão
   - Gaveta lateral (Drawer) no Modo Hiperfoco sem interromper timer/áudio/rascunho
   - Visão completa (#/formulas) agrupada por Semana/Tópico ou Disciplina FURB
   ========================================================================== */
(function (global) {
  "use strict";
  const NE = (global.NE = global.NE || {});
  const D = NE.Data, S = NE.Store, U = NE.U;
  const esc = U.esc;

  const SUBJECT_MAP = {};
  D.FURB_SUBJECTS.forEach(function (s) { SUBJECT_MAP[s.key] = s.name; });

  /* ==========================================================================
     BANCO COMPLETO DE FÓRMULAS (Semanas 1 a 14 · 56 Sessões · 7 Disciplinas)
     ========================================================================== */
  const FORMULAS = [
    /* ------------------------------ SEMANA 1 ------------------------------ */
    {
      id: "w1-pemdas",
      week: 1, sessions: [1, 4], subjects: ["mod", "intro"],
      title: "Hierarquia de Operações & Distributiva com Sinal",
      topic: "Aritmética Estrutural",
      expr: "1º ( )  →  2º aⁿ, √  →  3º ×, ÷ (esq→dir)  →  4º +, −\n−(a − b + c) = −a + b − c",
      vars: [
        { sym: "( )", desc: "Parênteses internos resolvidos primeiro" },
        { sym: "−(…)", desc: "Sinal negativo externo inverte TODOS os sinais internos" }
      ],
      when: "Use antes de qualquer manipulação numérica ou algébrica. Em multiplicações e divisões de mesma prioridade, resolva estritamente da esquerda para a direita."
    },
    {
      id: "w1-frac-ops",
      week: 1, sessions: [2, 3, 4], subjects: ["mod", "ele"],
      title: "Soma, Produto e Divisão de Frações (via MMC)",
      topic: "Frações & MMC/MDC",
      expr: "a/b ± c/d = [ a·(M/b) ± c·(M/d) ] / M,   onde M = MMC(b, d)\n(a/b) ÷ (c/d) = (a/b) · (d/c) = (a·d) / (b·c)",
      vars: [
        { sym: "M", desc: "Mínimo Múltiplo Comum dos denominadores (nunca some b + d)" },
        { sym: "d/c", desc: "Inverso (recíproco) da segunda fração na divisão" }
      ],
      when: "Soma/subtração exige denominadores iguais (via MMC). Na divisão de frações, conserve a primeira e multiplique pelo inverso da segunda."
    },
    {
      id: "w1-lcm-gcd",
      week: 1, sessions: [2, 3], subjects: ["mod"],
      title: "Relação Fundamental entre MMC e MDC",
      topic: "MMC e MDC Aplicados",
      expr: "MMC(a, b) · MDC(a, b) = a · b\nT_sinc = MMC(T₁, T₂)",
      vars: [
        { sym: "MDC(a, b)", desc: "Produto apenas dos fatores primos comuns de menor expoente" },
        { sym: "MMC(a, b)", desc: "Produto de todos os fatores primos de maior expoente" },
        { sym: "T₁, T₂", desc: "Períodos de dois sinais cíclicos (ms ou s)" }
      ],
      when: "Use o MDC para simplificar frações até a forma irredutível e o MMC para achar o denominador comum ou o instante em que dois sinais periódicos voltam a alinhar."
    },
    {
      id: "w1-req-series",
      week: 1, sessions: [1, 4], subjects: ["ele", "intro"],
      title: "Associação de Resistores em Série",
      topic: "Circuitos Resistivos",
      expr: "R_eq = R₁ + R₂ + … + Rₙ",
      vars: [
        { sym: "R_eq", desc: "Resistência equivalente total em série (Ω)" },
        { sym: "R₁…Rₙ", desc: "Resistores percorridos exatamente pela mesma corrente I (Ω)" }
      ],
      when: "Use quando os resistores estão no mesmo ramo sem bifurcação entre eles (mesma corrente I passa por todos)."
    },
    {
      id: "w1-req-parallel",
      week: 1, sessions: [1, 2, 3, 4], subjects: ["ele", "mod"],
      title: "Resistores em Paralelo (Fórmula Geral e Atalho de 2 Resistores)",
      topic: "Frações em Circuitos",
      expr: "Geral (N resistores):  1 / R_eq = 1/R₁ + 1/R₂ + … + 1/Rₙ\nAtalho (2 resistores): R_eq = (R₁ · R₂) / (R₁ + R₂)",
      vars: [
        { sym: "R_eq", desc: "Resistência equivalente em paralelo (Ω) — sempre menor que o menor resistor" },
        { sym: "G = 1/R", desc: "Condutância de cada ramo em siemens (S = Ω⁻¹)" }
      ],
      when: "Use o atalho do produto pela soma APENAS para exatamente 2 resistores em paralelo. Para 3 ou mais resistores, some 1/R via MMC e NÃO esqueça de inverter a fração no último passo."
    },
    {
      id: "w1-vdiv",
      week: 1, sessions: [3, 4, 17], subjects: ["ele"],
      title: "Divisor de Tensão e Divisor de Corrente",
      topic: "Divisores Resistivos",
      expr: "V₂ = V_in · [ R₂ / (R₁ + R₂) ]   (em série)\nI₁ = I_total · [ R₂ / (R₁ + R₂) ] (em paralelo, 2 ramos)",
      vars: [
        { sym: "V₂", desc: "Queda de tensão sobre o resistor R₂ (V)" },
        { sym: "V_in", desc: "Tensão total aplicada à série R₁ + R₂ (V)" },
        { sym: "I₁", desc: "Corrente no ramo R₁ (usa o resistor OPOSTO R₂ no numerador) (A)" }
      ],
      when: "Use o divisor de tensão para resistores em série sem carga pendurada no nó. No divisor de corrente (paralelo), o numerador leva o resistor do ramo oposto."
    },

    /* ------------------------------ SEMANA 2 ------------------------------ */
    {
      id: "w2-pow-rules",
      week: 2, sessions: [5, 7, 25], subjects: ["mod", "intro"],
      title: "Propriedades de Potenciação & Expoente Negativo",
      topic: "Potências",
      expr: "aᵐ · aⁿ = aᵐ⁺ⁿ   |   aᵐ / aⁿ = aᵐ⁻ⁿ   |   (aᵐ)ⁿ = aᵐ·ⁿ\na⁻ⁿ = 1 / aⁿ     |   a⁰ = 1 (a ≠ 0)",
      vars: [
        { sym: "a", desc: "Base real não nula" },
        { sym: "m, n", desc: "Expoentes (ao subir do denominador para o numerador, o expoente troca de sinal)" }
      ],
      when: "Use para simplificar potências de mesma base e prefixos de base 10. Lembre-se: (a + b)² NUNCA é a² + b²."
    },
    {
      id: "w2-rad-rules",
      week: 2, sessions: [6, 8], subjects: ["mod", "ele", "fis"],
      title: "Radiciação, Expoente Fracionário e Racionalização",
      topic: "Radicais",
      expr: "ⁿ√(aᵐ) = a^(m/n)   |   √a · √b = √(a·b)\n1/√a = √a / a      |   c/(√a ± √b) = c·(√a ∓ √b) / (a − b)",
      vars: [
        { sym: "n", desc: "Índice da raiz (vai para o denominador do expoente)" },
        { sym: "√a ∓ √b", desc: "Conjugado do denominador para eliminar raízes via diferença de quadrados" }
      ],
      when: "Converta raízes em potências fracionárias antes de derivar ou multiplicar. Use o conjugado quando o denominador tiver soma ou subtração com raiz quadrada."
    },
    {
      id: "w2-si-prefixes",
      week: 2, sessions: [5, 7, 8, 28], subjects: ["intro", "ele", "fis"],
      title: "Prefixos de Engenharia (SI) e Notação Científica",
      topic: "Notação Científica & SI",
      expr: "p = 10⁻¹²  |  n = 10⁻⁹  |  μ = 10⁻⁶  |  m = 10⁻³\nk = 10³    |  M = 10⁶   |  G = 10⁹   |  T = 10¹²",
      vars: [
        { sym: "a × 10ⁿ", desc: "Notação científica padrão: 1 ≤ |a| < 10 e n inteiro" },
        { sym: "kΩ · mA", desc: "10³ · 10⁻³ = 10⁰ = 1 V (atalho direto em circuitos)" }
      ],
      when: "Converta todos os prefixos para potências de 10 na Linha 1 antes de aplicar Lei de Ohm, Coulomb, constante RC ou ressonância."
    },
    {
      id: "w2-ohm-joule",
      week: 2, sessions: [1, 5, 8, 14, 17], subjects: ["ele", "fis"],
      title: "Lei de Ohm & Potência Elétrica (Efeito Joule)",
      topic: "Eletricidade Básica",
      expr: "V = R · I   |   P = V · I = R · I² = V² / R",
      vars: [
        { sym: "V", desc: "Diferença de potencial / tensão elétrica (V)" },
        { sym: "I", desc: "Corrente elétrica (A)" },
        { sym: "R", desc: "Resistência elétrica (Ω)" },
        { sym: "P", desc: "Potência dissipada ou fornecida (W = J/s)" }
      ],
      when: "Em série, prefira P = R·I² (corrente comum). Em paralelo ou tensão fixa de barramento, prefira P = V²/R."
    },
    {
      id: "w2-coulomb",
      week: 2, sessions: [8], subjects: ["fis", "ele"],
      title: "Lei de Coulomb & Campo Elétrico Pontual",
      topic: "Eletrostática",
      expr: "F = k · |q₁ · q₂| / r²   |   E = F / |q₀| = k · |Q| / r²",
      vars: [
        { sym: "k", desc: "Constante eletrostática no vácuo ≈ 9 × 10⁹ N·m²/C²" },
        { sym: "q₁, q₂", desc: "Cargas elétricas em coulombs (C; 1 μC = 10⁻⁶ C)" },
        { sym: "r", desc: "Distância entre os centros das cargas em METROS (cm → ×10⁻² m)" },
        { sym: "F, E", desc: "Força elétrica (N) e módulo do campo elétrico (N/C ou V/m)" }
      ],
      when: "Converta obrigatoriamente μC/nC para C e cm/mm para metros antes de elevar r ao quadrado."
    },
    {
      id: "w2-lc-resonance",
      week: 2, sessions: [6, 7], subjects: ["ele", "fis"],
      title: "Constante de Tempo RC e Ressonância LC",
      topic: "Circuitos RC / LC",
      expr: "τ = R · C   |   ω₀ = 1 / √(L · C)   |   f₀ = 1 / [ 2π · √(L · C) ]",
      vars: [
        { sym: "τ", desc: "Constante de tempo capacitiva em segundos (s)" },
        { sym: "L, C", desc: "Indutância em henries (H) e capacitância em farads (F)" },
        { sym: "ω₀, f₀", desc: "Frequência de ressonância angular (rad/s) e cíclica (Hz)" }
      ],
      when: "Use τ = R·C para saber a velocidade de carga/descarga (5τ ≈ 99,3% concluído) e ω₀ = 1/√(LC) quando as reatâncias indutiva e capacitiva se anulam."
    },

    /* ------------------------------ SEMANA 3 ------------------------------ */
    {
      id: "w3-bases",
      week: 3, sessions: [9, 10], subjects: ["dig", "intro"],
      title: "Conversão Binário ↔ Decimal ↔ Hexadecimal & Complemento de 2",
      topic: "Sistemas de Numeração",
      expr: "N = Σ bᵢ · 2ⁱ   |   Faixa sem sinal (n bits): 0 a 2ⁿ − 1 (2ⁿ estados)\nComplemento de 2 (−X em n bits):  2ⁿ − X = (~X) + 1",
      vars: [
        { sym: "n", desc: "Número de bits do registrador ou barramento" },
        { sym: "1 dígito Hex", desc: "Equivale exatamente a um nibble de 4 bits (0000₂ = 0 a 1111₂ = F)" }
      ],
      when: "Para converter binário ↔ hexadecimal, agrupe os bits de 4 em 4 da direita para a esquerda. Para achar −X em complemento de 2, inverta todos os bits e some 1."
    },
    {
      id: "w3-adc-mem",
      week: 3, sessions: [9, 10], subjects: ["dig", "ele"],
      title: "Resolução de Conversor A/D (ADC) e Endereçamento de Memória",
      topic: "Instrumentação Digital",
      expr: "ΔV = V_ref / 2ⁿ   (ou V_ref / (2ⁿ − 1))\nBytes = End_final − End_inicial + 1",
      vars: [
        { sym: "ΔV", desc: "Menor passo de tensão detectável pelo ADC (V ou mV por LSB)" },
        { sym: "V_ref", desc: "Tensão de fundo de escala do conversor (ex.: 3,3 V ou 5 V)" },
        { sym: "+ 1", desc: "Inclusão de ambos os extremos da faixa de memória" }
      ],
      when: "Use em projetos de microcontroladores para saber quantos milivolts vale cada contagem do ADC ou o tamanho em bytes de um bloco de memória."
    },
    {
      id: "w3-boole-demorgan",
      week: 3, sessions: [11, 12], subjects: ["dig"],
      title: "Álgebra de Boole, Portas Lógicas & Leis de De Morgan",
      topic: "Lógica Digital",
      expr: "De Morgan:  ¬(A · B) = ¬A + ¬B   |   ¬(A + B) = ¬A · ¬B\nAbsorção:   A + A·B = A          |   A + ¬A·B = A + B\nXOR:        A ⊕ B = ¬A·B + A·¬B",
      vars: [
        { sym: "· (AND)", desc: "Saída 1 somente se TODAS as entradas forem 1" },
        { sym: "+ (OR)", desc: "Saída 1 se PELO MENOS UMA entrada for 1" },
        { sym: "¬ (NOT)", desc: "Inversão lógica (0 ↔ 1)" }
      ],
      when: "Ao quebrar uma barra de negação longa (NAND/NOR), troque o operador (· ↔ +) e mantenha a negação individual sobre cada termo."
    },

    /* ------------------------------ SEMANA 4 ------------------------------ */
    {
      id: "w4-notable-prod",
      week: 4, sessions: [13, 14, 15], subjects: ["mod", "calc"],
      title: "Produtos Notáveis (Quadrado da Soma/Diferença, Diferença de Quadrados e Cubo)",
      topic: "Manipulação Algébrica",
      expr: "(a ± b)² = a² ± 2ab + b²\n(a + b)(a − b) = a² − b²\n(a ± b)³ = a³ ± 3a²b + 3ab² ± b³",
      vars: [
        { sym: "± 2ab", desc: "Termo central obrigatório no quadrado do binômio (jamais esqueça!)" },
        { sym: "+ b²", desc: "O último termo de (a − b)² é SEMPRE positivo" }
      ],
      when: "Use para expandir polinômios em limites/derivadas e para fatorar diferenças de quadrados instantaneamente."
    },
    {
      id: "w4-quad-factor",
      week: 4, sessions: [14, 15, 16, 22], subjects: ["mod", "calc", "ele"],
      title: "Fatoração de Trinômio do 2º Grau (Soma & Produto e Bhaskara)",
      topic: "Polinômios & Polos",
      expr: "a·x² + b·x + c = a · (x − x₁) · (x − x₂)\nΔ = b² − 4ac   |   x = ( −b ± √Δ ) / (2a)\nSoma: x₁ + x₂ = −b/a   |   Produto: x₁ · x₂ = c/a",
      vars: [
        { sym: "Δ", desc: "Discriminante (Δ > 0: 2 raízes reais; Δ = 0: raiz dupla; Δ < 0: complexas)" },
        { sym: "x₁, x₂", desc: "Raízes (zeros do polinômio ou polos da função de transferência H(s))" }
      ],
      when: "Para a = 1, procure mentalmente dois números que multiplicados dão c e somados dão −b. Atenção: na forma fatorada (x − r), o sinal da raiz r é o oposto do sinal no parêntese."
    },
    {
      id: "w4-alg-frac",
      week: 4, sessions: [16, 48, 49, 50], subjects: ["mod", "calc"],
      title: "Simplificação de Frações Algébricas & Levantamento de Indeterminação 0/0",
      topic: "Frações Algébricas",
      expr: "[ (x − a)(x + b) ] / [ (x − a)(x + c) ] = (x + b) / (x + c),   para x ≠ a e x ≠ −c",
      vars: [
        { sym: "(x − a)", desc: "Fator comum que causava 0/0 quando x → a" },
        { sym: "Domínio", desc: "Valores que zeram o denominador original continuam excluídos do domínio" }
      ],
      when: "SÓ cancele FATORES que multiplicam o numerador inteiro e o denominador inteiro — nunca cancele parcelas soltas de uma soma!"
    },

    /* ------------------------------ SEMANA 5 ------------------------------ */
    {
      id: "w5-abs-ineq",
      week: 5, sessions: [17, 18, 45], subjects: ["mod", "calc", "ele"],
      title: "Equações/Inequações Modulares e Inversão por Multiplicador Negativo",
      topic: "Inequações & Tolerância",
      expr: "|u| = a  ⇔  u = a  ou  u = −a\n|x − x₀| ≤ δ  ⇔  x₀ − δ ≤ x ≤ x₀ + δ\n−a·x > b  (a > 0)  ⇔  x < −b / a   (INVERTE o sinal da desigualdade!)",
      vars: [
        { sym: "x₀", desc: "Valor nominal central (ex.: resistência nominal R₀)" },
        { sym: "δ", desc: "Tolerância absoluta máxima (ex.: p% · R₀)" }
      ],
      when: "Sempre que multiplicar ou dividir os dois lados de uma inequação por um número NEGATIVO, inverta imediatamente o símbolo (< ↔ >, ≤ ↔ ≥)."
    },
    {
      id: "w5-cramer",
      week: 5, sessions: [19, 20], subjects: ["geo", "ele", "mod"],
      title: "Sistemas Lineares 2×2 e 3×3 (Regra de Cramer)",
      topic: "Sistemas Lineares",
      expr: "a₁x + b₁y = c₁\na₂x + b₂y = c₂   ⇒   D = a₁b₂ − a₂b₁,   x = Dₓ / D,   y = Dᵧ / D",
      vars: [
        { sym: "D", desc: "Determinante principal da matriz dos coeficientes (deve ser ≠ 0)" },
        { sym: "Dₓ, Dᵧ", desc: "Determinantes obtidos trocando a coluna da incógnita pelos termos independentes c" }
      ],
      when: "Use para encontrar tensões de nó ou correntes de malha em circuitos. Organize todas as equações na mesma ordem de colunas (I₁, I₂, I₃ = constante) antes de extrair a matriz."
    },
    {
      id: "w5-kirchhoff",
      week: 5, sessions: [20], subjects: ["ele"],
      title: "Leis de Kirchhoff (LKC nos Nós e LKT nas Malhas)",
      topic: "Análise de Circuitos",
      expr: "LKC (Nó):    Σ I_entram = Σ I_saem\nLKT (Malha): Σ V_elevações − Σ R·I_quedas = 0\nMalha acoplada: (R₁ + R₃)I₁ − R₃I₂ = V_fonte",
      vars: [
        { sym: "I₁, I₂", desc: "Correntes de malha arbitradas (se der negativo, o sentido real é o oposto)" },
        { sym: "R₃", desc: "Resistor compartilhado na fronteira entre as malhas 1 e 2" }
      ],
      when: "Em cada malha, some todas as resistências próprias na diagonal principal (+(R₁+R₃)I₁) e subtraia a contribuição da corrente vizinha no resistor compartilhado (−R₃I₂)."
    },

    /* ------------------------------ SEMANA 6 ------------------------------ */
    {
      id: "w6-affine-mru",
      week: 6, sessions: [21, 37, 38], subjects: ["calc", "fis", "ele"],
      title: "Função Afim (1º Grau), Coeficiente Angular e MRU",
      topic: "Funções Lineares",
      expr: "f(x) = a·x + b   |   m = a = Δy / Δx = (y₂ − y₁) / (x₂ − x₁)\nRaiz: x = −b / a |   MRU: s(t) = s₀ + v·t",
      vars: [
        { sym: "a (ou m)", desc: "Taxa de variação / inclinação da reta (em V×I é a resistência R; em s×t é a velocidade v)" },
        { sym: "b", desc: "Valor inicial / intercepto no eixo vertical (f(0) = b)" }
      ],
      when: "Use quando a taxa de variação entre duas grandezas é constante."
    },
    {
      id: "w6-quad-vertex",
      week: 6, sessions: [22, 23, 24], subjects: ["calc", "fis", "ele"],
      title: "Vértice da Parábola (Máximo/Mínimo), MUV e Máxima Transferência de Potência",
      topic: "Otimização Quadrática",
      expr: "x_v = −b / (2a)   |   y_v = −Δ / (4a) = f(x_v)\nMUV: s(t) = s₀ + v₀t + ½at²\nPotência Máxima na Carga: R_L = R_s  ⇒  I_v = V_th / (2R_s),  P_máx = V_th² / (4R_s)",
      vars: [
        { sym: "x_v, y_v", desc: "Coordenada do ponto crítico e valor extremo (máximo se a < 0; mínimo se a > 0)" },
        { sym: "R_L = R_s", desc: "Condição de casamento de impedância resistiva para máxima potência na carga" }
      ],
      when: "Use x_v = −b/(2a) para achar o instante de altura máxima de um projétil ou a corrente que maximiza a potência entregue por uma fonte real sem precisar derivar."
    },

    /* ------------------------------ SEMANA 7 ------------------------------ */
    {
      id: "w7-exp-log",
      week: 7, sessions: [25, 26, 27], subjects: ["mod", "calc", "dig"],
      title: "Equações Exponenciais e Propriedades dos Logaritmos",
      topic: "Exponenciais & Logaritmos",
      expr: "log_b(x) = y  ⇔  bʸ = x   (x > 0, b > 0, b ≠ 1)\nlog(A · B) = log A + log B   |   log(A / B) = log A − log B\nlog(Aᵏ) = k · log A          |   log_b(A) = ln(A) / ln(b)",
      vars: [
        { sym: "ln(x)", desc: "Logaritmo natural na base e ≈ 2,71828 (ln(eˣ) = x e e^(ln x) = x)" },
        { sym: "n = ⌈log₂ N⌉", desc: "Número mínimo de bits para codificar N estados distintos (2ⁿ ≥ N)" }
      ],
      when: "Use logaritmos sempre que a incógnita estiver presa no expoente (como o tempo t em circuitos RC/RL ou o número de bits em sistemas digitais)."
    },
    {
      id: "w7-decibel",
      week: 7, sessions: [27], subjects: ["ele", "intro"],
      title: "Escala Logarítmica de Ganho em Decibéis (dB)",
      topic: "Telecomunicações & Filtros",
      expr: "Ganho de Potência: G_dB = 10 · log₁₀(P₂ / P₁)\nGanho de Tensão:   G_dB = 20 · log₁₀(V₂ / V₁)\nCascata em dB:     G_total(dB) = G₁(dB) + G₂(dB) + G₃(dB)",
      vars: [
        { sym: "10 vs. 20", desc: "Potência usa fator 10; Tensão e Corrente usam fator 20 (pois P ∝ V²)" },
        { sym: "−3 dB", desc: "Ponto de corte de meia potência (P₂/P₁ ≈ 0,5; V₂/V₁ ≈ 1/√2 ≈ 0,707)" }
      ],
      when: "Atenção ao fator: se a razão dada for de POTÊNCIA (W, mW), multiplique o log por 10; se for de TENSÃO (V), multiplique por 20."
    },
    {
      id: "w7-rc-transient",
      week: 7, sessions: [28, 46, 51, 52], subjects: ["ele", "calc", "fis"],
      title: "Transitório de Carga e Descarga de Capacitor (Circuito RC)",
      topic: "Transitórios de 1ª Ordem",
      expr: "Descarga: v(t) = V₀ · e^(−t / τ)\nCarga:    v(t) = V_f · (1 − e^(−t / τ))\nTempo p/ atingir v:  t = −τ · ln(1 − v / V_f)   (na carga)",
      vars: [
        { sym: "τ = R·C", desc: "Constante de tempo (em t = 1τ resta 36,8% na descarga ou atinge 63,2% na carga)" },
        { sym: "V₀, V_f", desc: "Tensão inicial e tensão final de regime permanente (t → ∞)" }
      ],
      when: "Para isolar o tempo t, primeiro passe V_f dividindo, isole o termo e^(−t/τ) de um lado e só então aplique ln() nos dois membros."
    },

    /* ------------------------------ SEMANA 8 ------------------------------ */
    {
      id: "w8-pyth-trig",
      week: 8, sessions: [29, 30, 31], subjects: ["geo", "fis", "ele"],
      title: "Teorema de Pitágoras, Razões no Triângulo Retângulo e Identidade Fundamental",
      topic: "Trigonometria no Triângulo",
      expr: "a² = b² + c²   |   sen²θ + cos²θ = 1\nsen θ = Oposto / Hipotenusa  |  cos θ = Adjacente / Hipotenusa  |  tg θ = Oposto / Adjacente",
      vars: [
        { sym: "30°, 45°, 60°", desc: "sen: 1/2, √2/2, √3/2  |  cos: √3/2, √2/2, 1/2  |  tg: √3/3, 1, √3" },
        { sym: " Ternas", desc: "(3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25) e seus múltiplos" }
      ],
      when: "Identifique primeiro quem é o cateto OPOSTO e quem é o ADJACENTE ao ângulo θ marcado antes de escolher entre seno e cosseno."
    },
    {
      id: "w8-force-incline",
      week: 8, sessions: [31, 32], subjects: ["fis", "geo"],
      title: "Decomposição de Forças & Plano Inclinado",
      topic: "Mecânica Vetorial",
      expr: "Eixos padrão (θ com +x):  Fₓ = F · cos θ,   Fᵧ = F · sen θ\nPlano Inclinado (θ com a horizontal):  P_x (desce) = m·g·sen θ,   P_y (normal) = m·g·cos θ",
      vars: [
        { sym: "P = m·g", desc: "Força peso vertical para baixo (N, com m em kg e g ≈ 9,8 ou 10 m/s²)" },
        { sym: "P_x, P_y", desc: "Componente paralela à rampa (sen θ) e perpendicular à rampa (cos θ)" }
      ],
      when: "Armadilha clássica: no plano inclinado os papéis trocam — a componente que puxa o bloco rampa abaixo é P·sen θ (teste mental: se θ = 0°, sen 0° = 0 e o bloco não escorrega)."
    },
    {
      id: "w8-power-triangle",
      week: 8, sessions: [31, 32, 36], subjects: ["ele"],
      title: "Triângulo de Potências em CA e Fator de Potência",
      topic: "Potência em Corrente Alternada",
      expr: "S = √(P² + Q²)   |   FP = cos φ = P / S   |   Q = P · tg φ = S · sen φ",
      vars: [
        { sym: "P", desc: "Potência Ativa que realiza trabalho útil (W ou kW)" },
        { sym: "Q", desc: "Potência Reativa trocada por indutores/capacitores (var ou kvar)" },
        { sym: "S", desc: "Potência Aparente total exigida da fonte (VA ou kVA)" },
        { sym: "FP = cos φ", desc: "Fator de potência adimensional (0 a 1)" }
      ],
      when: "Nunca some watts com var diretamente (P + Q é inválido): some em quadratura via Pitágoras S = √(P² + Q²)."
    },

    /* ------------------------------ SEMANA 9 ------------------------------ */
    {
      id: "w9-rad-sin",
      week: 9, sessions: [33, 34], subjects: ["ele", "fis", "calc"],
      title: "Conversão Graus ↔ Radianos, Arco e Senoide CA no Tempo",
      topic: "Sinais Senoidais CA",
      expr: "θ_rad = θ_graus · (π / 180°)   |   s = R · θ_rad\nv(t) = V_p · sen(ω·t + φ)      |   ω = 2π·f = 2π / T   |   V_rms = V_p / √2",
      vars: [
        { sym: "f, T", desc: "Frequência em hertz (Hz = 1/s) e período T = 1/f em segundos" },
        { sym: "ω", desc: "Velocidade/frequência angular em rad/s (p/ f = 60 Hz, ω = 120π ≈ 377 rad/s)" },
        { sym: "Δφ", desc: "Defasagem entre dois sinais: Δφ = 360° · (Δt / T)" }
      ],
      when: "Na fórmula do comprimento de arco s = R·θ e em derivadas de funções trigonométricas no Cálculo, o ângulo θ DEVE estar obrigatoriamente em radianos."
    },
    {
      id: "w9-trig-identities",
      week: 9, sessions: [35, 36], subjects: ["calc", "ele", "fis"],
      title: "Arco Duplo, Soma de Arcos, Lei dos Cossenos e Potência Média CA",
      topic: "Identidades & Fasores",
      expr: "sen(2θ) = 2·sen θ·cos θ   |   cos(2θ) = cos²θ − sen²θ\ncos(a ± b) = cos a·cos b ∓ sen a·sen b   (sinal central INVERTE!)\nLei dos Cossenos: c² = a² + b² − 2ab·cos θ\nSoma de 2 Fasores: V² = V₁² + V₂² + 2·V₁·V₂·cos(Δφ)\nPotência Média CA: P = ½ · V_p · I_p · cos φ = V_rms · I_rms · cos φ",
      vars: [
        { sym: "∓ no cos(a±b)", desc: "No cosseno da soma o sinal entre os produtos é MENOS" },
        { sym: "+ no paralelogramo", desc: "Ao somar dois vetores/fasores com diferença de fase Δφ, o termo 2V₁V₂cos(Δφ) é POSITIVO" }
      ],
      when: "Use a identidade do produto de cossenos para entender por que a potência instantânea CA oscila em 2ω em torno da potência média P = (Vp·Ip/2)·cos φ."
    },

    /* ------------------------------ SEMANA 10 ----------------------------- */
    {
      id: "w10-line-dist",
      week: 10, sessions: [37, 38], subjects: ["geo", "calc"],
      title: "Distância 2D, Ponto Médio, Equação da Reta e Distância Ponto-Reta",
      topic: "Geometria Analítica — Retas",
      expr: "d(A, B) = √[ (x₂ − x₁)² + (y₂ − y₁)² ]   |   M = ( (x₁+x₂)/2 , (y₁+y₂)/2 )\ny − y₀ = m·(x − x₀)   |   Paralelas: m₁ = m₂   |   Perpendiculares: m₂ = −1 / m₁\nd(P₀, reta) = |a·x₀ + b·y₀ + c| / √(a² + b²)",
      vars: [
        { sym: "m", desc: "Coeficiente angular m = Δy/Δx" },
        { sym: "ax + by + c = 0", desc: "Equação geral da reta (necessária para a fórmula da distância ponto-reta)" }
      ],
      when: "Para achar a reta perpendicular, inverta a fração do coeficiente angular e troque o sinal (m₂ = −1/m₁)."
    },
    {
      id: "w10-conics-polar",
      week: 10, sessions: [39, 40], subjects: ["geo", "ele"],
      title: "Circunferência, Elipse e Conversão Retangular ↔ Polar (Fasores)",
      topic: "Cônicas & Coordenadas Polares",
      expr: "Circunferência: (x − x_c)² + (y − y_c)² = R²\nElipse: (x²/a²) + (y²/b²) = 1,  com a² = b² + c² (distância focal = 2c)\nPolar → Retangular:  x = r · cos θ,   y = r · sen θ\nRetangular → Polar:  r = √(x² + y²),   θ = atan2(y, x)",
      vars: [
        { sym: "(x_c, y_c), R", desc: "Centro (sinal oposto ao de dentro do parêntese) e raio da circunferência" },
        { sym: "Z = R + jX = |Z|∠θ", desc: "Impedância complexa nas formas retangular (para somar) e polar (para multiplicar/dividir)" }
      ],
      when: "Ao converter (x, y) para polar, sempre verifique o quadrante dos sinais de x e y: se x < 0 (2º ou 3º quadrante), some ou subtraia 180° ao arco-tangente."
    },

    /* ------------------------------ SEMANA 11 ----------------------------- */
    {
      id: "w11-vec-dot-cross",
      week: 11, sessions: [41, 42, 43, 44], subjects: ["geo", "fis", "ele"],
      title: "Vetores 2D/3D, Versor, Produto Escalar e Produto Vetorial",
      topic: "Álgebra Vetorial",
      expr: "AB = B − A   |   |v| = √(vₓ² + vᵧ² + v_z²)   |   û = v / |v|\nProduto Escalar (número): u · v = uₓvₓ + uᵧvᵧ + u_zv_z = |u||v|cos θ  (u ⊥ v ⇔ u · v = 0)\nProduto Vetorial (vetor ⊥): u × v = ( uᵧv_z − u_zvᵧ , −(uₓv_z − u_zvₓ) , uₓvᵧ − uᵧvₓ )\nTrabalho: W = F · d   |   Força de Lorentz: F_mag = q · (v × B)",
      vars: [
        { sym: "u · v", desc: "Retorna um ESCALAR (nulo quando os vetores formam 90°)" },
        { sym: "u × v", desc: "Retorna um VETOR 3D ortogonal a u e a v (atenção ao sinal negativo na componente y/j!)" }
      ],
      when: "Após calcular u × v, faça sempre o teste de sanidade: o produto escalar de (u × v) com u deve dar exatamente ZERO."
    },

    /* ------------------------------ SEMANA 12 ----------------------------- */
    {
      id: "w12-precalc-poly",
      week: 12, sessions: [45, 46, 47, 48], subjects: ["calc", "mod", "ele"],
      title: "Domínio Real, Composta/Inversa, Teorema do Resto e Frações Parciais",
      topic: "Pré-Cálculo & Polinômios",
      expr: "Domínio: Denominador ≠ 0  |  Radicando par ≥ 0  |  Argumento de log > 0\nTeorema do Resto: Resto de P(x) ÷ (x − r) é P(r)  (se P(r) = 0, r é raiz → Briot-Ruffini)\nFrações Parciais (Heaviside): (m·s + n)/[(s − p)(s − q)] = A/(s − p) + B/(s − q)",
      vars: [
        { sym: "f⁻¹(y) = x", desc: "Função inversa: desfaz a operação de f (f(x) = y ⇔ x = f⁻¹(y))" },
        { sym: "A, B", desc: "Resíduos obtidos multiplicando pelo denominador comum e substituindo s = p e s = q" }
      ],
      when: "Na função composta (f ∘ g)(x) = f(g(x)), resolva sempre de dentro para fora: calcule primeiro g(x) e injete o resultado no lugar de x em f."
    },

    /* ------------------------------ SEMANA 13 ----------------------------- */
    {
      id: "w13-limits",
      week: 13, sessions: [49, 50, 51, 52], subjects: ["calc", "ele"],
      title: "Limites, Limites no Infinito, Limite Fundamental e Continuidade",
      topic: "Cálculo I — Limites",
      expr: "Indeterminação 0/0: fatorar (x − a) ou multiplicar pelo conjugado (√x − a)(√x + a)\nNo infinito (polinômios): lim_(x→∞) (a·xⁿ + …)/(b·xⁿ + …) = a / b  (mesmo grau)\nLimite Trigonométrico Fundamental: lim_(u→0) [ sen(u) / u ] = 1  ⇒  lim_(x→0) sen(ax)/(bx) = a/b\nContinuidade em x = a:  lim_(x→a⁻) f(x) = lim_(x→a⁺) f(x) = f(a)",
      vars: [
        { sym: "t → 0⁺ e t → ∞", desc: "Em circuitos RC: em t=0⁺ capacitor descarregado é curto-circuito; em t→∞ é circuito aberto" }
      ],
      when: "Teste SEMPRE a substituição direta primeiro. Só fatore ou racionalize se a substituição direta resultar na indeterminação 0/0 ou ∞/∞."
    },

    /* ------------------------------ SEMANA 14 ----------------------------- */
    {
      id: "w14-derivatives",
      week: 14, sessions: [53, 54, 55, 56], subjects: ["calc", "fis", "ele"],
      title: "Derivadas: Definição, Regra do Tombo, Produto, Quociente, Cadeia e Física/Circuitos",
      topic: "Cálculo I — Derivadas",
      expr: "f'(x) = lim_(h→0) [f(x+h) − f(x)]/h   |   Reta Tangente: y − f(x₀) = f'(x₀)·(x − x₀)\nRegra do Tombo: (xⁿ)' = n·xⁿ⁻¹        |   (e^(kx))' = k·e^(kx)   |   (ln x)' = 1/x\n(sen kx)' = k·cos(kx)                 |   (cos kx)' = −k·sen(kx)\nProduto: (u·v)' = u'v + u·v'          |   Quociente: (u/v)' = (u'v − u·v') / v²\nCadeia:  [f(g(x))]' = f'(g(x)) · g'(x)\nCinemática: v(t) = ds/dt,  a(t) = dv/dt   |   Circuitos: i_C = C·dv/dt,  v_L = L·di/dt",
      vars: [
        { sym: "f'(x₀)", desc: "Coeficiente angular (inclinação) da reta tangente ao gráfico em x = x₀" },
        { sym: "g'(x)", desc: "Derivada da função interna na Regra da Cadeia (nunca esqueça de multiplicar por ela!)" },
        { sym: "i_C, v_L", desc: "Corrente no capacitor (C em farads) e tensão no indutor (L em henries)" }
      ],
      when: "Na regra do quociente, a ordem do numerador é obrigatória (u'v − uv', pois há um sinal de menos). Em circuitos, converta mF/μF para F e mH para H antes de multiplicar pela derivada."
    }
  ];

  /* ==========================================================================
     FILTRAGEM & RENDERIZAÇÃO DE CARDS DE FÓRMULA
     ========================================================================== */
  function forSession(sessionId) {
    const sess = D.CURRICULUM[sessionId - 1];
    if (!sess) return FORMULAS.slice();
    // 1º: Fórmulas mapeadas diretamente para o ID da sessão
    // 2º: Demais fórmulas da mesma semana
    const exact = FORMULAS.filter(function (f) { return f.sessions.indexOf(sessionId) !== -1; });
    const sameWeek = FORMULAS.filter(function (f) { return f.week === sess.week && f.sessions.indexOf(sessionId) === -1; });
    return exact.concat(sameWeek);
  }

  function renderCard(f, activeSessionId) {
    const isDirect = activeSessionId && f.sessions.indexOf(activeSessionId) !== -1;
    const subjLabels = f.subjects.map(function (k) { return SUBJECT_MAP[k] || k; }).join(" · ");
    const exprLines = esc(f.expr).split("\n").map(function (line) {
      return '<div class="fm-expr-line">' + line + '</div>';
    }).join("");
    const varsHTML = f.vars.map(function (v) {
      return '<li><code class="mono fm-sym">' + esc(v.sym) + '</code><span>' + esc(v.desc) + '</span></li>';
    }).join("");

    return '<article class="card fm-card' + (isDirect ? " fm-highlight" : "") + '">' +
      '<div class="fm-card-top">' +
      '<span class="mono fm-badge">S' + U.pad(f.week) + ' · ' + esc(f.topic) + '</span>' +
      (isDirect ? '<span class="mono fm-context-pill">Fórmula desta Sessão</span>' : '<span class="small muted">' + esc(subjLabels) + '</span>') +
      '</div>' +
      '<h3 class="fm-title">' + esc(f.title) + '</h3>' +
      '<div class="fm-expr mono">' + exprLines + '</div>' +
      '<div class="fm-meta-grid">' +
      '<div class="fm-vars-box"><span class="fm-box-label mono">Legenda &amp; Unidades</span><ul class="fm-vars">' + varsHTML + '</ul></div>' +
      '<div class="fm-when-box"><span class="fm-box-label mono">Quando Usar &amp; Alerta TDAH</span><p>' + esc(f.when) + '</p></div>' +
      '</div>' +
      '</article>';
  }

  /* ==========================================================================
     GAVETA LATERAL (DRAWER) — ACESSO RÁPIDO SEM SAIR DO HIPERFOCO
     ========================================================================== */
  let drawerEl = null;
  let escHandler = null;

  function ensureDrawerDOM() {
    if (drawerEl && document.body.contains(drawerEl)) return drawerEl;
    drawerEl = document.createElement("div");
    drawerEl.id = "fm-drawer-backdrop";
    drawerEl.className = "fm-backdrop";
    drawerEl.setAttribute("hidden", "");
    drawerEl.innerHTML =
      '<aside class="fm-drawer" role="dialog" aria-modal="true" aria-labelledby="fm-dr-title">' +
      '<header class="fm-drawer-head">' +
      '<div><p class="eyebrow mono" id="fm-dr-eyebrow">CONSULTA RÁPIDA · SEM QUEBRAR O FOCO</p>' +
      '<h2 id="fm-dr-title">Fórmulas da Sessão</h2></div>' +
      '<button type="button" class="btn small-btn" id="fm-dr-close">Fechar (Esc)</button>' +
      '</header>' +
      '<div class="fm-drawer-controls">' +
      '<div class="seg" id="fm-dr-scope">' +
      '<button type="button" data-scope="session" class="active">Apenas desta Seção</button>' +
      '<button type="button" data-scope="all">Ver Todas (S01–S14)</button>' +
      '</div>' +
      '<input type="text" id="fm-dr-search" class="mono" placeholder="Filtrar fórmula, símbolo ou tópico (ex.: Req, dB, derivada, MMC)…" autocomplete="off" spellcheck="false">' +
      '</div>' +
      '<div class="fm-drawer-body" id="fm-dr-body"></div>' +
      '</aside>';
    document.body.appendChild(drawerEl);

    drawerEl.addEventListener("click", function (e) {
      if (e.target === drawerEl || e.target.closest("#fm-dr-close")) {
        closeDrawer();
      }
    });
    return drawerEl;
  }

  function openDrawer(sessionId) {
    const activeId = sessionId || (S.state.timer && S.state.timer.sessionId) || (S.nextSession() && S.nextSession().id) || 1;
    const sess = D.CURRICULUM[activeId - 1] || D.CURRICULUM[0];
    const el = ensureDrawerDOM();

    let scope = "session";
    let query = "";

    const eyebrow = el.querySelector("#fm-dr-eyebrow");
    const title = el.querySelector("#fm-dr-title");
    const scopeBox = el.querySelector("#fm-dr-scope");
    const searchInput = el.querySelector("#fm-dr-search");
    const body = el.querySelector("#fm-dr-body");

    eyebrow.textContent = "SEMANA " + U.pad(sess.week) + " · DIA " + sess.day + " · " + sess.furbSubject.toUpperCase();
    title.textContent = "Fórmulas: " + sess.title;
    searchInput.value = "";

    function paint() {
      Array.prototype.forEach.call(scopeBox.querySelectorAll("button"), function (b) {
        b.classList.toggle("active", b.dataset.scope === scope);
      });
      let list = scope === "session" ? forSession(sess.id) : FORMULAS.slice();
      const q = query.trim().toLowerCase();
      if (q) {
        list = list.filter(function (f) {
          const hay = (f.title + " " + f.topic + " " + f.expr + " " + f.when + " " + f.vars.map(function (v) { return v.sym + " " + v.desc; }).join(" ")).toLowerCase();
          return hay.indexOf(q) !== -1;
        });
      }
      if (!list.length) {
        body.innerHTML = '<div class="card"><p class="muted">Nenhuma fórmula encontrada neste filtro. Clique em "Ver Todas (S01–S14)" para buscar no currículo inteiro.</p></div>';
        return;
      }
      const note = scope === "session"
        ? '<p class="small muted fm-scope-note">Exibindo <strong>' + list.length + ' fórmulas essenciais</strong> para a Semana ' + sess.week + ' (' + esc(sess.weekTheme) + '). Zero ruído visual.</p>'
        : '<p class="small muted fm-scope-note">Exibindo <strong>' + list.length + ' fórmulas</strong> de todas as 14 semanas.</p>';
      body.innerHTML = note + '<div class="fm-list">' + list.map(function (f) { return renderCard(f, sess.id); }).join("") + '</div>';
    }

    scopeBox.onclick = function (e) {
      const b = e.target.closest("button[data-scope]");
      if (!b) return;
      scope = b.dataset.scope;
      paint();
    };
    searchInput.oninput = function () {
      query = searchInput.value;
      if (query.trim().length > 1 && scope === "session") {
        // Se nenhuma fórmula da sessão bater, mas houver no banco geral, avisa ou mantém claro
      }
      paint();
    };

    paint();
    el.removeAttribute("hidden");
    document.body.classList.add("fm-drawer-open");

    if (escHandler) document.removeEventListener("keydown", escHandler);
    escHandler = function (e) {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", escHandler);
  }

  function closeDrawer() {
    if (!drawerEl) return;
    drawerEl.setAttribute("hidden", "");
    document.body.classList.remove("fm-drawer-open");
    if (escHandler) {
      document.removeEventListener("keydown", escHandler);
      escHandler = null;
    }
  }

  /* ==========================================================================
     ABA PRINCIPAL "#/formulas" (VIEW COMPLETA CONTEXTUALIZADA)
     ========================================================================== */
  function mountView(root) {
    const timerSid = S.state.timer && S.state.timer.sessionId;
    const nextSess = S.nextSession();
    const activeSid = timerSid || (nextSess ? nextSess.id : 1);
    const activeSess = D.CURRICULUM[activeSid - 1] || D.CURRICULUM[0];

    let scope = "session";     // "session" (padrão neuro-adaptado) ou "all"
    let groupBy = "week";      // "week" ou "subject"
    let subjFilter = "all";    // "all" ou key da disciplina FURB
    let weekFilter = 0;        // 0 = todas ou 1..14
    let query = "";

    root.innerHTML =
      '<section class="view-formulas">' +
      '<header class="view-head">' +
      '<p class="eyebrow mono">PRONTUÁRIO MATEMÁTICO &amp; ENGENHARIA ELÉTRICA</p>' +
      '<h1>Fórmulas Prontas &amp; Contextualizadas</h1>' +
      '<p class="muted">Externalização de Memória Operacional (IMO 111): consulte expressões, unidades SI e condições de uso sem sobrecarga visual.</p>' +
      '</header>' +

      '<div class="card fm-toolbar">' +
      '<div class="fm-toolbar-top">' +
      '<div>' +
      '<span class="small muted mono">MODO DE FOCO (FILTRO DE RUÍDO)</span>' +
      '<div class="seg" id="fm-v-scope">' +
      '<button type="button" data-scope="session" class="active">Apenas da Seção Atual (S' + U.pad(activeSess.week) + ' · D' + activeSess.day + ')</button>' +
      '<button type="button" data-scope="all">Ver Todas as Fórmulas (14 Semanas)</button>' +
      '</div>' +
      '</div>' +
      '<div id="fm-v-group-wrap">' +
      '<span class="small muted mono">AGRUPAMENTO</span>' +
      '<div class="seg" id="fm-v-group">' +
      '<button type="button" data-group="week" class="active">Por Semana / Tópico</button>' +
      '<button type="button" data-group="subject">Por Disciplina FURB</button>' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="fm-toolbar-filters">' +
      '<input type="text" id="fm-v-search" class="mono" placeholder="Buscar fórmula, grandeza, unidade ou condição (ex.: Kirchhoff, Req, dB, RC, derivada)…" autocomplete="off" spellcheck="false">' +
      '<div class="fm-pills" id="fm-v-subjects">' +
      '<button type="button" class="fm-pill active" data-sub="all">Todas as Disciplinas</button>' +
      D.FURB_SUBJECTS.map(function (s) {
        return '<button type="button" class="fm-pill" data-sub="' + s.key + '">' + esc(s.name) + '</button>';
      }).join("") +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div id="fm-v-context-banner"></div>' +
      '<div id="fm-v-content"></div>' +
      '</section>';

    const $ = function (sel) { return root.querySelector(sel); };

    function renderContent() {
      Array.prototype.forEach.call(root.querySelectorAll("#fm-v-scope button"), function (b) {
        b.classList.toggle("active", b.dataset.scope === scope);
      });
      Array.prototype.forEach.call(root.querySelectorAll("#fm-v-group button"), function (b) {
        b.classList.toggle("active", b.dataset.group === groupBy);
      });
      Array.prototype.forEach.call(root.querySelectorAll("#fm-v-subjects .fm-pill"), function (b) {
        b.classList.toggle("active", b.dataset.sub === subjFilter);
      });
      $("#fm-v-group-wrap").style.opacity = scope === "session" ? "0.45" : "1";

      const banner = $("#fm-v-context-banner");
      if (scope === "session") {
        banner.innerHTML =
          '<div class="card fm-active-banner">' +
          '<div><span class="eyebrow mono">SEÇÃO ATIVA · SEMANA ' + U.pad(activeSess.week) + ' · DIA ' + activeSess.day + '</span>' +
          '<h2>' + esc(activeSess.title) + '</h2>' +
          '<p class="small muted">' + esc(activeSess.weekTheme) + ' — Destrava: ' + esc(activeSess.furbSubject) + '</p></div>' +
          '<div class="row">' +
          '<a class="btn primary small-btn" href="#/study/' + activeSess.id + '">Ir para a Sessão de Estudo</a>' +
          '<button type="button" class="btn ghost small-btn" id="fm-v-expand">Expandir Todas as 14 Semanas</button>' +
          '</div></div>';
        const expBtn = $("#fm-v-expand");
        if (expBtn) expBtn.onclick = function () { scope = "all"; renderContent(); };
      } else {
        banner.innerHTML = "";
      }

      const q = query.trim().toLowerCase();
      let pool = scope === "session" ? forSession(activeSess.id) : FORMULAS.slice();
      if (subjFilter !== "all") {
        pool = pool.filter(function (f) { return f.subjects.indexOf(subjFilter) !== -1; });
      }
      if (weekFilter > 0) {
        pool = pool.filter(function (f) { return f.week === weekFilter; });
      }
      if (q) {
        pool = pool.filter(function (f) {
          const hay = (f.title + " " + f.topic + " " + f.expr + " " + f.when + " " + f.vars.map(function (v) { return v.sym + " " + v.desc; }).join(" ")).toLowerCase();
          return hay.indexOf(q) !== -1;
        });
      }

      const content = $("#fm-v-content");
      if (!pool.length) {
        content.innerHTML = '<div class="card"><p class="muted">Nenhuma fórmula encontrada para o filtro selecionado. Experimente alternar para "Ver Todas as Fórmulas (14 Semanas)" ou limpar a busca.</p></div>';
        return;
      }

      if (scope === "session") {
        content.innerHTML = '<div class="fm-list">' + pool.map(function (f) { return renderCard(f, activeSess.id); }).join("") + '</div>';
        return;
      }

      // Modo "Ver Todas": agrupado por Semana ou por Disciplina da 1ª Fase da FURB
      if (groupBy === "week") {
        content.innerHTML = D.WEEKS.map(function (w) {
          const items = pool.filter(function (f) { return f.week === w.week; });
          if (!items.length) return "";
          return '<details class="week fm-group" open>' +
            '<summary><span class="mono wk-n">S' + U.pad(w.week) + '</span>' +
            '<span class="wk-title">' + esc(w.theme) + '</span>' +
            '<span class="wk-meta mono">' + items.length + (items.length === 1 ? " fórmula" : " fórmulas") + '</span></summary>' +
            '<p class="small muted wk-app">Aplicação: ' + esc(w.application) + '</p>' +
            '<div class="fm-list">' + items.map(function (f) { return renderCard(f, activeSess.id); }).join("") + '</div>' +
            '</details>';
        }).join("");
      } else {
        content.innerHTML = D.FURB_SUBJECTS.map(function (sub) {
          const items = pool.filter(function (f) { return f.subjects.indexOf(sub.key) !== -1; });
          if (!items.length) return "";
          return '<details class="week fm-group" open>' +
            '<summary><span class="mono wk-n">' + sub.hours + 'h</span>' +
            '<span class="wk-title">' + esc(sub.name) + '</span>' +
            '<span class="wk-meta mono">' + items.length + (items.length === 1 ? " fórmula" : " fórmulas") + '</span></summary>' +
            '<div class="fm-list" style="margin-top:.85rem">' + items.map(function (f) { return renderCard(f, activeSess.id); }).join("") + '</div>' +
            '</details>';
        }).join("");
      }
    }

    $("#fm-v-scope").addEventListener("click", function (e) {
      const b = e.target.closest("button[data-scope]");
      if (!b) return;
      scope = b.dataset.scope;
      renderContent();
    });
    $("#fm-v-group").addEventListener("click", function (e) {
      const b = e.target.closest("button[data-group]");
      if (!b) return;
      scope = "all";
      groupBy = b.dataset.group;
      renderContent();
    });
    $("#fm-v-subjects").addEventListener("click", function (e) {
      const b = e.target.closest("button[data-sub]");
      if (!b) return;
      subjFilter = b.dataset.sub;
      if (subjFilter !== "all" && scope === "session") scope = "all";
      renderContent();
    });
    $("#fm-v-search").addEventListener("input", function (e) {
      query = e.target.value;
      if (query.trim().length > 0 && scope === "session") {
        const hitInSession = forSession(activeSess.id).some(function (f) {
          const hay = (f.title + " " + f.topic + " " + f.expr + " " + f.when).toLowerCase();
          return hay.indexOf(query.trim().toLowerCase()) !== -1;
        });
        if (!hitInSession) scope = "all";
      }
      renderContent();
    });

    renderContent();
    return function () {};
  }

  NE.Formulas = {
    list: FORMULAS,
    forSession: forSession,
    renderCard: renderCard,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    mount: mountView
  };
})(window);
