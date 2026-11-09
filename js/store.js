/* ==========================================================================
   NeuroEng // Prep OS — Persistência (localStorage) + utilitários
   ========================================================================== */
(function (global) {
  "use strict";
  const NE = (global.NE = global.NE || {});
  const D = NE.Data;
  const KEY = "neuroeng-prep-os-v1";

  /* ---------------------------- utilitários ---------------------------- */
  const U = {
    esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    },
    pad(n) { return String(n).padStart(2, "0"); },
    fmtClock(sec) {
      sec = Math.max(0, Math.floor(sec));
      const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
      return (h > 0 ? h + ":" + U.pad(m) : U.pad(m)) + ":" + U.pad(s);
    },
    fmtDuration(sec) {
      const m = Math.round(sec / 60);
      const h = Math.floor(m / 60);
      return h > 0 ? h + "h " + U.pad(m % 60) + "m" : m + "m";
    },
    fmtWeekHours(min) {
      const t = min * 4;
      return Math.floor(t / 60) + "h" + U.pad(t % 60);
    },
    gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t; } return a; },
    lcm(a, b) { return Math.abs(a * b) / U.gcd(a, b); }
  };

  /* ------------------------------ estado ------------------------------ */
  function defaults() {
    return {
      v: 1,
      createdAt: Date.now(),
      sessions: {},   // id -> progresso da sessão
      errors: [],     // [{t, sessionId, type}]
      timer: null,    // {sessionId, elapsedSec, offsetSec, running, savedAt}
      audio: { type: "brown", volume: 0.35 }
    };
  }

  function defaultSession() {
    return {
      completed: false, completedAt: null, mode: null,
      seconds: 0, notes: "", summary: "",
      topicsDone: [], lines: [], minMode: false, lastPhase: 0
    };
  }

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(defaults(), JSON.parse(raw));
    } catch (e) { console.warn("NeuroEng: falha ao ler localStorage", e); }
    return defaults();
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn("NeuroEng: falha ao salvar", e); }
  }

  function hydrate() {
    D.CURRICULUM.forEach(function (s) {
      const p = state.sessions[s.id];
      s.completed = !!(p && p.completed);
    });
  }

  const Store = {
    get state() { return state; },

    session(id) {
      // Referência estável: completa campos ausentes sem recriar o objeto.
      const s = state.sessions[id] || (state.sessions[id] = defaultSession());
      const d = defaultSession();
      Object.keys(d).forEach(function (k) { if (!(k in s)) s[k] = d[k]; });
      return s;
    },

    update(id, patch) {
      Object.assign(Store.session(id), patch);
      save();
    },

    save: save,

    completeSession(id, mode) {
      const s = Store.session(id);
      s.completed = true;
      s.completedAt = Date.now();
      s.mode = mode;
      D.CURRICULUM[id - 1].completed = true;
      save();
    },

    reopenSession(id) {
      const s = Store.session(id);
      s.completed = false;
      s.completedAt = null;
      s.mode = null;
      D.CURRICULUM[id - 1].completed = false;
      save();
    },

    logError(sessionId, type) {
      state.errors.push({ t: Date.now(), sessionId: sessionId, type: type });
      save();
    },

    undoError(sessionId, type) {
      for (let i = state.errors.length - 1; i >= 0; i--) {
        const e = state.errors[i];
        if (e.sessionId === sessionId && (!type || e.type === type)) {
          state.errors.splice(i, 1);
          save();
          return true;
        }
      }
      return false;
    },

    errorCounts(sessionId) {
      const c = { sign: 0, fraction: 0, reading: 0, skip: 0 };
      state.errors.forEach(function (e) {
        if ((sessionId == null || e.sessionId === sessionId) && c[e.type] != null) c[e.type]++;
      });
      return c;
    },

    setTimer(t) { state.timer = t; save(); },
    setAudio(a) { state.audio = Object.assign(state.audio, a); save(); },

    /* ------------------------- métricas derivadas ------------------------ */
    completedCount() { return D.CURRICULUM.filter(function (s) { return s.completed; }).length; },

    nextSession() {
      return D.CURRICULUM.find(function (s) { return !s.completed; }) || null;
    },

    totalSeconds() {
      return Object.keys(state.sessions).reduce(function (a, k) {
        return a + (state.sessions[k].seconds || 0);
      }, 0);
    },

    /** Ofensiva tolerante: sessões concluídas encadeadas com intervalo ≤ 4 dias. */
    streak() {
      const GAP = 4 * 86400000;
      const times = Object.keys(state.sessions)
        .map(function (k) { return state.sessions[k]; })
        .filter(function (s) { return s.completed && s.completedAt; })
        .map(function (s) { return s.completedAt; })
        .sort(function (a, b) { return a - b; });
      if (!times.length) return { count: 0, alive: false };
      let count = 1;
      for (let i = times.length - 1; i > 0; i--) {
        if (times[i] - times[i - 1] <= GAP) count++; else break;
      }
      return { count: count, alive: Date.now() - times[times.length - 1] <= GAP };
    },

    /** Recomendação automática baseada nas últimas 3 sessões com erros. */
    recommendation() {
      const errs = state.errors;
      if (!errs.length) {
        return { type: null, pct: 0, text: "Ainda sem erros registrados. Na Fase 4 de cada sessão, registre cada erro: dados reais vencem impressões e a culpa não entra na conta." };
      }
      const order = [];
      for (let i = errs.length - 1; i >= 0 && order.length < 3; i--) {
        if (order.indexOf(errs[i].sessionId) === -1) order.push(errs[i].sessionId);
      }
      const counts = { sign: 0, fraction: 0, reading: 0, skip: 0 };
      let total = 0;
      errs.forEach(function (e) {
        if (order.indexOf(e.sessionId) !== -1 && counts[e.type] != null) { counts[e.type]++; total++; }
      });
      let top = "skip";
      Object.keys(counts).forEach(function (k) { if (counts[k] > counts[top]) top = k; });
      const pct = Math.round((counts[top] / total) * 100);
      const cause = {
        sign: "por troca de sinais (+/−)",
        fraction: "em frações e MMC",
        reading: "por leitura rápida/impulsiva do enunciado",
        skip: "por pular etapas de cabeça"
      }[top];
      const action = {
        sign: "escreva cada sinal de menos em uma linha nova e circule-o antes de seguir.",
        fraction: "liste os denominadores e calcule o MMC em uma linha separada antes de somar qualquer fração.",
        reading: "leia o enunciado duas vezes, sublinhe dados e unidades e só então escreva a primeira linha.",
        skip: "escreva uma operação por linha, inclusive as \"óbvias\" — nada de contas de cabeça."
      }[top];
      return {
        type: top, pct: pct,
        text: "Nas últimas " + order.length + (order.length === 1 ? " sessão" : " sessões") + " com registro, " + pct + "% dos seus erros foram " + cause + ". Hoje, " + action
      };
    },

    /* --------------------------- backup / restore ------------------------ */
    exportJSON() {
      return JSON.stringify({ app: "NeuroEng Prep OS", exportedAt: new Date().toISOString(), data: state }, null, 2);
    },

    importJSON(text) {
      const parsed = JSON.parse(text);
      const data = parsed && parsed.data ? parsed.data : parsed;
      if (!data || typeof data !== "object" || typeof data.sessions !== "object" || !Array.isArray(data.errors)) {
        throw new Error("Arquivo de backup inválido.");
      }
      state = Object.assign(defaults(), data);
      hydrate();
      save();
    },

    reset() {
      state = defaults();
      hydrate();
      save();
    }
  };

  hydrate();
  NE.U = U;
  NE.Store = Store;

  // Garante que o estado do timer vá para o disco ao fechar/ocultar a aba.
  global.addEventListener("pagehide", save);
})(window);
