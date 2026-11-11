/* ==========================================================================
   NeuroEng // Prep OS — Estação de Estudo "Modo Hiperfoco" (Zen Workspace)
   ========================================================================== */
(function (global) {
  "use strict";
  const NE = global.NE;
  const D = NE.Data, S = NE.Store, U = NE.U, Noise = NE.Noise;
  const esc = U.esc;

  function mount(root, id) {
    const sess = D.CURRICULUM[id - 1];
    if (!sess) {
      root.innerHTML = '<div class="card"><p>Sessão não encontrada.</p><a class="btn" href="#/schedule">Voltar ao cronograma</a></div>';
      return function () {};
    }

    /* ----------------------------- estado do timer ---------------------------- */
    let base = 0;       // segundos acumulados até o último start
    let offset = 0;     // segundos de estudos anteriores (ao revisar sessão concluída)
    let running = false;
    let startTs = 0;
    let viewIdx = null; // fase exibida manualmente (null = acompanha a fase atual)
    let lastCur = -1;
    let lastSecShown = -1;
    let pulseTimer = null, tickTimer = null, noteTimer = null;
    let finished = false;

    (function restore() {
      const p = S.session(id);
      const t = S.state.timer;
      if (t && t.sessionId === id) { base = t.elapsedSec || 0; offset = t.offsetSec || 0; }
      else if (p.completed) { offset = p.seconds || 0; base = 0; }
      else { base = p.seconds || 0; }
    })();

    const P = function () { return S.session(id); };
    const minMode = function () { return !!P().minMode; };
    const targetSec = function () { return (minMode() ? D.MIN_MODE_MINUTES : sess.durationMinutes) * 60; };
    const elapsed = function () { return running ? base + (Date.now() - startTs) / 1000 : base; };

    function persist() {
      const el = elapsed();
      P().seconds = offset + Math.floor(el);
      S.state.timer = { sessionId: id, elapsedSec: el, offsetSec: offset, running: running, savedAt: Date.now() };
      S.save();
    }

    function phaseAt(el) {
      const t = targetSec();
      let acc = 0;
      for (let i = 0; i < 4; i++) {
        const end = acc + D.PHASES[i].pct * t;
        if (el < end || i === 3) return i;
        acc = end;
      }
      return 3;
    }

    /* --------------------------------- layout --------------------------------- */
    const audio = S.state.audio;
    root.innerHTML =
      '<section class="study" id="st-root">' +
      '<header class="study-head">' +
      '<div><p class="eyebrow mono">SEMANA ' + sess.week + ' · DIA ' + sess.day + ' · ' + sess.durationMinutes + ' MIN</p>' +
      '<h1>' + esc(sess.title) + '</h1>' +
      '<p class="muted small">' + esc(sess.weekTheme) + '</p></div>' +
      '<div class="study-head-actions">' +
      '<button class="btn ghost zen-only" id="st-exit" type="button">← Sair do Hiperfoco</button>' +
      '<a class="btn ghost pre-only" href="#/schedule">← Cronograma</a>' +
      (sess.completed ? '<span class="chip chip-done">Concluída</span>' : '') +
      '</div></header>' +

      '<div class="why-box">' +
      '<h2>Por que isso controla a Engenharia Elétrica?</h2>' +
      '<p>' + esc(sess.engineeringConnection) + '</p>' +
      '<p class="muted small">Destrava: ' + esc(sess.furbSubject) + '</p></div>' +

      '<div class="card reco pre-only"><h3>Antes de começar · Calibragem de atenção</h3>' +
      '<p>' + esc(S.recommendation().text) + '</p></div>' +

      '<div class="study-grid">' +
      '<div class="study-main">' +

      '<div class="card timer-card" id="st-timer-card">' +
      '<div class="timer-top"><div class="timer-read mono" id="st-clock">00:00</div>' +
      '<div class="timer-meta mono"><span id="st-goal"></span><span id="st-state" class="muted"></span></div></div>' +
      '<div class="phase-bar" id="st-bar" aria-hidden="true"></div>' +
      '<div class="timer-actions">' +
      '<button class="btn primary" id="st-toggle" type="button"></button>' +
      '<button class="btn" id="st-finish" type="button">Concluir sessão</button>' +
      '</div>' +
      '<label class="switch"><input type="checkbox" id="st-min"><span class="switch-ui"></span>' +
      '<span><strong>Modo Mínimo Viável (25 min)</strong><br><span class="muted small">Para sobrecarga sensorial ou imprevistos. Conta 100% e mantém a ofensiva.</span></span></label>' +
      '<p class="small" id="st-min-note"></p>' +
      '</div>' +

      '<div class="card phase-card">' +
      '<div class="phase-tabs" id="st-tabs" role="tablist"></div>' +
      '<div id="st-phase-panel"></div></div>' +
      '</div>' +

      '<aside class="study-tools">' +

      '<div class="card tool"><h3>Ruído de Fundo</h3>' +
      '<p class="muted small">Gerado no navegador. Bloqueia sons externos sem sobressaltos.</p>' +
      '<div class="seg" id="st-noise">' +
      '<button type="button" data-n="brown">Marrom</button>' +
      '<button type="button" data-n="pink">Rosa</button>' +
      '<button type="button" data-n="off">Silêncio</button></div>' +
      '<label class="range-row"><span class="small muted">Volume</span>' +
      '<input type="range" id="st-vol" min="0" max="100" value="' + Math.round(audio.volume * 100) + '"></label></div>' +

      '<div class="card tool"><h3>Scratchpad Algébrico</h3>' +
      '<p class="muted small">Uma linha por vez. Valide antes de abrir a próxima.</p>' +
      '<input type="text" id="sp-input" class="mono" placeholder="linha atual: 2x + 3 = 11" autocomplete="off" spellcheck="false">' +
      '<label class="check"><input type="checkbox" class="sp-chk"><span>Copiei os sinais corretamente?</span></label>' +
      '<label class="check"><input type="checkbox" class="sp-chk"><span>Isolei uma única variável nesta linha?</span></label>' +
      '<label class="check"><input type="checkbox" class="sp-chk"><span>Conferi as unidades/potências de 10?</span></label>' +
      '<div class="row"><button type="button" class="btn small-btn" id="sp-ok" disabled>Validar linha ✓</button>' +
      '<button type="button" class="btn ghost small-btn" id="sp-clear">Limpar</button></div>' +
      '<ol class="sp-lines mono" id="sp-lines"></ol></div>' +

      '<div class="card tool"><h3>Log de Erros de Atenção</h3>' +
      '<p class="muted small">Errou uma questão? Um clique, sem culpa — é dado, não julgamento.</p>' +
      '<div class="err-grid" id="st-errs"></div>' +
      '<div class="row"><button type="button" class="btn ghost small-btn" id="st-err-undo">Desfazer último</button>' +
      '<span class="small muted" id="st-err-fb" role="status"></span></div></div>' +

      '<div class="card tool"><h3>Notas da Sessão</h3>' +
      '<textarea id="st-notes" rows="4" placeholder="Dúvidas, macetes, o que travar…"></textarea></div>' +

      '</aside></div></section>';

    const $ = function (sel) { return root.querySelector(sel); };
    const $$ = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };

    // Barra de fases
    $("#st-bar").innerHTML = D.PHASES.map(function (ph) {
      return '<div class="seg-cell" style="flex:' + ph.pct * 100 + '"><div class="seg-fill"></div></div>';
    }).join("");
    $("#st-tabs").innerHTML = D.PHASES.map(function (ph, i) {
      return '<button type="button" role="tab" class="phase-tab" data-i="' + i + '"><span class="mono">F' + ph.key + '</span> ' + ph.short + '</button>';
    }).join("");

    /* --------------------------------- fases ---------------------------------- */
    let unmountBench = null;
    const CE = NE.CE;

    function renderPhase(idx) {
      if (unmountBench) { unmountBench(); unmountBench = null; }
      const ph = D.PHASES[idx];
      const t = targetSec();
      const mins = Math.round(ph.pct * t / 60 * 10) / 10;
      const mm = minMode();
      const theoryHTML = CE ? CE.renderTheory(id) : "";
      let body = "";

      if (idx === 0) {
        body =
          '<p class="lead">Entenda o gráfico, o conceito físico/elétrico e o "porquê" antes de escrever qualquer conta.</p>' +
          '<h4>Mapa do dia</h4><ol class="topic-list">' +
          sess.mathTopics.map(function (m, i) {
            return '<li class="' + (mm && i > 1 ? "dim" : "") + '">' + esc(m) + '</li>';
          }).join("") + '</ol>' +
          '<blockquote>' + esc(sess.weekApplication) + '</blockquote>' +
          theoryHTML;
      } else if (idx === 1) {
        const done = P().topicsDone;
        body =
          '<p class="lead">Resolva passo a passo no rascunho ou no papel — uma operação por linha. Confira sua resposta na bancada interativa abaixo.</p>' +
          (mm ? '<p class="note">Modo Mínimo: resolva as 2 primeiras questões (Nível 1) e marque o dia como concluído sem dívida.</p>' : '') +
          '<details class="theory-ref"><summary class="mono">Consultar Apostila Direta ao Ponto (Lógica, Receita Passo a Passo &amp; Armadilhas)</summary>' + theoryHTML + '</details>' +
          '<div id="st-bench"></div>' +
          '<h4>Checklist de blocos do dia</h4>' +
          '<div class="topic-checks">' +
          sess.mathTopics.map(function (m, i) {
            const off = mm && i > 1;
            return '<label class="check big ' + (off ? "dim" : "") + '"><input type="checkbox" data-t="' + i + '"' +
              (done.indexOf(i) !== -1 ? " checked" : "") + (off ? " disabled" : "") + '><span><strong>Bloco ' + (i + 1) + ':</strong> ' + esc(m) + '</span></label>';
          }).join("") + '</div>';
      } else if (idx === 2) {
        body =
          (mm ? '<p class="note">Fase opcional hoje. Pule sem culpa — ou tente só a primeira parte.</p>' : '') +
          '<p class="lead">Aplicação direta em Física I, Circuitos Elétricos, Sistemas Digitais ou Cálculo (Nível 3 FURB):</p>' +
          '<details class="theory-ref"><summary class="mono">Consultar Apostila Direta ao Ponto (Teoria &amp; Algoritmo)</summary>' + theoryHTML + '</details>' +
          '<div id="st-bench"></div>' +
          '<h4>Desafio integrador da sessão</h4>' +
          '<div class="challenge">' + esc(sess.challengeProblem) + '</div>' +
          '<details class="answer"><summary>Conferir resposta do desafio integrador (só depois de tentar)</summary><p class="mono">' + esc(sess.challengeAnswer) + '</p></details>';
      } else {
        const c = S.errorCounts(id);
        const pr = P().practice || { solved: 0, correct: 0, firstTry: 0 };
        body =
          '<p class="lead">Feche o ciclo: confira o balanço da bancada, registre os erros e escreva 1 linha de resumo conceitual.</p>' +
          '<div class="audit">' +
          '<div class="audit-item"><span class="mono num">' + (pr.solved || 0) + '/5</span><span class="small muted">Questões fixas</span></div>' +
          '<div class="audit-item"><span class="mono num">' + (pr.correct || 0) + '</span><span class="small muted">Total de acertos</span></div>' +
          D.ERROR_TYPES.map(function (e) {
            return '<div class="audit-item"><span class="mono num" data-audit="' + e.key + '">' + c[e.key] + '</span><span class="small muted">' + esc(e.label) + '</span></div>';
          }).join("") + '</div>' +
          '<label class="field"><span class="small muted">Resumo conceitual em uma linha</span>' +
          '<input type="text" id="st-summary" maxlength="200" placeholder="Hoje aprendi que…" value="' + esc(P().summary) + '"></label>';
      }

      $("#st-phase-panel").innerHTML =
        '<div class="phase-head"><span class="phase-tag mono">FASE ' + ph.key + ' · ' + Math.round(ph.pct * 100) + '% · ~' + mins + ' min</span>' +
        '<h2>' + esc(ph.name) + '</h2></div>' + body;

      const benchEl = $("#st-bench");
      if (benchEl && CE) {
        unmountBench = CE.mountBench(benchEl, {
          sessionId: id,
          levels: idx === 2 ? [3] : [1, 2, 3],
          onErrorLogged: function () {
            paintErrors("Registrado: Erro de Sinal. Siga em frente.");
          }
        });
      }

      $$(".phase-tab").forEach(function (b) {
        const on = Number(b.dataset.i) === idx;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      $$(".phase-tab").forEach(function (b) {
        b.classList.toggle("current", Number(b.dataset.i) === lastCur);
      });

      $$('#st-phase-panel input[data-t]').forEach(function (cb) {
        cb.addEventListener("change", function () {
          const i = Number(cb.dataset.t), arr = P().topicsDone;
          const k = arr.indexOf(i);
          if (cb.checked && k === -1) arr.push(i);
          if (!cb.checked && k !== -1) arr.splice(k, 1);
          S.save();
        });
      });
      const sum = $("#st-summary");
      if (sum) sum.addEventListener("input", function () { P().summary = sum.value; S.save(); });
    }

    $("#st-tabs").addEventListener("click", function (e) {
      const b = e.target.closest(".phase-tab");
      if (!b) return;
      viewIdx = Number(b.dataset.i);
      renderPhase(viewIdx);
    });

    /* ------------------------------ atualização UI ---------------------------- */
    function pulse() {
      const card = $("#st-timer-card");
      if (!card) return;
      card.classList.remove("pulse");
      void card.offsetWidth;
      card.classList.add("pulse");
      clearTimeout(pulseTimer);
      pulseTimer = setTimeout(function () { card.classList.remove("pulse"); }, 3000);
    }

    function updateButtons() {
      const el = Math.floor(elapsed());
      const tg = $("#st-toggle");
      if (running) tg.textContent = "Pausar sem Culpa";
      else tg.textContent = el > 0 ? "Retomar de " + U.fmtClock(el) : "Iniciar Hiperfoco";
      $("#st-goal").textContent = "/ " + U.fmtClock(targetSec()) + (minMode() ? " · MÍNIMO" : "");
      $("#st-min").checked = minMode();
      $("#st-min-note").textContent = minMode()
        ? "Meta de hoje: 25 min. Foco só no essencial: " + sess.essential.join(" · ")
        : "";
    }

    function updateTick(force) {
      const el = elapsed();
      const sec = Math.floor(el);
      const t = targetSec();
      const cur = phaseAt(el);

      if (sec !== lastSecShown || force) {
        lastSecShown = sec;
        $("#st-clock").textContent = U.fmtClock(sec);
        const cells = $$(".seg-fill");
        let acc = 0;
        D.PHASES.forEach(function (ph, i) {
          const len = ph.pct * t;
          const f = Math.max(0, Math.min(1, (el - acc) / len));
          cells[i].style.width = (f * 100).toFixed(1) + "%";
          acc += len;
        });
        const st = $("#st-state");
        if (el >= t) st.textContent = " Meta atingida — conclua quando quiser";
        else if (!running && sec > 0) st.textContent = " Pausado · salvo em " + U.fmtClock(sec);
        else st.textContent = "";
      }

      if (cur !== lastCur) {
        const first = lastCur === -1;
        lastCur = cur;
        viewIdx = null;
        renderPhase(cur);
        if (!first && running) pulse();
      }
    }

    function setRunning(on) {
      if (on === running) return;
      if (on) {
        startTs = Date.now();
        running = true;
        document.body.classList.add("zen");
        let lastSave = -1;
        tickTimer = setInterval(function () {
          updateTick(false);
          const s = Math.floor(elapsed());
          if (s !== lastSave) { lastSave = s; persist(); }
        }, 250);
      } else {
        base = elapsed();
        running = false;
        clearInterval(tickTimer);
      }
      persist();
      updateButtons();
      updateTick(true);
    }

    $("#st-toggle").addEventListener("click", function () { setRunning(!running); });

    $("#st-exit").addEventListener("click", function () {
      setRunning(false);
      document.body.classList.remove("zen");
    });

    $("#st-min").addEventListener("change", function (e) {
      P().minMode = e.target.checked;
      S.save();
      lastCur = -1;
      updateButtons();
      updateTick(true);
    });

    $("#st-finish").addEventListener("click", function () {
      clearTimeout(noteTimer);
      P().notes = $("#st-notes").value;
      setRunning(false);
      persist();
      S.completeSession(id, minMode() ? "min" : "full");
      S.state.timer = null;
      S.save();
      finished = true;
      document.body.classList.remove("zen");
      renderDone();
    });

    function renderDone() {
      const next = D.CURRICULUM[id] || null;
      const st = S.streak();
      root.innerHTML =
        '<section class="study"><div class="card done-card">' +
        '<p class="eyebrow mono">SESSÃO CONCLUÍDA</p>' +
        '<h1>Semana ' + sess.week + ' · Dia ' + sess.day + ' ✓</h1>' +
        '<p class="lead">' + esc(sess.title) + '</p>' +
        '<div class="stat-row">' +
        '<div><span class="mono num">' + U.fmtDuration(P().seconds) + '</span><span class="small muted">estudados</span></div>' +
        '<div><span class="mono num">' + (P().mode === "min" ? "Mínimo" : "Completo") + '</span><span class="small muted">modo</span></div>' +
        '<div><span class="mono num">' + st.count + '</span><span class="small muted">sessões em ofensiva</span></div></div>' +
        '<p class="muted">Dia fechado, sem dívida. Descanse: o cérebro consolida o aprendizado fora da tela.</p>' +
        '<div class="row">' +
        (next ? '<a class="btn primary" href="#/study/' + next.id + '">Próxima: S' + next.week + ' · D' + next.day + '</a>' : "") +
        '<a class="btn" href="#/dashboard">Centro de Comando</a></div></div></section>';
    }

    /* ---------------------------------- áudio --------------------------------- */
    function paintNoise() {
      $$("#st-noise button").forEach(function (b) {
        const on = (b.dataset.n === "off") ? !Noise.playing : Noise.type === b.dataset.n;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    $("#st-noise").addEventListener("click", function (e) {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.n === "off") Noise.stop();
      else { Noise.play(b.dataset.n, S.state.audio.volume); S.setAudio({ type: b.dataset.n }); }
      paintNoise();
    });
    $("#st-vol").addEventListener("input", function (e) {
      const v = Number(e.target.value) / 100;
      S.setAudio({ volume: v });
      Noise.setVolume(v);
    });
    paintNoise();

    /* ------------------------------- scratchpad -------------------------------- */
    const spInput = $("#sp-input"), spOk = $("#sp-ok");
    function spReady() {
      const all = $$(".sp-chk").every(function (c) { return c.checked; });
      spOk.disabled = !(all && spInput.value.trim());
    }
    function spRender() {
      const lines = P().lines;
      $("#sp-lines").innerHTML = lines.map(function (l) {
        return '<li><span class="num">' + l.n + '</span><span>' + esc(l.text) + '</span></li>';
      }).join("");
    }
    $$(".sp-chk").forEach(function (c) { c.addEventListener("change", spReady); });
    spInput.addEventListener("input", spReady);
    spOk.addEventListener("click", function () {
      const lines = P().lines;
      lines.push({ n: lines.length + 1, text: spInput.value.trim() });
      S.save();
      spInput.value = "";
      $$(".sp-chk").forEach(function (c) { c.checked = false; });
      spReady(); spRender(); spInput.focus();
    });
    $("#sp-clear").addEventListener("click", function () {
      P().lines = []; S.save(); spRender();
    });
    spInput.addEventListener("keydown", function (e) { if (e.key === "Enter" && !spOk.disabled) spOk.click(); });
    spRender();

    /* ------------------------------ log de erros ------------------------------- */
    function paintErrors(msg) {
      const c = S.errorCounts(id);
      $("#st-errs").innerHTML = D.ERROR_TYPES.map(function (e) {
        return '<button type="button" class="err-btn" data-e="' + e.key + '"><span>' + esc(e.label) + '</span><span class="mono num">' + c[e.key] + '</span></button>';
      }).join("");
      $$("[data-audit]").forEach(function (n) { n.textContent = c[n.dataset.audit]; });
      if (msg != null) $("#st-err-fb").textContent = msg;
    }
    $("#st-errs").addEventListener("click", function (e) {
      const b = e.target.closest(".err-btn");
      if (!b) return;
      S.logError(id, b.dataset.e);
      const lab = D.ERROR_TYPES.filter(function (t) { return t.key === b.dataset.e; })[0].label;
      paintErrors("Registrado: " + lab + ". Siga em frente.");
    });
    $("#st-err-undo").addEventListener("click", function () {
      paintErrors(S.undoError(id) ? "Último registro desfeito." : "Nada para desfazer.");
    });
    paintErrors();

    /* --------------------------------- notas ----------------------------------- */
    const notes = $("#st-notes");
    notes.value = P().notes || "";
    notes.addEventListener("input", function () {
      clearTimeout(noteTimer);
      noteTimer = setTimeout(function () { P().notes = notes.value; S.save(); }, 300);
    });

    /* ------------------------------ inicialização ------------------------------ */
    updateButtons();
    updateTick(true);

    function onVisibility() { if (document.hidden && running) persist(); }
    document.addEventListener("visibilitychange", onVisibility);
    const onHide = function () { if (!finished) { if (running) persist(); } };
    global.addEventListener("pagehide", onHide);

    /* -------------------------------- desmontar -------------------------------- */
    return function unmount() {
      if (unmountBench) { unmountBench(); unmountBench = null; }
      clearInterval(tickTimer);
      clearTimeout(pulseTimer);
      if (noteTimer) { clearTimeout(noteTimer); const n = root.querySelector("#st-notes"); if (n) { P().notes = n.value; S.save(); } }
      if (!finished) {
        if (running) { base = elapsed(); running = false; }
        if (base > 0) persist();  // "Pausar sem Culpa" implícito: salva o segundo exato
      }
      Noise.stop();
      document.body.classList.remove("zen");
      document.removeEventListener("visibilitychange", onVisibility);
      global.removeEventListener("pagehide", onHide);
    };
  }

  NE.Study = { mount: mount };
})(window);
