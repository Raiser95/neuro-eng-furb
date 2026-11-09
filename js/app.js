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
