(function (g) {
  "use strict";
  const NE = (g.NE = g.NE || {});
  const T = (NE.Theory = NE.Theory || {});

  /* ===================== SEMANA 12 ===================== */

  T[45] = {
    logic: `<p>Uma função é uma regra que associa a <b>cada</b> entrada x exatamente <b>uma</b> saída y. O <b>domínio</b> é o conjunto de entradas em que a regra faz sentido; a <b>imagem</b> é o conjunto de saídas que ela realmente produz. Existem só três proibições: denominador zero, radicando negativo em raiz de índice par e argumento de logaritmo ≤ 0.</p><p>Geometricamente, o domínio é a sombra do gráfico no eixo x e a imagem é a sombra no eixo y. Uma reta vertical corta o gráfico no máximo uma vez (isso é ser função); uma reta horizontal que o corta no máximo uma vez indica função <b>injetora</b>. Bijetora = injetora + sobrejetora, e só ela tem inversa em todo o contradomínio.</p><p>Na Engenharia Elétrica: um divisor de tensão V<sub>out</sub> = V<sub>in</sub>·R₂/(R₁+R₂) só vale para R₁+R₂ ≠ 0; um amplificador real só obedece ao modelo linear enquanto |V<sub>out</sub>| ≤ V<sub>sat</sub>. Dizer o domínio de validade é parte da resposta.</p>`,
    algo: [
      `Liste as <b>três fontes de restrição</b> presentes na expressão: denominador, raiz de índice par, logaritmo.`,
      `Denominador: escreva <code>denominador ≠ 0</code> e resolva; exclua só os pontos encontrados.`,
      `Raiz par: escreva <code>radicando ≥ 0</code> e resolva a inequação. Se dividir ou multiplicar por número <b>negativo</b>, <b>inverta o sentido</b> da desigualdade.`,
      `Logaritmo: escreva <code>argumento &gt; 0</code> (estritamente) e resolva.`,
      `Faça a <b>interseção</b> de todas as condições (todas valem ao mesmo tempo) e escreva o domínio em notação de intervalo.`,
      `Imagem: esboce o gráfico (vértice, assíntotas, extremos) e leia a faixa de valores de y. Teste injetividade com a reta horizontal.`
    ],
    example: {
      title: `Exemplo resolvido: domínio de f(x) = √(6 − 2x)/(x + 1) e imagem de h(x) = x² − 4`,
      lines: [
        `Linha 1: f(x) = √(6 − 2x)/(x + 1) — duas restrições: raiz par e denominador.`,
        `Linha 2: 6 − 2x ≥ 0 — radicando não pode ser negativo.`,
        `Linha 3: −2x ≥ −6 → <b>x ≤ 3</b> — ao dividir por −2 o sentido da desigualdade foi invertido.`,
        `Linha 4: x + 1 ≠ 0 → <b>x ≠ −1</b> — ponto excluído pelo denominador.`,
        `Linha 5: D(f) = (−∞, 3] menos {−1} — interseção das duas condições.`,
        `Linha 6: h(x) = x² − 4 tem vértice em (0, −4) e abre para cima — Im(h) = [−4, +∞).`,
        `Linha 7: h(1) = −3 e h(−1) = −3 — mesma saída para entradas distintas, logo h <b>não é injetora</b> em ℝ.`,
        `Linha 8: Resultado: D(f) = {x ∈ ℝ | x ≤ 3 e x ≠ −1}; Im(h) = [−4, +∞).`
      ]
    },
    traps: [
      `Dividir ambos os lados de −2x ≥ −6 por −2 e manter o ≥ por pressa. Contramedida: sempre que aparecer coeficiente negativo, desenhe uma seta circular em volta do sinal e escreva o sentido novo.`,
      `Esquecer que o logaritmo exige argumento <b>estritamente</b> positivo (&gt; 0) e aceitar o 0, ou que uma raiz no denominador exige &gt; 0 e não ≥ 0. Contramedida: escreva ao lado de cada restrição se é &gt; 0 ou ≥ 0 antes de resolver.`,
      `Resolver só a primeira restrição que enxerga e parar. Contramedida: faça um checklist de três caixas (denominador, raiz, log) e marque cada uma, mesmo que seja só para escrever &quot;não há&quot;.`
    ]
  };

  T[46] = {
    logic: `<p>Compor é encadear: (f∘g)(x) = f(g(x)). A saída de g vira a entrada de f. Por isso o domínio da composta exige duas coisas: x precisa estar no domínio de g <b>e</b> g(x) precisa cair no domínio de f. A composição <b>não é comutativa</b>: f∘g ≠ g∘f em geral.</p><p>Pense em uma linha de montagem: a peça passa pela máquina g e depois pela máquina f. Ler uma composta &quot;de fora para dentro&quot; é a habilidade de decompor: em (2x − 1)⁵ a função de fora é u⁵ e a de dentro é u = 2x − 1. Essa leitura é exatamente o que a regra da cadeia de Cálculo I vai exigir para derivar.</p><p>Na Engenharia Elétrica, a cadeia sensor → amplificador → ADC é uma composição: se o sensor dá V = 0,01·T, o amplificador multiplica por 100 e o ADC de 10 bits em 5 V converte em código ⌊1023·V/5⌋, o código final é uma função composta de T.</p>`,
    algo: [
      `Identifique quem é <b>interna</b> (g, executada primeiro) e quem é <b>externa</b> (f, executada depois).`,
      `Para f(g(x)): reescreva f e <b>substitua cada x de f por g(x) entre parênteses</b>.`,
      `Expanda os parênteses com cuidado (quadrado da soma, distributiva) e reduza os termos semelhantes.`,
      `Domínio da composta: tome D(g) e <b>retire</b> os x para os quais g(x) cai fora de D(f).`,
      `Para decompor h(x): ache a operação feita <b>por último</b> (função de fora) e chame de u o que está dentro dela.`,
      `Confira com um número: calcule g(a), depois f desse resultado, e compare com a fórmula de f(g(x)) em x = a.`
    ],
    example: {
      title: `Exemplo resolvido: f(x) = x² − 3x e g(x) = x + 2`,
      lines: [
        `Linha 1: f(g(x)) = f(x + 2) = (x + 2)² − 3(x + 2) — cada x de f virou (x + 2).`,
        `Linha 2: (x + 2)² = x² + 4x + 4 — quadrado da soma, sem esquecer o termo do meio.`,
        `Linha 3: <b>−3(x + 2) = −3x − 6</b> — o −3 distribui para os dois termos, inclusive o sinal.`,
        `Linha 4: f(g(x)) = x² + 4x + 4 − 3x − 6 = x² + x − 2 — reduzindo termos semelhantes.`,
        `Linha 5: g(f(x)) = (x² − 3x) + 2 = x² − 3x + 2 — ordem trocada, resultado diferente.`,
        `Linha 6: f(g(1)): g(1) = 3 e f(3) = 9 − 9 = 0 — via números.`,
        `Linha 7: pela fórmula, 1² + 1 − 2 = 0 — confere.`,
        `Linha 8: Resultado: f∘g = x² + x − 2 e g∘f = x² − 3x + 2, logo f∘g ≠ g∘f.`
      ]
    },
    traps: [
      `Trocar a ordem: calcular g(f(x)) quando o enunciado pede f(g(x)). Contramedida: leia f∘g em voz baixa como &quot;f DE g&quot; e escreva a seta g → f acima do exercício antes de começar.`,
      `Substituir g(x) sem parênteses e perder o sinal ou a potência, como em x + 2² em vez de (x + 2)². Contramedida: ao substituir, abra parênteses imediatamente e só os remova depois de expandir.`,
      `Esquecer o domínio da composta, por exemplo em √(x − 4) que exige x ≥ 4. Contramedida: depois da fórmula final, escreva sempre a linha &quot;D = ?&quot; e olhe para a função de fora.`
    ]
  };

  T[47] = {
    logic: `<p>A função inversa <b>desfaz</b> a original: f⁻¹(f(x)) = x. Ela só existe quando f é <b>bijetora</b>: se duas entradas dão a mesma saída, não há como voltar de forma única. Quando f falha só por não ser injetora, restringe-se o domínio (x² em x ≥ 0 tem inversa √x).</p><p>Geometricamente, o gráfico de f⁻¹ é o gráfico de f <b>refletido na reta y = x</b>, porque o par (a, b) vira (b, a). Os pares clássicos são eˣ e ln x, e sen x (em [−π/2, π/2]) e arcsen x. Por isso domínio de f⁻¹ = imagem de f, e vice-versa.</p><p>Na Engenharia Elétrica, projetar é inverter um modelo. A descarga de um capacitor é v(t) = V₀e^(−t/RC); a pergunta &quot;em quanto tempo a tensão cai a um valor v?&quot; é a função inversa t = −RC·ln(v/V₀). Calibrar um sensor também é inverter: do valor medido, recuperar a grandeza física.</p>`,
    algo: [
      `Verifique se f é injetora (teste da reta horizontal). Se não for, <b>restrinja o domínio</b> antes de inverter.`,
      `Escreva y = f(x).`,
      `<b>Troque x por y</b> (e y por x) em toda a equação.`,
      `Isole y: elimine denominadores multiplicando, junte todos os termos com y de um lado e <b>troque o sinal</b> ao passar termos de lado.`,
      `Fatore y em evidência (quando aparece em mais de um termo) e divida pelo coeficiente.`,
      `Aplique ln para desfazer eˣ (e eˣ para desfazer ln); nunca esqueça que o domínio de f⁻¹ é a imagem de f.`,
      `Confira: calcule f(a), depois f⁻¹ desse valor, e verifique que volta a a.`
    ],
    example: {
      title: `Exemplo resolvido: inversa de f(x) = (3x − 2)/(x + 4) e tempo de descarga`,
      lines: [
        `Linha 1: y = (3x − 2)/(x + 4) — escreva f como y.`,
        `Linha 2: x = (3y − 2)/(y + 4) — troca x ↔ y.`,
        `Linha 3: x(y + 4) = 3y − 2 → xy + 4x = 3y − 2 — multiplicou-se por (y + 4) e distribuiu-se.`,
        `Linha 4: <b>xy − 3y = −2 − 4x</b> — termos com y para a esquerda, os outros para a direita, com troca de sinal.`,
        `Linha 5: y(x − 3) = −4x − 2 — y em evidência.`,
        `Linha 6: f⁻¹(x) = (−4x − 2)/(x − 3) = (4x + 2)/(3 − x) — dividiu por (x − 3); domínio x ≠ 3.`,
        `Linha 7: teste: f(0) = −2/4 = −1/2 e f⁻¹(−1/2) = (−2 + 2)/(3,5) = 0 — volta ao ponto de partida.`,
        `Linha 8: v(t) = 5e^(−t/RC) com RC = 2 ms e v = 1 V → t = −RC·ln(v/5) = −2·ln(0,2) = 2·ln 5 ≈ 3,22 ms.`
      ]
    },
    traps: [
      `Escrever f⁻¹(x) como 1/f(x). O −1 é notação de inversa, não de expoente. Contramedida: escreva por extenso &quot;inversa&quot; ao lado e lembre que 1/f(x) se chama recíproca.`,
      `Errar o sinal ao passar termos de lado no passo xy + 4x = 3y − 2 (esquecer o − ao mover 3y ou 4x). Contramedida: escreva a operação inversa na margem (&quot;−3y dos dois lados&quot;) em vez de &quot;passar para o outro lado&quot; de cabeça.`,
      `Esquecer o ln ao desfazer exponencial, ou aplicar ln só em um dos fatores. Contramedida: isole primeiro eˣ sozinho de um lado, e só então aplique ln nos <b>dois</b> lados.`
    ]
  };

  T[48] = {
    logic: `<p>O módulo é a <b>distância até a origem</b>: |a| = a se a ≥ 0 e |a| = −a se a &lt; 0. No gráfico, |f(x)| mantém as partes acima do eixo x e <b>reflete para cima</b> as partes abaixo dele. Já f(|x|) copia o lado direito (x ≥ 0) e o espelha no eixo y, tornando o gráfico simétrico.</p><p>As transformações valem para qualquer curva-base: y = f(x − a) desloca <b>a</b> unidades para a direita; y = f(x) + b sobe <b>b</b>; y = −f(x) reflete no eixo x; y = f(kx) comprime horizontalmente por fator k. Para resolver |f(x)| = c com c ≥ 0, resolve-se f(x) = c <b>ou</b> f(x) = −c.</p><p>Na Engenharia Elétrica, um retificador de onda completa transforma v(t) = V<sub>p</sub>·sen(ωt) em V<sub>p</sub>·|sen(ωt)|. O período cai de 2π/ω para π/ω: a rede de 60 Hz gera ondulação de 120 Hz na saída, e é isso que dimensiona o capacitor do filtro.</p>`,
    algo: [
      `Para |f(x)| = c: se c &lt; 0 não há solução; se c ≥ 0, desdobre em <b>dois casos</b>: f(x) = c e f(x) = −c.`,
      `Resolva cada caso separadamente e <b>confira cada raiz</b> na equação original.`,
      `Para esboçar |f(x)|: desenhe f, localize onde cruza o eixo x e <b>reflita para cima</b> o trecho negativo.`,
      `Para esboçar f(|x|): desenhe só o trecho x ≥ 0 de f e <b>espelhe</b> no eixo y.`,
      `Transformações: dentro dos parênteses atuam ao <b>contrário</b> do esperado (x − 2 desloca para a direita); fora, atuam normalmente.`,
      `Período de |sen(kx)|: é a metade de 2π/k, isto é, π/k.`
    ],
    example: {
      title: `Exemplo resolvido: |x² − 9| = 7 e período do retificador`,
      lines: [
        `Linha 1: |x² − 9| = 7 — como 7 ≥ 0, há dois casos.`,
        `Linha 2: Caso (+): x² − 9 = 7 → x² = 16 → x = ±4 — soma 9 nos dois lados.`,
        `Linha 3: Caso (−): <b>x² − 9 = −7</b> → x² = 2 → x = ±√2 — aqui o 7 recebeu o sinal negativo.`,
        `Linha 4: teste: |16 − 9| = 7 e |2 − 9| = |−7| = 7 — as quatro raízes valem.`,
        `Linha 5: gráfico: a parábola x² − 9 fica negativa em −3 &lt; x &lt; 3; esse trecho é refletido para cima e o vértice passa de (0, −9) para (0, 9).`,
        `Linha 6: |sen(ωt)| repete a cada meio ciclo: período = π/ω.`,
        `Linha 7: com f = 60 Hz, ω = 2π·60 = 120π rad/s — frequência angular da rede.`,
        `Linha 8: Resultado: x = ±4 ou ±√2; período = π/(120π) = 1/120 s ≈ 8,33 ms (ondulação de 120 Hz).`
      ]
    },
    traps: [
      `Resolver só o caso positivo e esquecer o f(x) = −c. Contramedida: sempre que ver barras, escreva duas linhas &quot;(+)&quot; e &quot;(−)&quot; antes de fazer qualquer conta.`,
      `Não conferir as raízes: com módulo contendo variável dos dois lados, aparecem soluções falsas. Contramedida: substitua cada raiz na equação original e marque ✓ ou ✗.`,
      `Confundir |f(x)| com f(|x|). Contramedida: pergunte &quot;as barras estão fora ou dentro?&quot;; fora reflete o que está abaixo do eixo x, dentro espelha o lado direito no eixo y.`
    ]
  };

  /* ===================== SEMANA 13 ===================== */

  T[49] = {
    logic: `<p>O limite pergunta: &quot;para qual valor f(x) se aproxima quando x se aproxima de a?&quot; e <b>ignora</b> o que acontece em x = a. Por isso lim x→a f(x) = L pode existir mesmo que f(a) seja indefinido, como em (x² − 25)/(x − 5) em x = 5, que dá 0/0 mas se aproxima de 10.</p><p>Há duas ferramentas iniciais: a <b>tabela</b> (aproximar por valores como 4,9; 4,99; 4,999 e 5,1; 5,01; 5,001) e o <b>gráfico</b> (olhar a altura para onde a curva caminha, mesmo com um &quot;buraco&quot;). Para polinômios, que são contínuos, o limite é a própria <b>substituição direta</b>: lim x→a P(x) = P(a).</p><p>Na Engenharia Elétrica, limite é a linguagem do regime permanente. Num capacitor em carga, v(t) = V<sub>s</sub>(1 − e^(−t/RC)); quando t → ∞, e^(−t/RC) → 0 e a tensão tende a V<sub>s</sub>. O capacitor nunca &quot;chega&quot; exatamente, mas o limite diz para onde o sistema vai.</p>`,
    algo: [
      `Tente primeiro a <b>substituição direta</b> de x = a na expressão.`,
      `Se der número real, ele é o limite (função contínua). Se der <b>0/0</b>, o limite ainda pode existir: siga para a tabela ou para a álgebra.`,
      `Monte a tabela com valores <b>dos dois lados</b> de a, cada vez mais próximos (distância 0,1; 0,01; 0,001).`,
      `Compare os dois lados: se ambos tendem ao mesmo número L, então lim = L.`,
      `Confirme quando possível por fatoração: simplifique o fator que zera e substitua.`,
      `Escreva a resposta como <code>lim x→a f(x) = L</code> e anote separadamente se f(a) existe ou não.`
    ],
    example: {
      title: `Exemplo resolvido: lim x→5 (x² − 25)/(x − 5) e limite de um polinômio`,
      lines: [
        `Linha 1: f(5) = (25 − 25)/(5 − 5) = 0/0 — indefinido, mas o limite ainda pode existir.`,
        `Linha 2: x = 4,9: (24,01 − 25)/(−0,1) = 9,9 e x = 4,99: 9,99 — pela esquerda.`,
        `Linha 3: x = 5,1: (26,01 − 25)/0,1 = 10,1 e x = 5,01: 10,01 — pela direita.`,
        `Linha 4: os dois lados se aproximam de 10 — lim = 10 enquanto f(5) não existe.`,
        `Linha 5: confirmação: (x − 5)(x + 5)/(x − 5) = x + 5 para x ≠ 5 → 5 + 5 = 10.`,
        `Linha 6: lim x→2 (3x² − x + 1) = 3·4 − 2 + 1 = 11 — polinômio, substituição direta.`,
        `Linha 7: v(t) = 5(1 − e^(−t/RC)) com t → ∞: e^(−t/RC) → 0.`,
        `Linha 8: Resultado: lim t→∞ v(t) = 5·(1 − 0) = 5 V.`
      ]
    },
    traps: [
      `Concluir que &quot;0/0 significa que o limite não existe&quot;. É apenas uma indeterminação. Contramedida: ao ver 0/0, escreva a palavra INDETERMINADO e só então abra a tabela ou a fatoração.`,
      `Calcular a tabela só de um lado. Contramedida: sempre escreva duas colunas (&quot;esquerda&quot; e &quot;direita&quot;) com pelo menos duas linhas cada antes de afirmar o valor.`,
      `Confundir f(a) com lim x→a f(x). Contramedida: escreva as duas coisas em linhas separadas na resposta, mesmo que sejam iguais.`
    ]
  };

  T[50] = {
    logic: `<p>O limite em a existe se, e somente se, os <b>dois limites laterais</b> existirem e forem iguais: lim x→a⁻ f = lim x→a⁺ f = L. Se discordam (ou divergem), o limite não existe. Isso descreve saltos e degraus que o limite bilateral não consegue capturar.</p><p>Limites que tendem a ±∞ geram <b>assíntotas verticais</b> (x = a quando f → ±∞) e os limites quando x → ±∞ geram <b>assíntotas horizontais</b> (y = L). Em racionais, divida numerador e denominador pela <b>maior potência de x</b>: todos os termos do tipo c/xⁿ tendem a 0, e sobra a razão dos coeficientes líderes.</p><p>Na Engenharia Elétrica, uma chave que fecha em t = 0 produz um degrau: tensão 0 à esquerda, V à direita, e os laterais descrevem exatamente isso. Já o regime permanente é lim t→∞: na descarga v(t) = 12e^(−t/RC), o limite é 0 V, e em um filtro passa-baixas o ganho em frequências muito altas tende a 0.</p>`,
    algo: [
      `Para o lado <b>direito</b> (a⁺), use valores um pouco maiores que a; para o <b>esquerdo</b> (a⁻), valores um pouco menores. Analise o <b>sinal</b> de cada fator.`,
      `Denominador → 0 com numerador ≠ 0: o resultado é ±∞, e o sinal vem do sinal do denominador de cada lado.`,
      `Laterais diferentes (ou infinitos de sinais opostos): o limite <b>não existe</b>; escreva isso explicitamente.`,
      `Limite quando x → ±∞ em racionais: <b>divida tudo pela maior potência de x</b> do denominador.`,
      `Substitua os termos c/xⁿ por 0 e calcule a razão que sobrou.`,
      `Escreva as assíntotas: vertical x = a se o limite lateral é ±∞; horizontal y = L se o limite no infinito é L.`
    ],
    example: {
      title: `Exemplo resolvido: 1/(x − 2) em x = 2 e (4x² + 3x)/(2x² − 1) em x → ∞`,
      lines: [
        `Linha 1: x → 2⁺: x − 2 é positivo e muito pequeno — 1/(x − 2) → +∞.`,
        `Linha 2: x → 2⁻: <b>x − 2 é negativo</b> e muito pequeno — 1/(x − 2) → −∞.`,
        `Linha 3: laterais diferentes — o limite em 2 não existe e x = 2 é assíntota vertical.`,
        `Linha 4: g(x) = (4x² + 3x)/(2x² − 1) — maior potência é x²; divide-se numerador e denominador por x².`,
        `Linha 5: g(x) = (4 + 3/x)/(2 − 1/x²) — cada termo dividido por x².`,
        `Linha 6: x → ∞: 3/x → 0 e 1/x² → 0 — sobra (4 + 0)/(2 − 0).`,
        `Linha 7: lim x→∞ g(x) = 4/2 = 2 — y = 2 é assíntota horizontal (o mesmo vale para x → −∞).`,
        `Linha 8: Resultado físico: v(t) = 12e^(−t/RC) → 0 quando t → ∞, ou seja, v(∞) = 0 V.`
      ]
    },
    traps: [
      `Dizer que 1/0 = ∞ sem olhar o sinal, ignorando que +∞ e −∞ são lados diferentes. Contramedida: escreva (+) ou (−) em cima de cada fator para cada lado antes de concluir.`,
      `Cortar &quot;x² com x²&quot; sem dividir todos os termos, ou dividir só o numerador. Contramedida: desenhe uma barra de fração grande e escreva &quot;÷ x²&quot; embaixo de <b>cada</b> termo.`,
      `Tratar ∞ como número e escrever ∞ − ∞ = 0 ou ∞/∞ = 1. Contramedida: lembre que ∞ é um comportamento, não um número; ao ver ∞/∞, ative o algoritmo de dividir pela maior potência.`
    ]
  };

  T[51] = {
    logic: `<p>Quando a substituição dá <b>0/0</b>, o numerador e o denominador têm um fator comum que vai a zero. Esse fator é a causa da indeterminação, e a álgebra serve para <b>cancelá-lo</b> antes de substituir. Como limite ignora o ponto x = a, é legítimo simplificar (x − a)/(x − a) = 1 para x ≠ a.</p><p>Há duas ferramentas centrais. <b>Fatoração</b>: produtos notáveis (a² − b² = (a − b)(a + b)) e trinômios revelam o fator (x − a). <b>Racionalização</b>: com raízes, multiplique por conjugado, pois (√A − b)(√A + b) = A − b² elimina a raiz e faz aparecer o fator que cancela. Para ∞/∞, divide-se pela maior potência.</p><p>Na Engenharia Elétrica, a derivada é um limite 0/0: [f(x + h) − f(x)]/h com h → 0. Corrente num indutor, velocidade de variação de carga, ganho de filtro numa frequência de corte: todos surgem como 0/0 que a álgebra desbloqueia.</p>`,
    algo: [
      `Substitua x = a. Se der número, termine. Se der <b>0/0</b>, não pare: há fator a cancelar.`,
      `Polinômios: <b>fatore</b> numerador e denominador (fator comum, diferença de quadrados, trinômio por soma e produto).`,
      `Raízes: multiplique numerador e denominador pelo <b>conjugado</b> (mesmos termos, sinal central trocado).`,
      `Expanda só a parte que tem raiz: (√A − b)(√A + b) = A − b². Cuidado com o sinal ao distribuir o −b².`,
      `<b>Cancele</b> o fator que zera (válido porque x ≠ a no limite) e simplifique.`,
      `Substitua x = a na expressão simplificada. Para ∞/∞, divida tudo pela maior potência de x.`
    ],
    example: {
      title: `Exemplo resolvido: lim x→3 (x² − x − 6)/(x² − 9) e lim x→0 (√(x + 9) − 3)/x`,
      lines: [
        `Linha 1: substituindo x = 3: (9 − 3 − 6)/(9 − 9) = 0/0 — indeterminação.`,
        `Linha 2: x² − x − 6 = (x − 3)(x + 2) e x² − 9 = (x − 3)(x + 3) — trinômio e diferença de quadrados.`,
        `Linha 3: (x − 3)(x + 2)/[(x − 3)(x + 3)] = (x + 2)/(x + 3) — cancelou (x − 3), válido para x ≠ 3.`,
        `Linha 4: x → 3: (3 + 2)/(3 + 3) = 5/6 — primeiro limite.`,
        `Linha 5: em x = 0: (3 − 3)/0 = 0/0 — segundo limite, com raiz; usar o conjugado √(x + 9) + 3.`,
        `Linha 6: numerador: (√(x + 9))² <b>− 3²</b> = x + 9 − 9 = x — diferença de quadrados elimina a raiz.`,
        `Linha 7: x/[x(√(x + 9) + 3)] = 1/(√(x + 9) + 3) — cancelou x.`,
        `Linha 8: Resultado: x → 0 dá 1/(3 + 3) = 1/6; e o primeiro limite vale 5/6.`
      ]
    },
    traps: [
      `Cancelar termos em vez de fatores, como (x + 2)/(x + 3) virar 2/3 cortando os x. Contramedida: só cancele o que está multiplicando; circule o fator inteiro e verifique se há sinal de + ou − entre os termos.`,
      `No conjugado, multiplicar só o numerador e esquecer o denominador. Contramedida: escreva uma fração de 1 explícita [(√A + b)/(√A + b)] antes de multiplicar.`,
      `Errar o sinal da diferença de quadrados, por exemplo (√(x + 9))² − 3² virar x + 9 + 9. Contramedida: escreva o produto notável (a − b)(a + b) = a² − b² ao lado e substitua a e b entre parênteses.`
    ]
  };

  T[52] = {
    logic: `<p>Uma função f é <b>contínua</b> em a se três condições valem juntas: (1) f(a) existe; (2) lim x→a f(x) existe (laterais iguais); (3) lim x→a f(x) = f(a). Graficamente: dá para desenhar o gráfico em torno de a sem tirar o lápis do papel.</p><p>As falhas têm nomes. <b>Removível</b>: o limite existe, mas f(a) falta ou está no lugar errado (um buraco, consertável redefinindo f(a)). <b>De salto</b>: laterais finitos e diferentes. <b>Infinita</b>: o limite lateral é ±∞ (assíntota). Em funções por partes, a continuidade se impõe igualando os limites laterais na emenda. O Teorema do Valor Intermediário diz que uma função contínua em [a, b] assume todos os valores entre f(a) e f(b); por isso, se f muda de sinal, há uma raiz.</p><p>Na Engenharia Elétrica, a tensão no capacitor e a corrente no indutor são contínuas: não pulam instantaneamente porque isso exigiria potência infinita. Daí a regra de ouro v<sub>C</sub>(0⁺) = v<sub>C</sub>(0⁻).</p>`,
    algo: [
      `Verifique a condição (1): calcule ou tente calcular f(a).`,
      `Verifique a condição (2): calcule os <b>dois limites laterais</b> e compare.`,
      `Verifique a condição (3): compare o limite com f(a). Se diferirem, a descontinuidade é <b>removível</b>; se laterais finitos diferem, é de <b>salto</b>; se vão a ±∞, é <b>infinita</b>.`,
      `Para achar uma constante k que torne f contínua: <b>iguale</b> os dois lados na emenda e resolva para k.`,
      `Se aparecer 0/0 no ponto, fatore e cancele antes de calcular o limite.`,
      `Teorema do Valor Intermediário: se f é contínua em [a, b] e f(a), f(b) têm <b>sinais opostos</b>, existe raiz entre a e b.`
    ],
    example: {
      title: `Exemplo resolvido: achar k para f e g serem contínuas, e a tensão no capacitor`,
      lines: [
        `Linha 1: f(x) = (x² − 16)/(x − 4) para x ≠ 4 e f(4) = k — em x = 4 aparece 0/0.`,
        `Linha 2: (x − 4)(x + 4)/(x − 4) = x + 4 — fatorar e cancelar para x ≠ 4.`,
        `Linha 3: lim x→4 f(x) = 4 + 4 = 8 — limite existe.`,
        `Linha 4: continuidade exige f(4) = limite — k = 8.`,
        `Linha 5: g(x) = 3x − 1 (x &lt; 2) e g(x) = x² + k (x ≥ 2) — função por partes; emenda em x = 2.`,
        `Linha 6: lim x→2⁻ g = 3·2 − 1 = 5 e g(2) = 2² + k = 4 + k — esquerdo e valor do ponto.`,
        `Linha 7: igualando: 4 + k = 5 → <b>k = 5 − 4 = 1</b> — k = 1 torna g contínua.`,
        `Linha 8: Resultado: k = 8 para f; k = 1 para g. No circuito, se v<sub>C</sub>(0⁻) = 2 V, então v<sub>C</sub>(0⁺) = 2 V.`
      ]
    },
    traps: [
      `Verificar só se o limite existe e esquecer de comparar com f(a). Contramedida: escreva as três condições como checklist com três caixas e marque uma por uma.`,
      `Em funções por partes, usar a fórmula errada no limite lateral (usar a parte de x ≥ 2 para x → 2⁻). Contramedida: antes de calcular, escreva ao lado de cada limite qual fórmula ele usa (&quot;esquerda → primeira, direita → segunda&quot;).`,
      `Errar a aritmética ao isolar k (4 + k = 5 vira k = 9). Contramedida: troque o sinal explicitamente (&quot;−4 dos dois lados&quot;) e substitua k de volta para validar.`
    ]
  };

  /* ===================== SEMANA 14 ===================== */

  T[53] = {
    logic: `<p>A <b>taxa de variação média</b> de f no intervalo [a, b] é Δf/Δx = [f(b) − f(a)]/(b − a): quanto a saída muda por unidade de entrada. Geometricamente, é a <b>inclinação da reta secante</b> que une os pontos (a, f(a)) e (b, f(b)) do gráfico.</p><p>Quando f = s(t) é posição, Δs/Δt é a velocidade média, aquela que o computador de bordo indica para a viagem inteira. Ela esconde as oscilações dentro do intervalo. Se você encolhe o intervalo (de 1 s para 0,1 s para 0,01 s), as secantes giram e se aproximam de uma reta limite; a inclinação limite é a taxa <b>instantânea</b>, o assunto da próxima sessão.</p><p>Na Engenharia Elétrica, a corrente média num intervalo é ΔQ/Δt, a carga que passou dividida pelo tempo. Reduzir o Δt até quase zero leva à corrente instantânea i = dq/dt. Taxas médias também medem a velocidade de subida de um sinal (slew rate = ΔV/Δt em V/μs).</p>`,
    algo: [
      `Identifique a função e os extremos do intervalo: <b>a</b> (início) e <b>b</b> (fim).`,
      `Calcule <b>f(a)</b> e <b>f(b)</b> separadamente, substituindo com parênteses.`,
      `Monte a diferença na ordem correta: <b>f(b) − f(a)</b> no numerador e <b>b − a</b> no denominador (mesma ordem nos dois).`,
      `Divida e escreva a <b>unidade</b>: unidade de f por unidade de x (m/s, A, V/μs).`,
      `Para ver a tendência, repita com intervalos menores [a, a + 0,1], [a, a + 0,01] mantendo o ponto inicial.`,
      `Interprete: o resultado é a inclinação da secante; os valores que se estabilizam indicam a taxa instantânea.`
    ],
    example: {
      title: `Exemplo resolvido: s(t) = 3t² (m, s) a partir de t = 2 s`,
      lines: [
        `Linha 1: s(2) = 3·4 = 12 m — posição inicial.`,
        `Linha 2: [2, 4]: s(4) = 3·16 = 48 m → (48 − 12)/(4 − 2) = 36/2 = 18 m/s.`,
        `Linha 3: [2, 3]: s(3) = 3·9 = 27 m → (27 − 12)/(3 − 2) = 15/1 = 15 m/s.`,
        `Linha 4: [2; 2,1]: s(2,1) = 3·4,41 = 13,23 m → (13,23 − 12)/0,1 = 1,23/0,1 = 12,3 m/s.`,
        `Linha 5: [2; 2,01]: s(2,01) = 3·4,0401 = 12,1203 m → <b>(12,1203 − 12)</b>/0,01 = 0,1203/0,01 = 12,03 m/s.`,
        `Linha 6: sequência 18; 15; 12,3; 12,03 — as secantes se aproximam de uma inclinação limite.`,
        `Linha 7: Resultado: a velocidade instantânea em t = 2 s tende a 12 m/s.`
      ]
    },
    traps: [
      `Inverter a ordem em apenas um dos lados, como f(a) − f(b) em cima e b − a embaixo, o que troca o sinal da resposta. Contramedida: escreva &quot;final − inicial&quot; em cima e embaixo antes de substituir os números.`,
      `Esquecer de elevar ao quadrado ou de multiplicar o coeficiente ao calcular f(b), por exemplo 3·2,1² = 6,3². Contramedida: calcule a potência primeiro numa linha própria e só depois multiplique pelo coeficiente (precedência: potência antes de produto).`,
      `Esquecer a unidade ou dividir pelo valor de b em vez de b − a. Contramedida: circule o denominador como &quot;Δt&quot; e escreva a unidade ao lado da resposta final.`
    ]
  };

  T[54] = {
    logic: `<p>A derivada é a taxa média no limite de intervalos infinitamente pequenos: f′(x) = lim h→0 [f(x + h) − f(x)]/h. O numerador é a variação de f entre x e x + h, o denominador é o passo h, e o quociente é a inclinação da <b>secante</b>. No limite, a secante vira a <b>tangente</b> e f′(a) é o seu coeficiente angular.</p><p>O quociente sempre dá 0/0 se substituirmos h = 0 de imediato. A saída é <b>expandir f(x + h)</b> (produtos notáveis), subtrair f(x), <b>colocar h em evidência</b> e cancelar. Notações equivalentes: f′(x), dy/dx, df/dx. Se f é derivável em a, então é contínua em a, mas a recíproca é falsa: f(x) = |x| é contínua e tem bico em 0, onde não há tangente única.</p><p>Na Engenharia Elétrica, a corrente é i = dq/dt, a derivada da carga, e a tensão no indutor é v = L·di/dt. Toda a análise de circuitos dinâmicos é derivada.</p>`,
    algo: [
      `Escreva o quociente de Newton: <code>[f(x + h) − f(x)]/h</code>.`,
      `Calcule f(x + h) substituindo x por (x + h) <b>entre parênteses</b> e expanda (quadrado da soma, cubo da soma).`,
      `Subtraia f(x) inteiro: <b>coloque f(x) entre parênteses</b> e troque o sinal de cada termo dele.`,
      `Os termos sem h se cancelam; <b>fatore h</b> nos termos restantes.`,
      `Cancele o h do numerador com o h do denominador.`,
      `Faça h → 0 na expressão simplificada. O resultado é f′(x).`,
      `Para a tangente em x = a: use f′(a) como inclinação e escreva y − f(a) = f′(a)(x − a).`
    ],
    example: {
      title: `Exemplo resolvido: derivada de f(x) = x² + 3x pela definição`,
      lines: [
        `Linha 1: f′(x) = lim h→0 [f(x + h) − f(x)]/h — definição.`,
        `Linha 2: f(x + h) = (x + h)² + 3(x + h) = x² + 2xh + h² + 3x + 3h — expansão.`,
        `Linha 3: f(x + h) − f(x) = x² + 2xh + h² + 3x + 3h <b>− x² − 3x</b> = 2xh + h² + 3h — sinal trocado em todo f(x).`,
        `Linha 4: h(2x + h + 3)/h — h em evidência no numerador.`,
        `Linha 5: = 2x + h + 3 — cancelou h (h ≠ 0 dentro do limite).`,
        `Linha 6: h → 0: f′(x) = 2x + 3 — a derivada.`,
        `Linha 7: f′(2) = 2·2 + 3 = 7 e f(2) = 4 + 6 = 10 — inclinação e ponto de tangência.`,
        `Linha 8: Resultado: tangente em x = 2: y − 10 = 7(x − 2), ou y = 7x − 4.`
      ]
    },
    traps: [
      `Esquecer de trocar o sinal de todos os termos de f(x) ao subtrair, deixando um x² ou 3x sem cancelar. Contramedida: escreva f(x) entre parênteses com o sinal de menos na frente e distribua termo por termo.`,
      `Expandir (x + h)² como x² + h² (esquecendo o termo 2xh). Contramedida: escreva sempre &quot;a² + 2ab + b²&quot; ao lado e substitua a = x e b = h.`,
      `Substituir h = 0 cedo demais e declarar 0/0. Contramedida: só faça h → 0 depois de cancelar o h do denominador; se ainda sobrar h embaixo, algo está faltando.`
    ]
  };

  T[55] = {
    logic: `<p>A regra do tombo diz que (xⁿ)′ = n·xⁿ⁻¹: o expoente &quot;tomba&quot; para a frente como coeficiente e o expoente diminui 1. Ela nasce do quociente de Newton: o binômio (x + h)ⁿ = xⁿ + n·xⁿ⁻¹·h + (termos com h²…), e depois de subtrair xⁿ e dividir por h, só sobra n·xⁿ⁻¹ quando h → 0.</p><p>A derivada é <b>linear</b>: (c·f)′ = c·f′ e (f + g)′ = f′ + g′. Então, para um polinômio, derivam-se os termos um a um. A derivada de uma constante é 0 (não varia), e (x)′ = 1. Raízes e inversos se tratam reescrevendo como potência: √x = x^(1/2) e 1/x² = x⁻². O valor f′(a) é a inclinação da tangente em x = a.</p><p>Na Engenharia Elétrica, a derivada de um polinômio descreve, por exemplo, a taxa de variação de uma carga q(t) = 3t² + 2t (então i = 6t + 2) ou a potência dissipada P = R·i². Zerar f′ localiza máximos e mínimos, o núcleo da otimização de projeto.</p>`,
    algo: [
      `Reescreva cada termo na forma <b>c·xⁿ</b>: raízes como x^(1/n), denominadores como expoente negativo.`,
      `Derive termo a termo: <b>multiplique o coeficiente pelo expoente</b> e <b>subtraia 1 do expoente</b>.`,
      `Cuidado com o sinal: o coeficiente negativo continua negativo depois de multiplicar (−3·3 = <b>−9</b>).`,
      `Derivada de termo em x (como 6x) é o coeficiente (6); derivada de constante é <b>0</b> (o termo desaparece).`,
      `Monte f′(x) juntando os termos derivados com os sinais originais.`,
      `Para a inclinação em x = a, calcule f′(a); para a tangente, calcule também f(a) e escreva <code>y − f(a) = f′(a)(x − a)</code>.`
    ],
    example: {
      title: `Exemplo resolvido: f(x) = 5x⁴ − 3x³ + 6x − 2, derivada e tangente em x = 2`,
      lines: [
        `Linha 1: (5x⁴)′ = 5·4·x³ = 20x³ — coeficiente vezes expoente; expoente 4 → 3.`,
        `Linha 2: (−3x³)′ = −3·3·x² = <b>−9x²</b> — o sinal negativo permanece.`,
        `Linha 3: (6x)′ = 6 e (−2)′ = 0 — constante desaparece.`,
        `Linha 4: f′(x) = 20x³ − 9x² + 6 — derivada completa.`,
        `Linha 5: f′(2) = 20·8 − 9·4 + 6 = 160 − 36 + 6 = 130 — inclinação em x = 2.`,
        `Linha 6: f(2) = 5·16 − 3·8 + 12 − 2 = 80 − 24 + 12 − 2 = 66 — ponto de tangência (2, 66).`,
        `Linha 7: y − 66 = 130(x − 2) — equação da tangente.`,
        `Linha 8: y = 130x − 260 + 66 = 130x − 194 — forma reduzida.`
      ]
    },
    traps: [
      `Derivar a constante como se fosse xⁿ, deixando um termo que deveria sumir (por exemplo (−2)′ = −2). Contramedida: ao ver um número solto, escreva &quot;0&quot; ao lado dele antes de continuar.`,
      `Esquecer de diminuir o expoente, ou diminuir sem multiplicar (5x⁴ virar 5x³ ou 20x⁴). Contramedida: faça as duas ações escrevendo a seta &quot;×n&quot; e &quot;−1&quot; em cada termo.`,
      `Calcular f′(a) no lugar de f(a) na reta tangente (usar f′(2) = 130 como y). Contramedida: faça dois cálculos separados e rotulados, &quot;inclinação = f′(a)&quot; e &quot;ponto = f(a)&quot;, antes de montar a equação.`
    ]
  };

  T[56] = {
    logic: `<p>A derivada é <b>a taxa de variação instantânea</b> de uma grandeza em relação ao tempo. Se s(t) é a posição, a velocidade é v = ds/dt e a aceleração é a = dv/dt = d²s/dt². Se q(t) é a carga que atravessou a seção de um fio, a corrente é i = dq/dt (1 A = 1 C/s). Mesma matemática, grandezas diferentes.</p><p>Os <b>pontos críticos</b> (f′ = 0) são onde a grandeza para de subir ou descer: v = 0 indica o instante em que o móvel inverte o sentido; para uma tensão ou corrente, indica um máximo ou mínimo local. O sinal de f′ diz se a função cresce (+) ou decresce (−), e o sinal de a diz se a velocidade aumenta ou diminui.</p><p>Na Engenharia Elétrica, o indutor obedece a v<sub>L</sub> = L·di/dt e o capacitor a i<sub>C</sub> = C·dv/dt: a tensão no indutor só aparece quando a corrente <b>varia</b>. Em corrente contínua constante (di/dt = 0), o indutor é um curto-circuito. Esse é o ponto de partida da análise de circuitos RL e RC.</p>`,
    algo: [
      `Identifique a grandeza e a variável: s(t), q(t) ou i(t), e a <b>unidade</b> de cada uma.`,
      `Derive com a regra do tombo: <b>velocidade v = s′(t)</b>, <b>corrente i = q′(t)</b>.`,
      `Para a aceleração (ou di/dt), derive <b>de novo</b> o resultado anterior.`,
      `Para pontos críticos, resolva <b>f′(t) = 0</b>: fatore ou use soma e produto.`,
      `Substitua os instantes nas funções originais para obter posição, corrente ou tensão naquele ponto.`,
      `Para o indutor, use v<sub>L</sub> = L·di/dt com <b>L em henries</b> (mH = 10⁻³ H) e di/dt em A/s.`,
      `Escreva sempre a unidade final: m/s, m/s², A, V.`
    ],
    example: {
      title: `Exemplo resolvido: s(t) = t³ − 6t² + 9t (m, s) e q(t) = t³ + 4t (C) com indutor`,
      lines: [
        `Linha 1: v(t) = s′(t) = 3t² − 12t + 9 — regra do tombo termo a termo.`,
        `Linha 2: v = 0 → 3(t² − 4t + 3) = 3(t − 1)(t − 3) = 0 — instantes t = 1 s e t = 3 s.`,
        `Linha 3: a(t) = v′(t) = 6t − 12 — derivada de novo.`,
        `Linha 4: a(1) = <b>6 − 12 = −6</b> m/s² e a(3) = 18 − 12 = 6 m/s² — inversão de sentido em t = 1 e t = 3 s.`,
        `Linha 5: s(1) = 1 − 6 + 9 = 4 m e s(3) = 27 − 54 + 27 = 0 m — posições dos pontos críticos.`,
        `Linha 6: i(t) = q′(t) = 3t² + 4 — corrente em A; i(2) = 3·4 + 4 = 16 A.`,
        `Linha 7: di/dt = 6t → em t = 2 s: 6·2 = 12 A/s — taxa de variação da corrente.`,
        `Linha 8: com L = 2 mH: v<sub>L</sub> = L·di/dt = 2×10⁻³·12 = 24×10⁻³ V = 24 mV.`
      ]
    },
    traps: [
      `Derivar a posição uma vez e achar que é a aceleração (ou derivar duas vezes quando só pediram velocidade). Contramedida: escreva a cadeia s → v → a e circule o degrau pedido antes de derivar.`,
      `Resolver v = 0 incorretamente (dividir por t e perder uma raiz, ou errar o sinal ao fatorar). Contramedida: fatore sempre o coeficiente comum primeiro e confirme cada raiz substituindo em v(t).`,
      `Esquecer a conversão de mH para H em v = L·di/dt e errar por um fator 1000. Contramedida: converta as unidades na primeira linha (2 mH = 2×10⁻³ H) e escreva a unidade final do resultado.`
    ]
  };
})(window);
