/* NeuroEng // Prep OS — Teoria das sessões 1–16 (Semanas 1–4) */
(function (g) {
  "use strict";
  const NE = (g.NE = g.NE || {});
  const T = (NE.Theory = NE.Theory || {});

  /* ============================ SEMANA 1 ============================ */
  T[1] = {
    logic: `<p>Uma expressão é uma <b>árvore de dependências</b>: a ordem das operações não é convenção arbitrária, é a regra que decide quais sub-resultados precisam existir antes dos outros. Parênteses forçam um agrupamento, potências ligam mais forte que × ÷, e × ÷ ligam mais forte que + −. A propriedade distributiva (a·(b+c) = a·b + a·c) é a ponte entre soma e produto, e é por ela que se fatora e se expande.</p><p>Fatorar em primos (360 = 2³·3²·5) revela divisibilidade e prepara MMC/MDC. Estimar a ordem de grandeza antes de calcular é um detector de erro: se a resposta foge da estimativa, há bug.</p><p>Na Engenharia Elétrica, Req = R₁ + R₂·R₃/(R₂+R₃) é um resistor em série com um paralelo. Errar a precedência troca a topologia do circuito. Sanity check físico: um paralelo é sempre menor que o menor dos seus resistores.</p>`,
    algo: [
      `Identifique e <b>circule os parênteses mais internos</b>; resolva-os primeiro, de dentro para fora.`,
      `Resolva as <b>potências e raízes</b> (da esquerda para a direita).`,
      `Resolva <b>× e ÷ na ordem em que aparecem</b>, da esquerda para a direita (÷ não tem prioridade menor que ×).`,
      `Só então faça <b>+ e −</b>, da esquerda para a direita. Reescreva a expressão inteira a cada passo, uma operação por linha.`,
      `Para divisibilidade, divida o número por 2, 3, 5, 7… e anote os primos até chegar a 1; o resultado é a fatoração.`,
      `Antes de calcular, faça a <b>estimativa</b> (arredonde para 1 algarismo); depois compare com o resultado exato.`
    ],
    example: {
      title: `Exemplo resolvido: Req = R₁ + R₂·R₃/(R₂+R₃) com R₁ = 12 Ω, R₂ = 20 Ω, R₃ = 30 Ω`,
      lines: [
        `Linha 1: estimativa — o paralelo de 20 Ω e 30 Ω é menor que 20 Ω, então Req ≈ 12 + (algo menor que 20) ∈ [12, 32] Ω.`,
        `Linha 2: Req = 12 + 20·30/(20+30) — substituição direta, sem calcular nada ainda.`,
        `Linha 3: Req = 12 + 20·30/<b>50</b> — primeiro o <b>parêntese</b>: 20 + 30 = 50.`,
        `Linha 4: Req = 12 + <b>600</b>/50 — depois o produto do numerador: 20·30 = 600 (× vem antes de +).`,
        `Linha 5: Req = 12 + <b>12</b> — divisão: 600 ÷ 50 = 12 (o paralelo vale 12 Ω, menor que 20 Ω ✓).`,
        `Linha 6: Req = 24 Ω — soma final, dentro da faixa estimada [12, 32] Ω.`
      ]
    },
    traps: [
      `Somar antes de multiplicar: calcular 12 + 20 = 32 e só depois ·30/50 troca o circuito inteiro. Contramedida: sublinhe com lápis cada × ÷ antes de encostar em qualquer + −.`,
      `Fazer 600/50 + 12 pela metade e perder o termo solto na linha seguinte. Contramedida: reescreva a expressão completa em cada linha, mesmo as partes que não mudaram.`,
      `Aceitar um Req paralelo maior que um dos resistores porque a conta parece certa. Contramedida: escreva a estimativa na Linha 1 e confronte o resultado final com ela.`
    ]
  };

  T[2] = {
    logic: `<p>Uma fração a/b é <b>a ÷ b</b>: quantas vezes b cabe em a. Multiplicar numerador e denominador pelo mesmo número k multiplica por k/k = 1, então o valor não muda (frações equivalentes) — é isso que permite simplificar e criar denominador comum. Somar exige a mesma unidade de divisão (mesmo denominador); multiplicar não. Dividir por uma fração é multiplicar pelo <b>inverso</b>, porque (a/b)÷(c/d) pergunta quantos c/d cabem em a/b.</p><p>Fração complexa é só uma divisão: resolva o numerador e o denominador separadamente e inverta o de baixo.</p><p>Na Engenharia Elétrica, resistores em paralelo somam <i>condutâncias</i>: 1/Req = 1/R₁ + 1/R₂. Para R₁ = 8 Ω e R₂ = 12 Ω a conta é uma soma de frações seguida de uma inversão — o erro mais comum do primeiro semestre.</p>`,
    algo: [
      `Fatore os denominadores e ache o <b>MMC</b>; ele será o denominador comum.`,
      `Para cada fração, calcule <b>MMC ÷ denominador</b> e multiplique numerador e denominador por esse fator.`,
      `<b>Some (ou subtraia) apenas os numeradores</b>; o denominador comum é mantido, nunca somado.`,
      `Para multiplicar, multiplique numerador com numerador e denominador com denominador, <b>simplificando antes</b> (corte cruzado).`,
      `Para dividir, <b>inverta a segunda fração</b> e multiplique: (a/b) ÷ (c/d) = (a/b)·(d/c).`,
      `Fração complexa: reduza o numerador a uma fração, o denominador a uma fração, e divida. No fim, <b>simplifique pelo MDC</b> e faça o teste de plausibilidade.`
    ],
    example: {
      title: `Exemplo resolvido: Req de 8 Ω em paralelo com 12 Ω`,
      lines: [
        `Linha 1: 1/Req = 1/8 + 1/12 — soma de condutâncias em paralelo.`,
        `Linha 2: MMC(8, 12): 8 = 2³ e 12 = 2²·3, logo MMC = 2³·3 = 24 — maior expoente de cada primo.`,
        `Linha 3: 1/8 = <b>3</b>/24 e 1/12 = <b>2</b>/24 — fatores 24 ÷ 8 = 3 e 24 ÷ 12 = 2 multiplicam em cima e embaixo.`,
        `Linha 4: 1/Req = 3/24 + 2/24 = <b>5</b>/24 — soma só os numeradores; o denominador 24 fica.`,
        `Linha 5: Req = <b>24/5</b> — inverter os dois lados da igualdade (1/Req → Req).`,
        `Linha 6: Req = 4,8 Ω — menor que 8 Ω, como todo paralelo deve ser ✓.`
      ]
    },
    traps: [
      `Somar 1/8 + 1/12 como 2/20 (numerador com numerador, denominador com denominador). Contramedida: escreva MMC = ___ antes de qualquer soma e só prossiga com o denominador comum.`,
      `Parar em 1/Req = 5/24 e responder Req = 5/24. Contramedida: circule o símbolo 1/Req e escreva abaixo Req = (inverso) como passo obrigatório.`,
      `Inverter a fração errada na divisão (a primeira em vez da segunda). Contramedida: ponha uma seta sobre o divisor e escreva ao lado o seu inverso antes de multiplicar.`
    ]
  };

  T[3] = {
    logic: `<p>Todo inteiro é um produto único de primos (Teorema Fundamental da Aritmética), e MMC/MDC são leituras dessa fatoração: o <b>MDC</b> usa o <b>menor</b> expoente de cada primo comum (o maior divisor compartilhado); o <b>MMC</b> usa o <b>maior</b> expoente de todos os primos (o menor múltiplo compartilhado). Daí MMC(a, b)·MDC(a, b) = a·b.</p><p>Geometricamente, o MMC é o primeiro instante em que dois ciclos de comprimentos diferentes voltam a coincidir; algebricamente, é o menor denominador que serve a todas as frações, evitando números enormes. O MDC faz o oposto: reduz uma fração ao máximo.</p><p>Na Engenharia Elétrica: dois sinais periódicos de 20 ms e 50 ms se realinham a cada MMC = 100 ms (essencial para analisar a soma de ondas). Em paralelos, o MMC mantém as contas de 1/Req pequenas; em Laplace, o mesmo conceito aparece como MMC de polinômios.</p>`,
    algo: [
      `Fatore cada número em <b>primos</b> (divisões sucessivas) e escreva na forma de potências.`,
      `<b>MMC</b> = produto de todos os primos que aparecem, cada um com o <b>maior expoente</b>.`,
      `<b>MDC</b> = produto apenas dos primos <b>comuns</b>, cada um com o <b>menor expoente</b>.`,
      `Confira com a identidade <b>MMC·MDC = a·b</b> (para dois números).`,
      `Para somar frações, use o MMC dos denominadores e converta com fator = MMC ÷ denominador.`,
      `Ao final, divida numerador e denominador pelo <b>MDC</b> para simplificar ao máximo.`
    ],
    example: {
      title: `Exemplo resolvido: períodos de 20 ms e 50 ms; e 1/20 + 1/50 (em kΩ)`,
      lines: [
        `Linha 1: 20 = 2²·5 e 50 = 2·5² — fatoração em primos.`,
        `Linha 2: MMC = 2²·5² = 4·25 = 100 — <b>maior</b> expoente: 2² e 5².`,
        `Linha 3: MDC = 2·5 = 10 — <b>menor</b> expoente: 2¹ e 5¹. Conferência: 100·10 = 1000 = 20·50 ✓.`,
        `Linha 4: os dois sinais reiniciam juntos a cada 100 ms — o MMC é o instante de realinhamento.`,
        `Linha 5: 1/20 + 1/50 = <b>5</b>/100 + <b>2</b>/100 — fatores 100 ÷ 20 = 5 e 100 ÷ 50 = 2.`,
        `Linha 6: = 7/100, e MDC(7, 100) = 1, então já está simplificada — soma dos numeradores.`,
        `Linha 7: Req = 100/7 ≈ 14,29 kΩ — inversão final, menor que 20 kΩ ✓.`
      ]
    },
    traps: [
      `Usar o produto 20·50 = 1000 como denominador comum e carregar números gigantes. Contramedida: sempre fatore antes e use o MMC; se o denominador passar de 3 algarismos, reveja.`,
      `Trocar MMC por MDC (usar menor expoente onde era maior). Contramedida: escreva MMC = MAIOR expoente, MDC = MENOR expoente no topo da folha e confira com MMC·MDC = a·b.`,
      `Esquecer de multiplicar o numerador pelo mesmo fator do denominador (1/20 virar 1/100). Contramedida: escreva o fator (×5) em cima e embaixo, com cor diferente.`
    ]
  };

  T[4] = {
    logic: `<p>O sinal é <b>direção</b> na reta numérica: − inverte o sentido. Por isso −·− = + (inverter duas vezes volta ao sentido original) e subtrair é somar o oposto: a − b = a + (−b). Logo −(a − b) = −a + b: o sinal de fora vira <b>multiplicador −1</b> que distribui a todos os termos do parêntese. Numa fração, o sinal pode ficar no numerador, no denominador ou na frente: −a/b = (−a)/b = a/(−b).</p><p>Na Engenharia Elétrica, a polaridade é um sinal físico. Na Lei de Kirchhoff das Tensões, a soma ao redor da malha é zero com sinais corretos; um sinal trocado inverte o sentido da corrente. O divisor de tensão Vout = Vin·R₂/(R₁+R₂) distribui Vin em proporção às resistências: R₂ maior, mais tensão sobre R₂. Com Vin negativo, Vout também é negativo — a razão R₂/(R₁+R₂) é sempre positiva e entre 0 e 1.</p>`,
    algo: [
      `Antes de calcular, escreva o sinal de cada número entre <b>parênteses</b>: (−3), (+5).`,
      `Multiplicação e divisão: <b>sinais iguais dão +, sinais diferentes dão −</b>. Conte quantos − existem: par dá +, ímpar dá −.`,
      `Subtração: reescreva <b>a − b como a + (−b)</b>; assim tudo vira soma.`,
      `Parêntese precedido de −: <b>troque o sinal de TODOS os termos de dentro</b>: −(a − b) = −a + b.`,
      `Divisor de tensão: some R₁ + R₂ primeiro, depois calcule Vout = Vin·R₂/(R₁+R₂); a razão fica entre 0 e 1.`,
      `Verifique com a lei das malhas: <b>Vin − V₁ − V₂ = 0</b> (no mesmo sentido de polaridade).`
    ],
    example: {
      title: `Exemplo resolvido: divisor com Vin = −9 V, R₁ = 2 kΩ, R₂ = 7 kΩ`,
      lines: [
        `Linha 1: Vout = Vin·R₂/(R₁+R₂), com Vin = (−9) V — substituir mantendo o parêntese no negativo.`,
        `Linha 2: R₁ + R₂ = 2 kΩ + 7 kΩ = 9 kΩ — soma do denominador antes de dividir.`,
        `Linha 3: Vout = (−9)·7/9 — as unidades kΩ cancelam, pois a razão é adimensional.`,
        `Linha 4: Vout = <b>(−9)/9</b>·7 = <b>(−1)</b>·7 — (−) ÷ (+) = (−); simplificar 9/9 = 1.`,
        `Linha 5: Vout = −7 V — razão 7/9 positiva, o sinal vem só da fonte.`,
        `Linha 6: V₁ = (−9)·2/9 = −2 V; malha: −9 − (−2) − (−7) = −9 <b>+ 2 + 7</b> = 0 ✓ — −(−x) = +x.`
      ]
    },
    traps: [
      `Distribuir o − de −(a − b) só no primeiro termo, resultando em −a − b. Contramedida: desenhe setas do sinal para cada termo dentro do parêntese e reescreva todos.`,
      `Perder o sinal negativo ao copiar de uma linha para a outra (o clássico erro de transcrição). Contramedida: circule todo sinal − na linha anterior e confirme que há o mesmo número de círculos na nova.`,
      `Aplicar −·− = − por tratar o dois sinais como se somassem. Contramedida: conte os sinais negativos em voz baixa e escreva ao lado: par → +, ímpar → −.`
    ]
  };

  /* ============================ SEMANA 2 ============================ */
  T[5] = {
    logic: `<p>aⁿ é multiplicação repetida, e <b>todas as propriedades vêm dessa contagem</b>: aᵐ·aⁿ = aᵐ⁺ⁿ (juntar fatores), aᵐ/aⁿ = aᵐ⁻ⁿ (cancelar fatores) e (aᵐ)ⁿ = aᵐ·ⁿ (repetir blocos). Da divisão, a⁰ = aⁿ/aⁿ = 1 e a⁻ⁿ = 1/aⁿ: o expoente negativo é <b>inverso</b>, não número negativo. A potência atua só no que está imediatamente à esquerda: (a+b)² = a² + 2ab + b² e não a² + b²; o termo cruzado 2ab é a área dos dois retângulos do quadrado.</p><p>Na Engenharia Elétrica, os prefixos são potências de 10: k = 10³, m = 10⁻³, μ = 10⁻⁶, n = 10⁻⁹. Em V = I·R com 3,3 kΩ e 4 mA, multiplicam-se os coeficientes e somam-se os expoentes: 10³·10⁻³ = 10⁰. Em P = V²/R, dobrar V quadruplica P.</p>`,
    algo: [
      `Converta cada grandeza para <b>coeficiente × 10ⁿ</b> (k = 10³, m = 10⁻³, μ = 10⁻⁶, n = 10⁻⁹).`,
      `Produto de mesma base: <b>some os expoentes</b>; quociente: <b>subtraia</b> (numerador menos denominador).`,
      `Potência de potência: <b>multiplique os expoentes</b>: (10⁻²)³ = 10⁻⁶.`,
      `Expoente negativo: <b>inverta</b> a base: a⁻ⁿ = 1/aⁿ. Expoente zero: resultado 1 (para a ≠ 0).`,
      `Multiplique os coeficientes separadamente dos 10ⁿ, depois recombine.`,
      `<b>Nunca distribua a potência sobre a soma</b>: (a+b)² = a² + 2ab + b². Expanda sempre os três termos.`
    ],
    example: {
      title: `Exemplo resolvido: V = I·R e P = V·I com R = 3,3 kΩ e I = 4 mA`,
      lines: [
        `Linha 1: R = 3,3×10³ Ω e I = 4×10⁻³ A — prefixos escritos como potências de 10.`,
        `Linha 2: V = 3,3×10³ · 4×10⁻³ — Lei de Ohm, V = I·R.`,
        `Linha 3: V = (3,3·4) · 10<sup>3 <b>+</b> (−3)</sup> — coeficientes multiplicam e <b>expoentes somam</b>.`,
        `Linha 4: V = 13,2 · 10⁰ = 13,2 V — 10⁰ = 1.`,
        `Linha 5: P = V·I = 13,2 · 4×10⁻³ = (13,2·4)×10⁻³ = 52,8×10⁻³ W — 13,2·4 = 52,8.`,
        `Linha 6: P = 52,8 mW — 10⁻³ W = 1 mW.`
      ]
    },
    traps: [
      `Somar expoentes ao dividir (10⁵/10² = 10⁷). Contramedida: ao dividir, escreva explicitamente 5 <b>−</b> 2 antes de resolver.`,
      `Ler 10⁻³ como número negativo (−1000) em vez de 1/1000. Contramedida: traduza em voz alta: dez a menos três é um milésimo, e escreva o prefixo (m) ao lado.`,
      `Esquecer o termo do meio em (a+b)² e escrever a² + b². Contramedida: desenhe o quadrado de lado a+b com 4 regiões (a², ab, ab, b²) antes de aplicar a fórmula.`
    ]
  };

  T[6] = {
    logic: `<p>A raiz enésima é a operação <b>inversa</b> da potência, e por isso é uma potência fracionária: ⁿ√a = a<sup>1/n</sup>, pois (a<sup>1/n</sup>)ⁿ = a. Isso unifica tudo: √(a·b) = √a·√b e √(a/b) = √a/√b valem porque (ab)<sup>1/2</sup> = a<sup>1/2</sup>·b<sup>1/2</sup>. Para simplificar, extraia quadrados perfeitos: √72 = √(36·2) = 6√2. Mas √(a+b) ≠ √a + √b: a raiz não distribui sobre soma (√9 + √16 = 7, mas √25 = 5).</p><p>Na Engenharia Elétrica, o valor eficaz de uma senoide é Vrms = Vp/√2, a tensão contínua que dissiparia a mesma potência. Num circuito LC, a ressonância ocorre em ω₀ = 1/√(LC); dobrar C diminui ω₀ por √2, não por 2 — a raiz suaviza a dependência.</p>`,
    algo: [
      `Reescreva a raiz como potência quando o problema pedir: <b>ⁿ√aᵐ = a^(m/n)</b>.`,
      `Para simplificar √N, fatore N em primos e <b>tire um fator de cada par</b>: √72 = √(2³·3²) = 2·3·√2 = 6√2.`,
      `Produto e quociente: <b>√a·√b = √(ab)</b> e <b>√a/√b = √(a/b)</b>. Não existe regra equivalente para soma.`,
      `Para raiz de 10ⁿ: <b>divida o expoente por 2</b> (se for ímpar, reescreva como 10ⁿ⁻¹·10, ou ajuste o coeficiente).`,
      `Raiz no denominador: <b>multiplique em cima e embaixo pela própria raiz</b> (racionalizar): a/√b = a√b/b.`,
      `Confira com estimativa: √2 ≈ 1,414, √3 ≈ 1,732, √10 ≈ 3,162.`
    ],
    example: {
      title: `Exemplo resolvido: Vrms de Vp = 10 V e ω₀ de L = 1 mH, C = 100 nF`,
      lines: [
        `Linha 1: Vrms = Vp/√2 = 10/√2 — valor eficaz de uma senoide de pico 10 V.`,
        `Linha 2: 10/√2 = 10·<b>√2</b>/(√2·<b>√2</b>) = 10√2/2 — multiplicar em cima e embaixo por √2 (racionalizar).`,
        `Linha 3: Vrms = 5√2 ≈ 5·1,414 = 7,07 V — menor que o pico de 10 V ✓.`,
        `Linha 4: L = 1 mH = 10⁻³ H e C = 100 nF = 10⁻⁷ F — prefixos em potências de 10.`,
        `Linha 5: LC = 10⁻³·10⁻⁷ = 10<sup>−3+(−7)</sup> = 10⁻¹⁰ — produto de mesma base soma expoentes.`,
        `Linha 6: √(10⁻¹⁰) = (10⁻¹⁰)<sup>1/2</sup> = 10⁻⁵ — <b>expoente × 1/2</b>.`,
        `Linha 7: ω₀ = 1/10⁻⁵ = 10⁵ rad/s — inverter muda o sinal do expoente (f₀ = ω₀/2π ≈ 15,9 kHz).`
      ]
    },
    traps: [
      `Escrever √(a+b) = √a + √b (por exemplo, √(9+16) = 3+4). Contramedida: teste com 9 e 16 mentalmente: 5 ≠ 7; escreva ≠ ao lado sempre que a raiz cobrir uma soma.`,
      `Esquecer de tirar o fator da raiz com expoente ímpar (deixar √72 pela metade). Contramedida: fatore em primos em coluna e circule os pares antes de simplificar.`,
      `Calcular 1/√(LC) e esquecer de inverter no final (ou inverter antes da raiz e errar o expoente). Contramedida: escreva as duas etapas em linhas separadas: raiz primeiro, inversão depois.`
    ]
  };

  T[7] = {
    logic: `<p>A notação científica separa a informação em duas partes independentes: o <b>coeficiente</b> a (1 ≤ a &lt; 10), que carrega os algarismos significativos, e o <b>expoente</b> n, que carrega a escala (ordem de grandeza). Multiplicar vira multiplicar coeficientes e somar expoentes; dividir vira dividir coeficientes e subtrair expoentes. Somar exige expoentes iguais, pois só se somam grandezas na mesma escala. O resultado sempre é renormalizado: 3300×10⁻⁶ = 3,3×10⁻³.</p><p>Na Engenharia Elétrica, os prefixos SI são degraus de 10³: p (10⁻¹²), n (10⁻⁹), μ (10⁻⁶), m (10⁻³), k (10³), M (10⁶), G (10⁹). A constante de tempo de um circuito RC, τ = R·C, é o tempo para o capacitor atingir 63% da carga; com 33 kΩ e 100 nF, a ordem de grandeza é de milissegundos. Algarismos significativos informam a precisão: não devolva 6 dígitos de uma medida com 2.</p>`,
    algo: [
      `Converta o prefixo em potência de 10 (<b>n → ×10⁻⁹, μ → ×10⁻⁶, m → ×10⁻³, k → ×10³, M → ×10⁶</b>).`,
      `Estime primeiro: arredonde cada coeficiente para 1 algarismo e some os expoentes mentalmente.`,
      `Multiplicação: <b>multiplique os coeficientes e some os expoentes</b>; divisão: divida os coeficientes e <b>subtraia</b> os expoentes.`,
      `<b>Renormalize</b> para 1 ≤ a &lt; 10: ao andar a vírgula k casas para a esquerda, <b>some k</b> ao expoente; para a direita, subtraia k.`,
      `Para somar ou subtrair, <b>iguale os expoentes</b> antes e só então opere com os coeficientes.`,
      `Converta de volta ao prefixo mais próximo (múltiplo de 3 no expoente) e limite os algarismos significativos ao dado menos preciso.`
    ],
    example: {
      title: `Exemplo resolvido: τ = R·C com R = 33 kΩ e C = 100 nF`,
      lines: [
        `Linha 1: R = 33×10³ Ω e C = 100×10⁻⁹ F — conversão dos prefixos k e n.`,
        `Linha 2: estimativa — 3×10⁴ · 1×10⁻⁷ = 3×10⁻³ s, ou seja, alguns milissegundos.`,
        `Linha 3: τ = (33×10³)·(100×10⁻⁹) = (33·100)×10<sup>3 <b>+</b> (−9)</sup> = 3300×10⁻⁶ — coeficientes multiplicam, expoentes somam.`,
        `Linha 4: 3300 = <b>3,3×10³</b>, logo 3,3×10³·10⁻⁶ = 3,3×10<sup>−6+3</sup> — vírgula 3 casas para a esquerda, expoente <b>+3</b>.`,
        `Linha 5: τ = 3,3×10⁻³ s — coerente com a estimativa de 3×10⁻³ s.`,
        `Linha 6: 10⁻³ s = 1 ms, então τ = 3,3 ms.`
      ]
    },
    traps: [
      `Normalizar andando a vírgula e esquecendo de ajustar o expoente (ou ajustando no sentido contrário). Contramedida: regra do vaivém: mantenha o valor — vírgula para a esquerda, expoente sobe; escreva o ±k que usou.`,
      `Somar expoentes de números com expoentes diferentes (2×10³ + 3×10⁴ = 5×10⁷). Contramedida: antes de somar, escreva ambos com o mesmo 10ⁿ e circule o expoente.`,
      `Confundir m (milli, 10⁻³) com M (mega, 10⁶) ou μ com m. Contramedida: pronuncie o nome completo do prefixo e escreva a potência ao lado antes de calcular.`
    ]
  };

  T[8] = {
    logic: `<p>Racionalizar é multiplicar por 1 disfarçado (x/x) para tirar a raiz do denominador. Para 1/√a basta multiplicar por √a/√a. Para 1/(a+√b), use o <b>conjugado</b> (a−√b): o produto (a+√b)(a−√b) = a² − b elimina a raiz pela diferença de quadrados. Isso é essencial em Cálculo I, pois transforma formas indeterminadas 0/0 em algo calculável.</p><p>Na Engenharia Elétrica, a Lei de Ohm (V = I·R) é uma relação proporcional, e a Lei de Coulomb (F = k·q₁q₂/r²) uma lei do inverso do quadrado: dobrar a distância divide a força por 4. Com prefixos (μC, cm), o risco é numérico, não conceitual: converta tudo para o SI antes. A <b>análise dimensional</b> é o seu detector de erro: N·m²/C² · C² / m² = N. Se a unidade final não for a esperada, a fórmula ou a conversão está errada.</p>`,
    algo: [
      `Converta todas as grandezas ao SI (cm → m ÷100, μC → ×10⁻⁶ C) e escreva em potências de 10.`,
      `Lei de Coulomb: <b>eleve r ao quadrado inteiro</b>, incluindo o expoente do prefixo: (2×10⁻¹)² = 4×10⁻².`,
      `Multiplique os coeficientes, <b>some os expoentes</b> no numerador e <b>subtraia</b> o expoente do denominador.`,
      `Racionalizar 1/√a: <b>multiplique em cima e embaixo por √a</b>, resultando em √a/a.`,
      `Racionalizar 1/(a+√b): multiplique pelo <b>conjugado (a−√b)</b>; o denominador vira <b>a² − b</b>.`,
      `Confira a <b>unidade</b> final (análise dimensional) e a plausibilidade da ordem de grandeza.`
    ],
    example: {
      title: `Exemplo resolvido: racionalizar 4/(2+√2) e Coulomb com 4 μC, 1 μC e 20 cm`,
      lines: [
        `Linha 1: 4/(2+√2) · (2−√2)/(2−√2) — multiplicar por 1 usando o <b>conjugado</b> (troca o sinal).`,
        `Linha 2: denominador (2+√2)(2−√2) = 2² − (√2)² = 4 − 2 = 2 — diferença de quadrados.`,
        `Linha 3: 4(2−√2)/2 = 2(2−√2) = 4 − 2√2 ≈ 1,17 (confere: 4/3,414 ≈ 1,17 ✓).`,
        `Linha 4: r = 20 cm = 2×10⁻¹ m, então r² = (2×10⁻¹)² = 4×10⁻² m² — <b>quadrado do coeficiente e do expoente</b>.`,
        `Linha 5: numerador: 9×10⁹·4×10⁻⁶·1×10⁻⁶ = 36×10⁹⁻⁶⁻⁶ = 36×10⁻³ — 9·4·1 = 36; expoentes 9 − 6 − 6 = −3.`,
        `Linha 6: F = 36×10⁻³ / 4×10⁻² = 9×10<sup>−3 <b>−</b> (−2)</sup> = 9×10⁻¹ — divisão: expoentes subtraem.`,
        `Linha 7: F = 0,9 N — N·m²/C² · C²/m² = N ✓ (unidade correta).`
      ]
    },
    traps: [
      `Esquecer de elevar o prefixo ao quadrado (usar r = 0,2 e depois 2×10⁻¹ sem quadrado em 10⁻¹). Contramedida: escreva r² = ( )² com parênteses e calcule o coeficiente e o expoente separadamente.`,
      `Multiplicar o denominador pelo conjugado e esquecer de multiplicar o numerador. Contramedida: escreva sempre a fração (conj)/(conj) completa, com os dois lados, antes de operar.`,
      `Usar cm ou μC direto na fórmula sem converter para SI. Contramedida: crie uma linha de conversões ANTES de qualquer cálculo e risque cada unidade antiga ao converter.`
    ]
  };

  /* ============================ SEMANA 3 ============================ */
  T[9] = {
    logic: `<p>Num sistema posicional de base b, cada dígito vale <b>dígito × bᵖᵒˢⁱᶜᵃᵒ</b>: 214 = 2·10² + 1·10¹ + 4·10⁰. O binário é a base 2, com apenas dois dígitos (0 e 1), porque um transistor tem dois estados confiáveis (tensão alta ou baixa). Os pesos são potências de 2: ... 128, 64, 32, 16, 8, 4, 2, 1. Com n bits há 2ⁿ combinações, cobrindo de 0 até 2ⁿ − 1.</p><p>Na soma binária, 1+1 = 10₂ (escreve 0, vai 1), exatamente como 9+1 em decimal. Se o resultado exige mais bits do que o registrador possui, há <b>overflow</b>: o bit extra é perdido.</p><p>Na Engenharia Elétrica, um ADC de n bits divide a faixa de tensão em 2ⁿ níveis. Um ADC de 10 bits em 5 V tem 1024 níveis (≈ 4,88 mV por passo). Memórias, contadores e barramentos seguem a mesma contagem.</p>`,
    algo: [
      `Escreva os <b>pesos</b> sobre cada bit, da direita para a esquerda: 1, 2, 4, 8, 16, 32, 64, 128.`,
      `Binário → decimal: <b>some os pesos das posições onde há 1</b>; ignore os zeros.`,
      `Decimal → binário: subtraia o maior peso que cabe e marque 1; repita com o resto (ou use divisões sucessivas por 2).`,
      `Soma binária, coluna por coluna da direita: <b>0+0=0, 0+1=1, 1+1=0 e vai 1, 1+1+1=1 e vai 1</b>.`,
      `Se houver <b>vai-um além do bit mais significativo</b>, há overflow: o resultado em n bits é o valor módulo 2ⁿ.`,
      `Para n bits: <b>2ⁿ estados</b>, valor máximo 2ⁿ − 1; resolução de um ADC = faixa ÷ 2ⁿ.`
    ],
    example: {
      title: `Exemplo resolvido: 1101 0110₂ + 0011 1010₂ em 8 bits`,
      lines: [
        `Linha 1: pesos dos 8 bits: 128 64 32 16 8 4 2 1 — potências de 2 da esquerda para a direita.`,
        `Linha 2: 1101 0110₂ = 1·128 + 1·64 + 0·32 + 1·16 + 0·8 + 1·4 + 1·2 + 0·1 — pesos × bits.`,
        `Linha 3: = 128 + 64 + 16 + 4 + 2 = 214 — soma só onde há 1.`,
        `Linha 4: 0011 1010₂ = 32 + 16 + 8 + 2 = 58 — mesmo método.`,
        `Linha 5: 214 + 58 = 272, mas 8 bits representam no máximo 2⁸ − 1 = 255 — já se prevê overflow.`,
        `Linha 6: 1101 0110 + 0011 1010 = <b>1</b> 0001 0000 — coluna a coluna, com <b>vai-um</b> saindo do bit mais significativo.`,
        `Linha 7: os 8 bits guardam 0001 0000₂ = 16 = 272 − 256 — resultado 16 com carry = 1 (overflow), não 272.`
      ]
    },
    traps: [
      `Somar os pesos dos zeros, ou deixar de somar um peso por pressa. Contramedida: escreva o peso embaixo de cada bit e risque os pesos dos zeros antes de somar.`,
      `Errar o vai-um no meio da soma binária (1+1+1). Contramedida: escreva a linha de carries acima das colunas e registre cada vai-um antes de passar à próxima coluna.`,
      `Confundir 2ⁿ com o valor máximo (esquecer o −1). Contramedida: escreva 8 bits → 0 a 255 e nunca 256 como valor máximo; 256 é a quantidade de estados.`
    ]
  };

  T[10] = {
    logic: `<p>Como 8 = 2³ e 16 = 2⁴, cada dígito octal equivale a exatamente <b>3 bits</b> e cada dígito hexadecimal a exatamente <b>4 bits</b>. Por isso a conversão é só agrupar, sem fazer contas: 1001 1100₂ = 9C₁₆. Hexadecimal usa os símbolos 0–9 e A–F (A = 10, B = 11, C = 12, D = 13, E = 14, F = 15). Para o decimal, vale o peso de cada posição: 0x9C = 9·16 + 12 = 156.</p><p>Números negativos precisam de uma representação em bits. No <b>complemento de 2</b> com n bits, −x é representado por 2ⁿ − x: inverta os bits de x e some 1. Assim a mesma soma binária do hardware serve para somar e subtrair.</p><p>Na Engenharia Elétrica, endereços de memória, registradores de microcontroladores e cores usam hexadecimal, e a ULA opera em complemento de 2: 0xE4 em 8 bits é −28, pois 256 − 28 = 228 = 0xE4.</p>`,
    algo: [
      `Hexadecimal → binário: <b>troque cada dígito hexa por 4 bits</b> (8421): 9 = 1001, C = 1100.`,
      `Binário → hexa/octal: agrupe de <b>4 (hexa) ou 3 (octal) bits a partir da direita</b>, completando com zeros à esquerda.`,
      `Hexa → decimal: <b>dígito × 16ᵖᵒˢⁱᶜᵃᵒ</b> e soma (A–F valem 10–15).`,
      `Decimal → outra base: <b>divida sucessivamente</b> pela base, anote os restos e <b>leia de baixo para cima</b>.`,
      `Complemento de 2: escreva o módulo em n bits, <b>inverta todos os bits</b> e <b>some 1</b>.`,
      `Para voltar: se o bit mais significativo é 1, o número é negativo; inverta, some 1 e atribua o sinal −.`
    ],
    example: {
      title: `Exemplo resolvido: 0x9C em binário, octal e decimal; −28 em complemento de 2 (8 bits)`,
      lines: [
        `Linha 1: 9 = 1001 e C = 12 = 1100 — cada dígito hexa são 4 bits.`,
        `Linha 2: 0x9C = 1001 1100₂ — concatenar os grupos.`,
        `Linha 3: decimal: 9·16 + 12·1 = 144 + 12 = 156 — pesos 16¹ e 16⁰.`,
        `Linha 4: octal: 010 011 100 = 2 3 4 = 234₈ — grupos de 3 bits da direita, com um 0 à esquerda; 2·64 + 3·8 + 4 = 156 ✓.`,
        `Linha 5: +28 em 8 bits = 0001 1100 — 16 + 8 + 4 = 28.`,
        `Linha 6: <b>inverter</b> todos os bits: 0001 1100 → 1110 0011.`,
        `Linha 7: <b>somar 1</b>: 1110 0011 + 1 = 1110 0100 = 0xE4 — conferência: 256 − 28 = 228 = 0xE4. Logo −28 = 1110 0100₂.`
      ]
    },
    traps: [
      `Agrupar os bits a partir da esquerda e não da direita (o último grupo fica errado). Contramedida: desenhe os separadores de grupo contando a partir do bit menos significativo.`,
      `Esquecer o <b>+1</b> após inverter no complemento de 2 (e obter o complemento de 1). Contramedida: escreva dois passos numerados: (1) inverter, (2) somar 1; só termine quando ambos estiverem riscados.`,
      `Ler os restos das divisões sucessivas de cima para baixo. Contramedida: coloque uma seta para cima ao lado da coluna de restos e releia de baixo para cima.`
    ]
  };

  T[11] = {
    logic: `<p>A álgebra de Boole opera com apenas duas constantes (0 e 1) e três operações fundamentais: <b>AND</b> (produto, A·B vale 1 só se ambos valem 1), <b>OR</b> (soma, A+B vale 1 se algum vale 1) e <b>NOT</b> (complemento, Ā). NAND e NOR são AND/OR seguidos de NOT, e o XOR (A ⊕ B) vale 1 quando as entradas são <b>diferentes</b>. Como cada variável só tem dois valores, uma função de n variáveis é completamente descrita por uma tabela-verdade de 2ⁿ linhas, sem ambiguidade.</p><p>Para traduzir um texto em expressão, leia o conectivo: E → AND, OU → OR, NÃO → NOT, e monte uma <b>soma de produtos</b>: um termo para cada linha da tabela em que a saída é 1.</p><p>Na Engenharia Elétrica, cada porta lógica é um circuito de transistores. Um alarme, uma luz de escada com dois interruptores ou o controle de um motor são problemas desse tipo, e é isso que você vai projetar em Eletrônica Digital I.</p>`,
    algo: [
      `Liste as <b>variáveis de entrada</b> e a saída; defina o que significa 1 e 0 para cada uma.`,
      `Traduza o texto por palavras-chave: <b>E → AND (·)</b>, <b>OU → OR (+)</b>, <b>NÃO → NOT (barra)</b>.`,
      `Monte a tabela com <b>2ⁿ linhas</b>, contando em binário (000, 001, 010, …) para não esquecer nenhuma combinação.`,
      `Preencha a saída avaliando a expressão linha por linha; <b>avalie primeiro NOT, depois AND, depois OR</b> (precedência booleana).`,
      `Reconheça as identidades: A·0 = 0, A·1 = A, A+0 = A, A+1 = 1, A·Ā = 0, A+Ā = 1, A·A = A.`,
      `Para obter a expressão a partir da tabela, escreva um <b>produto para cada linha com saída 1</b> (variável com valor 0 aparece complementada) e some os produtos.`
    ],
    example: {
      title: `Exemplo resolvido: luz de escada que acende se os interruptores A e B estão diferentes`,
      lines: [
        `Linha 1: "diferentes" significa um 1 e o outro 0 — identificar quais linhas valem 1.`,
        `Linha 2: A = 1, B = 0 → A·B̄ e A = 0, B = 1 → Ā·B — um produto por linha; o <b>NOT</b> vai na variável que vale 0.`,
        `Linha 3: S = A·B̄ + Ā·B = A ⊕ B — soma dos produtos (é o XOR).`,
        `Linha 4: (A,B) = (0,0): 0·1 + 1·0 = 0 + 0 = 0 — S = 0.`,
        `Linha 5: (0,1): 0·0 + 1·1 = 1 e (1,0): 1·1 + 0·0 = 1 — S = 1 nas duas.`,
        `Linha 6: (1,1): 1·0 + 0·1 = 0 — S = 0.`,
        `Linha 7: S = A ⊕ B, com S = 1 apenas nas linhas 01 e 10 (2 de 4 linhas).`
      ]
    },
    traps: [
      `Misturar + (OR) com soma aritmética (1 + 1 = 2). Contramedida: em Boole, 1 + 1 = 1; escreva essa regra no topo da folha antes de preencher a tabela.`,
      `Esquecer uma linha da tabela-verdade por pular na contagem binária. Contramedida: escreva as linhas contando em binário de 000 até 111 e confirme que são 2ⁿ linhas antes de avaliar.`,
      `Aplicar o NOT na expressão errada (a barra de A·B é diferente de Ā·B̄). Contramedida: desenhe a barra cobrindo exatamente o trecho afetado e avalie esse trecho completo antes de invertê-lo.`
    ]
  };

  T[12] = {
    logic: `<p>Os <b>teoremas de De Morgan</b> relacionam AND e OR por meio do NOT: NOT(A·B) = Ā + B̄ e NOT(A+B) = Ā·B̄. Em palavras: "negar um grupo é negar cada elemento e <b>trocar AND por OR</b>". Eles provam que NAND (ou NOR) sozinha implementa qualquer função lógica, o que permite fabricar um circuito inteiro com um único tipo de porta.</p><p>Simplificar significa aplicar identidades até restar o menor número de termos e literais: A·B + A·B̄ = A·(B + B̄) = A; absorção: A + A·B = A; e a distributiva dual A + Ā·B = A + B. Cada literal eliminado é uma porta ou uma entrada a menos: menos área de silício, menos consumo e menor atraso. O mapa de Karnaugh faz o mesmo visualmente, agrupando células adjacentes com saída 1.</p><p>Na Engenharia Elétrica, S = C·(A+B) custa duas portas em vez de seis, e a mesma função fica mais rápida e barata.</p>`,
    algo: [
      `Procure primeiro <b>fatores comuns</b> e coloque-os em evidência (distributiva): X·A + X·B = X·(A + B).`,
      `Aplique o complemento: <b>B + B̄ = 1</b> e <b>B·B̄ = 0</b>; depois use A·1 = A e A + 0 = A.`,
      `Aplique a absorção <b>A + A·B = A</b> e a dual <b>A + Ā·B = A + B</b> (passo-chave de simplificação).`,
      `De Morgan: para negar uma expressão, <b>negue cada literal e troque · por +</b> (ou + por ·).`,
      `Para implementar só com NAND: use <b>duas inversões</b> (dupla negação, Ā̄ = A) e De Morgan para trocar OR por NAND de complementos.`,
      `Valide testando 2 ou 3 combinações de entrada na expressão original e na simplificada.`
    ],
    example: {
      title: `Exemplo resolvido: simplificar S = A·B·C + A·B̄·C + Ā·B·C`,
      lines: [
        `Linha 1: S = A·B·C + A·B̄·C + Ā·B·C — expressão original (3 termos, 9 literais).`,
        `Linha 2: S = C·(A·B + A·B̄ + Ā·B) — <b>C em evidência</b> (distributiva).`,
        `Linha 3: A·B + A·B̄ = A·(B + B̄) = A·1 = A — complemento: B + B̄ = 1.`,
        `Linha 4: S = C·(A + Ā·B) — substituição do resultado da Linha 3.`,
        `Linha 5: A + Ā·B = (A + Ā)·(A + B) = 1·(A + B) = A + B — distributiva da soma sobre o produto, com A + Ā = 1.`,
        `Linha 6: S = C·(A + B) — expressão simplificada (3 literais).`,
        `Linha 7: De Morgan: A + B = NOT(Ā·B̄), então S = C·NOT(Ā·B̄) — OR obtido de uma NAND com entradas complementadas.`,
        `Linha 8: teste A = 0, B = 1, C = 1: original → Ā·B·C = 1 e simplificada → 1·(0+1) = 1 ✓; A = 0, B = 0, C = 1: ambas dão 0 ✓.`
      ]
    },
    traps: [
      `Aplicar De Morgan negando só os literais e esquecendo de trocar AND por OR. Contramedida: escreva "quebra a barra, muda o sinal" e confira a troca de operador em cada aplicação.`,
      `Cancelar termos que não são complementos (A + B̄ confundido com 1). Contramedida: antes de usar B + B̄ = 1, verifique se as duas letras são idênticas, uma com barra e outra sem.`,
      `Simplificar sem validar e propagar um erro por 6 linhas. Contramedida: após cada simplificação, teste uma combinação de entrada na expressão anterior e na nova.`
    ]
  };

  /* ============================ SEMANA 4 ============================ */
  T[13] = {
    logic: `<p>Os produtos notáveis são a leitura geométrica da distributiva. (a+b)² é a área de um quadrado de lado a+b, composta por quatro regiões: a², ab, ab e b². Daí (a+b)² = a² + 2ab + b² e (a−b)² = a² − 2ab + b². O produto da soma pela diferença elimina o termo cruzado: (a+b)(a−b) = a² − b². Os cubos seguem o mesmo raciocínio (a+b)³ = a³ + 3a²b + 3ab² + b³, e o quadrado de três termos tem 3 quadrados e 3 produtos duplos.</p><p>Na Engenharia Elétrica, se uma tensão varia de V para V + ΔV, a potência em R fica proporcional a (V+ΔV)² = V² + 2VΔV + ΔV². O termo ΔV² é desprezível para ΔV pequeno, e sobra 2VΔV: é a ideia central da derivada de V². Conhecer o padrão permite expandir (para derivar) ou reconhecer o padrão (para fatorar).</p>`,
    algo: [
      `Escreva o padrão: <b>(a+b)² = a² + 2ab + b²</b> e <b>(a−b)² = a² − 2ab + b²</b>; o termo do meio sempre é 2·(primeiro)·(segundo).`,
      `Soma pela diferença: <b>(a+b)(a−b) = a² − b²</b> (sem termo do meio).`,
      `Cubos: <b>(a+b)³ = a³ + 3a²b + 3ab² + b³</b>; no (a−b)³, os sinais <b>alternam</b> (+, −, +, −).`,
      `Quadrado de três termos: <b>(a+b+c)² = a² + b² + c² + 2ab + 2ac + 2bc</b>.`,
      `Quando o primeiro termo tem coeficiente (3x+2)², <b>eleve o coeficiente ao quadrado</b> também: 9x² + 12x + 4.`,
      `Valide com um número: substitua x = 1 (ou 2) nos dois lados da igualdade.`
    ],
    example: {
      title: `Exemplo resolvido: [(x+h)² − x²]/h e conferência com x = 10, h = 0,1`,
      lines: [
        `Linha 1: (x+h)² = x² + 2xh + h² — quadrado da soma; <b>o termo do meio 2xh não pode faltar</b>.`,
        `Linha 2: (x+h)² − x² = x² + 2xh + h² <b>− x²</b> = 2xh + h² — o x² cancela.`,
        `Linha 3: (2xh + h²)/h = <b>h</b>·(2x + h)/h — fator h em evidência.`,
        `Linha 4: = 2x + h — cancelando o fator h (e não termos).`,
        `Linha 5: conferência com x = 10, h = 0,1: (10,1)² − 10² = 102,01 − 100 = 2,01 e 2,01/0,1 = 20,1.`,
        `Linha 6: fórmula: 2x + h = 2·10 + 0,1 = 20,1 ✓ — bate com a Linha 5.`,
        `Linha 7: com h muito pequeno (h → 0), resta 2x — que é a derivada de x².`
      ]
    },
    traps: [
      `Escrever (a+b)² = a² + b². Contramedida: teste com a = 1, b = 1: (2)² = 4 mas 1 + 1 = 2; escreva o termo 2ab antes de qualquer outra coisa.`,
      `Errar o sinal do termo do meio em (a−b)² ou do último termo (−b² em vez de +b²). Contramedida: anote o esquema + − + (quadrado da diferença) com a fórmula pronta ao lado.`,
      `Elevar só a variável e não o coeficiente em (3x+2)². Contramedida: escreva (3x)² = 9x² entre parênteses antes de somar os outros termos.`
    ]
  };

  T[14] = {
    logic: `<p>Fatorar é o processo inverso de aplicar a distributiva: transformar uma <b>soma</b> em <b>produto</b>. O fator comum em evidência retira o MDC dos coeficientes e a menor potência de cada variável: 6x³ − 9x² + 3x = 3x·(2x² − 3x + 1). A fatoração por agrupamento forma blocos que revelam um fator comum: ax + ay + bx + by = a(x+y) + b(x+y) = (a+b)(x+y).</p><p>Tudo pode ser verificado: distribuir de volta tem de recompor a expressão original. Por que fatorar? Um produto é zero se algum fator for zero, então produtos expõem as raízes, enquanto somas escondem a estrutura.</p><p>Na Engenharia Elétrica, P = I²R₁ + I²R₂ + I²R₃ = I²(R₁+R₂+R₃) revela que em série a mesma corrente atravessa todos, e a potência total é I² vezes a resistência equivalente. A fatoração expõe a estrutura física da fórmula.</p>`,
    algo: [
      `Ache o <b>MDC dos coeficientes</b> e a <b>menor potência</b> de cada variável presente em todos os termos: esse é o fator comum.`,
      `Escreva o fator comum e, entre parênteses, <b>divida cada termo</b> por ele; se o termo for igual ao fator, sobra <b>1</b>, nunca 0.`,
      `Mantenha os sinais dos termos originais: <b>o sinal de cada termo é preservado</b> ao dividir pelo fator positivo.`,
      `Agrupamento: separe em <b>pares</b>, ponha o fator comum de cada par em evidência e veja se o parêntese restante é <b>igual</b> nos dois.`,
      `Se o sinal do segundo grupo for −, <b>coloque −fator em evidência</b> para inverter os sinais internos e igualar os parênteses.`,
      `<b>Verifique distribuindo de volta</b> o resultado; deve reproduzir a expressão original termo a termo.`
    ],
    example: {
      title: `Exemplo resolvido: agrupamento, 6x³ − 9x² + 3x e P = I²(R₁+R₂+R₃)`,
      lines: [
        `Linha 1: ax + ay + bx + by = (ax + ay) + (bx + by) — separar em pares.`,
        `Linha 2: = a(x + y) + b(x + y) = (x + y)(a + b) — o <b>parêntese (x+y)</b> é o novo fator comum.`,
        `Linha 3: 6x³ − 9x² + 3x — MDC(6, 9, 3) = 3 e a menor potência de x é x¹, logo o fator é 3x.`,
        `Linha 4: 6x³/3x = 2x², −9x²/3x = <b>−3x</b>, 3x/3x = <b>1</b> → 3x·(2x² − 3x + 1) — o último termo vira 1, não 0.`,
        `Linha 5: verificação: 3x·2x² − 3x·3x + 3x·1 = 6x³ − 9x² + 3x ✓.`,
        `Linha 6: I = 2 A, R₁ = 3 Ω, R₂ = 5 Ω, R₃ = 7 Ω: P = I²(R₁+R₂+R₃) = 4·15 = 60 W — conferência: 4·3 + 4·5 + 4·7 = 12 + 20 + 28 = 60 W ✓.`
      ]
    },
    traps: [
      `Colocar o fator em evidência e deixar 0 onde o termo era igual ao fator (3x/3x virou 0). Contramedida: escreva cada divisão individualmente (termo ÷ fator) e confirme que o parêntese tem o mesmo número de termos que a expressão original.`,
      `Trocar o sinal de um termo ao dividir (o −9x² virar +3x). Contramedida: sublinhe o sinal de cada termo original e confira que ele reaparece igual dentro do parêntese.`,
      `Não verificar o resultado e entregar uma fatoração errada. Contramedida: sempre distribua de volta (1 linha) e compare termo a termo com o original antes de marcar como concluído.`
    ]
  };

  T[15] = {
    logic: `<p>Cada produto notável lido ao contrário vira um método de fatoração. <b>Trinômio quadrado perfeito:</b> a² ± 2ab + b² = (a ± b)². <b>Soma e Produto:</b> (x+p)(x+q) = x² + (p+q)x + pq, então para fatorar x² + Sx + P procure dois números com <b>produto P e soma S</b>. <b>Diferença de quadrados:</b> a² − b² = (a−b)(a+b). <b>Cubos:</b> a³ − b³ = (a−b)(a²+ab+b²) e a³ + b³ = (a+b)(a²−ab+b²).</p><p>Um polinômio fatorado mostra suas raízes: cada fator (x − r) vale zero em x = r. Por isso fatorar equivale a resolver a equação.</p><p>Na Engenharia Elétrica, a equação característica de um circuito RLC ou de um sistema de controle, como s² + 7s + 12 = (s+3)(s+4), tem raízes (polos) s = −3 e s = −4. Como ambas são negativas, a resposta decai exponencialmente e o sistema é estável. Raízes positivas indicariam resposta que cresce sem limite.</p>`,
    algo: [
      `Trinômio x² + Sx + P: liste os <b>pares de fatores de P</b> e escolha o par cuja <b>soma é S</b> (atenção aos sinais de ambos).`,
      `Escreva (x + p)(x + q) e <b>verifique expandindo</b>; as raízes são <b>−p e −q</b> (sinais trocados).`,
      `Trinômio quadrado perfeito: confirme que o primeiro e o último termo são quadrados e que o <b>termo do meio = 2·a·b</b>; então (a ± b)².`,
      `Diferença de quadrados: <b>a² − b² = (a−b)(a+b)</b>; extraia as raízes dos dois termos, incluindo os coeficientes (9x² = (3x)²).`,
      `Cubos: <b>a³ − b³ = (a−b)(a²+ab+b²)</b> e <b>a³ + b³ = (a+b)(a²−ab+b²)</b> (o último termo é sempre positivo).`,
      `Sempre procure primeiro um fator comum em evidência; depois aplique o método adequado e verifique distribuindo.`
    ],
    example: {
      title: `Exemplo resolvido: polos de s² + 7s + 12 e fatorações notáveis`,
      lines: [
        `Linha 1: s² + 7s + 12 — buscar a·b = 12 e a + b = 7; (1,12) soma 13 ✗; (2,6) soma 8 ✗; (3,4) soma 7 ✓.`,
        `Linha 2: s² + 7s + 12 = (s + 3)(s + 4) — par encontrado.`,
        `Linha 3: verificação: (s+3)(s+4) = s² + 4s + 3s + 12 = s² + 7s + 12 ✓.`,
        `Linha 4: 9x² − 16 = (3x)² − 4² = (3x − 4)(3x + 4) — diferença de quadrados, sem termo do meio.`,
        `Linha 5: x³ − 27 = x³ − 3³ = (x − 3)(x² + <b>3x</b> + 9) — a³ − b³ com a = x, b = 3.`,
        `Linha 6: raízes: s + 3 = 0 → s = <b>−3</b> e s + 4 = 0 → s = <b>−4</b> (em s⁻¹), ambas negativas, logo o sistema é estável.`
      ]
    },
    traps: [
      `Escolher o par de fatores com produto correto, mas ignorar a soma (ou o sinal). Contramedida: monte uma tabelinha com colunas par, produto e soma, e só circule o par que satisfaz as duas.`,
      `Trocar o sinal das raízes (afirmar que a raiz é +3 para (s+3)). Contramedida: escreva (s+3) = 0 → s = −3 como linha explícita; nunca leia a raiz direto do parêntese.`,
      `Fatorar x² + 9 como (x+3)(x−3) ou usar diferença de quadrados numa soma. Contramedida: confirme o sinal de menos entre os dois quadrados antes de aplicar a² − b².`
    ]
  };

  T[16] = {
    logic: `<p>Uma fração algébrica é uma razão de polinômios, e o seu <b>domínio</b> exclui os valores que zeram o denominador: dividir por zero não é definido. Simplificar significa fatorar o numerador e o denominador e cancelar fatores comuns (<b>nunca termos</b>): (x²−x−2)/(x²−4) = (x−2)(x+1)/((x−2)(x+2)) = (x+1)/(x+2), mas a restrição x ≠ 2 continua valendo na expressão original. Somar frações algébricas segue a aritmética: fatore os denominadores, ache o MMC dos polinômios, converta e some os numeradores.</p><p>Quando x → a e o resultado direto é 0/0, a expressão é uma indeterminação: há um fator (x − a) escondido no numerador e no denominador. Fatorar e cancelar o revela, e o limite é o valor da forma simplificada em x = a. É a técnica central de Cálculo I.</p><p>Na Engenharia Elétrica, funções de transferência H(s) são razões de polinômios: raízes do numerador são zeros, e raízes do denominador são polos.</p>`,
    algo: [
      `Antes de tudo, <b>escreva o domínio</b>: iguale cada denominador a 0 e registre os valores proibidos.`,
      `<b>Fatore</b> numerador e denominador (evidência, trinômio, diferença de quadrados).`,
      `<b>Cancele apenas fatores idênticos</b> (parênteses inteiros), nunca termos de uma soma.`,
      `Para somar: fatore os denominadores, calcule o <b>MMC dos polinômios</b>, multiplique cada numerador pelo fator que falta e <b>some os numeradores</b>.`,
      `Para multiplicar, fatore tudo e simplifique antes; para dividir, <b>inverta</b> a segunda fração.`,
      `Para limites: se a substituição direta dá <b>0/0</b>, fatore e cancele o fator (x − a); só então substitua x = a.`
    ],
    example: {
      title: `Exemplo resolvido: simplificar (x²−x−2)/(x²−4) e calcular o limite com x → 2`,
      lines: [
        `Linha 1: domínio: x² − 4 ≠ 0 → x ≠ 2 e x ≠ −2 — registrar antes de simplificar.`,
        `Linha 2: numerador: a·b = −2 e a + b = −1 → (−2)·(+1); então x² − x − 2 = (x − 2)(x + 1).`,
        `Linha 3: denominador: x² − 4 = x² − 2² = (x − 2)(x + 2) — diferença de quadrados.`,
        `Linha 4: (x−2)(x+1)/((x−2)(x+2)) = (x+1)/(x+2) — <b>cancela o fator (x − 2)</b> inteiro, com x ≠ 2.`,
        `Linha 5: teste em x = 3: original (9−3−2)/(9−4) = 4/5 e simplificada (3+1)/(3+2) = 4/5 ✓.`,
        `Linha 6: em x = 2 a original dá 0/0 (indeterminação), mas a simplificada dá (2+1)/(2+2) = 3/4 — valor do limite.`,
        `Linha 7: lim (x→2) (x²−x−2)/(x²−4) = 3/4 — a expressão se aproxima de 3/4 sem nunca valer 3/4 em x = 2.`
      ]
    },
    traps: [
      `Cancelar termos em vez de fatores, como em (x+1)/(x+2) = 1/2. Contramedida: só corte quando houver um parêntese inteiro igual em cima e embaixo, ligado por produto; circule os dois fatores iguais.`,
      `Esquecer de registrar o domínio e afirmar que a expressão simplificada vale para todo x. Contramedida: a primeira linha é sempre denominador ≠ 0; reescreva a restrição no resultado final.`,
      `Substituir x = a direto, ver 0/0 e travar ou declarar que não existe. Contramedida: escreva 0/0 → fatorar → cancelar → substituir como roteiro de 4 passos fixo.`
    ]
  };
})(window);
