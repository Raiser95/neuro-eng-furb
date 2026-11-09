# NeuroEng // Prep OS

Ambiente de estudo de 14 semanas (56 sessões) para a 1ª fase de Engenharia Elétrica na FURB.

**Como usar:** abra `index.html` no navegador (duplo clique). Não precisa de servidor, build ou internet
(as fontes Inter / JetBrains Mono são opcionais — sem rede o sistema usa fontes do SO).

## Estrutura
| Arquivo | Função |
|---|---|
| `index.html` | Shell da SPA e navegação |
| `css/styles.css` | Design system neutro (variáveis CSS), responsivo |
| `js/data.js` | Currículo: 56 sessões, matérias FURB, fases, tipos de erro |
| `js/store.js` | Persistência `localStorage`, métricas, recomendação, backup |
| `js/audio.js` | Brown/Pink noise via Web Audio API |
| `js/study.js` | Modo Hiperfoco (timer 4 fases, scratchpad, log de erros, notas) |
| `js/lab.js` | Laboratório visual (senoides/parábola, resistores, portas lógicas) |
| `js/views.js` | Dashboard, Cronograma, Painel Neuro-Analítico |
| `js/app.js` | Roteador por hash |

Dados salvos na chave `neuroeng-prep-os-v1`. Use *Analítico → Exportar JSON* para backup.


## PWA (offline + instal�vel)
- Service Workers exigem **HTTPS ou localhost** (n�o funcionam em ile://). Teste local: python -m http.server 8080 e abra http://localhost:8080; para o iPhone, hospede em HTTPS (ex.: GitHub Pages/Netlify).
- **Windows/Brave:** abra a URL ? �cone de instalar na barra de endere�o (ou menu ? ? *Instalar aplicativo*).
- **iPhone:** Safari ? Compartilhar ? *Adicionar � Tela de In�cio*. Abra uma vez online; depois funciona 100% offline.
- O �udio no iOS respeita o bot�o de silencioso do aparelho em Safari antigo; no iOS 16.4+ o app pede reprodu��o em modo "playback".
- Cache-first: ao editar qualquer arquivo, incremente CACHE_VERSION em sw.js.
- �cones: powershell -ExecutionPolicy Bypass -File tools\make-icons.ps1 (regenera os PNGs em icons/).
