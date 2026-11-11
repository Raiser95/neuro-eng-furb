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
      updatedAt: Date.now(),
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
      topicsDone: [], lines: [], minMode: false, lastPhase: 0,
      practice: { solved: 0, correct: 0, firstTry: 0, checks: 0, items: {}, gen: null, genCount: 0 }
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

  function save(skipCloudSync) {
    try {
      state.updatedAt = Date.now();
      localStorage.setItem(KEY, JSON.stringify(state));
      if (!skipCloudSync && CloudSync) {
        CloudSync.schedulePush();
      }
    }
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

  /* ==========================================================================
     Cloud Sync (GitHub Gist API) — Multi-device Sync (PC <-> iOS)
     Token e Gist ID residem APENAS no localStorage ('neuroeng_cloud_config').
     ========================================================================== */
  const CLOUD_KEY = "neuroeng_cloud_config";
  const GIST_FILENAME = "neuroeng_furb_state.json";
  let syncTimer = null;
  let syncListeners = [];

  function loadCloudConfig() {
    try {
      const raw = localStorage.getItem(CLOUD_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn("NeuroEng: erro ao ler cloud config", e); }
    return { token: "", gistId: "", lastSync: null, status: "disconnected" };
  }

  let cloudConfig = loadCloudConfig();

  function saveCloudConfig(cfg) {
    cloudConfig = Object.assign(cloudConfig, cfg);
    try { localStorage.setItem(CLOUD_KEY, JSON.stringify(cloudConfig)); }
    catch (e) { console.warn("NeuroEng: erro ao salvar cloud config", e); }
    notifyCloudListeners();
  }

  function notifyCloudListeners() {
    syncListeners.forEach(function (fn) {
      try { fn(CloudSync.getStatus()); } catch (e) { /* ignora */ }
    });
  }

  const CloudSync = {
    getConfig() { return Object.assign({}, cloudConfig); },
    getStatus() {
      if (!cloudConfig.token) return { status: "disconnected", label: "Cloud: Desconectado", lastSync: cloudConfig.lastSync };
      if (!navigator.onLine) return { status: "offline", label: "Cloud: Offline", lastSync: cloudConfig.lastSync };
      if (cloudConfig.status === "syncing") return { status: "syncing", label: "Cloud: Sincronizando...", lastSync: cloudConfig.lastSync };
      if (cloudConfig.status === "error") return { status: "error", label: "Cloud: Erro na conexão", lastSync: cloudConfig.lastSync };
      return { status: "synced", label: "Cloud: Sincronizado", lastSync: cloudConfig.lastSync };
    },

    onStatusChange(fn) {
      if (typeof fn === "function" && syncListeners.indexOf(fn) === -1) {
        syncListeners.push(fn);
      }
    },

    disconnect() {
      cloudConfig = { token: "", gistId: "", lastSync: null, status: "disconnected" };
      try { localStorage.removeItem(CLOUD_KEY); } catch (e) {}
      notifyCloudListeners();
    },

    /**
     * Conecta ou reconecta à API do GitHub Gist.
     * Busca gist existente com 'neuroeng_furb_state.json' ou cria um novo Gist secreto.
     */
    async connect(token) {
      token = (token || "").trim();
      if (!token) throw new Error("Token do GitHub não fornecido.");
      saveCloudConfig({ token: token, status: "syncing" });

      try {
        const headers = {
          "Accept": "application/vnd.github+json",
          "Authorization": "Bearer " + token,
          "X-GitHub-Api-Version": "2022-11-28"
        };

        // 1. Procurar gist existente
        const res = await fetch("https://api.github.com/gists?per_page=100", { headers: headers });
        if (!res.ok) {
          const errData = await res.json().catch(function () { return {}; });
          throw new Error(errData.message || ("Erro HTTP " + res.status));
        }

        const gists = await res.json();
        let targetGist = gists.find(function (g) {
          return g.files && g.files[GIST_FILENAME];
        });

        if (targetGist) {
          saveCloudConfig({ gistId: targetGist.id });
          // Baixar o estado do Gist e fazer merge
          await CloudSync.pull(true);
        } else {
          // Criar novo Gist secreto
          state.updatedAt = Date.now();
          const createRes = await fetch("https://api.github.com/gists", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              description: "NeuroEng // Prep OS — Cloud Sync Data",
              public: false,
              files: {
                [GIST_FILENAME]: {
                  content: JSON.stringify(state, null, 2)
                }
              }
            })
          });

          if (!createRes.ok) {
            const errData = await createRes.json().catch(function () { return {}; });
            throw new Error("Falha ao criar Gist: " + (errData.message || createRes.status));
          }

          const createdGist = await createRes.json();
          saveCloudConfig({
            gistId: createdGist.id,
            lastSync: Date.now(),
            status: "synced"
          });
        }

        return CloudSync.getConfig();
      } catch (err) {
        saveCloudConfig({ status: "error" });
        throw err;
      }
    },

    /**
     * Puxa (GET) estado do Gist se for mais recente que o local.
     * Retorna true se o estado local foi atualizado.
     */
    async pull(force) {
      if (!cloudConfig.token || !cloudConfig.gistId || !navigator.onLine) return false;
      saveCloudConfig({ status: "syncing" });

      try {
        const headers = {
          "Accept": "application/vnd.github+json",
          "Authorization": "Bearer " + cloudConfig.token,
          "X-GitHub-Api-Version": "2022-11-28"
        };

        const res = await fetch("https://api.github.com/gists/" + cloudConfig.gistId + "?_t=" + Date.now(), {
          headers: headers
        });

        if (!res.ok) {
          if (res.status === 404) {
            saveCloudConfig({ gistId: "" });
            throw new Error("Gist não encontrado. Reconecte para recriá-lo.");
          }
          throw new Error("HTTP " + res.status);
        }

        const gistData = await res.json();
        const fileObj = gistData.files && gistData.files[GIST_FILENAME];
        if (!fileObj || !fileObj.content) {
          throw new Error("Arquivo no Gist vazio ou ausente.");
        }

        const remoteState = JSON.parse(fileObj.content);
        const remoteUpdated = Number(remoteState.updatedAt || 0);
        const localUpdated = Number(state.updatedAt || 0);

        if (force || remoteUpdated > localUpdated) {
          // Atualiza o estado local a partir da nuvem
          state = Object.assign(defaults(), remoteState);
          hydrate();
          // Salva no localStorage local sem disparar novo push em loop
          localStorage.setItem(KEY, JSON.stringify(state));
          saveCloudConfig({ lastSync: Date.now(), status: "synced" });
          global.dispatchEvent(new CustomEvent("neuroeng:state-updated", { detail: { source: "cloud" } }));
          return true;
        } else if (localUpdated > remoteUpdated) {
          // Local está à frente; sobe para a nuvem
          await CloudSync.push();
        } else {
          saveCloudConfig({ lastSync: Date.now(), status: "synced" });
        }
        return false;
      } catch (err) {
        console.warn("NeuroEng: erro no CloudSync.pull", err);
        saveCloudConfig({ status: "error" });
        return false;
      }
    },

    /**
     * Envia (PATCH) estado atual para o Gist.
     */
    async push() {
      if (!cloudConfig.token || !cloudConfig.gistId || !navigator.onLine) return false;
      saveCloudConfig({ status: "syncing" });

      try {
        const headers = {
          "Accept": "application/vnd.github+json",
          "Authorization": "Bearer " + cloudConfig.token,
          "X-GitHub-Api-Version": "2022-11-28"
        };

        const res = await fetch("https://api.github.com/gists/" + cloudConfig.gistId, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify({
            files: {
              [GIST_FILENAME]: {
                content: JSON.stringify(state, null, 2)
              }
            }
          })
        });

        if (!res.ok) {
          throw new Error("Erro ao sincronizar com o Gist: HTTP " + res.status);
        }

        saveCloudConfig({ lastSync: Date.now(), status: "synced" });
        return true;
      } catch (err) {
        console.warn("NeuroEng: erro no CloudSync.push", err);
        saveCloudConfig({ status: "error" });
        return false;
      }
    },

    /**
     * Agenda push debounced de 2 segundos para evitar excesso de requisições.
     */
    schedulePush() {
      if (!cloudConfig.token || !cloudConfig.gistId) return;
      clearTimeout(syncTimer);
      syncTimer = setTimeout(function () {
        CloudSync.push();
      }, 2000);
    }
  };

  hydrate();
  NE.U = U;
  NE.Store = Store;
  NE.CloudSync = CloudSync;

  // Garante que o estado do timer vá para o disco ao fechar/ocultar a aba.
  global.addEventListener("pagehide", save);

  // Gatilhos automáticos de sincronização no foco e inicialização
  global.addEventListener("online", function () {
    notifyCloudListeners();
    CloudSync.pull();
  });
  global.addEventListener("offline", function () {
    notifyCloudListeners();
  });

  // Pull no retorno ao foco (iPhone/PC)
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && cloudConfig.token && cloudConfig.gistId) {
      CloudSync.pull();
    }
  });

  // Sincronização inicial silenciosa no carregamento
  if (cloudConfig.token && cloudConfig.gistId) {
    setTimeout(function () { CloudSync.pull(); }, 1000);
  }
})(window);
