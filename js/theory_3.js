(function (g) {
  "use strict";
  const NE = (g.NE = g.NE || {});
  const T = (NE.Theory = NE.Theory || {});

  /* ===================== SEMANA 9 — Senoides e CA ===================== */

  T[33] = {
    logic: `<p>O círculo unitário (raio 1, centro na origem) transforma ângulo em coordenadas: o ponto no ângulo θ é (cos θ, sen θ). Cosseno é a projeção no eixo x e seno é a projeção no eixo y. O radiano mede o ângulo pelo comprimento do arco: π rad = 180°, e uma volta completa = 2π. Por isso ele é a unidade natural do Cálculo, sem constantes extras.</p><p>Os quatro quadrantes fixam os sinais: 1º (+,+), 2º (sen +, cos −), 3º (−,−), 4º (sen −, cos +). Qualquer ângulo se reduz a um ângulo de referência α no 1º quadrante, e o valor é ± o de α.</p><p>Na Eletricidade, uma tensão senoidal é a sombra de um ponteiro girando no círculo: ωt é o ângulo do ponteiro, e uma volta completa é um período T. A fase inicial, como 4π/3 rad, diz onde o ponteiro estava em t = 0 e, portanto, a tensão inicial.</p>`,
    algo: [
      `Converta graus → rad multiplicando por <b>π/180</b> e simplifique a fração. Converta rad → graus multiplicando por <b>180/π</b>.`,
      `Reduza o ângulo ao intervalo de 0° a 360°: subtraia <b>360°</b> (ou 2π) enquanto for maior; some se for negativo.`,
      `Identifique o quadrante: 1º até 90°, 2º até 180°, 3º até 270°, 4º até 360°.`,
      `Calcule o ângulo de referência α: 2º → <b>180° − θ</b>; 3º → <b>θ − 180°</b>; 4º → <b>360° − θ</b>.`,
      `Calcule sen α e cos α com os valores notáveis (30°, 45°, 60°) e <b>aplique o sinal do quadrante</b> em cada um separadamente.`,
      `Confira com sen² + cos² = 1 antes de seguir.`
    ],
    example: {
      title: `Exemplo resolvido: sen e cos de 240° e a tensão inicial de v(t) = 10·sen(ωt + 240°) V`,
      lines: [
        `Linha 1: 240° · π/180 = 240π/180 = 4π/3 rad — simplifica dividindo numerador e denominador por 60.`,
        `Linha 2: 180° ≤ 240° ≤ 270° — o ângulo está no <b>3º quadrante</b>.`,
        `Linha 3: α = 240° − 180° = 60° — ângulo de referência no 1º quadrante.`,
        `Linha 4: sen 60° = √3/2 e cos 60° = 1/2 — valores notáveis, ainda sem sinal.`,
        `Linha 5: sen 240° = <b>−√3/2</b> e cos 240° = <b>−1/2</b> — no 3º quadrante seno e cosseno são negativos.`,
        `Linha 6: (−√3/2)² + (−1/2)² = 3/4 + 1/4 = 1 — a conferência fecha.`,
        `Linha 7: v(0) = 10·sen 240° = 10·(<b>−√3/2</b>) ≈ −8,66 V — a tensão inicial é negativa, como o ponteiro abaixo do eixo x indica.`
      ]
    },
    traps: [
      `Confundir a fórmula de conversão e multiplicar por 180/π ao ir de graus para radianos. Antes de calcular, escreva a unidade de chegada e confira: 180° deve virar π.`,
      `Aplicar o sinal do quadrante só no seno e esquecer o cosseno (ou o contrário). Escreva duas colunas, sen e cos, e marque + ou − em cada uma antes do número.`,
      `Calcular o ângulo de referência sempre como 180° − θ, mesmo no 3º ou 4º quadrante. Desenhe o círculo, circule o quadrante e só então escolha a fórmula de α.`
    ]
  };

  T[34] = {
    logic: `<p>A senoide v(t) = A·sen(ωt + θ) é o ponteiro de comprimento A girando a ω rad/s, observado só pela projeção vertical. A amplitude A é o pico; ω = 2πf diz quantos radianos o ponteiro avança por segundo; o período T = 2π/ω = 1/f é o tempo de uma volta. A fase θ é o ângulo inicial: como ωt + θ = ω(t + θ/ω), a curva é deslocada no tempo de θ/ω, para a esquerda se θ for positivo (adiantada).</p><p>Cada parâmetro aparece no osciloscópio: A é a altura do pico, T é a distância horizontal entre dois picos, e θ é o deslocamento horizontal em relação a uma referência. Na tomada, Vp = 311 V e f = 60 Hz dão ω ≈ 377 rad/s. Em um sinal de áudio ou de clock de 1 kHz, T = 1 ms. Quem não separa f de ω erra o argumento do seno por um fator 2π.</p>`,
    algo: [
      `Leia a amplitude A: o número que multiplica o seno (o pico, não o valor pico a pico).`,
      `Se for dada a frequência f, calcule <b>ω = 2π·f</b> (rad/s). Se for dado ω, calcule <b>f = ω/2π</b>.`,
      `Calcule o período: <b>T = 1/f = 2π/ω</b>.`,
      `Converta a fase para radianos se vier em graus, <b>antes</b> de somar com ωt. Nunca misture graus e radianos no mesmo argumento.`,
      `Para v em um instante t: calcule o argumento ωt + θ, <b>calculadora em radianos</b>, e só depois aplique o seno.`,
      `Para o deslocamento no tempo: <b>Δt = θ/ω</b> (θ positivo = adiantada, curva deslocada para a esquerda).`
    ],
    example: {
      title: `Exemplo resolvido: v(t) = 12·sen(2π·1000·t + π/6) V`,
      lines: [
        `Linha 1: A = 12 V, f = 1000 Hz, θ = π/6 rad (= 30°) — leitura direta dos parâmetros.`,
        `Linha 2: ω = 2π·1000 ≈ 6283 rad/s — a frequência angular é 2π vezes f.`,
        `Linha 3: T = 1/1000 s = 1 ms — o período é o inverso de f.`,
        `Linha 4: v(0) = 12·sen(π/6) = 12·0,5 = 6 V — no instante inicial só a fase atua.`,
        `Linha 5: em t = 0,25 ms, ωt = 2π·1000·0,25×10⁻³ = π/2 — um quarto de volta.`,
        `Linha 6: argumento = π/2 + π/6 = <b>3π/6 + π/6</b> = 4π/6 = 2π/3 — soma com denominador comum (MMC = 6).`,
        `Linha 7: v(0,25 ms) = 12·sen(2π/3) = 12·(√3/2) ≈ 10,39 V.`,
        `Linha 8: Δt = θ/ω = (π/6)/(2π·1000) = 1/12000 s ≈ 83,3 μs — a curva está adiantada em 83,3 μs (1/12 do período).`
      ]
    },
    traps: [
      `Usar f no lugar de ω dentro do seno e esquecer o 2π. Antes de qualquer conta, escreva ω = 2π·f em uma linha própria.`,
      `Deixar a calculadora em graus enquanto o argumento está em radianos (ou o contrário). Antes de calcular, escreva RAD ou DEG ao lado do argumento e confira o modo.`,
      `Somar fase em graus com ωt em radianos, por exemplo 377t + 30. Converta a fase para radianos (30° = π/6) e circule a unidade de cada termo antes de somar.`
    ]
  };

  T[35] = {
    logic: `<p>Todas as identidades saem de uma ideia: o ponto (cos x, sen x) está sobre o círculo unitário. Pitágoras dá sen²x + cos²x = 1. A rotação de um vetor dá as fórmulas da soma: sen(a+b) = sen a·cos b + cos a·sen b e cos(a+b) = cos a·cos b − sen a·sen b. Fazendo a = b, saem as de arco duplo: sen 2x = 2·sen x·cos x e cos 2x = cos²x − sen²x = 1 − 2·sen²x. Deslocar 90° troca seno por cosseno: sen(x + π/2) = cos x.</p><p>Isolando sen²x em cos 2x = 1 − 2·sen²x, obtém-se sen²x = (1 − cos 2x)/2. A parcela cos 2x oscila em torno de zero, então a média de sen²x é 1/2.</p><p>Na Eletricidade, a potência instantânea num resistor é p = v²/R = Vp²·sen²(ωt)/R. Sua média é Vp²/(2R), e daí vem o valor eficaz Vrms = Vp/√2.</p>`,
    algo: [
      `Antes de manipular, escreva as identidades-base: <b>sen² + cos² = 1</b>, soma de arcos e arco duplo.`,
      `Para quadrado de soma, expanda como produto notável: (sen x + cos x)² = sen²x + <b>2·sen x·cos x</b> + cos²x. Não esqueça o termo do meio.`,
      `Agrupe sen² + cos² e <b>substitua por 1</b>. Reconheça 2·sen x·cos x como sen 2x.`,
      `Para a média de sen²x ou cos²x, use <b>sen²x = (1 − cos 2x)/2</b> e <b>cos²x = (1 + cos 2x)/2</b>.`,
      `A média de qualquer cos(kx) com k ≠ 0 em ciclos completos é <b>zero</b>; sobra só a constante.`,
      `Confira com um valor numérico simples, como x = 0 ou x = π/2.`
    ],
    example: {
      title: `Exemplo resolvido: potência média de v(t) = 10·sen(ωt) V sobre R = 5 Ω`,
      lines: [
        `Linha 1: p(t) = v²/R = 100·sen²(ωt)/5 = 20·sen²(ωt) W — potência instantânea.`,
        `Linha 2: cos 2x = 1 − 2·sen²x — identidade de arco duplo com x = ωt.`,
        `Linha 3: 2·sen²x = 1 <b>− cos 2x</b> — passa cos 2x para o outro lado e <b>troca o sinal</b>.`,
        `Linha 4: sen²x = (1 − cos 2x)/2 — divide ambos os lados por 2.`,
        `Linha 5: p(t) = 20·(1 − cos 2ωt)/2 = <b>10·(1 − cos 2ωt)</b> = 10 − 10·cos 2ωt — distribui o 10 e <b>o sinal negativo</b> segue o cosseno.`,
        `Linha 6: média de cos 2ωt = 0 — oscila igualmente acima e abaixo de zero.`,
        `Linha 7: P média = 10 − 0 = 10 W — confere com Vp²/(2R) = 100/10 = 10 W.`,
        `Linha 8: Vrms = 10/√2 ≈ 7,07 V e Vrms²/R = 50/5 = 10 W — o fator 1/2 vira Vp/√2.`
      ]
    },
    traps: [
      `Escrever (sen x + cos x)² = sen²x + cos²x, esquecendo o termo 2·sen x·cos x. Antes de simplificar, escreva o produto notável completo com os três termos.`,
      `Errar o sinal ao isolar sen²x e escrever (1 + cos 2x)/2. Faça o isolamento em uma linha própria: 2·sen²x = 1 − cos 2x. Teste com x = 0: sen²0 = 0 e (1 − 1)/2 = 0.`,
      `Aplicar sen(a+b) = sen a + sen b, tratando o seno como linear. Circule a palavra soma de arcos e escreva a fórmula completa com os dois produtos antes de substituir.`
    ]
  };

  T[36] = {
    logic: `<p>Duas senoides de mesma frequência diferem apenas na fase. Escrevendo v = Vp·sen(ωt) e i = Ip·sen(ωt − φ), o ângulo φ é o quanto a corrente chega depois da tensão: φ positivo (i atrasada) é circuito indutivo; φ negativo (i adiantada) é capacitivo. O fasor é o ponteiro girante congelado em t = 0: tem módulo (amplitude) e ângulo (fase), e a defasagem é o ângulo entre dois fasores.</p><p>Fase e tempo se convertem por proporção: um ciclo (360° ou 2π) corresponde a um período T, logo Δt = (φ/360°)·T = φ/ω.</p><p>Na Engenharia Elétrica, φ governa o fator de potência cos φ, e a potência média é P = Vrms·Irms·cos φ. Uma indústria com cos φ baixo puxa corrente que não vira trabalho e é multada pela concessionária.</p>`,
    algo: [
      `Escreva as duas funções com o <b>mesmo ω</b>. Se o ω for diferente, não há defasagem fixa.`,
      `Compare as fases: calcule <b>φ = θ_v − θ_i</b>. Se φ for positivo, a tensão está adiantada em relação à corrente.`,
      `Classifique: corrente atrasada (φ ≥ 0) = <b>indutivo</b>; corrente adiantada (φ ≤ 0) = <b>capacitivo</b>.`,
      `Converta fase em tempo: <b>Δt = (φ/360°)·T</b>, com T = 1/f.`,
      `Para o fator de potência use <b>cos φ</b> e para a potência média, <b>P = Vrms·Irms·cos φ</b>, com Vrms = Vp/√2 e Irms = Ip/√2.`
    ],
    example: {
      title: `Exemplo resolvido: v(t) = 311·sen(377t) V e i(t) = 5·sen(377t − 45°) A, f = 60 Hz`,
      lines: [
        `Linha 1: θ_v = 0° e θ_i = −45° — lê-se a fase de cada função, ambas com ω = 377 rad/s.`,
        `Linha 2: φ = θ_v − θ_i = 0° − (<b>−45°</b>) = <b>0° + 45°</b> = 45° — subtrair um negativo soma.`,
        `Linha 3: φ ≥ 0, então a tensão está adiantada e a corrente atrasada em 45° — carga indutiva.`,
        `Linha 4: T = 1/60 ≈ 16,67 ms — período da rede.`,
        `Linha 5: Δt = (45°/360°)·16,67 ms = (1/8)·16,67 ≈ 2,08 ms — atraso da corrente.`,
        `Linha 6: FP = cos 45° = √2/2 ≈ 0,707 — fator de potência.`,
        `Linha 7: P = (311/√2)·(5/√2)·0,707 = (1555/2)·0,707 = 777,5·0,707 ≈ 550 W — potência média ativa.`
      ]
    },
    traps: [
      `Subtrair as fases na ordem errada ou perder o sinal de uma fase negativa (0° − (−45°) virar −45°). Escreva as fases entre parênteses, com sinal, e faça θ_v − θ_i em uma linha só para isso.`,
      `Inverter quem está adiantada e quem está atrasada. Lembre que ωt + θ com θ positivo chega antes. Anote a conclusão com palavras (a corrente atrasa) antes de ir ao próximo passo.`,
      `Usar valores de pico em P = V·I·cos φ, o que dobra a potência. Escreva Vrms = Vp/√2 e Irms = Ip/√2 antes de multiplicar.`
    ]
  };

  /* ===================== SEMANA 10 — Geometria Analítica ===================== */

  T[37] = {
    logic: `<p>O plano cartesiano associa cada ponto a um par (x, y), o que permite tratar geometria com álgebra. A distância entre A(x₁, y₁) e B(x₂, y₂) é Pitágoras: o segmento AB é a hipotenusa de um triângulo retângulo cujos catetos são Δx e Δy, logo d = √[(Δx)² + (Δy)²]. O ponto médio é a média das coordenadas, e o baricentro de um triângulo é a média das três.</p><p>Três pontos estão alinhados quando os vetores AB e AC têm a mesma direção, isto é, quando os coeficientes angulares coincidem, ou quando o determinante das coordenadas é zero. Geometricamente, o triângulo ABC tem área nula.</p><p>Na Engenharia Elétrica, o layout de uma PCB é um plano em milímetros: o comprimento de uma trilha entre dois pinos é uma distância, e o ponto médio posiciona um capacitor de desacoplamento. Em um robô, a distância ao alvo vem da mesma fórmula.</p>`,
    algo: [
      `Marque as coordenadas e escreva <b>Δx = x₂ − x₁</b> e <b>Δy = y₂ − y₁</b> separadamente, com os sinais.`,
      `Distância: calcule <b>√(Δx² + Δy²)</b>. Eleve ao quadrado cada diferença (o quadrado elimina o sinal) e some antes de tirar a raiz.`,
      `Ponto médio: <b>M = ((x₁+x₂)/2 ; (y₁+y₂)/2)</b>. Some as coordenadas e depois divida por 2.`,
      `Baricentro de A, B e C: <b>G = ((x_A+x_B+x_C)/3 ; (y_A+y_B+y_C)/3)</b>.`,
      `Alinhamento: calcule o determinante <b>x_A(y_B − y_C) + x_B(y_C − y_A) + x_C(y_A − y_B)</b>. Resultado 0 significa pontos alinhados.`,
      `Confirme comparando os coeficientes angulares AB e AC.`
    ],
    example: {
      title: `Exemplo resolvido: A(−2, 1), B(4, 9) e C(1, 5), em mm sobre uma PCB`,
      lines: [
        `Linha 1: Δx = 4 − (<b>−2</b>) = <b>4 + 2</b> = 6 e Δy = 9 − 1 = 8 — a subtração de negativo vira soma.`,
        `Linha 2: d(AB) = √(6² + 8²) = √(36 + 64) = √100 = 10 mm — comprimento da trilha.`,
        `Linha 3: M = ((−2 + 4)/2 ; (1 + 9)/2) = (2/2 ; 10/2) = (1 ; 5) — igual ao ponto C.`,
        `Linha 4: det = −2·(9 − 5) + 4·(5 − 1) + 1·(1 − 9) = −8 + 16 − 8 = 0 — A, B e C estão alinhados.`,
        `Linha 5: m(AB) = 8/6 = 4/3 e m(AC) = (5 − 1)/(1 − (<b>−2</b>)) = 4/3 — coeficientes iguais, confirma.`,
        `Linha 6: com D(1, 2): G = ((−2 + 4 + 1)/3 ; (1 + 9 + 2)/3) = (3/3 ; 12/3) = (1 ; 4) — baricentro de ABD.`
      ]
    },
    traps: [
      `Errar o sinal em x₂ − x₁ quando a coordenada é negativa (4 − (−2) virar 2). Escreva a subtração com parênteses em torno do negativo e converta para soma no passo seguinte.`,
      `Esquecer a raiz final ou esquecer de elevar ao quadrado, e responder 100 em vez de 10. Escreva √( ) com o conteúdo completo antes de calcular.`,
      `Calcular o ponto médio dividindo só uma das coordenadas ou somando sem dividir. Faça duas linhas separadas, uma para x e uma para y, e circule o 2 do denominador em cada uma.`
    ]
  };

  T[38] = {
    logic: `<p>O coeficiente angular m = Δy/Δx é a taxa de variação: quanto y muda para cada unidade de x. Em uma reta essa taxa é constante, e por isso um ponto e uma inclinação definem a reta toda: y − y₀ = m(x − x₀). A forma geral ax + by + c = 0 é a mesma reta com tudo de um lado. Retas paralelas têm o mesmo m; perpendiculares têm m₁·m₂ = −1, porque girar 90° troca Δx e Δy e inverte um deles.</p><p>A distância de P(x₀, y₀) à reta ax + by + c = 0 é d = |a·x₀ + b·y₀ + c|/√(a² + b²), o comprimento do segmento perpendicular.</p><p>Na Eletricidade, uma curva I-V de resistor é uma reta com m = 1/R, e a reta de carga de um transistor é V = Vcc − R·I, com inclinação −R. A mesma ideia vira a derivada em Cálculo I: a inclinação local de uma curva.</p>`,
    algo: [
      `Calcule o coeficiente angular: <b>m = (y₂ − y₁)/(x₂ − x₁)</b>, mantendo a <b>mesma ordem</b> de subtração no numerador e no denominador.`,
      `Escreva a ponto-inclinação: <b>y − y₁ = m·(x − x₁)</b>. Distribua m e isole y para a forma reduzida.`,
      `Para a forma geral, passe tudo para um lado: <b>ax + by + c = 0</b>.`,
      `Para a perpendicular, use <b>m⊥ = −1/m</b> (inverta e troque o sinal). Para a paralela, use o mesmo m.`,
      `Distância de ponto a reta: coloque a reta na forma geral e calcule <b>|a·x₀ + b·y₀ + c|/√(a² + b²)</b>.`,
      `Teste: substitua os dois pontos originais na equação final.`
    ],
    example: {
      title: `Exemplo resolvido: reta por P(1, −1) e Q(5, 7)`,
      lines: [
        `Linha 1: m = (7 − (<b>−1</b>))/(5 − 1) = (<b>7 + 1</b>)/4 = 8/4 = 2 — subtrair o negativo soma.`,
        `Linha 2: y − (<b>−1</b>) = 2·(x − 1) → y <b>+ 1</b> = 2x − 2 — o sinal duplo vira soma; a distributiva dá 2x − 2.`,
        `Linha 3: y = 2x − 2 <b>− 1</b> = 2x − 3 — passa o +1 para o outro lado com sinal trocado.`,
        `Linha 4: forma geral: 2x − y − 3 = 0 — com a = 2, b = −1, c = −3.`,
        `Linha 5: m⊥ = −1/2, passando pela origem: y = −x/2 — perpendicular, pois 2·(−1/2) = −1.`,
        `Linha 6: d(origem, reta) = |2·0 + (−1)·0 − 3|/√(2² + (−1)²) = 3/√5 ≈ 1,34 — distância da origem à reta.`,
        `Linha 7: teste em Q: 2·5 − 3 = 7 ✓ — o ponto satisfaz a equação.`
      ]
    },
    traps: [
      `Inverter a ordem de subtração só no numerador ou só no denominador e errar o sinal de m. Escreva (y₂ − y₁) e (x₂ − x₁) lado a lado, com cada ponto entre parênteses.`,
      `Esquecer de distribuir o m em todo o parêntese em y − y₁ = m(x − x₁), por exemplo 2(x − 1) virar 2x − 1. Desenhe setas da distributiva sobre cada termo do parêntese.`,
      `Para a perpendicular, só inverter m ou só trocar o sinal. Escreva m₁·m₂ e confira que o produto dá −1 antes de usar o resultado.`
    ]
  };

  T[39] = {
    logic: `<p>Uma circunferência é o conjunto dos pontos a distância r de um centro C(a, b). Aplicando a fórmula da distância e elevando ao quadrado, obtém-se (x − a)² + (y − b)² = r². Essa forma reduzida mostra centro e raio diretamente. Desenvolvendo, aparece a forma geral x² + y² + Dx + Ey + F = 0. Para voltar à forma reduzida, completam-se quadrados: x² + Dx vira (x + D/2)² − D²/4, e o mesmo vale para y. É o mesmo truque dos produtos notáveis.</p><p>Um ponto P está dentro, sobre ou fora conforme (x − a)² + (y − b)² seja menor, igual ou maior que r². Para interseção com uma reta, substitui-se a reta na circunferência e resolve-se uma equação do 2º grau: Δ ≥ 0 indica o número de pontos.</p><p>Na Engenharia Elétrica, a ponta de um fasor de módulo r descreve um círculo no plano complexo à medida que ωt avança.</p>`,
    algo: [
      `Agrupe os termos em x, os termos em y e <b>passe a constante para o lado direito (trocando o sinal)</b>.`,
      `Complete o quadrado em x: some <b>(D/2)²</b> aos dois lados. Faça o mesmo em y com <b>(E/2)²</b>.`,
      `Fatore: <b>(x + D/2)² + (y + E/2)² = r²</b>. Lembre que o centro tem o sinal oposto ao que aparece no parêntese: (x + 2) significa a = −2.`,
      `Leia centro C(a, b) e raio <b>r = √(lado direito)</b>.`,
      `Posição de um ponto P: calcule (x_P − a)² + (y_P − b)² e compare com <b>r²</b> (menor = dentro; igual = sobre; maior = fora).`,
      `Interseção com reta: substitua y (ou x) na equação da circunferência e resolva o 2º grau.`
    ],
    example: {
      title: `Exemplo resolvido: x² + y² + 4x − 6y − 12 = 0`,
      lines: [
        `Linha 1: (x² + 4x) + (y² − 6y) = <b>+12</b> — a constante −12 passa para a direita com o sinal trocado.`,
        `Linha 2: (4/2)² = 4 e (−6/2)² = 9 — termos para completar os quadrados.`,
        `Linha 3: (x² + 4x + 4) + (y² − 6y + 9) = 12 + 4 + 9 — soma-se 4 e 9 aos <b>dois</b> lados.`,
        `Linha 4: (x + 2)² + (y <b>− 3</b>)² = 25 — fatoração, e o sinal do parêntese é oposto ao do termo linear.`,
        `Linha 5: centro C(<b>−2</b>, 3) e raio r = √25 = 5 — o centro tem o sinal contrário ao do parêntese.`,
        `Linha 6: P(1, 7): (1 + 2)² + (7 − 3)² = 9 + 16 = 25 — igual a r², então P pertence à circunferência.`,
        `Linha 7: O(0, 0): (0 + 2)² + (0 − 3)² = 4 + 9 = 13 ≤ 25 — a origem é interior.`,
        `Linha 8: reta y = 3: (x + 2)² = 25 → x + 2 = ±5 → x = 3 ou x = −7 — pontos (3, 3) e (−7, 3).`
      ]
    },
    traps: [
      `Somar o termo de completar quadrados só do lado esquerdo e esquecer o lado direito. Desenhe uma seta e escreva +4 e +9 nos dois lados da igualdade.`,
      `Ler o centro com o sinal errado, por exemplo (x + 2)² virar a = 2. Escreva (x − (−2))² para enxergar o sinal e anote C(−2, 3).`,
      `Esquecer de tirar a raiz e responder r = 25 em vez de r = 5. Circule o lado direito, escreva r² = 25 e depois r = √25.`
    ]
  };

  T[40] = {
    logic: `<p>Cônicas são os cortes de um cone por um plano: elipse (soma das distâncias a dois focos é constante), parábola (distância ao foco igual à distância à diretriz) e hipérbole (diferença das distâncias aos focos é constante). A parábola x² = 4py tem foco em (0, p) e diretriz y = −p. Toda onda que chega paralela ao eixo é refletida para o foco, e é por isso que as antenas parabólicas colocam o receptor ali.</p><p>A tangente a uma curva em um ponto é a reta que a toca localmente. Na circunferência, ela é perpendicular ao raio naquele ponto: m_tangente = −1/m_raio. Em y = x², a inclinação em x = a é o limite de [(a+h)² − a²]/h = 2a + h quando h → 0, isto é, 2a. É a ideia da derivada.</p><p>Na Engenharia Elétrica, a parábola dá o ganho de antenas e refletores de RF, e a elipse aparece nas figuras de Lissajous do osciloscópio, quando duas senoides defasadas são plotadas uma contra a outra.</p>`,
    algo: [
      `Identifique a cônica pela equação: x² + y² = r² (círculo), <b>x² = 4py</b> (parábola), x²/a² + y²/b² = 1 (elipse), x²/a² − y²/b² = 1 (hipérbole). Observe o sinal entre os quadrados.`,
      `Na parábola x² = 4py, isole <b>4p</b> comparando com a equação dada. O foco está em (0, p) e a diretriz é y = −p.`,
      `Tangente a um círculo em P(x₀, y₀): calcule o coeficiente do raio <b>m_r = y₀/x₀</b> (centro na origem) e use <b>m_t = −1/m_r</b>.`,
      `Alternativa direta para o círculo centrado na origem: a tangente é <b>x₀·x + y₀·y = r²</b>.`,
      `Para a inclinação em uma curva, calcule <b>[f(a+h) − f(a)]/h</b>, simplifique o h do numerador e faça h tender a 0.`,
      `Escreva a tangente: <b>y − f(a) = m·(x − a)</b>.`
    ],
    example: {
      title: `Exemplo resolvido: tangentes em x² + y² = 25 no ponto (−3, 4) e em y = x² no ponto x = 2`,
      lines: [
        `Linha 1: m_raio = 4/(<b>−3</b>) = −4/3 — o raio vai da origem a (−3, 4).`,
        `Linha 2: m_tangente = −1/(−4/3) = <b>+3/4</b> — inverte a fração e o sinal negativo se cancela com o do coeficiente.`,
        `Linha 3: y − 4 = (3/4)(x + 3) → 4y − 16 = 3x + 9 — multiplica por 4 e distribui.`,
        `Linha 4: −3x + 4y = 25 — confere com x₀x + y₀y = 25: (−3)x + 4y = 25 ✓.`,
        `Linha 5: [(2 + h)² − 4]/h = (4 + 4h + h² − 4)/h = (4h + h²)/h = 4 + h — o h do numerador se cancela.`,
        `Linha 6: h → 0 resulta em m = 4, e a tangente é y − 4 = 4(x − 2) → y = 4x − 4.`,
        `Linha 7: y = x² equivale a x² = 1·y, então 4p = 1, logo p = 1/4 e o foco é (0, 1/4) — foco da parábola.`
      ]
    },
    traps: [
      `Usar como m_tangente o próprio coeficiente do raio, esquecendo que a tangente é perpendicular. Antes de escrever a reta, anote m_r·m_t = −1 e confira o produto.`,
      `Perder o sinal da coordenada negativa ao calcular y₀/x₀ (4/(−3) virar 4/3). Escreva a fração com o parêntese e circule o sinal do denominador.`,
      `Expandir (2 + h)² como 4 + h², esquecendo o termo 4h. Escreva o produto notável completo (a² + 2ab + b²) antes de simplificar.`
    ]
  };

  /* ===================== SEMANA 11 — Vetores ===================== */

  T[41] = {
    logic: `<p>Um vetor é uma grandeza com direção e intensidade, descrita por componentes: v = (x, y, z) = x·i + y·j + z·k, em que i, j, k são os vetores unitários dos eixos. O vetor de A para B é B − A, ponta menos origem. O módulo vem de Pitágoras aplicado duas vezes: |v| = √(x² + y² + z²). O versor v̂ = v/|v| tem módulo 1 e guarda só a direção. Assim, qualquer vetor é módulo × versor.</p><p>Essa separação é exatamente a que a física usa. Um campo elétrico de 12 V/m na direção de um versor û é E = 12·û: o número dá a intensidade, e û dá a orientação. Forças, velocidades e campos magnéticos seguem o mesmo padrão.</p><p>Na Engenharia Elétrica, um campo E cria uma força F = qE na direção de E. Para obter o campo em um ponto a partir de uma carga, usa-se o vetor entre os dois pontos e seu versor, como na lei de Coulomb vetorial.</p>`,
    algo: [
      `Vetor entre pontos: calcule <b>AB = B − A</b>, componente a componente. Ponta menos origem, nunca o contrário.`,
      `Módulo: eleve cada componente ao quadrado (o sinal some), some e extraia a raiz: <b>|v| = √(x² + y² + z²)</b>.`,
      `Versor: divida <b>cada componente</b> por |v|: v̂ = (x/|v|, y/|v|, z/|v|). Os sinais das componentes se mantêm.`,
      `Teste do versor: a soma dos quadrados das componentes deve dar <b>1</b>.`,
      `Para um vetor de módulo dado M na direção de v̂, calcule <b>M·v̂</b>, multiplicando cada componente.`
    ],
    example: {
      title: `Exemplo resolvido: A(1, 2, −1) e B(3, −2, 3), campo de 12 V/m ao longo de AB`,
      lines: [
        `Linha 1: AB = (3 − 1, −2 − 2, 3 − (<b>−1</b>)) = (2, −4, <b>3 + 1</b>) = (2, −4, 4) — subtrair o −1 vira soma.`,
        `Linha 2: |AB| = √(2² + (−4)² + 4²) = √(4 + 16 + 16) = √36 = 6 m — o quadrado de −4 é positivo.`,
        `Linha 3: AB/|AB| = (2/6, −4/6, 4/6) = (1/3, −2/3, 2/3) — versor, dividindo cada componente por 6.`,
        `Linha 4: teste: (1/3)² + (−2/3)² + (2/3)² = 1/9 + 4/9 + 4/9 = 9/9 = 1 ✓ — o módulo do versor é 1.`,
        `Linha 5: E = 12·(1/3, −2/3, 2/3) = (4, <b>−8</b>, 8) V/m — o sinal negativo da componente y se mantém.`,
        `Linha 6: |E| = √(16 + 64 + 64) = √144 = 12 V/m — recupera o módulo original.`
      ]
    },
    traps: [
      `Calcular AB como A − B, invertendo o sentido do vetor. Escreva "ponta − origem" ao lado da conta e confira qual ponto é a ponta.`,
      `Esquecer que (−4)² = +16 e somar −16 dentro da raiz. Coloque cada componente entre parênteses antes de elevar ao quadrado.`,
      `Dividir só uma componente por |v| ao montar o versor. Faça a conferência: o módulo do versor deve dar 1; se não deu, uma divisão foi esquecida.`
    ]
  };

  T[42] = {
    logic: `<p>A soma de vetores é feita componente a componente: (a, b) + (c, d) = (a + c, b + d). Geometricamente, é a regra do paralelogramo (ou ponta com origem). Multiplicar por um escalar k estica o vetor por |k| e inverte o sentido se k for negativo; por isso u e w são paralelos quando w = k·u. A subtração u − v é a soma de u com o oposto de v. Uma combinação linear α·u + β·v mistura vetores com pesos.</p><p>Um corpo está em equilíbrio quando a resultante é nula, ΣF = 0, componente a componente. Se faltar uma força F₃, então F₃ = −(F₁ + F₂).</p><p>Na Engenharia Elétrica, a mesma estrutura linear gera o Princípio da Superposição: em um circuito linear, a tensão total é a soma das contribuições de cada fonte, V = V₁ + V₂. Campos elétricos de várias cargas também se somam como vetores.</p>`,
    algo: [
      `Escreva cada vetor em colunas ou com as componentes alinhadas: x com x, y com y.`,
      `Some ou subtraia <b>componente a componente</b>. Ao subtrair, distribua o sinal: <b>u − v = (u₁ − v₁, u₂ − v₂)</b>, trocando o sinal de cada componente de v.`,
      `Multiplicação por escalar: multiplique <b>todas</b> as componentes pelo número, inclusive o sinal.`,
      `Paralelismo: u ∥ w se existir k com <b>w = k·u</b>, ou seja, as razões entre componentes correspondentes são iguais.`,
      `Equilíbrio: calcule a soma das forças conhecidas e <b>troque o sinal</b> para obter a força que falta: F₃ = −(F₁ + F₂).`,
      `Módulo da resultante: <b>√(x² + y²)</b>, usando as componentes finais.`
    ],
    example: {
      title: `Exemplo resolvido: F₁ = (6, −2) N e F₂ = (−4, 5) N`,
      lines: [
        `Linha 1: F₁ + F₂ = (6 + (<b>−4</b>), −2 + 5) = (2, 3) N — a soma com o negativo vira subtração.`,
        `Linha 2: equilíbrio: F₃ = −(F₁ + F₂) = <b>−(2, 3) = (−2, −3)</b> N — o sinal troca em cada componente.`,
        `Linha 3: |F₃| = √((−2)² + (−3)²) = √(4 + 9) = √13 ≈ 3,61 N.`,
        `Linha 4: 2·F₁ − F₂ = (12, −4) − (−4, 5) = (12 − (<b>−4</b>), −4 − 5) = (<b>12 + 4</b>, −9) = (16, −9) N — a subtração distribui o sinal.`,
        `Linha 5: w = (−4, −6) e u = (2, 3): −4/2 = −2 e −6/3 = −2 — as razões são iguais.`,
        `Linha 6: w = −2·u, então w é paralelo a u, com sentido oposto e o dobro do comprimento.`,
        `Linha 7: F₁ + F₂ + F₃ = (2 − 2, 3 − 3) = (0, 0) N — o ponto está em equilíbrio.`
      ]
    },
    traps: [
      `Subtrair vetores sem distribuir o sinal, por exemplo (12, −4) − (−4, 5) = (8, −9). Escreva o parêntese e converta para a forma "mais o oposto": (12, −4) + (4, −5).`,
      `Trocar o sinal de apenas uma componente ao obter a força de equilíbrio. Coloque o sinal de menos fora do parêntese da soma e distribua para <b>as duas</b> componentes.`,
      `Somar módulos em vez de componentes (|F₁| + |F₂|). Pergunte: é vetor? Então componente a componente. Só calcule o módulo no final.`
    ]
  };

  T[43] = {
    logic: `<p>O produto escalar u·v = u₁v₁ + u₂v₂ + u₃v₃ = |u||v|cos θ devolve um número que mede o quanto dois vetores apontam para o mesmo lado. Se θ = 90°, é zero (ortogonais); se θ for agudo, é positivo; se obtuso, negativo. Isolando o cosseno, cos θ = u·v/(|u||v|) dá o ângulo. A projeção de u sobre v tem comprimento u·v/|v|: é a sombra de u na direção de v.</p><p>O trabalho de uma força constante é W = F·d, o que significa que só a componente da força ao longo do deslocamento realiza trabalho. Empurrar uma caixa de lado não a move para frente, e isso é o cosseno de 90° igual a zero.</p><p>Na Engenharia Elétrica, a potência de uma carga em CA é P = V·I·cos φ, um produto escalar de fasores: só a componente da corrente alinhada com a tensão transfere energia.</p>`,
    algo: [
      `Multiplique as componentes <b>correspondentes</b>: u₁v₁, u₂v₂, u₃v₃, mantendo os sinais, e some os produtos.`,
      `Calcule os módulos |u| e |v| separadamente (soma dos quadrados, depois a raiz).`,
      `Obtenha o cosseno: <b>cos θ = (u·v)/(|u||v|)</b>. O sinal do produto escalar já informa se θ é agudo ou obtuso.`,
      `Ache o ângulo com a função inversa: <b>θ = arccos(...)</b>, com a calculadora em graus.`,
      `Projeção de u sobre v: <b>(u·v)/|v|</b> (comprimento). Trabalho: <b>W = F·d</b> em joules (N·m).`,
      `Ortogonalidade: se u·v = <b>0</b>, os vetores são perpendiculares.`
    ],
    example: {
      title: `Exemplo resolvido: F = (6, −2, 4) N e d = (2, 1, 3) m`,
      lines: [
        `Linha 1: F·d = 6·2 + (<b>−2</b>)·1 + 4·3 — produto de componentes correspondentes.`,
        `Linha 2: F·d = 12 <b>− 2</b> + 12 = 22 J — o termo do meio é negativo; esse é o trabalho realizado.`,
        `Linha 3: |F| = √(36 + 4 + 16) = √56 ≈ 7,48 N e |d| = √(4 + 1 + 9) = √14 ≈ 3,74 m.`,
        `Linha 4: |F||d| = √56·√14 = √784 = 28 — produto dos módulos, sem arredondar.`,
        `Linha 5: cos θ = 22/28 ≈ 0,786 — positivo, então θ é agudo.`,
        `Linha 6: θ = arccos(0,786) ≈ 38,2° — ângulo entre força e deslocamento.`,
        `Linha 7: projeção de F sobre d = 22/√14 = 22/3,74 ≈ 5,88 N — componente útil da força.`
      ]
    },
    traps: [
      `Multiplicar componentes não correspondentes ou perder o sinal do termo negativo, como (−2)·1. Alinhe os vetores em duas linhas e coloque cada parcela entre parênteses antes de somar.`,
      `Dividir pelo produto escalar ou esquecer um dos módulos no denominador do cosseno. Escreva o denominador |u||v| completo com os dois módulos antes de dividir.`,
      `Responder o produto escalar como se fosse vetor (com três componentes). Pergunte: o resultado tem direção? Aqui é um escalar em joules, um único número.`
    ]
  };

  T[44] = {
    logic: `<p>O produto vetorial u × v devolve um vetor perpendicular a u e a v, com módulo |u||v|sen θ, que é a área do paralelogramo formado pelos dois. O sentido vem da regra da mão direita: dedos de u para v, polegar em u × v. Ele é anticomutativo, u × v = −(v × u), e é nulo quando os vetores são paralelos (sen θ = 0). A área do triângulo é metade do módulo.</p><p>O cálculo usa o determinante simbólico com i, j, k: o termo de j entra com sinal negativo, e esse é o ponto em que se erra com mais frequência. Em componentes: (u₂v₃ − u₃v₂, −(u₁v₃ − u₃v₁), u₁v₂ − u₂v₁).</p><p>Na Engenharia Elétrica, o torque de um motor é τ = r × F, e a força magnética sobre uma carga ou fio é F = q·v × B, a base física de motores e geradores. O vetor de Poynting S = E × H dá a direção do fluxo de potência de uma onda eletromagnética.</p>`,
    algo: [
      `Monte o determinante simbólico: primeira linha <b>i  j  k</b>, segunda linha u, terceira linha v.`,
      `Componente i: <b>u₂v₃ − u₃v₂</b>.`,
      `Componente j: <b>−(u₁v₃ − u₃v₁)</b>. Escreva o sinal de menos <b>antes</b> do parêntese e distribua só no final.`,
      `Componente k: <b>u₁v₂ − u₂v₁</b>.`,
      `Teste de perpendicularidade: <b>(u × v)·u = 0</b> e <b>(u × v)·v = 0</b>. Se não deu zero, há erro de conta ou de sinal.`,
      `Módulo e área: <b>|u × v|</b> é a área do paralelogramo; <b>|u × v|/2</b> é a área do triângulo.`
    ],
    example: {
      title: `Exemplo resolvido: u = (2, 1, −1) e v = (1, 3, 2)`,
      lines: [
        `Linha 1: i: 1·2 − (<b>−1</b>)·3 = 2 <b>+ 3</b> = 5 — o produto −(−1)·3 vira +3.`,
        `Linha 2: j: −(2·2 − (<b>−1</b>)·1) = −(4 <b>+ 1</b>) = <b>−5</b> — o sinal de menos externo vale para a componente j inteira.`,
        `Linha 3: k: 2·3 − 1·1 = 6 − 1 = 5 — último termo do determinante.`,
        `Linha 4: u × v = (5, −5, 5) — vetor resultante.`,
        `Linha 5: (u × v)·u = 5·2 + (−5)·1 + 5·(−1) = 10 − 5 − 5 = 0 e (u × v)·v = 5 − 15 + 10 = 0 — perpendicular aos dois.`,
        `Linha 6: |u × v| = √(25 + 25 + 25) = √75 = 5√3 ≈ 8,66 — área do paralelogramo.`,
        `Linha 7: área do triângulo = 5√3/2 ≈ 4,33 unidades de área — metade do paralelogramo.`
      ]
    },
    traps: [
      `Esquecer o sinal de menos na componente j (ou distribuí-lo errado). Escreva o menos na frente do parêntese, resolva o interior e só depois aplique o sinal.`,
      `Trocar a ordem u × v por v × u, o que inverte todo o vetor. Antes de montar o determinante, marque qual é u (2ª linha) e qual é v (3ª linha).`,
      `Não verificar o resultado. Sempre faça o teste de perpendicularidade com dois produtos escalares: um zero que falha denuncia um erro de sinal.`
    ]
  };
})(window);
