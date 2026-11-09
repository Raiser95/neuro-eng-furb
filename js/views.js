/* ==========================================================================
   NeuroEng // Prep OS — Visões: Dashboard, Cronograma e Painel Neuro-Analítico
   ========================================================================== */
(function (global) {
  "use strict";
  const NE = global.NE;
  const D = NE.Data, S = NE.Store, U = NE.U;
  const esc = U.esc;

  function bar(pct, done) {
    return '<div class="bar' + (done ? " done" : "") + '"><div class="bar-fill" style="width:' + Math.max(0, Math.min(100, pct)).toFixed(1) + '%"></div></div>';
  }

  /* =============================== DASHBOARD =============================== */
  function dashboard(root) {
    const done = S.completedCount();
    const total = D.CURRICULUM.length;
    const next = S.nextSession();
    const week = next ? next.week : 14;
    const weekMin = next ? next.durationMinutes : 150;
    const st = S.streak();
    const t = S.state.timer;
    const resuming = next && t && t.sessionId === next.id && t.elapsedSec > 0;
    const reco = S.recommendation();

    const subjects = D.FURB_SUBJECTS.map(function (sub) {
      const rel = D.CURRICULUM.filter(function (s) { return s.furbKeys.indexOf(sub.key) !== -1; });
      const ok = rel.filter(function (s) { return s.completed; }).length;
      const pct = rel.length ? (ok / rel.length) * 100 : 0;
      return '<li class="subject"><div class="subject-top"><span>' + esc(sub.name) + ' <span class="muted mono small">(' + sub.hours + 'h)</span></span>' +
        '<span class="mono">' + Math.round(pct) + '%</span></div>' + bar(pct, pct >= 100) +
        '<span class="small muted mono">' + ok + ' de ' + rel.length + ' sessões de base concluídas</span></li>';
    }).join("");

    root.innerHTML =
      '<section class="view-dash"><header class="view-head"><p class="eyebrow mono">CENTRO DE COMANDO</p>' +
      '<h1>Olá, Alan. Um bloco de cada vez.</h1>' +
      '<p class="muted">Sem horário fixo, sem culpa. O que conta é a sequência — e o Modo Mínimo (25 min) garante o dia.</p></header>' +

      '<div class="grid-2">' +
      '<div class="card countdown"><p class="eyebrow mono">INÍCIO ENGENHARIA ELÉTRICA · FURB</p>' +
      '<div class="cd-row mono" id="cd"></div>' +
      '<p class="small muted mono">15 de fevereiro de 2027, 08:00</p></div>' +

      '<div class="card today"><p class="eyebrow mono">SESSÃO DE HOJE</p>' +
      (next
        ? '<h2>Semana ' + next.week + ' · Dia ' + next.day + '</h2><p class="lead">' + esc(next.title) + '</p>' +
          '<p class="small muted">' + esc(next.engineeringConnection) + '</p>' +
          '<div class="row"><a class="btn primary" href="#/study/' + next.id + '">' + (resuming ? "Retomar de " + U.fmtClock(t.elapsedSec) : "Iniciar Sessão") + '</a>' +
          '<span class="mono small muted">' + next.durationMinutes + ' min · ou 25 min no Modo Mínimo</span></div>'
        : '<h2>Currículo concluído ✓</h2><p class="muted">As 56 sessões foram finalizadas. Revise pelo cronograma.</p>') +
      '</div></div>' +

      '<div class="grid-4">' +
      '<div class="card metric"><span class="mono num">' + done + '/' + total + '</span><span class="small muted">sessões concluídas</span></div>' +
      '<div class="card metric"><span class="mono num">S' + week + '</span><span class="small muted">semana atual · meta ' + weekMin + ' min/dia</span></div>' +
      '<div class="card metric"><span class="mono num">' + U.fmtDuration(S.totalSeconds()) + '</span><span class="small muted">horas acumuladas</span></div>' +
      '<div class="card metric"><span class="mono num">' + st.count + '</span><span class="small muted">' + (st.count === 0 ? "ofensiva · comece quando quiser" : st.alive ? "sessões em ofensiva" : "ofensiva · retome leve com 25 min") + '</span></div>' +
      '</div>' +

      '<div class="card"><div class="subject-top"><h3>Progresso geral · 14 semanas</h3><span class="mono">' + Math.round(done / total * 100) + '%</span></div>' +
      bar(done / total * 100, done === total) +
      '<div class="week-dots" aria-hidden="true">' +
      Array.apply(null, Array(14)).map(function (_, i) {
        const w = i + 1;
        const c = D.CURRICULUM.filter(function (s) { return s.week === w && s.completed; }).length;
        return '<span class="wdot ' + (c === 4 ? "full" : c > 0 ? "part" : "") + '" title="Semana ' + w + ': ' + c + '/4"><span class="mono">' + w + '</span></span>';
      }).join("") + '</div></div>' +

      '<div class="card"><h3>Prontidão FURB · 1ª Fase</h3>' +
      '<p class="small muted">Quanto dos estudos concluídos já destravou cada disciplina.</p><ul class="subjects">' + subjects + '</ul></div>' +

      '<div class="card reco"><h3>Calibragem para a próxima sessão</h3><p>' + esc(reco.text) + '</p></div>' +
      '</section>';

    const cd = root.querySelector("#cd");
    function tick() {
      let ms = D.START_DATE.getTime() - Date.now();
      if (ms <= 0) { cd.innerHTML = '<div><span class="num">Iniciado</span></div>'; return; }
      const d = Math.floor(ms / 86400000); ms -= d * 86400000;
      const h = Math.floor(ms / 3600000); ms -= h * 3600000;
      const m = Math.floor(ms / 60000);
      cd.innerHTML =
        '<div><span class="num">' + d + '</span><span class="small muted">dias</span></div>' +
        '<div><span class="num">' + U.pad(h) + '</span><span class="small muted">horas</span></div>' +
        '<div><span class="num">' + U.pad(m) + '</span><span class="small muted">min</span></div>';
    }
    tick();
    const iv = setInterval(tick, 20000);
    return function () { clearInterval(iv); };
  }

  /* =============================== CRONOGRAMA ============================== */
  function schedule(root) {
    const next = S.nextSession();
    const curWeek = next ? next.week : 14;

    root.innerHTML =
      '<section class="view-schedule"><header class="view-head"><p class="eyebrow mono">CRONOGRAMA EVOLUTIVO</p>' +
      '<h1>14 semanas · 4 dias · 56 sessões</h1>' +
      '<p class="muted">Cada dia é monotemático e tem um orçamento de tempo — não um horário. Faça os 4 dias na ordem que a vida permitir.</p>' +
      '<div class="row"><button type="button" class="btn small-btn" id="sc-open">Expandir todas</button><button type="button" class="btn ghost small-btn" id="sc-close">Recolher todas</button></div></header>' +
      D.WEEKS.map(function (w) {
        const cards = D.CURRICULUM.filter(function (s) { return s.week === w.week; });
        const cnt = cards.filter(function (s) { return s.completed; }).length;
        return '<details class="week" ' + (w.week === curWeek ? "open" : "") + ' data-week="' + w.week + '">' +
          '<summary><span class="mono wk-n">S' + U.pad(w.week) + '</span>' +
          '<span class="wk-title">' + esc(w.theme) + '</span>' +
          '<span class="wk-meta mono">' + w.minutes + ' min/dia · ' + U.fmtWeekHours(w.minutes) + '/sem · ' + cnt + '/4</span></summary>' +
          '<p class="small muted wk-app">Aplicação: ' + esc(w.application) + '</p>' +
          '<div class="day-grid">' +
          cards.map(function (s) {
            const p = S.session(s.id);
            const prog = p.seconds > 0 && !s.completed;
            return '<article class="card day ' + (s.completed ? "done" : "") + '">' +
              '<div class="day-top"><span class="mono eyebrow">DIA ' + s.day + '</span><span class="mono small muted">' + s.durationMinutes + ' min</span></div>' +
              '<h3>' + esc(s.title) + '</h3>' +
              '<ul class="mini">' + s.mathTopics.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join("") + '</ul>' +
              '<p class="small muted">' + esc(s.furbSubject) + '</p>' +
              '<div class="day-actions">' +
              '<a class="btn small-btn ' + (s.completed ? "" : "primary") + '" href="#/study/' + s.id + '">' + (s.completed ? "Revisar" : prog ? "Continuar" : "Iniciar sessão") + '</a>' +
              '<label class="check mini-check"><input type="checkbox" data-id="' + s.id + '"' + (s.completed ? " checked" : "") + '><span>' + (s.completed ? "Concluído" : "Marcar concluído") + '</span></label>' +
              '</div>' + (prog ? '<p class="small mono muted">Pausado em ' + U.fmtClock(p.seconds) + '</p>' : "") +
              '</article>';
          }).join("") + '</div></details>';
      }).join("") + '</section>';

    root.onchange = onChange;   // propriedade (não addEventListener): re-render não duplica handlers
    function onChange(e) {
      const cb = e.target.closest("input[data-id]");
      if (!cb) return;
      const id = Number(cb.dataset.id);
      if (cb.checked) S.completeSession(id, "manual"); else S.reopenSession(id);
      const keep = Array.prototype.map.call(root.querySelectorAll("details"), function (d) { return d.open; });
      const y = global.scrollY;
      schedule(root);   // re-render
      Array.prototype.forEach.call(root.querySelectorAll("details"), function (d, i) { d.open = keep[i]; });
      global.scrollTo(0, y);
    }
    root.querySelector("#sc-open").addEventListener("click", function () {
      Array.prototype.forEach.call(root.querySelectorAll("details"), function (d) { d.open = true; });
    });
    root.querySelector("#sc-close").addEventListener("click", function () {
      Array.prototype.forEach.call(root.querySelectorAll("details"), function (d) { d.open = false; });
    });
    return function () { root.onchange = null; };
  }

  /* =========================== PAINEL NEURO-ANALÍTICO ====================== */
  function analytics(root) {
    function profileBar(label, val, max, sub) {
      return '<li class="prof"><div class="subject-top"><span>' + label + (sub ? ' <span class="muted small">' + sub + '</span>' : '') + '</span><span class="mono">' + val + '</span></div>' + bar(val / max * 100, false) + '</li>';
    }

    function render() {
      const c = S.errorCounts();
      const totalErr = c.sign + c.fraction + c.reading + c.skip;
      const maxErr = Math.max(1, c.sign, c.fraction, c.reading, c.skip);
      const reco = S.recommendation();

      root.innerHTML =
        '<section class="view-an"><header class="view-head"><p class="eyebrow mono">PAINEL NEURO-ANALÍTICO</p>' +
        '<h1>IMO Debugger</h1><p class="muted">Seu perfil cognitivo não é uma limitação — é o manual de configuração do sistema.</p></header>' +

        '<div class="grid-2">' +
        '<div class="card"><h3>WAIS-III · Perfil Intelectual</h3><ul class="profile">' +
        profileBar("QIT", 123, 150, "Quociente total") +
        profileBar("ICV", 125, 150, "Compreensão Verbal") +
        profileBar("IOP", 123, 150, "Organização Perceptual") +
        profileBar("IVP", 119, 150, "Velocidade de Processamento") +
        profileBar("IMO", 111, 150, "Memória Operacional") +
        '</ul><p class="small muted">IMO é o ponto de menor pico → o sistema externaliza cálculos (papel, scratchpad, checklists).</p></div>' +

        '<div class="card"><h3>Figuras de Rey · FDT</h3><ul class="profile">' +
        '<li class="prof"><div class="subject-top"><span>Figuras de Rey <span class="muted small">(memória visuoespacial)</span></span><span class="mono">P70</span></div>' + bar(70, false) + '</li>' +
        '</ul>' +
        '<ul class="profile">' +
        '<li class="prof"><div class="subject-top"><span>FDT · Velocidade <span class="muted small">(leitura/contagem)</span></span><span class="mono">PC 75</span></div>' + bar(75, false) + '</li>' +
        '<li class="prof"><div class="subject-top"><span>FDT · Escolha <span class="muted small">(controle inibitório)</span></span><span class="mono">PC 5</span></div>' + bar(5, false) + '</li>' +
        '</ul><p class="small muted">Velocidade alta com escolha baixa = rápido, mas com custo ao alternar regras. Por isso cada dia é monotemático.</p></div>' +
        '</div>' +

        '<div class="card"><div class="subject-top"><h3>Falhas de Controle Inibitório</h3><span class="mono small muted">' + totalErr + ' registros</span></div>' +
        '<div class="err-chart">' +
        D.ERROR_TYPES.map(function (e) {
          const n = c[e.key];
          return '<div class="err-row"><span class="err-label">' + esc(e.long) + '</span>' + bar(n / maxErr * 100, false) +
            '<span class="mono err-n">' + n + (totalErr ? ' · ' + Math.round(n / totalErr * 100) + '%' : '') + '</span></div>';
        }).join("") + '</div>' +
        '<div class="reco-inline"><strong>Recomendação para a próxima sessão</strong><p>' + esc(reco.text) + '</p></div></div>' +

        '<div class="card"><h3>Backup dos Dados</h3>' +
        '<p class="small muted">Tudo fica salvo apenas neste navegador. Exporte um JSON de vez em quando.</p>' +
        '<div class="row"><button type="button" class="btn" id="an-export">Exportar JSON</button>' +
        '<label class="btn" for="an-import" tabindex="0">Importar JSON</label>' +
        '<input type="file" id="an-import" accept="application/json,.json" hidden>' +
        '<button type="button" class="btn ghost" id="an-reset">Apagar todos os dados</button></div>' +
        '<p class="small" id="an-msg" role="status"></p></div></section>';

      const msg = root.querySelector("#an-msg");
      root.querySelector("#an-export").addEventListener("click", function () {
        const blob = new Blob([S.exportJSON()], { type: "application/json" });
        const a = document.createElement("a");
        const d = new Date();
        a.href = URL.createObjectURL(blob);
        a.download = "neuroeng-backup-" + d.getFullYear() + "-" + U.pad(d.getMonth() + 1) + "-" + U.pad(d.getDate()) + ".json";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
        msg.textContent = "Backup exportado.";
      });
      root.querySelector("#an-import").addEventListener("change", function (e) {
        const f = e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = function () {
          if (!global.confirm("Importar substitui os dados atuais deste navegador. Continuar?")) return;
          try { S.importJSON(String(r.result)); render(); root.querySelector("#an-msg").textContent = "Backup importado com sucesso."; }
          catch (err) { msg.textContent = "Não foi possível importar: " + err.message; }
        };
        r.readAsText(f);
      });
      root.querySelector("#an-reset").addEventListener("click", function () {
        if (global.confirm("Apagar TODOS os dados (progresso, tempo, erros e notas)? Essa ação não pode ser desfeita.")) {
          S.reset(); render(); root.querySelector("#an-msg").textContent = "Dados apagados.";
        }
      });
    }
    render();
    return function () {};
  }

  NE.Views = { dashboard: dashboard, schedule: schedule, analytics: analytics };
})(window);
