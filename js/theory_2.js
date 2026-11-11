(function (g) {
  "use strict";
  const NE = (g.NE = g.NE || {});
  const T = (NE.Theory = NE.Theory || {});

  /* =========================== SEMANA 5 =========================== */

  T[17] = {
    logic: `<p>Uma equação é uma balança em equilíbrio: qualquer operação aplicada a um lado precisa ser aplicada ao outro, e isso é tudo. Isolar uma variável é desfazer, na ordem inversa, o que a fórmula fez com ela (a última operação feita é a primeira a ser desfeita). Fração é só divisão pendente: multiplicar tudo pelo MMC dos denominadores elimina a divisão sem mudar a solução.</p><p>Na Engenharia Elétrica, analisar é calcular a saída dada a entrada; <i>projetar</i> é isolar o componente. No divisor de tensão Vout = Vs·R₂/(R₁+R₂), a variável R₂ aparece em cima e embaixo, então é preciso multiplicar cruzado, distribuir e <b>reunir os termos com R₂ de um lado só</b> antes de fatorar. A verificação por substituição é o seu teste unitário: se o valor não reproduz Vout, a álgebra tem um bug.</p>`,
    algo: [
      `Se houver frações, calcule o <b>MMC</b> dos denominadores e multiplique <b>todos</b> os termos dos dois lados por ele.`,
      `<b>Distribua</b> cada fator sobre todos os termos do parêntese, cuidando do sinal: −(a − b) = −a <b>+ b</b>.`,
      `Junte os termos que contêm a variável de um lado e o resto do outro; ao atravessar o igual, o termo <b>troca de sinal</b>.`,
      `Se a variável aparece em mais de um termo, <b>fatore</b>: R₂·(Vs − Vout).`,
      `<b>Divida</b> pelo coeficiente da variável (ele precisa ser diferente de zero).`,
      `Substitua o resultado na equação original e confira os dois lados com unidades.`
    ],
    example: {
      title: `Exemplo resolvido: isolar R₂ no divisor de tensão (Vs = 12 V, R₁ = 3 kΩ, Vout = 5 V)`,
      lines: [
        `Linha 1: Vout = Vs·R₂/(R₁ + R₂) — fórmula do divisor; incógnita R₂ aparece em cima e embaixo`,
        `Linha 2: Vout·(R₁ + R₂) = Vs·R₂ — <b>multiplicar ambos os lados por (R₁ + R₂)</b> para eliminar a fração`,
        `Linha 3: Vout·R₁ + Vout·R₂ = Vs·R₂ — <b>distribuir</b> Vout nos dois termos do parêntese`,
        `Linha 4: Vout·R₁ = Vs·R₂ <b>− Vout·R₂</b> — subtrair Vout·R₂ dos dois lados para reunir os termos com R₂`,
        `Linha 5: Vout·R₁ = R₂·(Vs − Vout) — <b>fatorar</b> R₂ em evidência`,
        `Linha 6: R₂ = Vout·R₁/(Vs − Vout) — <b>dividir</b> por (Vs − Vout)`,
        `Linha 7: R₂ = 5·3000/(12 − 5) = 15000/7 ≈ 2143 Ω — substituir os números só no final`,
        `Linha 8: Verificação: 12·2143/(3000 + 2143) = 25716/5143 ≈ 5,0 V — resultado: R₂ ≈ 2,14 kΩ`
      ]
    },
    traps: [
      `Fazer a conta com números antes de isolar e errar o sinal ao atravessar o igual. Contramedida: escreva a operação inversa ao lado de cada linha (por exemplo, "− Vout·R₂ nos dois lados") antes de executar.`,
      `Aplicar a operação em um lado só ou distribuir o fator em apenas um termo do parêntese. Contramedida: desenhe uma barra vertical no meio do igual e circule cada termo ao multiplicar.`,
      `Aceitar o resultado sem conferir, ou misturar kΩ com Ω. Contramedida: converta tudo para Ω antes de começar e feche com a substituição na equação original.`
    ]
  };

  T[18] = {
    logic: `<p>Inequação é uma equação em que o sinal de igual virou uma região: a solução é um intervalo, não um ponto. Tudo funciona como na balança, com <b>uma exceção</b>: multiplicar ou dividir por número negativo espelha a reta numérica e, por isso, inverte o sentido da desigualdade (3 &gt; 2, mas −3 &lt; −2).</p><p>O valor absoluto |x| é a distância de x até a origem, e |x − c| é a distância até c. Assim |x − c| ≤ a significa "x está a no máximo a de distância de c", ou seja, c − a ≤ x ≤ c + a. Já |x − c| ≥ a significa "x está longe de c": duas regiões separadas.</p><p>Na Engenharia Elétrica, um resistor de 4,7 kΩ ±5% é |R − 4700| ≤ 235. A margem de ruído em lógica digital, a faixa de temperatura de um chip e o erro de um ADC têm a mesma estrutura: <b>valor nominal ± tolerância = módulo</b>.</p>`,
    algo: [
      `Resolva como equação, com uma única regra extra: ao multiplicar ou dividir por <b>número negativo, inverta o sinal da desigualdade</b>.`,
      `Para |u| ≤ a (ou &lt; a), escreva <b>−a ≤ u ≤ a</b> e resolva as duas desigualdades de uma vez, aplicando a mesma operação aos três membros.`,
      `Para |u| ≥ a (ou &gt; a), separe em <b>dois casos com "ou"</b>: u ≤ −a ou u ≥ a.`,
      `Se a ≤ 0 em |u| = a, trate à parte: |u| = 0 tem solução única, e |u| = negativo é impossível.`,
      `Escreva o conjunto-solução em intervalo: colchete se inclui o extremo (≤, ≥), parêntese se exclui (&lt;, &gt;, e sempre em ±∞).`,
      `Teste um ponto de dentro e um de fora do intervalo na desigualdade original.`
    ],
    example: {
      title: `Exemplo resolvido: faixa de um resistor de 4,7 kΩ ±5% e uma inequação com coeficiente negativo`,
      lines: [
        `Linha 1: |R − 4700| ≤ 0,05·4700 = 235 — tolerância de 5% vira módulo com raio 235 Ω`,
        `Linha 2: <b>−235 ≤ R − 4700 ≤ 235</b> — |u| ≤ a vira −a ≤ u ≤ a`,
        `Linha 3: 4465 ≤ R ≤ 4935 — somar 4700 aos três membros`,
        `Linha 4: Outra inequação: 7 − 2x ≥ 1 — coeficiente de x é negativo`,
        `Linha 5: −2x ≥ 1 <b>− 7</b> = −6 — subtrair 7 dos dois lados`,
        `Linha 6: x <b>≤</b> 3 — dividir por −2 e <b>inverter o sentido</b> (≥ vira ≤)`,
        `Linha 7: Teste: x = 0 → 7 ≥ 1 ✓; x = 4 → 7 − 8 = −1 ≥ 1 é falso ✓ — o intervalo está do lado certo`,
        `Linha 8: Resultado: R ∈ [4465 Ω; 4935 Ω] e x ∈ (−∞; 3]`
      ]
    },
    traps: [
      `Dividir por número negativo e esquecer de inverter o sinal. Contramedida: circule o sinal do coeficiente antes de dividir e escreva "NEG → INVERTE" ao lado da linha.`,
      `Resolver |u| &lt; a como duas soluções separadas, ou |u| &gt; a como um único intervalo. Contramedida: lembre que "perto" é um intervalo só (E), "longe" são dois pedaços (OU), e desenhe a reta numérica.`,
      `Fechar o colchete onde a desigualdade é estrita, ou esquecer que a tolerância é percentual do valor nominal. Contramedida: pergunte "o extremo é aceito?" para cada ponta e calcule o raio (0,05·R₀) em uma linha separada.`
    ]
  };

  T[19] = {
    logic: `<p>Cada equação linear com duas incógnitas é uma reta no plano (x, y); resolver o sistema é achar o ponto onde as duas retas se cruzam. Há três casos: retas concorrentes (uma solução, SPD), paralelas (nenhuma, SI) e coincidentes (infinitas, SPI). Algebricamente, o sistema é SPD quando os coeficientes não são proporcionais.</p><p>Substituição e escalonamento são a mesma ideia: <b>eliminar uma variável</b> para cair em uma equação de 1º grau. Na substituição, você isola uma variável e a injeta na outra equação. No escalonamento, você multiplica as equações para que os coeficientes de uma variável se tornem opostos e somam.</p><p>Na Engenharia Elétrica, a análise de malhas produz exatamente isso: duas correntes desconhecidas I₁ e I₂ e duas equações de tensão (Lei de Kirchhoff). SPI ou SI no sistema significa um circuito mal definido (fontes em conflito ou equações redundantes), e não um erro de conta.</p>`,
    algo: [
      `Escreva as duas equações na forma padrão ax + by = c e numere como (a) e (b).`,
      `<b>Substituição:</b> isole a variável de coeficiente 1 (ou −1) em uma equação e <b>substitua entre parênteses</b> na outra.`,
      `<b>Escalonamento:</b> multiplique as equações por números que deixem os coeficientes de uma variável <b>opostos</b> (+k e −k) e some membro a membro.`,
      `Resolva a equação de 1º grau resultante e volte para achar a outra variável.`,
      `Classifique: se sobrar 0 = 0, é <b>SPI</b>; se sobrar 0 = número não nulo, é <b>SI</b>; se achou um par, é <b>SPD</b>.`,
      `Confira o par nas <b>duas</b> equações originais.`
    ],
    example: {
      title: `Exemplo resolvido: duas malhas com 3I₁ + 2I₂ = 13 e 2I₁ − I₂ = 4 (volts, correntes em ampères)`,
      lines: [
        `Linha 1: (a) 3I₁ + 2I₂ = 13 e (b) 2I₁ − I₂ = 4 — equações de malha escritas na forma padrão`,
        `Linha 2: I₂ = 2I₁ <b>− 4</b> — isolar I₂ em (b): passa −I₂ para a direita e o 4 para a esquerda, e troca o sinal ao multiplicar por −1`,
        `Linha 3: 3I₁ + 2·<b>(2I₁ − 4)</b> = 13 — substituir em (a), com parênteses obrigatórios`,
        `Linha 4: 3I₁ + 4I₁ <b>− 8</b> = 13 → 7I₁ = 21 — distribuir o 2 nos dois termos e somar 8 dos dois lados`,
        `Linha 5: I₁ = 3 A e I₂ = 2·3 − 4 = 2 A — dividir por 7 e voltar na expressão de I₂`,
        `Linha 6: Pelo escalonamento: 2·(b) dá 4I₁ − 2I₂ = 8; somando com (a): 7I₁ = 21 — <b>os termos em I₂ se cancelam</b> e a resposta coincide`,
        `Linha 7: Conferência: (a) 3·3 + 2·2 = 13 ✓; (b) 2·3 − 2 = 4 ✓ — o par satisfaz as duas equações`,
        `Linha 8: Resultado: (I₁, I₂) = (3 A; 2 A) — as retas se cruzam em (3, 2); sistema SPD`
      ]
    },
    traps: [
      `Substituir sem parênteses e multiplicar só o primeiro termo: 2·2I₁ − 4 em vez de 2·(2I₁ − 4). Contramedida: sempre abra parênteses ao substituir e circule o fator que vai distribuir.`,
      `Somar as equações sem antes igualar os coeficientes, ou somar quando deveria subtrair (sinais iguais não se cancelam). Contramedida: escreva os coeficientes da variável a eliminar um embaixo do outro e confira se são +k e −k.`,
      `Achar x e esquecer de calcular y, ou não conferir nas duas equações. Contramedida: escreva o par (x, y) completo e faça a substituição nas duas equações originais.`
    ]
  };

  T[20] = {
    logic: `<p>Um sistema 3×3 é a interseção de três planos no espaço. O escalonamento de Gauss usa só operações que preservam a solução (trocar equações, multiplicar por constante não nula, somar uma equação a outra) para chegar a uma forma triangular, que se resolve de baixo para cima, por retrosubstituição.</p><p>As leis de Kirchhoff são o que transforma um circuito em sistema linear. A <b>LKC</b> diz que a soma das correntes em um nó é zero (carga não se acumula). A <b>LKT</b> diz que a soma das tensões em uma malha fechada é zero (energia é conservada). Cada nó e cada malha independentes geram uma equação, e o número de equações iguala o número de correntes.</p><p>É exatamente isso que o SPICE faz: monta a matriz de coeficientes do circuito e a escalona. Resolver o sistema é resolver o circuito, e a conferência física (potência fornecida = soma das potências nos resistores) valida a álgebra.</p>`,
    algo: [
      `Defina um sentido de corrente para cada ramo (o sentido é arbitrário; se der negativo, só estava invertido).`,
      `Escreva a <b>LKC</b> em um nó: correntes que entram = correntes que saem.`,
      `Escreva a <b>LKT</b> em cada malha independente: percorra em um sentido e some as quedas R·I; a soma é igual à fonte. <b>Corrente contra o sentido de percurso muda o sinal do termo</b>.`,
      `Alinhe as colunas I₁, I₂, I₃ em todas as equações (coloque 0 nos termos ausentes).`,
      `Escalone: use uma equação para <b>eliminar uma variável das outras duas</b>, depois resolva o sistema 2×2 restante.`,
      `Faça a retrosubstituição e confira nas três equações e no balanço de potência.`
    ],
    example: {
      title: `Exemplo resolvido: fonte de 12 V, resistor série de 2 Ω e, em paralelo, ramos de 3 Ω (I₂) e 6 Ω (I₃)`,
      lines: [
        `Linha 1: I₁ − I₂ − I₃ = 0 — LKC no nó: I₁ entra, I₂ e I₃ saem`,
        `Linha 2: 2I₁ + 3I₂ = 12 — LKT na malha 1 (fonte, 2 Ω e 3 Ω)`,
        `Linha 3: 3I₂ <b>− 6I₃</b> = 0 — LKT na malha 2 (3 Ω e 6 Ω): I₃ percorre o 6 Ω contra o sentido de percurso, por isso o sinal negativo`,
        `Linha 4: I₂ = 2I₃ — da linha 3, <b>passar o termo e dividir por 3</b>`,
        `Linha 5: I₁ <b>−</b> 2I₃ <b>−</b> I₃ = 0 → I₁ = 3I₃ — substituir I₂ na LKC e isolar I₁`,
        `Linha 6: 2·(3I₃) + 3·(2I₃) = 12 → 12I₃ = 12 → I₃ = 1 A — substituir tudo na malha 1 e eliminar I₁ e I₂`,
        `Linha 7: I₂ = 2·1 = 2 A e I₁ = 3·1 = 3 A — retrosubstituição`,
        `Linha 8: Resultado: I₁ = 3 A; I₂ = 2 A; I₃ = 1 A — confere: 2·3 + 3·2 = 12 ✓, 3·2 − 6·1 = 0 ✓, P fonte = 12·3 = 36 W = 2·9 + 3·4 + 6·1 = 36 W ✓`
      ]
    },
    traps: [
      `Errar o sinal de um termo da LKT por ter percorrido a malha em um sentido e anotado a corrente de outro. Contramedida: desenhe a seta de percurso dentro da malha e marque "+" quando a corrente está a favor e "−" quando está contra.`,
      `Escalonar mexendo só em uma parte da equação (esquecer de multiplicar o lado direito ou um dos termos). Contramedida: ao multiplicar uma linha, escreva "×k" e passe o dedo por todos os termos, inclusive o resultado.`,
      `Deixar uma variável fora da coluna certa e misturar I₂ com I₃. Contramedida: reescreva o sistema com as colunas alinhadas e com zero nos termos ausentes antes de começar.`
    ]
  };

  /* =========================== SEMANA 6 =========================== */

  T[21] = {
    logic: `<p>A função afim f(x) = ax + b descreve qualquer fenômeno em que a variação de saída é proporcional à variação de entrada. O coeficiente <b>a</b> é a razão Δy/Δx (a inclinação) e dá a taxa de variação, enquanto <b>b</b> é o valor em x = 0, onde a reta corta o eixo y. Se a &gt; 0 a função cresce, se a &lt; 0 decresce, e a raiz x = −b/a é onde ela cruza o eixo x. Duas retas definem-se por dois pontos.</p><p>A inclinação sempre carrega significado físico: em V = R·I, a inclinação é a resistência (Ω = V/A); em s = s₀ + v·t, é a velocidade (m/s); num sensor de temperatura, é a sensibilidade (V/°C). Quando você mede dois pontos de um sensor, a reta que passa por eles é o modelo de calibração, e o offset b é o erro de zero. Um ajuste por retas é a primeira ferramenta de qualquer laboratório de eletrônica.</p>`,
    algo: [
      `Identifique as duas grandezas e <b>anote as unidades</b> de x e y (a unidade de a é y/x).`,
      `Calcule a inclinação: <b>a = (y₂ − y₁)/(x₂ − x₁)</b>, com a mesma ordem de subtração no numerador e no denominador.`,
      `Ache b substituindo um dos pontos em y = ax + b: <b>b = y₁ − a·x₁</b>.`,
      `A raiz é onde y = 0: <b>x = −b/a</b> (só existe se a ≠ 0).`,
      `Classifique: a &gt; 0 cresce; a &lt; 0 decresce; a = 0 é constante.`,
      `Teste o segundo ponto na equação para validar o modelo.`
    ],
    example: {
      title: `Exemplo resolvido: calibração de um sensor com os pontos (20 °C; 0,60 V) e (60 °C; 1,00 V)`,
      lines: [
        `Linha 1: P₁(20; 0,60) e P₂(60; 1,00) — x = T em °C, y = V em volts`,
        `Linha 2: a = (1,00 <b>−</b> 0,60)/(60 <b>−</b> 20) — Δy/Δx, subtraindo na mesma ordem em cima e embaixo`,
        `Linha 3: a = 0,40/40 = 0,01 V/°C — inclinação = sensibilidade do sensor (10 mV/°C)`,
        `Linha 4: 0,60 = 0,01·20 + b → b = 0,60 <b>− 0,20</b> = 0,40 V — substituir P₁ e passar 0,20 para o outro lado trocando o sinal`,
        `Linha 5: V(T) = 0,01·T + 0,40 — equação da reta`,
        `Linha 6: 0 = 0,01·T + 0,40 → T = <b>−</b>0,40/0,01 = −40 °C — raiz: temperatura em que a saída seria 0 V`,
        `Linha 7: Teste em P₂: V(60) = 0,01·60 + 0,40 = 1,00 V ✓; previsão: V(45) = 0,45 + 0,40 = 0,85 V`,
        `Linha 8: Resultado: V = 0,01·T + 0,40 (V, com T em °C); função crescente com sensibilidade de 10 mV/°C`
      ]
    },
    traps: [
      `Inverter a ordem na subtração do numerador ou do denominador (y₂ − y₁ sobre x₁ − x₂), o que troca o sinal da inclinação. Contramedida: escreva os pontos como P₁ e P₂ e use "2 menos 1" nos dois.`,
      `Confundir a (inclinação) com b (intercepto), ou ler b como o valor de y no ponto qualquer. Contramedida: b é y em x = 0; pergunte "qual a saída com entrada zero?".`,
      `Ignorar unidades e escalas (mV com V, ms com s) ao calcular a inclinação. Contramedida: converta tudo para unidades base antes de dividir e escreva a unidade do resultado (V/°C, Ω, m/s).`
    ]
  };

  T[22] = {
    logic: `<p>A função quadrática f(x) = ax² + bx + c é uma parábola. O sinal de a define a concavidade (a &gt; 0 para cima, a &lt; 0 para baixo). O discriminante Δ = b² − 4ac decide as raízes reais: Δ &gt; 0 duas, Δ = 0 uma (parábola tangente ao eixo), Δ &lt; 0 nenhuma. Bhaskara é a fórmula de completar quadrados: x = (−b ± √Δ)/(2a).</p><p>A simetria é a chave: o vértice fica no meio das raízes, xv = −b/(2a), e a soma e o produto das raízes são x₁ + x₂ = −b/a e x₁·x₂ = c/a. Isso permite conferir a resposta sem refazer a conta, e achar o extremo sem calcular raízes: yv = −Δ/(4a).</p><p>Em Física, s = s₀ + v₀t + ½at² (MRUV) é uma parábola, e o vértice responde "quando e onde o máximo?". Em Engenharia Elétrica, a potência P = V·I − Rs·I² é uma parábola invertida e o vértice é o ponto de máxima entrega de potência: a mesma matemática da altura máxima de uma bola.</p>`,
    algo: [
      `Escreva na forma padrão ax² + bx + c = 0 e <b>anote a, b e c com seus sinais</b>.`,
      `Calcule <b>Δ = b² − 4ac</b> com parênteses para valores negativos: (−5)·(−25) = +125.`,
      `Se Δ ≥ 0, aplique <b>x = (−b ± √Δ)/(2a)</b>; o denominador é 2a inteiro, com o sinal de a.`,
      `Confira por soma (−b/a) e produto (c/a) das raízes.`,
      `Vértice: <b>xv = −b/(2a)</b> (média das raízes) e <b>yv = −Δ/(4a)</b>.`,
      `Se a &lt; 0, o vértice é máximo; se a &gt; 0, é mínimo.`
    ],
    example: {
      title: `Exemplo resolvido: h(t) = −5t² + 30t − 25 (metros, segundos)`,
      lines: [
        `Linha 1: a = −5, b = 30, c = −25 — a &lt; 0: parábola com concavidade para baixo (haverá máximo)`,
        `Linha 2: Δ = 30² − 4·(−5)·(−25) = 900 <b>− 500</b> = 400 — (−5)·(−25) = +125 e 4·125 = 500, que é subtraído`,
        `Linha 3: t = (−30 ± 20)/(2·(−5)) = (−30 ± 20)/<b>(−10)</b> — √400 = 20; o denominador é negativo`,
        `Linha 4: t₁ = (−30 + 20)/(−10) = 1 s e t₂ = (−30 − 20)/(−10) = 5 s — as raízes: onde h = 0`,
        `Linha 5: Soma = 1 + 5 = 6 = −b/a = −30/(−5) ✓; produto = 5 = c/a = −25/(−5) ✓ — conferência`,
        `Linha 6: tv = −b/(2a) = −30/<b>(−10)</b> = 3 s — igual à média (1 + 5)/2`,
        `Linha 7: hv = −Δ/(4a) = −400/(−20) = 20 m — confere: h(3) = −45 + 90 − 25 = 20`,
        `Linha 8: Resultado: h = 0 em t = 1 s e t = 5 s; altura máxima de 20 m em t = 3 s`
      ]
    },
    traps: [
      `Errar o sinal em −4ac quando a ou c são negativos (virar +4ac) ou esquecer o b² positivo. Contramedida: escreva (−b)² e 4·a·c com parênteses e calcule o produto dos sinais antes dos módulos.`,
      `Dividir só por a em vez de 2a, ou aplicar o ± em apenas um termo. Contramedida: escreva o denominador 2a como número já calculado e calcule as duas raízes em linhas separadas.`,
      `Calcular yv usando xv incorretamente ou confundir yv = −Δ/4a com −Δ/2a. Contramedida: confirme yv substituindo xv na função original.`
    ]
  };

  T[23] = {
    logic: `<p>Estudar o sinal de uma função é descobrir em quais intervalos f(x) &gt; 0, f(x) &lt; 0 ou f(x) = 0. Uma função contínua só pode mudar de sinal passando por uma raiz (ou por uma descontinuidade, no caso de quociente), então os pontos críticos dividem a reta em regiões onde o sinal é constante. Na afim, o sinal inverte na raiz; na quadrática, a parábola é do sinal de a fora das raízes e do sinal contrário entre elas (se Δ &gt; 0).</p><p>Para produtos e quocientes, estude o sinal de cada fator e combine pela regra dos sinais em um <b>quadro de sinais</b>. Para quocientes, o denominador nunca pode se anular: suas raízes são sempre excluídas. Não passe o denominador multiplicando para o outro lado sem saber o seu sinal.</p><p>Em Engenharia Elétrica, isso define regiões de operação: onde o ganho é positivo, onde a corrente inverte de sentido, onde um transistor conduz e onde um sistema é estável.</p>`,
    algo: [
      `Passe tudo para um lado e deixe <b>zero do outro</b>; nunca multiplique em cruz uma inequação com incógnita.`,
      `Fatore (ou use Bhaskara) e <b>ache todas as raízes</b> de numerador e denominador.`,
      `Desenhe uma linha para cada fator: sinal da afim (inverte na raiz) ou da quadrática (sinal de a fora das raízes).`,
      `Monte o <b>quadro de sinais</b> multiplicando (ou dividindo) os sinais coluna por coluna.`,
      `Escolha os intervalos que satisfazem o sinal pedido; <b>raízes do denominador sempre ficam de fora</b>, e as do numerador entram só com ≤ ou ≥.`,
      `Teste um ponto de cada região na desigualdade original.`
    ],
    example: {
      title: `Exemplo resolvido: (x² − 4x + 3)/(x − 2) &lt; 0`,
      lines: [
        `Linha 1: (x² − 4x + 3)/(x − 2) &lt; 0 — zero já está do lado direito`,
        `Linha 2: Numerador: Δ = 16 − 12 = 4, x = (4 ± 2)/2 → 1 e 3 — a &gt; 0: positivo fora de [1; 3] e negativo entre 1 e 3`,
        `Linha 3: Denominador: raiz x = 2 — negativo para x &lt; 2, positivo para x &gt; 2; <b>x = 2 é excluído sempre</b>`,
        `Linha 4: Quadro: x &lt; 1: (+)/(−) = <b>−</b>; 1 &lt; x &lt; 2: (−)/(−) = <b>+</b>; 2 &lt; x &lt; 3: (−)/(+) = <b>−</b>; x &gt; 3: (+)/(+) = <b>+</b> — regra dos sinais na divisão`,
        `Linha 5: Queremos &lt; 0 (estrito): escolhemos as regiões com sinal <b>−</b>; x = 1 e x = 3 (resultado 0) também saem`,
        `Linha 6: Teste: x = 0 → 3/(−2) = −1,5 ✓ (negativo); x = 1,5 → (−0,75)/(−0,5) = +1,5 (positivo, fora) ✓`,
        `Linha 7: Teste: x = 2,5 → (−0,75)/(0,5) = −1,5 ✓; x = 4 → 3/2 = +1,5 (fora) ✓`,
        `Linha 8: Resultado: x &lt; 1 ou 2 &lt; x &lt; 3`
      ]
    },
    traps: [
      `Multiplicar os dois lados pelo denominador sem saber o seu sinal e esquecer de inverter a desigualdade. Contramedida: nunca passe o denominador para o outro lado; passe tudo para um lado e use o quadro de sinais.`,
      `Incluir no resultado a raiz do denominador, ou excluir a do numerador quando a desigualdade é ≤ ou ≥. Contramedida: marque o denominador com ○ (vazio) e o numerador com ● (cheio) quando a desigualdade é não estrita.`,
      `Errar o sinal da quadrática (esquecer que a &lt; 0 inverte o desenho) ou a regra dos sinais na divisão. Contramedida: teste um ponto em cada intervalo e anote o sinal real na coluna.`
    ]
  };

  T[24] = {
    logic: `<p>Uma fonte real é uma fonte ideal Vs em série com uma resistência interna Rs. Ligando uma carga RL, a corrente é I = Vs/(Rs + RL) e a tensão na carga é VL = Vs − Rs·I (Lei de Kirchhoff das Tensões). A potência entregue à carga é P = VL·I = Vs·I − Rs·I², que é uma <b>parábola invertida</b> em I (a = −Rs &lt; 0).</p><p>Todo problema de otimização com um parâmetro vira "achar o vértice". Aqui, I* = Vs/(2Rs) e Pmax = Vs²/(4Rs). Substituindo I* em RL = VL/I, tudo se resume em <b>RL = Rs</b>: a carga deve ser igual à resistência da fonte.</p><p>Interpretação física: se RL é muito pequena, a corrente é grande, mas a tensão na carga é quase nula; se RL é muito grande, a tensão é alta, mas a corrente é quase nula. O máximo fica no meio. Isso orienta o casamento de impedâncias em áudio, antenas e RF. Atenção: com RL = Rs, o rendimento é apenas 50%; em energia, o objetivo é eficiência, não potência máxima.</p>`,
    algo: [
      `Desenhe a fonte real: Vs em série com Rs, ligada à carga RL.`,
      `Escreva a tensão na carga pela LKT: <b>VL = Vs − Rs·I</b>.`,
      `Monte a potência na carga: <b>P = VL·I</b>, distribuindo I: P = Vs·I <b>− Rs·I²</b>.`,
      `Identifique a, b e c da parábola (a = −Rs, b = Vs, c = 0) e calcule o vértice: <b>I* = −b/(2a) = Vs/(2Rs)</b>.`,
      `Calcule Pmax substituindo I* em P(I) e a tensão VL = Vs − Rs·I*.`,
      `Volte à variável de projeto: <b>RL = VL/I*</b> e compare com Rs.`
    ],
    example: {
      title: `Exemplo resolvido: fonte Vs = 20 V com Rs = 5 Ω alimentando uma carga RL`,
      lines: [
        `Linha 1: VL = Vs − Rs·I = 20 − 5I — LKT: a queda em Rs reduz a tensão na carga`,
        `Linha 2: P = VL·I = (20 − 5I)·I = 20I <b>− 5I²</b> — distribuir I; a = −5 &lt; 0, parábola para baixo`,
        `Linha 3: I* = −b/(2a) = −20/(2·(−5)) = −20/<b>(−10)</b> = 2 A — vértice, o máximo`,
        `Linha 4: Pmax = 20·2 − 5·2² = 40 − 20 = 20 W — substituir I* em P(I)`,
        `Linha 5: VL = 20 − 5·2 = 10 V — tensão na carga no ponto ótimo`,
        `Linha 6: RL = VL/I* = 10/2 = 5 Ω = Rs — carga igual à resistência da fonte`,
        `Linha 7: Contraprova: RL = 20 Ω → I = 20/25 = 0,8 A; P = 20·0,8 − 5·0,64 = 16 − 3,2 = 12,8 W &lt; 20 W ✓`,
        `Linha 8: Resultado: Pmax = 20 W (= Vs²/4Rs = 400/20) com RL = Rs = 5 Ω, a 2 A; rendimento de 50%`
      ]
    },
    traps: [
      `Calcular o vértice com o sinal de a errado (usar +Rs) e achar um mínimo. Contramedida: escreva P(I) em ordem decrescente de grau e leia o sinal de a antes de usar a fórmula.`,
      `Parar em I* e entregar a corrente como se fosse a resposta, esquecendo de voltar para RL. Contramedida: releia a pergunta e sublinhe a variável pedida; só encerre quando a unidade final for Ω.`,
      `Elevar ao quadrado errado: I² com I = 2 → 2·2 = 4, mas Rs·I² ≠ (Rs·I)². Contramedida: escreva a potência como Rs·(I²) com parênteses e calcule I² primeiro.`
    ]
  };

  /* =========================== SEMANA 7 =========================== */

  T[25] = {
    logic: `<p>Na função exponencial f(x) = aˣ (a &gt; 0, a ≠ 1), a variável está no expoente: se a &gt; 1 há crescimento, se 0 &lt; a &lt; 1 há decaimento. Ela é sempre positiva, nunca toca o eixo x (assíntota) e passa por (0, 1). A base natural é e ≈ 2,718, escolhida porque a derivada de eˣ é ela mesma: a taxa de variação é proporcional ao valor atual, que é a lei de todo processo de relaxação.</p><p>A forma e^(−t/τ) é o padrão da Engenharia: τ é a <b>constante de tempo</b>. Em t = τ o valor cai para e⁻¹ ≈ 36,8% do inicial; em 3τ, para 5%; em 5τ, para menos de 1%. Por isso se diz que, após 5τ, o transitório "acabou".</p><p>Em circuitos, a descarga de um capacitor em um resistor segue v(t) = V₀·e^(−t/RC) e τ = R·C. Na lógica de resolução, equações exponenciais simples se resolvem igualando as bases: 4ˣ = 8 vira 2²ˣ = 2³, logo 2x = 3.</p>`,
    algo: [
      `Identifique a forma: <b>V₀·e^(−t/τ)</b> (decai) ou V₀·e^(+t/τ) (cresce). O <b>sinal do expoente</b> define o comportamento.`,
      `Calcule o expoente com a unidade: <b>t/τ</b> é adimensional, então t e τ devem estar na mesma unidade.`,
      `Calcule e^(expoente) e multiplique por V₀; lembre que <b>e⁻ⁿ = 1/eⁿ</b>.`,
      `Valores de referência: e⁻¹ ≈ 0,368; e⁻² ≈ 0,135; e⁻³ ≈ 0,050; e⁻⁵ ≈ 0,0067.`,
      `Equação exponencial simples: <b>escreva os dois lados na mesma base</b> e iguale os expoentes.`,
      `Estime a plausibilidade: o valor deve ficar entre 0 e V₀ no decaimento.`
    ],
    example: {
      title: `Exemplo resolvido: v(t) = 12·e^(−t/τ) com τ = 2 ms, e a equação 4ˣ = 8`,
      lines: [
        `Linha 1: v(0) = 12·e⁰ = 12 V — em t = 0 vale V₀, pois e⁰ = 1`,
        `Linha 2: t = 2 ms = 1τ: v = 12·e<b>⁻¹</b> = 12·0,3679 ≈ 4,41 V — expoente −t/τ = −1`,
        `Linha 3: t = 6 ms = 3τ: v = 12·e<b>⁻³</b> = 12·0,0498 ≈ 0,60 V — e⁻³ = 1/e³ = 1/20,09`,
        `Linha 4: t = 10 ms = 5τ: v = 12·e<b>⁻⁵</b> = 12·0,006738 ≈ 0,081 V — menos de 1% de 12 V`,
        `Linha 5: Equação exponencial: 4ˣ = 8 → (2²)ˣ = 2³ — <b>reescrever na base 2</b>`,
        `Linha 6: 2²ˣ = 2³ → <b>2x = 3</b> — bases iguais, expoentes iguais; x = 3/2`,
        `Linha 7: Conferência: 4^(3/2) = (√4)³ = 2³ = 8 ✓`,
        `Linha 8: Resultado: v = 4,41 V em 1τ, 0,60 V em 3τ e 0,081 V em 5τ; x = 3/2 — transitório extinto em ≈ 5τ = 10 ms`
      ]
    },
    traps: [
      `Esquecer o sinal negativo do expoente e obter e^(+1) = 2,72 em vez de e^(−1) = 0,368 (o sinal cresce quando deveria decair). Contramedida: antes de calcular, escreva "decai ⇒ resultado menor que V₀" e confira.`,
      `Usar t em ms e τ em s (ou o contrário) e errar o expoente por fator de 1000. Contramedida: converta t e τ para a mesma unidade e escreva o quociente t/τ como número puro.`,
      `Confundir aˣ com xᵃ, ou multiplicar a base pelo expoente (2³ = 6). Contramedida: leia em voz alta "dois multiplicado por si mesmo três vezes" e escreva a expansão 2·2·2.`
    ]
  };

  T[26] = {
    logic: `<p>O logaritmo é a função inversa da exponencial: logᵦ a = x significa βˣ = a. Ele responde "a que potência devo elevar a base para obter este número?". Graficamente, é o espelho da exponencial em relação à reta y = x. Por isso, é a ferramenta para <b>isolar variáveis que estão no expoente</b>: aplicar ln dos dois lados de eˣ = b dá x = ln b.</p><p>As propriedades vêm das regras de potência: log(a·b) = log a + log b (produto vira soma), log(a/b) = log a − log b (quociente vira subtração), log(aⁿ) = n·log a (potência desce). Mudança de base: logᵦ a = log a/log β, o que permite calcular qualquer base com a calculadora (log₁₀ ou ln). Lembre que log(a + b) não tem simplificação, e que o logaritmo só existe para argumento positivo.</p><p>Em Engenharia Elétrica, ln dá o tempo de um transitório (t = τ·ln(V₀/v)), e log₁₀ comprime escalas gigantes em dB: converter produtos em somas é o que permite somar ganhos de uma cascata.</p>`,
    algo: [
      `Isole a parte exponencial primeiro: <b>divida</b> pelo coeficiente que a multiplica (e passe as constantes somadas).`,
      `Aplique <b>ln</b> (se a base é e) ou log (qualquer base) nos <b>dois lados</b>.`,
      `Use a propriedade da potência: <b>ln(eᵘ) = u</b> e <b>log(aⁿ) = n·log a</b>; o expoente desce.`,
      `Lembre: <b>ln(1/x) = −ln x</b>, ln(a·b) = ln a + ln b, ln(a/b) = ln a − ln b.`,
      `Para bases diferentes de e ou 10, use <b>x = log b/log a</b> (mudança de base).`,
      `Verifique que o argumento é positivo e confira substituindo na equação original.`
    ],
    example: {
      title: `Exemplo resolvido: 3·e^(−0,5t) = 1, depois 2ˣ = 50 e log₁₀200`,
      lines: [
        `Linha 1: 3·e^(−0,5t) = 1 — queremos t, que está no expoente`,
        `Linha 2: e^(−0,5t) = 1/3 — <b>dividir por 3 primeiro</b>, antes de aplicar ln`,
        `Linha 3: ln(e^(−0,5t)) = ln(1/3) — aplicar ln nos dois lados`,
        `Linha 4: <b>−0,5t</b> = <b>−ln 3</b> — ln(eᵘ) = u e ln(1/3) = −ln 3 (log do quociente)`,
        `Linha 5: t = ln 3/0,5 = 2·1,0986 ≈ 2,197 — os dois sinais negativos se cancelam`,
        `Linha 6: 2ˣ = 50 → x = log₁₀50/log₁₀2 = 1,699/0,301 ≈ 5,64 — mudança de base (conferência: 2⁵·2⁰·⁶⁴ ≈ 32·1,56 ≈ 50)`,
        `Linha 7: log₁₀200 = log₁₀2 + log₁₀100 = 0,301 + 2 = 2,301 — produto vira soma`,
        `Linha 8: Resultado: t ≈ 2,20 (na unidade de t, por exemplo s); x ≈ 5,64; log₁₀200 ≈ 2,301`
      ]
    },
    traps: [
      `Aplicar ln só em um termo ou antes de isolar a exponencial (ln(3 + eˣ) ≠ ln3 + x). Contramedida: primeiro deixe a forma "exponencial = número"; só então aplique ln dos dois lados.`,
      `Escrever log(a + b) = log a + log b, ou log(a·b) = log a · log b. Contramedida: lembre "produto → soma, quociente → subtração, potência → fator" e anote as três regras ao lado.`,
      `Perder o sinal negativo de ln de número menor que 1 (ln(1/3) = −1,0986). Contramedida: antes de calcular, pergunte "o argumento é menor que 1? então o log é negativo".`
    ]
  };

  T[27] = {
    logic: `<p>Um capacitor C em série com um resistor R não muda de tensão instantaneamente: a corrente R·I = Vs − v carrega C, e a taxa de variação de v é proporcional à diferença que falta. Uma taxa proporcional à distância do alvo produz exatamente uma exponencial, com <b>τ = R·C</b> (Ω·F = s).</p><p>Na descarga, v(t) = V₀·e^(−t/τ), decaindo para 0. Na carga, v(t) = Vs·(1 − e^(−t/τ)), subindo de 0 até Vs, e a distância até Vs cai com e^(−t/τ). Em t = τ, o capacitor carregou 63,2%; em 5τ, mais de 99%.</p><p>Para achar o tempo em que a tensão atinge um valor desejado, isole a exponencial e aplique ln: <b>t = −τ·ln(1 − v/Vs)</b> na carga, e t = τ·ln(V₀/v) na descarga. Esse é o cálculo de qualquer temporizador RC, debounce de botão, filtro passa-baixas ou circuito de reset. Antes de calcular, confira os prefixos de unidade (kΩ, μF).</p>`,
    algo: [
      `Calcule <b>τ = R·C</b> com unidades base: Ω e F (kΩ = 10³, μF = 10⁻⁶).`,
      `Escolha o modelo: <b>descarga</b> v = V₀·e^(−t/τ) ou <b>carga</b> v = Vs·(1 − e^(−t/τ)).`,
      `Substitua o alvo e <b>isole a exponencial</b>: na carga, divida por Vs e depois <b>passe o 1 e troque o sinal</b>.`,
      `Aplique <b>ln</b> nos dois lados e cancele o sinal negativo do expoente.`,
      `Multiplique por τ para obter t.`,
      `Valide: t é positivo, e o valor fica entre 0 e a tensão final (conferir ≈ 63% em τ).`
    ],
    example: {
      title: `Exemplo resolvido: carga de C = 10 μF por R = 22 kΩ a partir de 0 V com Vs = 5 V; tempo para v = 3 V`,
      lines: [
        `Linha 1: τ = R·C = 22·10³·10·10⁻⁶ = 0,22 s — Ω·F = s`,
        `Linha 2: v(t) = 5·(1 − e^(−t/τ)) — carga a partir de v(0) = 0`,
        `Linha 3: 3 = 5·(1 − e^(−t/τ)) → 0,6 = 1 <b>−</b> e^(−t/τ) — dividir por 5 antes de mexer no 1`,
        `Linha 4: e^(−t/τ) = 1 <b>− 0,6</b> = 0,4 — passar a exponencial e o 0,6 de lado, trocando os sinais`,
        `Linha 5: −t/τ = ln 0,4 = <b>−</b>0,9163 — ln de número menor que 1 é negativo`,
        `Linha 6: t/τ = 0,9163 → t = 0,9163·0,22 ≈ 0,202 s — cancelar o sinal e multiplicar por τ`,
        `Linha 7: Conferência: e^(−0,9163) = 0,4 → v = 5·(1 − 0,4) = 3 V ✓`,
        `Linha 8: Resultado: τ = 0,22 s e t ≈ 0,20 s (≈ 0,92τ) para chegar a 3 V`
      ]
    },
    traps: [
      `Errar os prefixos: usar kΩ·μF sem converter e obter τ errado por potências de 10. Contramedida: escreva R = 22·10³ e C = 10·10⁻⁶ antes de multiplicar e confira que a unidade final é segundo.`,
      `Usar a fórmula de descarga na carga (ou o contrário): esquecer o (1 − e^(−t/τ)). Contramedida: teste t = 0: na carga v = 0; na descarga v = V₀. Se não bater, o modelo está errado.`,
      `Passar o 1 para o outro lado sem trocar o sinal e obter e^(−t/τ) = 1,6 (impossível). Contramedida: lembre que e^(…) fica sempre entre 0 e 1 aqui; se der maior que 1 ou negativo, volte uma linha.`
    ]
  };

  T[28] = {
    logic: `<p>O decibel é uma escala logarítmica para razões: dB = 10·log₁₀(P₂/P₁) para potência. Como a potência é proporcional ao quadrado da tensão (P = V²/R), o fator se torna <b>20·log₁₀(V₂/V₁)</b> para tensão ou corrente. O motivo de usar logaritmo é prático: sinais de rádio e áudio variam em muitas ordens de grandeza (1 pW a 1 kW), e o logaritmo comprime esse intervalo.</p><p>A grande vantagem é que <b>produto vira soma</b>: em uma cascata amplificador → cabo → filtro, o ganho total em dB é a soma dos ganhos de cada bloco, e a atenuação entra com sinal negativo. Valores de memória: +3 dB ≈ dobra a potência (×2), +6 dB ≈ dobra a tensão, +10 dB = ×10 em potência, +20 dB = ×10 em tensão, −3 dB = metade da potência.</p><p>O dBm é dB referenciado a 1 mW: P(dBm) = 10·log₁₀(P/1 mW); 0 dBm = 1 mW, 30 dBm = 1 W. É a unidade de qualquer enlace de rádio e de fibra óptica.</p>`,
    algo: [
      `Defina a grandeza: <b>potência → fator 10</b>; <b>tensão ou corrente → fator 20</b> (com a mesma impedância).`,
      `Calcule a razão <b>saída/entrada</b> com as mesmas unidades (V com V, mW com mW).`,
      `Aplique o logaritmo <b>base 10</b> e multiplique pelo fator.`,
      `Para cascatas, <b>some os dB</b> (ganho +, atenuação −); nunca some razões.`,
      `Para voltar: <b>razão = 10^(dB/10)</b> (potência) ou <b>10^(dB/20)</b> (tensão).`,
      `dBm: divida a potência por 1 mW antes do log; 0 dBm = 1 mW.`
    ],
    example: {
      title: `Exemplo resolvido: amplificador de Vin = 2 mV para Vout = 0,5 V, seguido de cabo de −6 dB`,
      lines: [
        `Linha 1: Vout/Vin = 0,5/0,002 = 250 — mesma unidade (V) em cima e embaixo`,
        `Linha 2: G = <b>20</b>·log₁₀(250) — grandeza é tensão: fator 20, não 10`,
        `Linha 3: log₁₀250 = log₁₀(1000/4) = 3 <b>−</b> 2·0,301 = 2,398 — quociente vira subtração; log 4 = 2·log 2`,
        `Linha 4: G = 20·2,398 ≈ 47,96 dB — ganho do amplificador`,
        `Linha 5: Gtotal = 47,96 <b>+ (−6)</b> = 41,96 dB — na cascata os dB somam; a atenuação entra com sinal negativo`,
        `Linha 6: razão = 10^(41,96/20) = 10^2,098 ≈ 125 — voltar a razão (confere: 250/2 = 125, pois −6 dB ≈ metade da tensão)`,
        `Linha 7: dBm: 10 mW → 10·log₁₀(10/1) = +10 dBm; 0,1 mW → 10·log₁₀(0,1) = −10 dBm`,
        `Linha 8: Resultado: 47,96 dB no amplificador e 41,96 dB na cascata (≈ 125× em tensão)`
      ]
    },
    traps: [
      `Usar fator 10 para tensão (ou 20 para potência), errando o resultado por 2×. Contramedida: antes de calcular, escreva "P → 10, V → 20" e circule a grandeza do enunciado.`,
      `Inverter a razão (entrada/saída) e obter ganho com sinal trocado, ou multiplicar ganhos em dB em vez de somar. Contramedida: escreva "saída sobre entrada" e verifique: amplificar ⇒ dB positivo, atenuar ⇒ dB negativo.`,
      `Usar ln no lugar de log₁₀ na calculadora (ln 250 = 5,52 ≠ 2,40). Contramedida: confira o botão: dB usa log (base 10); em caso de dúvida, teste log(100) = 2.`
    ]
  };

  /* =========================== SEMANA 8 =========================== */

  T[29] = {
    logic: `<p>A geometria plana converte formas em números. Duas retas paralelas cortadas por uma transversal geram ângulos correspondentes e alternos internos iguais; a soma dos ângulos internos de um triângulo é 180° (e a de um quadrilátero, 360°). As áreas básicas: triângulo b·h/2, trapézio (B + b)·h/2, círculo πr²; o comprimento da circunferência é 2πr. Lembre-se: <b>área escala com o quadrado</b> do comprimento, e o perímetro escala linearmente.</p><p>Na Engenharia Elétrica, a geometria entra direto nas fórmulas dos componentes. Resistência: R = ρL/A, com A = πd²/4 para um fio redondo; dobrar o diâmetro reduz R a 1/4. Capacitância de placas paralelas: C = εA/d, que cresce com a área e cai com a distância. Indutância e campo magnético também dependem da área do núcleo.</p><p>O erro mais comum é trabalhar com as unidades: A em m² (1 cm² = 10⁻⁴ m²) e d em metros. Converta antes de substituir.</p>`,
    algo: [
      `Identifique a forma (círculo, triângulo, trapézio) e anote os dados com suas unidades.`,
      `<b>Converta tudo para metros</b> antes de calcular (cm × 10⁻², mm × 10⁻³).`,
      `Se for dado o diâmetro, use <b>r = d/2</b> (ou A = πd²/4); não use d no lugar de r.`,
      `Calcule a área com a fórmula certa e lembre que <b>área em m²</b> tem o expoente quadrado nas conversões.`,
      `Para ângulos, use soma interna 180° e paralelas: <b>alternos internos são iguais</b>.`,
      `Substitua na fórmula física (R = ρL/A ou C = εA/d) e confira a ordem de grandeza.`
    ],
    example: {
      title: `Exemplo resolvido: capacitor de placas circulares com r = 1 cm, d = 0,1 mm e ε₀ = 8,85×10⁻¹² F/m`,
      lines: [
        `Linha 1: r = 1 cm = 0,01 m = 10⁻² m — <b>converter cm → m</b> antes de qualquer conta`,
        `Linha 2: A = π·r² = π·(10⁻²)² = π·10⁻⁴ ≈ 3,14×10⁻⁴ m² — <b>o quadrado vale para o 10⁻² também</b>`,
        `Linha 3: Perímetro da placa: 2πr = 2π·0,01 ≈ 0,0628 m = 6,28 cm — circunferência cresce linear com r`,
        `Linha 4: Aparte: triângulo com ângulos de 50° e 70° tem o terceiro de 180° − 50° − 70° = 60° — soma interna de 180°`,
        `Linha 5: d = 0,1 mm = 10⁻⁴ m — converter mm → m`,
        `Linha 6: C = ε₀·A/d = 8,85×10⁻¹²·(3,14×10⁻⁴)/10⁻⁴ — fórmula da capacitância de placas paralelas`,
        `Linha 7: 10⁻⁴/10⁻⁴ = 1 → C = 8,85×10⁻¹²·3,14 ≈ 27,8×10⁻¹² F — cancelar as potências de 10`,
        `Linha 8: Resultado: C ≈ 27,8 pF (A ≈ 3,14×10⁻⁴ m², perímetro ≈ 6,28 cm)`
      ]
    },
    traps: [
      `Usar o diâmetro no lugar do raio em πr² (erro de 4×). Contramedida: circule "diâmetro ou raio?" no enunciado e escreva r = d/2 como primeira linha da conta.`,
      `Converter cm² para m² multiplicando por 10⁻² em vez de 10⁻⁴. Contramedida: converta o comprimento antes de elevar ao quadrado: (10⁻² m)² = 10⁻⁴ m².`,
      `Confundir área com perímetro (πr² com 2πr) ou esquecer o /2 do triângulo. Contramedida: escreva a unidade ao lado: m² para área, m para perímetro; se a unidade não bater, a fórmula está errada.`
    ]
  };

  T[30] = {
    logic: `<p>No triângulo retângulo, o quadrado da hipotenusa é a soma dos quadrados dos catetos: a² + b² = c². Geometricamente, a área do quadrado sobre a hipotenusa é igual à soma das áreas dos quadrados sobre os catetos. Ternas pitagóricas inteiras (3-4-5, 5-12-13, 8-15-17) e seus múltiplos permitem resolver de cabeça. Só vale para triângulos retângulos, e a hipotenusa é sempre o maior lado.</p><p>Triângulos semelhantes têm ângulos iguais e lados proporcionais: a razão k entre lados correspondentes é a mesma para todos. O Teorema de Tales é o caso de retas paralelas cortando transversais em segmentos proporcionais. Isso permite medir o que não se alcança (altura de um prédio pela sombra) e é a base de escalas e mapas.</p><p>Na Engenharia Elétrica, resistência R e reatância X são perpendiculares (R no eixo real, X no imaginário), logo o módulo da impedância é <b>|Z| = √(R² + X²)</b>. Todo circuito RL ou RC em série repete esse triângulo.</p>`,
    algo: [
      `Identifique o ângulo reto e a <b>hipotenusa</b> (lado oposto a ele, o maior).`,
      `Se faltar a hipotenusa: <b>c = √(a² + b²)</b>; se faltar um cateto: <b>a = √(c² − b²)</b> (subtração!).`,
      `Quadrados primeiro, soma depois; só então tire a raiz.`,
      `Reconheça ternas (3-4-5, 5-12-13) e seus múltiplos para conferir.`,
      `Semelhança: monte a razão com <b>lados correspondentes na mesma ordem</b> (altura/sombra = altura/sombra).`,
      `Resolva a proporção por produto cruzado e confira se o valor é plausível (a escala k deve ser a mesma).`
    ],
    example: {
      title: `Exemplo resolvido: impedância com R = 60 Ω e X = 80 Ω, e altura de uma torre pela sombra`,
      lines: [
        `Linha 1: R = 60 Ω e X = 80 Ω em série — são os catetos do triângulo de impedância`,
        `Linha 2: |Z|² = R² + X² = 60² + 80² = 3600 + 6400 = 10000 — <b>quadrar cada termo antes de somar</b>`,
        `Linha 3: |Z| = √10000 = 100 Ω — hipotenusa`,
        `Linha 4: Atalho: (60; 80) = 20·(3; 4) → hipotenusa 20·5 = 100 Ω ✓ — terna 3-4-5 ampliada 20 vezes`,
        `Linha 5: Semelhança: vara de 1,5 m com sombra de 2 m; torre com sombra de 24 m no mesmo instante — mesmo ângulo do sol`,
        `Linha 6: altura/24 = 1,5/2 — razão entre lados correspondentes (<b>altura ↔ altura, sombra ↔ sombra</b>)`,
        `Linha 7: altura = 24·1,5/2 = 36/2 = 18 m — produto cruzado e divisão`,
        `Linha 8: Resultado: |Z| = 100 Ω e torre de 18 m`
      ]
    },
    traps: [
      `Somar os catetos sem elevar ao quadrado (60 + 80 = 140) ou esquecer a raiz no final. Contramedida: escreva a² + b² = c² antes de substituir e só termine quando tiver tirado a raiz.`,
      `Usar Pitágoras com a hipotenusa trocada: somar quando deveria subtrair (cateto = √(c² − b²)). Contramedida: sublinhe o maior lado e confirme que a resposta de um cateto é menor que a hipotenusa.`,
      `Montar a proporção com lados não correspondentes (altura/sombra = sombra/altura). Contramedida: rotule cada lado (A_vara, S_vara, A_torre, S_torre) e escreva a razão com o mesmo tipo em cima nos dois lados.`
    ]
  };

  T[31] = {
    logic: `<p>Em um triângulo retângulo, a razão entre dois lados depende só do ângulo, não do tamanho do triângulo (semelhança). Para um ângulo agudo θ: <b>sen θ = oposto/hipotenusa</b>, <b>cos θ = adjacente/hipotenusa</b> e <b>tg θ = oposto/adjacente</b> (SOH-CAH-TOA). Como a hipotenusa é o maior lado, sen e cos ficam entre 0 e 1, e Pitágoras, dividido por c², dá a relação fundamental sen²θ + cos²θ = 1.</p><p>Ângulos notáveis: 30° (sen 1/2, cos √3/2, tg √3/3), 45° (√2/2, √2/2, 1) e 60° (√3/2, 1/2, √3). Para o caminho inverso, as funções arcsen, arccos e arctg devolvem o ângulo a partir da razão (calculadora em graus!).</p><p>Em Engenharia, um vetor inclinado (força em um cabo, campo, fasor) se separa em duas partes: <b>a componente ao longo do eixo (cos) e a componente transversal (sen)</b>. É a mesma conta da parte real e imaginária de um fasor de tensão e da potência ativa em circuitos.</p>`,
    algo: [
      `<b>Desenhe</b> o triângulo, marque o ângulo θ e rotule: hipotenusa, cateto oposto (em frente a θ) e cateto adjacente (encostado em θ).`,
      `Escolha a razão: <b>SOH</b> se há oposto e hipotenusa, <b>CAH</b> se há adjacente e hipotenusa, <b>TOA</b> se há oposto e adjacente.`,
      `Isole o lado desconhecido: <b>oposto = H·sen θ</b>; <b>adjacente = H·cos θ</b>; ou <b>θ = arcsen, arccos, arctg</b> da razão.`,
      `Use os valores notáveis (30°, 45°, 60°) sempre que o enunciado permitir, sem calculadora.`,
      `Confira: <b>sen² + cos² = 1</b> e Pitágoras com as componentes.`,
      `Confirme a calculadora em <b>modo graus</b>, não radianos.`
    ],
    example: {
      title: `Exemplo resolvido: cabo com tração T = 200 N a 30° com a horizontal e o ângulo de um triângulo 3-4`,
      lines: [
        `Linha 1: T = 200 N e θ = 30° — a vertical é o cateto <b>oposto</b> e a horizontal é o <b>adjacente</b>`,
        `Linha 2: Ty = T·sen 30° = 200·0,5 = 100 N — SOH: oposto = hipotenusa·sen`,
        `Linha 3: Tx = T·cos 30° = 200·(√3/2) = 100√3 ≈ 173,2 N — CAH: adjacente = hipotenusa·cos`,
        `Linha 4: sen²30° + cos²30° = 1/4 + 3/4 = 1 ✓ — relação fundamental`,
        `Linha 5: √(Tx² + Ty²) = √(30000 + 10000) = √40000 = 200 N ✓ — as componentes recompõem T`,
        `Linha 6: Catetos 3 m (oposto) e 4 m (adjacente): tg θ = 3/4 = 0,75 — TOA`,
        `Linha 7: θ = arctg(0,75) ≈ 36,87° — função inversa, calculadora em graus`,
        `Linha 8: Resultado: Tx ≈ 173,2 N; Ty = 100 N; θ ≈ 36,9°`
      ]
    },
    traps: [
      `Trocar oposto e adjacente (usar sen no lugar de cos). Contramedida: desenhe o triângulo e escreva O e A nos catetos em relação ao ângulo pedido antes de escolher a razão.`,
      `Calculadora em radianos (sen 30 = −0,99 em vez de 0,5). Contramedida: teste sen(30) antes: se não der 0,5, mude para graus.`,
      `Esquecer que o ângulo dado pode ser medido a partir da vertical, o que troca sen por cos. Contramedida: marque no desenho de qual eixo o ângulo parte, e faça o teste de plausibilidade: para ângulo pequeno a componente ao longo do eixo é quase toda a hipotenusa.`
    ]
  };

  T[32] = {
    logic: `<p>Decompor um vetor é projetá-lo em dois eixos perpendiculares: Fx = F·cos θ (componente ao longo do eixo do ângulo) e Fy = F·sen θ (componente transversal). Em um plano inclinado de ângulo θ, o peso P = m·g se decompõe em <b>P·sen θ ao longo do plano</b> (que faz o bloco descer) e <b>P·cos θ perpendicular ao plano</b> (que a normal equilibra). Em θ = 0 o plano é horizontal e só há normal.</p><p>A mesma matemática aparece em Circuitos de CA. Em uma carga, a potência ativa P (W, que realiza trabalho) e a reativa Q (var, que oscila entre fonte e campo) são perpendiculares, e a potência aparente é a hipotenusa: <b>S² = P² + Q²</b>. O ângulo φ entre P e S dá o fator de potência <b>FP = cos φ = P/S</b>, que diz que fração da corrente "trabalha".</p><p>Um FP baixo obriga a rede a transportar corrente extra sem entregar energia útil, o que causa perdas nos cabos. Por isso, concessionárias cobram multa e indústrias instalam bancos de capacitores para corrigir o FP.</p>`,
    algo: [
      `Desenhe o <b>vetor e os eixos</b> (para plano inclinado: um eixo ao longo do plano e outro perpendicular); marque o ângulo θ.`,
      `Componente <b>ao longo do ângulo</b> = F·cos θ; componente do <b>lado oposto</b> = F·sen θ. No plano inclinado: <b>paralela = P·sen θ</b>; perpendicular = P·cos θ.`,
      `Calcule o peso: <b>P = m·g</b> (em newtons), antes de decompor.`,
      `Triângulo de potências: <b>S = √(P² + Q²)</b>; com S e P, <b>FP = P/S</b> e φ = arccos(FP).`,
      `Se tiver P e φ: Q = P·tg φ e S = P/cos φ.`,
      `Confira que as componentes recompõem o vetor (Pitágoras).`
    ],
    example: {
      title: `Exemplo resolvido: bloco de 20 kg em plano de 37° (g = 10 m/s², sen 37° = 0,6, cos 37° = 0,8) e carga com P = 1200 W e Q = 900 var`,
      lines: [
        `Linha 1: P = m·g = 20·10 = 200 N — peso, antes de decompor`,
        `Linha 2: Paralela = P·sen 37° = 200·0,6 = 120 N — componente que puxa o bloco ao longo do plano`,
        `Linha 3: Perpendicular = P·cos 37° = 200·0,8 = 160 N — equilibrada pela normal`,
        `Linha 4: √(120² + 160²) = √(14400 + 25600) = √40000 = 200 N ✓ — recompõe o peso`,
        `Linha 5: S² = P² + Q² = 1200² + 900² = 1 440 000 + 810 000 = 2 250 000 — <b>quadrar antes de somar</b>`,
        `Linha 6: S = √2 250 000 = 1500 VA — potência aparente`,
        `Linha 7: FP = cos φ = P/S = 1200/1500 = 0,8 → φ ≈ 36,9° — mesmo triângulo 3-4-5 do plano inclinado`,
        `Linha 8: Resultado: 120 N ao longo do plano; S = 1500 VA; FP = 0,8`
      ]
    },
    traps: [
      `Trocar sen e cos no plano inclinado (a componente ao longo do plano é P·sen θ, não P·cos θ). Contramedida: teste os casos extremos: em θ = 0 a força ao longo do plano deve ser 0 (sen 0 = 0) e em θ = 90° deve ser P.`,
      `Somar P + Q diretamente em vez de S = √(P² + Q²), ou esquecer a raiz. Contramedida: desenhe o triângulo com S como hipotenusa e confira que S é maior que P e que Q.`,
      `Esquecer de multiplicar a massa por g (usar 20 em vez de 200 N) ou misturar W, var e VA. Contramedida: escreva a unidade ao lado de cada número e converta kg em N antes de decompor.`
    ]
  };
})(window);
