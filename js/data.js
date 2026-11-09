/* ==========================================================================
   NeuroEng // Prep OS — Dados do currículo (14 semanas × 4 dias = 56 sessões)
   Cada sessão: id, week, day, durationMinutes, title, mathTopics,
   engineeringConnection, furbSubject, challengeProblem, completed (+ extras).
   ========================================================================== */
(function (global) {
  "use strict";

  const START_DATE = new Date(2027, 1, 15, 8, 0, 0); // 15/02/2027 08:00 (horário local)
  const MIN_MODE_MINUTES = 25;

  // Matérias da 1ª fase de Engenharia Elétrica — FURB
  const FURB_SUBJECTS = [
    { key: "calc",  name: "Cálculo Diferencial e Integral I", hours: 72 },
    { key: "fis",   name: "Física Geral e Experimental I",    hours: 72 },
    { key: "geo",   name: "Geometria Analítica",              hours: 54 },
    { key: "ele",   name: "Eletricidade Básica",              hours: 36 },
    { key: "dig",   name: "Eletrônica Digital I",             hours: 108 },
    { key: "mod",   name: "Módulos de Matemática",            hours: 36 },
    { key: "intro", name: "Introdução à Engenharia",          hours: 54 }
  ];

  const ERROR_TYPES = [
    { key: "sign",     label: "Sinal (+/−)",             long: "Erro de Sinal" },
    { key: "fraction", label: "Fração/MMC",              long: "Erro de Fração/MMC" },
    { key: "reading",  label: "Distração na Leitura",    long: "Leitura Rápida/Impulsiva" },
    { key: "skip",     label: "Pulei Etapa Mentalmente", long: "Pulei Passo Mentalmente" }
  ];

  const PHASES = [
    { key: 1, pct: 0.20, name: "Visão Espacial & Engenharia",        short: "Visão" },
    { key: 2, pct: 0.50, name: "Prática Deliberada & Externa",       short: "Prática" },
    { key: 3, pct: 0.20, name: "Desafio Dupla-Excepcionalidade",     short: "Desafio" },
    { key: 4, pct: 0.10, name: "Auditoria de Memória Operacional",   short: "Auditoria" }
  ];

  const WEEKS = [
    /* ------------------------------- SEMANA 1 ------------------------------- */
    {
      week: 1, minutes: 90,
      theme: "Aritmética, Frações, MMC/MDC e Operações com Sinais",
      application: "Associação de resistores série/paralelo e divisores de tensão (Eletricidade Básica).",
      days: [
        {
          title: "Aritmética Estrutural & Ordem das Operações",
          math: ["Ordem das operações (parênteses → potências → × ÷ → + −)", "Propriedades: comutativa, associativa e distributiva", "Divisibilidade e fatoração em números primos", "Estimativa e ordem de grandeza (sanity check)"],
          eng: "Toda fórmula de circuito é uma cadeia de operações. Errar a precedência em Req = R₁ + R₂·R₃/(R₂+R₃) muda o resultado do projeto inteiro — a ordem das operações é a gramática da Engenharia.",
          furb: "Módulos de Matemática · Introdução à Engenharia", keys: ["mod", "intro"],
          challenge: "Calcule Req = R₁ + (R₂·R₃)/(R₂+R₃) com R₁ = 10 Ω, R₂ = 30 Ω e R₃ = 60 Ω, escrevendo cada passagem em uma linha. Antes de calcular, estime a ordem de grandeza.",
          answer: "R₂·R₃/(R₂+R₃) = 1800/90 = 20 Ω → Req = 30 Ω."
        },
        {
          title: "Frações: Soma, Produto, Divisão e Simplificação",
          math: ["Frações equivalentes e simplificação", "Soma e subtração com denominadores diferentes", "Multiplicação e divisão (inverter e multiplicar)", "Frações complexas (fração de fração)"],
          eng: "Sem frações não existe resistência equivalente em paralelo: 1/Req = 1/R₁ + 1/R₂. Frações são a linguagem de divisores de tensão, ganhos e razões em todo circuito.",
          furb: "Eletricidade Básica · Módulos de Matemática", keys: ["ele", "mod"],
          challenge: "Três resistores de 12 Ω, 20 Ω e 30 Ω estão em paralelo. Calcule Req mostrando a soma das frações com denominador comum explícito.",
          answer: "1/12 + 1/20 + 1/30 = 5/60 + 3/60 + 2/60 = 10/60 = 1/6 → Req = 6 Ω."
        },
        {
          title: "MMC e MDC Aplicados",
          math: ["Decomposição em fatores primos", "MMC como denominador comum", "MDC e simplificação máxima", "Soma de frações com MMC explícito"],
          eng: "Sem MMC algébrico você não calcula a impedância equivalente de um circuito em paralelo nem resolve Transformadas de Laplace. O MMC também dá o instante em que sinais de períodos diferentes voltam a se alinhar.",
          furb: "Eletricidade Básica · Módulos de Matemática", keys: ["ele", "mod"],
          challenge: "(a) Dois sinais periódicos têm períodos de 12 ms e 18 ms. Em qual menor instante ambos reiniciam juntos? (b) Resistores de 18 Ω e 24 Ω em paralelo: calcule Req usando o MMC.",
          answer: "(a) MMC(12,18) = 36 ms. (b) MMC = 72 → 4/72 + 3/72 = 7/72 → Req = 72/7 ≈ 10,29 Ω."
        },
        {
          title: "Operações com Sinais & Divisor de Tensão",
          math: ["Regra de sinais (+, −, ×, ÷)", "Subtração como soma do oposto", "Sinais em frações e parênteses: −(a − b)", "Divisor de tensão: Vout = Vin·R₂/(R₁+R₂)"],
          eng: "Polaridade de tensões e sentido de correntes (Kirchhoff) dependem 100% de sinais. Um único sinal trocado inverte o sentido físico da corrente — e o divisor de tensão é o bloco básico de todo sensor.",
          furb: "Eletricidade Básica · Módulos de Matemática", keys: ["ele", "mod"],
          challenge: "Fonte de 12 V alimenta R₁ = 1 kΩ em série com R₂ = 3 kΩ. Calcule a tensão sobre R₂ e verifique que V₁ + V₂ = 12 V. Depois, inverta a polaridade da fonte e refaça as contas com sinais.",
          answer: "V₂ = 12·3k/4k = 9 V; V₁ = 3 V; soma = 12 V. Com a fonte invertida, todos os sinais trocam: V₂ = −9 V."
        }
      ]
    },
    /* ------------------------------- SEMANA 2 ------------------------------- */
    {
      week: 2, minutes: 90,
      theme: "Potenciação, Radiciação, Notação Científica e Racionalização",
      application: "Prefixos de engenharia (m, μ, n, k, M, G), Lei de Ohm e Lei de Coulomb.",
      days: [
        {
          title: "Potenciação & Potências de 10",
          math: ["Definição, expoente zero e expoente negativo", "Propriedades: produto, quociente e potência de potência", "Potências de 10 e seus prefixos", "Erros clássicos: (a+b)² ≠ a² + b²"],
          eng: "Os prefixos da Engenharia são potências de 10: m = 10⁻³, μ = 10⁻⁶, n = 10⁻⁹, k = 10³, M = 10⁶, G = 10⁹. Quem domina expoentes lê um datasheet sem calculadora.",
          furb: "Eletricidade Básica · Módulos de Matemática · Intro. à Engenharia", keys: ["ele", "mod", "intro"],
          challenge: "Um resistor de 4,7 kΩ é percorrido por 2,2 mA. Calcule a tensão em volts usando apenas potências de 10 (sem converter para decimais longos).",
          answer: "4,7×10³ · 2,2×10⁻³ = 10,34×10⁰ = 10,34 V."
        },
        {
          title: "Radiciação & Raízes Fracionárias",
          math: ["Raiz como potência fracionária: ⁿ√a = a^(1/n)", "Propriedades das raízes", "Simplificação: √72 = 6√2", "Erro clássico: √(a+b) ≠ √a + √b"],
          eng: "Valor eficaz Vrms = Vp/√2 e frequência de ressonância ω₀ = 1/√(LC) são raízes. Toda análise de CA depende de manipular √ com segurança.",
          furb: "Eletricidade Básica · Física Geral I", keys: ["ele", "fis"],
          challenge: "(a) Uma tensão de pico Vp = 311 V: qual o valor eficaz? (b) Um circuito LC com L = 1 mH e C = 1 μF: calcule ω₀ = 1/√(LC).",
          answer: "(a) 311/√2 ≈ 220 V. (b) LC = 10⁻⁹ → √ = 3,162×10⁻⁵ → ω₀ ≈ 31 623 rad/s."
        },
        {
          title: "Notação Científica & Prefixos SI",
          math: ["Forma a×10ⁿ (1 ≤ a < 10)", "Operações em notação científica", "Conversão de prefixos (p, n, μ, m, k, M, G)", "Algarismos significativos e ordem de grandeza"],
          eng: "Capacitores em nF e pF, resistores em kΩ e MΩ, frequências em GHz: a notação científica é o idioma da instrumentação e da Introdução à Engenharia.",
          furb: "Intro. à Engenharia · Física Geral I · Eletricidade Básica", keys: ["intro", "fis", "ele"],
          challenge: "Calcule a constante de tempo τ = R·C para R = 22 kΩ e C = 470 nF e expresse em milissegundos.",
          answer: "22×10³ · 470×10⁻⁹ = 10 340×10⁻⁶ s ≈ 10,34 ms."
        },
        {
          title: "Racionalização + Leis de Ohm e Coulomb",
          math: ["Racionalização: 1/√a e 1/(a+√b) com conjugado", "Lei de Ohm: V = I·R com prefixos", "Lei de Coulomb: F = k·q₁q₂/r²", "Análise dimensional (conferir unidades)"],
          eng: "Ohm e Coulomb são potências e razões em ação: F ∝ 1/r² explode ao dobrar a distância. Racionalizar expressões é pré-requisito de limites em Cálculo I.",
          furb: "Física Geral I · Eletricidade Básica", keys: ["fis", "ele"],
          challenge: "Duas cargas de 2 μC e 3 μC estão a 30 cm no vácuo (k = 9×10⁹ N·m²/C²). Calcule a força. Depois racionalize 6/(3−√3).",
          answer: "F = 9×10⁹·6×10⁻¹²/0,09 = 0,6 N. 6/(3−√3) = 6(3+√3)/6 = 3 + √3."
        }
      ]
    },
    /* ------------------------------- SEMANA 3 ------------------------------- */
    {
      week: 3, minutes: 95,
      theme: "Sistemas Numéricos (Binário, Octal, Hexadecimal), Conversões e Álgebra de Boole",
      application: "Aplicação direta em Eletrônica Digital I (108h da grade FURB).",
      days: [
        {
          title: "Sistema Posicional & Binário",
          math: ["Base 10 como soma de potências de 10", "Binário ↔ decimal", "Soma binária e overflow", "n bits = 2ⁿ estados"],
          eng: "Todo hardware digital representa informação como tensão alta/baixa. A faixa de n bits (2ⁿ) define a resolução de conversores A/D e o tamanho de memórias.",
          furb: "Eletrônica Digital I · Intro. à Engenharia", keys: ["dig", "intro"],
          challenge: "Um ADC de 10 bits mede de 0 a 5 V. Quantos níveis distintos existem e qual a resolução (V por passo)? Converta 1011 0110₂ para decimal.",
          answer: "2¹⁰ = 1024 níveis; 5/1024 ≈ 4,88 mV por passo. 10110110₂ = 128+32+16+4+2 = 182."
        },
        {
          title: "Octal, Hexadecimal & Conversões de Base",
          math: ["Agrupamento de bits (3 → octal, 4 → hexa)", "Hexadecimal ↔ decimal", "Divisões sucessivas", "Complemento de 2 (introdução)"],
          eng: "Endereços de memória, registradores de microcontroladores e cores são escritos em hexadecimal. Complemento de 2 é como o hardware representa números negativos.",
          furb: "Eletrônica Digital I", keys: ["dig"],
          challenge: "Converta 0xB7 para binário e decimal. Depois represente −45 em 8 bits (complemento de 2).",
          answer: "0xB7 = 1011 0111₂ = 183. +45 = 00101101 → inverte 11010010 → +1 = 11010011."
        },
        {
          title: "Álgebra de Boole: Portas & Tabelas-Verdade",
          math: ["Portas AND, OR, NOT, NAND, NOR, XOR", "Construção de tabelas-verdade", "Postulados e identidades básicas", "Da descrição verbal à expressão booleana"],
          eng: "Cada circuito integrado digital é uma expressão booleana em silício. Traduzir um requisito em S = f(A,B,C) é a habilidade central de Eletrônica Digital I.",
          furb: "Eletrônica Digital I", keys: ["dig"],
          challenge: "Um alarme dispara (S = 1) se o sensor de porta A = 1 E (o sensor de janela B = 1 OU o modo noite C = 1). Escreva S e monte a tabela-verdade de 8 linhas.",
          answer: "S = A·(B + C). S = 1 apenas nas linhas (A,B,C) = 110, 101 e 111."
        },
        {
          title: "De Morgan & Simplificação Booleana",
          math: ["Teoremas de De Morgan", "Absorção e distributiva", "Simplificação algébrica em etapas", "Mapa de Karnaugh de 2 variáveis (intro)"],
          eng: "Simplificar uma expressão significa menos portas, menos área, menos energia e menos custo. De Morgan permite implementar qualquer lógica só com NAND.",
          furb: "Eletrônica Digital I", keys: ["dig"],
          challenge: "Simplifique S = A·B + A·B̄ + Ā·B. Depois escreva a versão final usando apenas portas NAND.",
          answer: "A(B + B̄) + ĀB = A + ĀB = A + B. Com NAND: S = NAND(Ā, B̄) = ¬(Ā·B̄)."
        }
      ]
    },
    /* ------------------------------- SEMANA 4 ------------------------------- */
    {
      week: 4, minutes: 100,
      theme: "Produtos Notáveis, Fatoração e Frações Algébricas",
      application: "Simplificação de equações para Limites em Cálculo I.",
      days: [
        {
          title: "Produtos Notáveis",
          math: ["(a+b)², (a−b)² e (a+b)(a−b)", "(a+b)³ e (a−b)³", "Expandir vs. reconhecer padrões", "Quadrado da soma de três termos"],
          eng: "Ao calcular a variação de P = V² quando V muda para V + ΔV surge (V+ΔV)² = V² + 2VΔV + ΔV². Esse padrão é exatamente o primeiro passo da definição de derivada.",
          furb: "Cálculo I · Módulos de Matemática", keys: ["calc", "mod"],
          challenge: "Calcule [(x+h)² − x²]/h e simplifique. O que sobra quando h fica muito pequeno?",
          answer: "(x² + 2xh + h² − x²)/h = 2x + h → 2x quando h → 0."
        },
        {
          title: "Fatoração I: Evidência e Agrupamento",
          math: ["Fator comum em evidência", "Fatoração por agrupamento", "Fatoração de potências", "Verificação distribuindo de volta"],
          eng: "Potência total dissipada em resistores em série: P = I²R₁ + I²R₂ + I²R₃ = I²(R₁+R₂+R₃). Colocar em evidência revela a estrutura física escondida na expressão.",
          furb: "Cálculo I · Eletricidade Básica", keys: ["calc", "ele"],
          challenge: "(a) Fatore P = I²R₁ + I²R₂ + I²R₃. (b) Fatore ax + ay + bx + by. (c) Fatore 6x³ − 9x² + 3x.",
          answer: "(a) I²(R₁+R₂+R₃). (b) (a+b)(x+y). (c) 3x(2x² − 3x + 1)."
        },
        {
          title: "Fatoração II: Trinômios e Diferença de Quadrados",
          math: ["Trinômio quadrado perfeito", "Trinômio x² + Sx + P (soma e produto)", "Diferença de quadrados", "Soma e diferença de cubos"],
          eng: "Fatorar polinômios é achar as raízes de equações características — é assim que se descobrem os polos e zeros de circuitos e a estabilidade de sistemas.",
          furb: "Cálculo I · Módulos de Matemática", keys: ["calc", "mod"],
          challenge: "Fatore: (a) x² − 5x + 6; (b) x² − 9; (c) 4x² − 12x + 9; (d) x³ − 8.",
          answer: "(a) (x−2)(x−3). (b) (x−3)(x+3). (c) (2x−3)². (d) (x−2)(x²+2x+4)."
        },
        {
          title: "Frações Algébricas & Preparação para Limites",
          math: ["Domínio: denominador ≠ 0", "Simplificação por fatoração", "Soma de frações algébricas (MMC de polinômios)", "Reconhecer a indeterminação 0/0"],
          eng: "Em Cálculo I, quase todo limite 0/0 se resolve fatorando e simplificando. Aqui você treina o músculo que vai usar na Semana 13 e em toda a graduação.",
          furb: "Cálculo Diferencial e Integral I", keys: ["calc"],
          challenge: "(a) Simplifique (x²−9)/(x−3) e diga o valor ao qual a expressão se aproxima quando x → 3. (b) Simplifique (x²−x−6)/(x²−4).",
          answer: "(a) x + 3 → 6. (b) (x−3)(x+2)/((x−2)(x+2)) = (x−3)/(x−2), com x ≠ ±2."
        }
      ]
    },
    /* ------------------------------- SEMANA 5 ------------------------------- */
    {
      week: 5, minutes: 105,
      theme: "Equações de 1º Grau, Inequações, Valor Absoluto e Sistemas Lineares 2×2 e 3×3",
      application: "Leis de Kirchhoff dos Nós e das Malhas.",
      days: [
        {
          title: "Equações de 1º Grau & Isolamento de Variável",
          math: ["Princípio da balança", "Isolar variável literal em fórmulas", "Equações com frações", "Verificação por substituição"],
          eng: "Projetar é isolar: dada a tensão desejada, qual resistor escolho? Isolar R₂ no divisor de tensão é rotina de projeto de qualquer circuito de sensor.",
          furb: "Eletricidade Básica · Módulos de Matemática", keys: ["ele", "mod"],
          challenge: "No divisor Vout = Vs·R₂/(R₁+R₂), isole R₂. Com Vs = 10 V, R₁ = 2 kΩ e Vout desejada = 4 V, ache R₂ e confira por substituição.",
          answer: "R₂ = Vout·R₁/(Vs − Vout) = 4·2000/6 ≈ 1333 Ω. Confere: 10·1333/3333 ≈ 4 V."
        },
        {
          title: "Inequações & Valor Absoluto",
          math: ["Inequações de 1º grau (inverte ao multiplicar por negativo)", "Intervalos e notação", "|x| = a, |x| < a, |x| > a", "Tolerâncias como módulo"],
          eng: "Tolerância de resistores (±5%) e margem de ruído em lógica digital são desigualdades com módulo: |R − R₀| ≤ 0,05·R₀.",
          furb: "Módulos de Matemática · Cálculo I · Eletricidade Básica", keys: ["mod", "calc", "ele"],
          challenge: "(a) Um resistor de 1 kΩ ±5%: escreva a faixa de valores via |R − 1000| ≤ 50. (b) Resolva |2x − 3| < 7. (c) Resolva 3 − 2x > 9.",
          answer: "(a) 950 ≤ R ≤ 1050 Ω. (b) −2 < x < 5. (c) x < −3."
        },
        {
          title: "Sistemas 2×2: Substituição e Escalonamento",
          math: ["Método da substituição", "Método da adição/escalonamento", "Classificação: SPD, SPI, SI", "Interpretação geométrica: retas se cruzando"],
          eng: "Duas correntes desconhecidas, duas equações: é o padrão de análise de malhas. Geometricamente, a solução é o ponto onde duas retas se cruzam (Geometria Analítica).",
          furb: "Geometria Analítica · Eletricidade Básica · Módulos de Matemática", keys: ["geo", "ele", "mod"],
          challenge: "Resolva 2x + 3y = 12 e x − y = 1 por substituição e por escalonamento. Interprete o resultado como interseção de duas retas.",
          answer: "x = 3, y = 2. Ponto (3, 2) é onde as retas se cruzam."
        },
        {
          title: "Sistemas 3×3 & Leis de Kirchhoff",
          math: ["Escalonamento (Gauss) 3×3", "LKT: soma das tensões na malha = 0", "LKC: soma das correntes no nó = 0", "Montar o sistema a partir do circuito"],
          eng: "Kirchhoff transforma qualquer circuito em um sistema linear. Resolver o sistema é resolver o circuito — é a base de simuladores como SPICE.",
          furb: "Eletricidade Básica · Geometria Analítica", keys: ["ele", "geo"],
          challenge: "Duas malhas compartilham um resistor de 4 Ω. Malha 1: fonte 10 V, 2 Ω e o 4 Ω comum. Malha 2: 4 Ω privado e o 4 Ω comum. Monte o sistema (6I₁ − 4I₂ = 10; −4I₁ + 8I₂ = 0), resolva e ache a corrente e a tensão no resistor comum.",
          answer: "I₁ = 2,5 A, I₂ = 1,25 A. Corrente no ramo comum = I₁ − I₂ = 1,25 A; tensão = 4·1,25 = 5 V."
        }
      ]
    },
    /* ------------------------------- SEMANA 6 ------------------------------- */
    {
      week: 6, minutes: 110,
      theme: "Funções de 1º e 2º Grau, Parábolas, Estudo de Sinal e Raízes",
      application: "Cinemática MRU/MRUV e potência máxima transferida em circuitos.",
      days: [
        {
          title: "Função Afim: Reta e Gráfico",
          math: ["f(x) = ax + b: coeficientes angular e linear", "Raiz, crescimento e decrescimento", "Construir a reta por dois pontos", "Modelar dados experimentais"],
          eng: "V = R·I é uma função linear e s = s₀ + v·t é o MRU. A inclinação da reta carrega o significado físico (resistência, velocidade).",
          furb: "Física Geral I · Módulos de Matemática · Geometria Analítica", keys: ["fis", "mod", "geo"],
          challenge: "(a) Um móvel segue s = 5 + 3t (m, s). Quando alcança 50 m? (b) Medições de um resistor: (0 mA, 0 V) e (2 mA, 4 V). Ache a equação V(I) e o valor de R.",
          answer: "(a) t = 15 s. (b) V = 2000·I → R = 2 kΩ."
        },
        {
          title: "Função Quadrática: Parábola, Vértice e Raízes",
          math: ["Fórmula de Bhaskara e discriminante Δ", "Soma e produto das raízes", "Vértice: xv = −b/2a, yv = −Δ/4a", "Concavidade e gráfico"],
          eng: "O MRUV (s = s₀ + v₀t + ½at²) é uma parábola. O vértice responde \"quando e onde atinge o máximo?\" — a mesma pergunta que aparece em otimização de circuitos.",
          furb: "Física Geral I · Cálculo I", keys: ["fis", "calc"],
          challenge: "Uma bola é lançada com h(t) = 20t − 5t² (m, s). Ache o tempo de voo, o instante e o valor da altura máxima.",
          answer: "Raízes t = 0 e t = 4 s. Vértice t = 2 s, h = 20 m."
        },
        {
          title: "Estudo de Sinal & Inequações Quadráticas",
          math: ["Sinal da função afim", "Sinal da função quadrática", "Inequações produto e quociente", "Quadro de sinais"],
          eng: "Saber em que intervalo uma grandeza é positiva ou negativa define regiões de operação: quando um ganho amplifica, quando uma corrente muda de sentido, quando um sistema é estável.",
          furb: "Cálculo I · Módulos de Matemática", keys: ["calc", "mod"],
          challenge: "(a) Resolva x² − 6x + 8 < 0. (b) Resolva (x − 1)/(x + 2) ≥ 0 com quadro de sinais.",
          answer: "(a) 2 < x < 4. (b) x < −2 ou x ≥ 1 (x = −2 excluído)."
        },
        {
          title: "Potência Máxima Transferida (Modelagem Quadrática)",
          math: ["Modelar P em função da corrente: P = V·I − Rs·I²", "Vértice como máximo", "Voltar da variável I para a carga RL", "Interpretação física do resultado"],
          eng: "Uma fonte real tem resistência interna Rs. A potência entregue à carga é uma parábola invertida: o máximo ocorre quando RL = Rs — resultado central em áudio, RF e energia.",
          furb: "Eletricidade Básica · Física Geral I", keys: ["ele", "fis"],
          challenge: "Fonte de 12 V com Rs = 4 Ω. A potência na carga é P(I) = 12·I − 4·I². Ache I que maximiza P, a potência máxima e o valor de RL correspondente.",
          answer: "I = 12/(2·4) = 1,5 A; Pmax = 18 − 9 = 9 W; RL = (12 − 4·1,5)/1,5 = 4 Ω = Rs."
        }
      ]
    },
    /* ------------------------------- SEMANA 7 ------------------------------- */
    {
      week: 7, minutes: 115,
      theme: "Funções Exponenciais e Logarítmicas (ln, log₁₀ e propriedades)",
      application: "Transitórios de carga/descarga de capacitores v(t) = V₀·e^(−t/RC) e Decibéis.",
      days: [
        {
          title: "Funções Exponenciais",
          math: ["aˣ: crescimento e decaimento", "O número e e o gráfico de eˣ", "Equações exponenciais simples", "Constante de tempo τ"],
          eng: "Descarga de capacitor, decaimento radioativo, carga de bateria e amortecimento mecânico seguem e^(−t/τ). Entender a curva é entender como a natureza \"esquece\" um estado inicial.",
          furb: "Cálculo I · Eletricidade Básica", keys: ["calc", "ele"],
          challenge: "Para v(t) = 10·e^(−t/τ), calcule v em t = τ, 2τ, 3τ e 5τ. Em que instante o sinal é considerado praticamente extinto?",
          answer: "3,68 V; 1,35 V; 0,50 V; 0,067 V. Após ≈ 5τ (< 1%)."
        },
        {
          title: "Logaritmos: Definição e Propriedades",
          math: ["logᵦ a como expoente", "Log de produto, quociente e potência", "Mudança de base: log₁₀ e ln", "Resolver aˣ = b com logaritmos"],
          eng: "O logaritmo é o inverso da exponencial: é a ferramenta para descobrir \"quanto tempo leva\" e para comprimir escalas gigantes (dB, pH, Richter).",
          furb: "Cálculo I · Módulos de Matemática", keys: ["calc", "mod"],
          challenge: "(a) Resolva 5·e^(−2t) = 1. (b) Resolva 2ˣ = 1000. (c) Simplifique ln(e³) + log₁₀(1000).",
          answer: "(a) t = ln5/2 ≈ 0,805. (b) x = log1000/log2 ≈ 9,97. (c) 3 + 3 = 6."
        },
        {
          title: "Carga e Descarga de Capacitores",
          math: ["τ = R·C", "Descarga: v = V₀·e^(−t/RC)", "Carga: v = Vs(1 − e^(−t/RC))", "Isolar t usando ln"],
          eng: "Todo temporizador, filtro e debounce de botão usa a curva RC. Isolar t com ln é como se dimensiona o tempo de um circuito real.",
          furb: "Eletricidade Básica · Física Geral I · Cálculo I", keys: ["ele", "fis", "calc"],
          challenge: "R = 10 kΩ, C = 100 μF, capacitor inicialmente em V₀ = 9 V descarregando. Calcule τ e o tempo para a tensão cair a 1 V.",
          answer: "τ = 10⁴·10⁻⁴ = 1 s; 1 = 9e^(−t) → t = ln 9 ≈ 2,20 s."
        },
        {
          title: "Decibéis",
          math: ["dB = 10·log(P₂/P₁)", "dB = 20·log(V₂/V₁)", "Valores de referência: 3 dB ≈ 2×, 20 dB = 10×", "dBm e conversões"],
          eng: "Ganho de amplificadores, atenuação de cabos e resposta de filtros são expressos em dB. Multiplicações viram somas — o que torna possível projetar cascatas de estágios de cabeça (ou melhor, no papel).",
          furb: "Eletricidade Básica · Intro. à Engenharia · Módulos de Matemática", keys: ["ele", "intro", "mod"],
          challenge: "(a) Um amplificador leva 1 V a 10 V: ganho em dB? (b) A potência cai pela metade: quantos dB? (c) Ganho de tensão de 40 dB equivale a quantas vezes?",
          answer: "(a) 20·log10 = 20 dB. (b) 10·log(0,5) ≈ −3,01 dB. (c) 10²= 100×."
        }
      ]
    },
    /* ------------------------------- SEMANA 8 ------------------------------- */
    {
      week: 8, minutes: 120,
      theme: "Geometria Plana, Pitágoras, Semelhança de Triângulos e Trigonometria no Triângulo Retângulo",
      application: "Decomposição de forças em Física Geral I e Triângulo de Potências.",
      days: [
        {
          title: "Geometria Plana: Áreas, Perímetros e Ângulos",
          math: ["Ângulos: paralelas e transversal", "Soma dos ângulos internos", "Áreas: triângulo, círculo, trapézio", "Comprimento da circunferência"],
          eng: "Resistência de um fio depende da área da seção (A = πd²/4); capacitância depende da área das placas (C = εA/d). Geometria plana vira número no projeto.",
          furb: "Eletricidade Básica · Geometria Analítica · Intro. à Engenharia", keys: ["ele", "geo", "intro"],
          challenge: "Fio de cobre (ρ = 1,7×10⁻⁸ Ω·m) com d = 2 mm e L = 100 m. Calcule a área da seção e a resistência R = ρL/A.",
          answer: "A = π·(10⁻³)² ≈ 3,14×10⁻⁶ m²; R ≈ 0,54 Ω."
        },
        {
          title: "Pitágoras & Semelhança de Triângulos",
          math: ["Teorema de Pitágoras: a² + b² = c²", "Ternas pitagóricas", "Semelhança e razão de proporcionalidade", "Teorema de Tales"],
          eng: "O módulo da impedância é Pitágoras: |Z| = √(R² + X²). Semelhança de triângulos mede alturas e distâncias sem tocar no objeto — base de topografia e óptica.",
          furb: "Geometria Analítica · Física Geral I · Módulos de Matemática", keys: ["geo", "fis", "mod"],
          challenge: "(a) Escada de 5 m com base a 3 m da parede: qual a altura atingida? (b) Poste de 2 m projeta sombra de 1,5 m; no mesmo instante uma árvore projeta 9 m. Qual a altura? (c) R = 30 Ω e X = 40 Ω em série: |Z|?",
          answer: "(a) 4 m. (b) 12 m. (c) |Z| = 50 Ω."
        },
        {
          title: "Trigonometria no Triângulo Retângulo",
          math: ["sen, cos, tg (SOH-CAH-TOA)", "Ângulos notáveis: 30°, 45°, 60°", "Funções inversas: arcsen, arccos, arctg", "Relação fundamental: sen² + cos² = 1"],
          eng: "Sempre que uma grandeza vetorial tem direção inclinada (força, campo, fasor), seno e cosseno separam a parte útil da parte perdida.",
          furb: "Física Geral I · Geometria Analítica", keys: ["fis", "geo"],
          challenge: "Um cabo de 20 m sustenta um poste com inclinação de 37° em relação ao solo (sen 37° ≈ 0,6; cos 37° ≈ 0,8). Qual a altura de fixação e a distância horizontal?",
          answer: "Altura = 20·0,6 = 12 m; distância = 20·0,8 = 16 m."
        },
        {
          title: "Decomposição de Forças & Triângulo de Potências",
          math: ["Componentes Fx = F·cosθ e Fy = F·senθ", "Plano inclinado: P·senθ e P·cosθ", "Triângulo de potências: S² = P² + Q²", "Fator de potência: cosφ = P/S"],
          eng: "Mesma matemática, dois mundos: forças em Física I e potência ativa/reativa em Circuitos. O ângulo φ entre P e S diz quanta potência realmente trabalha.",
          furb: "Física Geral I · Eletricidade Básica", keys: ["fis", "ele"],
          challenge: "(a) Bloco de 10 kg (g = 10 m/s²) em plano inclinado de 30° sem atrito: componente da força peso ao longo do plano? (b) Carga com P = 800 W e Q = 600 var: S e fator de potência?",
          answer: "(a) 100·sen30° = 50 N. (b) S = 1000 VA; FP = 0,8."
        }
      ]
    },
    /* ------------------------------- SEMANA 9 ------------------------------- */
    {
      week: 9, minutes: 125,
      theme: "Ciclo Trigonométrico, Radianos, Funções Senoides A·sen(ωt + θ) e Identidades",
      application: "Corrente alternada, frequência angular e defasagem.",
      days: [
        {
          title: "Ciclo Trigonométrico & Radianos",
          math: ["Círculo unitário e quadrantes", "Graus ↔ radianos (π rad = 180°)", "Sinais de seno e cosseno por quadrante", "Redução ao 1º quadrante"],
          eng: "Ângulos de fase em CA são medidos em radianos. O ciclo trigonométrico é o \"relógio\" de qualquer sinal periódico: um giro completo = 2π = um período.",
          furb: "Cálculo I · Módulos de Matemática · Eletricidade Básica", keys: ["calc", "mod", "ele"],
          challenge: "(a) Converta 30°, 45°, 90° e 270° para radianos. (b) Ache sen e cos de 150° e de 225° usando redução ao 1º quadrante.",
          answer: "(a) π/6, π/4, π/2, 3π/2. (b) 150°: sen = 1/2, cos = −√3/2. 225°: sen = cos = −√2/2."
        },
        {
          title: "Senoides: A·sen(ωt + θ)",
          math: ["Amplitude A", "Período T = 2π/ω e frequência f = 1/T", "ω = 2πf (frequência angular)", "Fase θ como deslocamento no tempo"],
          eng: "A tensão da tomada é v(t) = Vp·sen(ωt). Cada parâmetro da senoide tem um significado físico mensurável no osciloscópio.",
          furb: "Eletricidade Básica · Física Geral I", keys: ["ele", "fis"],
          challenge: "Rede de 60 Hz com pico de 311 V. Escreva v(t), ache ω e T e calcule v em t = 2 ms.",
          answer: "ω = 2π·60 ≈ 377 rad/s; T ≈ 16,67 ms; v(2 ms) = 311·sen(0,754) ≈ 213 V."
        },
        {
          title: "Identidades Trigonométricas",
          math: ["sen² + cos² = 1", "Seno e cosseno da soma de arcos", "Arco duplo: sen2x e cos2x", "cos x = sen(x + π/2)"],
          eng: "A potência instantânea em CA contém sen²(ωt). A identidade cos2x = 1 − 2sen²x mostra que sua média vale ½ — origem do fator 1/2 em potência média e do valor RMS.",
          furb: "Cálculo I · Eletricidade Básica", keys: ["calc", "ele"],
          challenge: "(a) Mostre que sen(ωt + π/2) = cos(ωt). (b) Simplifique (sen x + cos x)². (c) Use cos2x = 1 − 2sen²x para mostrar que o valor médio de sen²x é ½.",
          answer: "(b) 1 + sen2x. (c) sen²x = (1 − cos2x)/2; a média de cos2x é 0 → média = ½."
        },
        {
          title: "Corrente Alternada, Frequência Angular & Defasagem",
          math: ["Defasagem entre tensão e corrente", "Adiantamento e atraso", "Fasor como seta girante", "Conversão fase ↔ tempo"],
          eng: "Em circuitos indutivos a corrente atrasa, em capacitivos ela adianta. A defasagem determina o fator de potência — e o custo de energia de uma indústria.",
          furb: "Eletricidade Básica · Física Geral I", keys: ["ele", "fis"],
          challenge: "v(t) = 170·sen(377t) e i(t) = 10·sen(377t − 60°). Quem está adiantada? Qual o atraso em milissegundos (f = 60 Hz)?",
          answer: "A tensão está adiantada 60° (corrente atrasada). Δt = (60/360)·16,67 ms ≈ 2,78 ms."
        }
      ]
    },
    /* ------------------------------- SEMANA 10 ------------------------------ */
    {
      week: 10, minutes: 130,
      theme: "Geometria Analítica no Plano: Distância, Reta, Coeficiente Angular, Circunferência e Cônicas",
      application: "Geometria Analítica FURB e retas tangentes.",
      days: [
        {
          title: "Plano Cartesiano, Distância e Ponto Médio",
          math: ["Coordenadas no plano", "Distância entre dois pontos", "Ponto médio e baricentro", "Condição de alinhamento de três pontos"],
          eng: "Toda trajetória, posição de robô e layout de PCB vive em coordenadas. A distância entre pontos é Pitágoras com coordenadas.",
          furb: "Geometria Analítica · Física Geral I", keys: ["geo", "fis"],
          challenge: "Dados A(1, 2) e B(7, 10): calcule a distância AB e o ponto médio M. Verifique se A, M e B estão alinhados.",
          answer: "d = √(36+64) = 10; M = (4, 6); sim, M pertence ao segmento AB."
        },
        {
          title: "Equação da Reta & Coeficiente Angular",
          math: ["m = Δy/Δx", "Forma ponto-inclinação e forma geral", "Paralelas e perpendiculares (m₁·m₂ = −1)", "Distância de ponto a reta"],
          eng: "O coeficiente angular é a taxa de variação — o conceito que vira derivada em Cálculo I. Reta de carga de transistor e curva I-V linear são retas.",
          furb: "Geometria Analítica · Cálculo I", keys: ["geo", "calc"],
          challenge: "Para P(2, 3) e Q(6, 11): equação da reta PQ, a perpendicular passando pela origem e a distância da origem à reta PQ.",
          answer: "m = 2 → y = 2x − 1. Perpendicular: y = −x/2. Distância = |−1|/√5 ≈ 0,447."
        },
        {
          title: "Circunferência",
          math: ["(x − a)² + (y − b)² = r²", "Equação geral e completar quadrados", "Posição de ponto em relação à circunferência", "Interseção reta × circunferência"],
          eng: "A ponta do fasor, uma roda e uma órbita descrevem círculos. Completar quadrados (Semana 4) volta aqui como ferramenta de leitura geométrica.",
          furb: "Geometria Analítica · Física Geral I", keys: ["geo", "fis"],
          challenge: "Para x² + y² − 6x + 4y − 12 = 0, ache o centro e o raio e verifique se o ponto (0, 2) pertence à circunferência.",
          answer: "(x−3)² + (y+2)² = 25 → centro (3, −2), r = 5. (0,2): 9 + 16 = 25 → pertence."
        },
        {
          title: "Cônicas & Retas Tangentes",
          math: ["Elipse, parábola e hipérbole (visão geral)", "Foco e diretriz da parábola", "Tangente à circunferência (⊥ ao raio)", "Inclinação da tangente em uma curva (prévia)"],
          eng: "Antenas parabólicas concentram sinal no foco; órbitas são elipses. A reta tangente aproxima uma curva localmente — a ideia-mãe da derivada.",
          furb: "Geometria Analítica · Cálculo I", keys: ["geo", "calc"],
          challenge: "(a) Tangente à circunferência x² + y² = 25 no ponto (3, 4). (b) Para y = x² no ponto (1, 1), qual a inclinação da tangente (estime com pontos próximos)?",
          answer: "(a) Raio tem m = 4/3 → tangente m = −3/4: 3x + 4y = 25. (b) Inclinação = 2."
        }
      ]
    },
    /* ------------------------------- SEMANA 11 ------------------------------ */
    {
      week: 11, minutes: 135,
      theme: "Vetores em ℝ² e ℝ³: Módulo, Versor, Soma, Produto Escalar e Produto Vetorial",
      application: "Geometria Analítica e Física I — Trabalho e Torque.",
      days: [
        {
          title: "Vetores: Componentes, Módulo e Versor",
          math: ["Componentes e notação i, j, k", "Módulo |v| = √(x² + y² + z²)", "Versor v/|v|", "Vetor definido por dois pontos"],
          eng: "Forças, velocidades, campos elétricos e magnéticos são vetores. O versor isola a direção, o módulo isola a intensidade.",
          furb: "Geometria Analítica · Física Geral I", keys: ["geo", "fis"],
          challenge: "Para v = (3, −4, 12), calcule |v| e o versor. Qual o vetor de A(1,1,1) até B(4,5,13)?",
          answer: "|v| = 13; versor = (3/13, −4/13, 12/13). AB = (3, 4, 12), |AB| = 13."
        },
        {
          title: "Soma Vetorial & Combinação Linear",
          math: ["Soma por componentes e paralelogramo", "Subtração e multiplicação por escalar", "Vetores paralelos", "Equilíbrio: ΣF = 0"],
          eng: "Equilíbrio de estruturas e superposição de campos usam soma vetorial. O Princípio da Superposição de circuitos lineares é a mesma ideia.",
          furb: "Física Geral I · Geometria Analítica", keys: ["fis", "geo"],
          challenge: "Três forças atuam em um ponto em equilíbrio: F₁ = (3, 4) N e F₂ = (−5, 2) N. Ache F₃ e seu módulo.",
          answer: "F₃ = −(F₁ + F₂) = (2, −6) N; |F₃| = √40 ≈ 6,32 N."
        },
        {
          title: "Produto Escalar: Ângulo e Trabalho",
          math: ["u·v = Σ uᵢvᵢ = |u||v|cosθ", "Ângulo entre vetores", "Projeção ortogonal", "Trabalho W = F·d"],
          eng: "Trabalho é o produto escalar entre força e deslocamento: só a componente da força na direção do movimento realiza trabalho. O mesmo ocorre com potência P = V·I em CA.",
          furb: "Geometria Analítica · Física Geral I", keys: ["geo", "fis"],
          challenge: "F = (10, 5, 0) N e d = (4, 2, 3) m. Calcule o trabalho e o ângulo entre F e d.",
          answer: "W = 40 + 10 = 50 J; cosθ = 50/(11,18·5,385) ≈ 0,830 → θ ≈ 34°."
        },
        {
          title: "Produto Vetorial: Torque e Área",
          math: ["Determinante simbólico i, j, k", "|u×v| = |u||v|senθ", "Regra da mão direita", "Área do paralelogramo e do triângulo"],
          eng: "Torque τ = r×F aciona motores; a força de Lorentz F = qv×B é a base de geradores e motores elétricos. Produto vetorial é a matemática da rotação.",
          furb: "Geometria Analítica · Física Geral I", keys: ["geo", "fis"],
          challenge: "(a) r = (0,5; 0; 0) m e F = (0; 20; 0) N: ache τ = r×F. (b) Área do triângulo com u = (1, 2, 0) e v = (3, 1, 0).",
          answer: "(a) τ = (0, 0, 10) N·m. (b) u×v = (0, 0, −5) → área = 2,5."
        }
      ]
    },
    /* ------------------------------- SEMANA 12 ------------------------------ */
    {
      week: 12, minutes: 140,
      theme: "Pré-Cálculo Avançado: Domínio, Imagem, Funções Inversas, Compostas e Gráficos Modulares",
      application: "Módulos de Matemática e Cálculo I.",
      days: [
        {
          title: "Funções: Domínio, Imagem e Leitura de Gráficos",
          math: ["Definição de função", "Domínio: denominador, raiz par e logaritmo", "Imagem a partir do gráfico", "Injetora, sobrejetora e bijetora"],
          eng: "Todo modelo físico tem domínio de validade: um transistor satura, um capacitor tem tensão máxima. Dizer onde a função existe é parte da resposta de Engenharia.",
          furb: "Módulos de Matemática · Cálculo I", keys: ["mod", "calc"],
          challenge: "Determine o domínio de (a) f(x) = √(x − 2)/(x − 5) e (b) g(x) = ln(4 − x²).",
          answer: "(a) x ≥ 2 e x ≠ 5. (b) −2 < x < 2."
        },
        {
          title: "Funções Compostas",
          math: ["Composição f∘g", "Domínio da composta", "Decompor uma função complexa", "Preparação para a regra da cadeia"],
          eng: "Sistemas em cascata (sensor → amplificador → ADC) são composições de funções. A regra da cadeia de Cálculo I deriva composições.",
          furb: "Módulos de Matemática · Cálculo I", keys: ["mod", "calc"],
          challenge: "f(x) = x² + 1 e g(x) = 2x − 3. Calcule f(g(x)), g(f(x)) e f(g(2)). Decomponha h(x) = √(sen x + 2).",
          answer: "f(g(x)) = 4x² − 12x + 10; g(f(x)) = 2x² − 1; f(g(2)) = 2. h = √(·) ∘ (sen x + 2)."
        },
        {
          title: "Funções Inversas",
          math: ["Condição para existir a inversa", "Procedimento: trocar x ↔ y e isolar", "Simetria em relação a y = x", "eˣ e ln x; sen e arcsen"],
          eng: "Dada v(t) = V₀e^(−t/RC), a função inversa t(v) = −RC·ln(v/V₀) responde \"quando atinge tal tensão?\". Projetar muitas vezes é inverter um modelo.",
          furb: "Módulos de Matemática · Cálculo I · Eletricidade Básica", keys: ["mod", "calc", "ele"],
          challenge: "Ache f⁻¹ para f(x) = (2x + 1)/(x − 3). Em seguida, inverta v(t) = 12e^(−t/RC) para obter t(v).",
          answer: "f⁻¹(x) = (3x + 1)/(x − 2). t = −RC·ln(v/12)."
        },
        {
          title: "Gráficos Modulares & Transformações",
          math: ["|f(x)| e f(|x|)", "Translação, reflexão e escala", "Equações modulares via gráfico", "Retificação de onda: |sen x|"],
          eng: "Um retificador de onda completa transforma sen(ωt) em |sen(ωt)| — o módulo vira circuito. Transformações gráficas permitem ler qualquer curva a partir de uma base conhecida.",
          furb: "Módulos de Matemática · Cálculo I · Eletricidade Básica", keys: ["mod", "calc", "ele"],
          challenge: "Esboce y = |x² − 4| e resolva |x² − 4| = 3. Esboce também |sen x| e identifique seu período.",
          answer: "x² − 4 = ±3 → x² = 7 ou x² = 1 → x = ±√7, ±1. Período de |sen x| = π."
        }
      ]
    },
    /* ------------------------------- SEMANA 13 ------------------------------ */
    {
      week: 13, minutes: 145,
      theme: "Introdução ao Cálculo I: Limites, Limites Laterais, Indeterminações 0/0 e Continuidade",
      application: "Cálculo Diferencial e Integral I (FURB).",
      days: [
        {
          title: "Conceito Intuitivo de Limite",
          math: ["Aproximação numérica por tabelas", "Leitura de limites em gráficos", "Notação lim x→a f(x) = L", "Limite de polinômios por substituição"],
          eng: "Quando t → ∞, a tensão de um capacitor em carga tende a Vs. Limite é a linguagem de \"para onde o sistema tende\" — regime permanente.",
          furb: "Cálculo Diferencial e Integral I", keys: ["calc"],
          challenge: "Monte uma tabela de f(x) = (x² − 1)/(x − 1) para x = 0,9; 0,99; 0,999 e 1,1; 1,01; 1,001. Para que valor tende f? Por que f(1) não existe?",
          answer: "Os valores tendem a 2. f(1) = 0/0 é indefinido, mas o limite existe (= 2)."
        },
        {
          title: "Limites Laterais & Limites no Infinito",
          math: ["Limite pela esquerda e pela direita", "Existência do limite (laterais iguais)", "Assíntotas verticais e horizontais", "Limites quando x → ±∞"],
          eng: "Uma chave que liga em t = 0 tem comportamento diferente antes e depois: limites laterais descrevem o degrau. O regime permanente é lim t→∞.",
          furb: "Cálculo Diferencial e Integral I", keys: ["calc"],
          challenge: "Calcule: (a) lim x→0⁺ 1/x e lim x→0⁻ 1/x; (b) lim x→∞ (3x² + 1)/(x² − 5); (c) lim t→∞ Vs(1 − e^(−t/RC)).",
          answer: "(a) +∞ e −∞ (limite não existe). (b) 3. (c) Vs."
        },
        {
          title: "Indeterminações 0/0 e Técnicas Algébricas",
          math: ["Fatoração e simplificação", "Racionalização com conjugado", "Produtos notáveis em limites", "Indeterminação ∞/∞"],
          eng: "Tudo que você treinou nas Semanas 2 e 4 (fatoração, racionalização) é a caixa de ferramentas para resolver 0/0 — e 0/0 é exatamente o que aparece na derivada.",
          furb: "Cálculo Diferencial e Integral I", keys: ["calc"],
          challenge: "Calcule: (a) lim x→2 (x² − 4)/(x − 2); (b) lim x→0 (√(x + 4) − 2)/x; (c) lim x→3 (x² − 5x + 6)/(x − 3).",
          answer: "(a) 4. (b) Multiplicando pelo conjugado: 1/(√(x+4)+2) → 1/4. (c) (x−2) → 1."
        },
        {
          title: "Continuidade",
          math: ["Três condições de continuidade", "Descontinuidade removível, de salto e infinita", "Funções definidas por partes", "Teorema do Valor Intermediário (intuição)"],
          eng: "A tensão em um capacitor é contínua (não pula instantaneamente); a corrente em um indutor também. Continuidade é uma lei física disfarçada de matemática.",
          furb: "Cálculo Diferencial e Integral I · Eletricidade Básica", keys: ["calc", "ele"],
          challenge: "(a) Ache k para que f(x) = (x² − 9)/(x − 3) se x ≠ 3 e f(3) = k seja contínua. (b) Ache k para que g(x) = x + k (x < 2) e g(x) = x² (x ≥ 2) seja contínua em 2.",
          answer: "(a) k = 6. (b) 2 + k = 4 → k = 2."
        }
      ]
    },
    /* ------------------------------- SEMANA 14 ------------------------------ */
    {
      week: 14, minutes: 150,
      theme: "Introdução às Derivadas: Taxa Média vs. Instantânea, Regra do Tombo e Interpretação Física",
      application: "Velocidade v = ds/dt e Corrente i = dq/dt.",
      days: [
        {
          title: "Taxa de Variação Média",
          math: ["Δy/Δx como taxa média", "Reta secante", "Velocidade média", "Intervalos cada vez menores"],
          eng: "Taxa média é o que um velocímetro de viagem calcula. Encolher o intervalo até ficar infinitesimal leva à derivada — e à corrente instantânea.",
          furb: "Cálculo I · Física Geral I", keys: ["calc", "fis"],
          challenge: "Para s(t) = t² (m, s): ache a velocidade média em [1, 3], [1, 2] e [1; 1,1]. Para onde estão tendendo?",
          answer: "4 m/s; 3 m/s; 2,1 m/s → tendem a 2 m/s (velocidade em t = 1 s)."
        },
        {
          title: "Taxa Instantânea & Definição de Derivada",
          math: ["Quociente de Newton: lim h→0 [f(x+h) − f(x)]/h", "Reta tangente e f′(a)", "Notação dy/dx", "Derivabilidade vs. continuidade"],
          eng: "A derivada é o limite que você resolveu na Semana 13 aplicado ao produto notável da Semana 4. Seis semanas de base convergem aqui.",
          furb: "Cálculo Diferencial e Integral I", keys: ["calc"],
          challenge: "Usando a definição, calcule f′(x) para (a) f(x) = x², (b) f(x) = 3x e (c) f(x) = x³ (use (x+h)³ da Semana 4).",
          answer: "(a) 2x. (b) 3. (c) 3x²."
        },
        {
          title: "Regra do Tombo (Derivada de Polinômios)",
          math: ["(xⁿ)′ = n·xⁿ⁻¹", "Derivada de constante, soma e múltiplo", "Derivada de polinômios", "Equação da reta tangente"],
          eng: "Com a regra do tombo, derivar um polinômio vira mecânica: trazer o expoente, diminuir 1. É a ferramenta de otimização que aparecerá em todo o curso.",
          furb: "Cálculo I · Módulos de Matemática", keys: ["calc", "mod"],
          challenge: "Para f(x) = 4x³ − 6x² + 2x − 7: ache f′(x), f′(1) e a equação da tangente em x = 1.",
          answer: "f′ = 12x² − 12x + 2; f′(1) = 2; f(1) = −7 → y + 7 = 2(x − 1)."
        },
        {
          title: "Interpretação Física: v = ds/dt e i = dq/dt",
          math: ["Velocidade e aceleração como derivadas", "i = dq/dt", "Pontos críticos (f′ = 0)", "Preview: v_L = L·di/dt"],
          eng: "Corrente é a taxa de variação da carga; tensão no indutor é proporcional à taxa de variação da corrente. A derivada é o motor de Circuitos e Física.",
          furb: "Cálculo I · Física Geral I · Eletricidade Básica", keys: ["calc", "fis", "ele"],
          challenge: "(a) s(t) = 2t³ − 9t² + 12t: ache v(t), os instantes de v = 0 e a(2). (b) q(t) = 3t² + 2t (C): ache i(t) e i(2 s).",
          answer: "(a) v = 6t² − 18t + 12; zeros t = 1 e 2 s; a(t) = 12t − 18 → a(2) = 6 m/s². (b) i = 6t + 2 → i(2) = 14 A."
        }
      ]
    }
  ];

  // Achata para 56 sessões
  const CURRICULUM = [];
  WEEKS.forEach(function (w) {
    w.days.forEach(function (d, i) {
      CURRICULUM.push({
        id: (w.week - 1) * 4 + i + 1,
        week: w.week,
        day: i + 1,
        durationMinutes: w.minutes,
        title: d.title,
        mathTopics: d.math,
        engineeringConnection: d.eng,
        furbSubject: d.furb,
        furbKeys: d.keys,
        challengeProblem: d.challenge,
        challengeAnswer: d.answer,
        weekTheme: w.theme,
        weekApplication: w.application,
        essential: d.math.slice(0, 2),
        completed: false
      });
    });
  });

  global.NE = global.NE || {};
  global.NE.Data = {
    START_DATE: START_DATE,
    MIN_MODE_MINUTES: MIN_MODE_MINUTES,
    FURB_SUBJECTS: FURB_SUBJECTS,
    ERROR_TYPES: ERROR_TYPES,
    PHASES: PHASES,
    WEEKS: WEEKS,
    CURRICULUM: CURRICULUM
  };
})(window);

