/* ==========================================================================
   NeuroEng // Prep OS — Roteador (hash) e inicialização
   ========================================================================== */
(function (global) {
  "use strict";
  const NE = global.NE;
  const root = document.getElementById("view");
  let cleanup = null;

  const ROUTES = {
    dashboard: function () { return NE.Views.dashboard(root); },
    schedule:  function () { return NE.Views.schedule(root); },
    lab:       function () { return NE.Lab.mount(root); },
    analytics: function () { return NE.Views.analytics(root); }
  };

  function route() {
    const parts = (location.hash || "#/dashboard").replace(/^#\/?/, "").split("/");
    let name = parts[0] || "dashboard";

    if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
    document.body.classList.remove("zen");
    root.onchange = null;
    root.innerHTML = "";

    if (name === "study") {
      const id = parseInt(parts[1], 10);
      const fallback = NE.Store.nextSession();
      cleanup = NE.Study.mount(root, id >= 1 && id <= 56 ? id : (fallback ? fallback.id : 1));
    } else {
      if (!ROUTES[name]) name = "dashboard";
      cleanup = ROUTES[name]();
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (a) {
      const on = a.dataset.nav === name;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    global.scrollTo(0, 0);
    root.focus({ preventScroll: true });
  }

  global.addEventListener("hashchange", route);
  route();

  /* ------------------- Listener de atualização via Cloud -------------------- */
  global.addEventListener("neuroeng:state-updated", function (e) {
    // Re-executa rota atual para atualizar tela com dados vindos da nuvem
    route();
  });

  /* ---------------------- Indicador de Status da Cloud ---------------------- */
  const cloudPill = document.getElementById("cloud-pill");
  function updateCloudUI(st) {
    if (!cloudPill) return;
    const dot = cloudPill.querySelector(".cloud-dot");
    const txt = cloudPill.querySelector(".cloud-text");
    if (!st) st = (NE.CloudSync && NE.CloudSync.getStatus()) || { status: "disconnected", label: "Cloud: Off" };
    
    cloudPill.className = "cloud-indicator cloud-" + st.status;
    cloudPill.title = st.label + (st.lastSync ? " (Última: " + new Date(st.lastSync).toLocaleTimeString("pt-BR") + ")" : "");
    if (txt) {
      if (st.status === "synced") txt.textContent = "Cloud: Synced";
      else if (st.status === "syncing") txt.textContent = "Cloud: Sync...";
      else if (st.status === "offline") txt.textContent = "Cloud: Offline";
      else if (st.status === "error") txt.textContent = "Cloud: Erro";
      else txt.textContent = "Cloud: Desconectado";
    }
  }

  if (NE.CloudSync) {
    NE.CloudSync.onStatusChange(updateCloudUI);
    updateCloudUI(NE.CloudSync.getStatus());
  }

  /* ------------------------- PWA: Service Worker offline ------------------------ */
  // Service Workers exigem HTTPS ou localhost (não funcionam em file://).
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    global.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function (err) {
        console.warn("NeuroEng: Service Worker não registrado", err);
      });
    });
  }
})(window);
