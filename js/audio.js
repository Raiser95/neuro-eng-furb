/* ==========================================================================
   NeuroEng // Prep OS — Gerador de ruído sintético (Web Audio API nativa)
   Brown Noise e Pink Noise gerados matematicamente — sem arquivos externos.
   ========================================================================== */
(function (global) {
  "use strict";
  const NE = (global.NE = global.NE || {});

  let ctx = null, master = null, source = null, current = null, unlocked = false;
  const cache = {};

  /**
   * Cria/destrava o AudioContext. DEVE ser chamado de forma SÍNCRONA dentro de um
   * evento de toque/clique: no Safari/iOS o contexto nasce "suspended" e só
   * audioCtx.resume() disparado por gesto direto do usuário o libera.
   */
  function ensureCtx() {
    // iOS 16.4+: permite tocar mesmo com o botão lateral no modo silencioso
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) { /* ignora */ }

    if (!ctx) {
      const AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      ctx.onstatechange = function () { if (ctx.state === "running") unlocked = true; };
    }

    // resume() dentro do gesto + "buffer mudo" (truque clássico do iOS para garantir o desbloqueio)
    if (ctx.state !== "running") {
      const p = ctx.resume();
      if (p && p.catch) p.catch(function () { /* será tentado de novo no próximo toque */ });
    }
    if (!unlocked) {
      try {
        const silent = ctx.createBuffer(1, 1, 22050);
        const s = ctx.createBufferSource();
        s.buffer = silent;
        s.connect(ctx.destination);
        s.start(0);
      } catch (e) { /* ignora */ }
    }
    return true;
  }

  // iOS pode suspender/“interromper” o contexto (ligação, bloqueio de tela, troca de app).
  // Se estava tocando, retoma no próximo toque ou ao voltar para o app.
  function reviveIfNeeded() {
    if (ctx && current && ctx.state !== "running") {
      const p = ctx.resume();
      if (p && p.catch) p.catch(function () { /* aguarda novo gesto */ });
    }
  }
  ["touchend", "click"].forEach(function (ev) {
    global.addEventListener(ev, reviveIfNeeded, { capture: true, passive: true });
  });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) reviveIfNeeded(); });

  /** Gera 12 s de ruído com emenda cruzada (crossfade) para loop sem estalo. */
  function makeBuffer(type) {
    if (cache[type]) return cache[type];
    const rate = ctx.sampleRate;
    const L = Math.floor(rate * 12);
    const F = Math.floor(rate * 1.5);
    const raw = new Float32Array(L + F);

    if (type === "brown") {
      // Passeio aleatório com vazamento: Brownian noise (−6 dB/oitava)
      let last = 0;
      for (let i = 0; i < raw.length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        raw[i] = last * 3.5;
      }
    } else {
      // Ruído rosa (−3 dB/oitava): filtro de Paul Kellet
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < raw.length; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.96900 * b2 + w * 0.1538520;
        b3 = 0.86650 * b3 + w * 0.3104856;
        b4 = 0.55000 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.0168980;
        raw[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    }

    const buf = ctx.createBuffer(1, L, rate);
    const out = buf.getChannelData(0);
    for (let i = 0; i < L; i++) out[i] = raw[i];
    // Emenda: início = mistura entre o começo e a "cauda" que sucede o fim do loop
    for (let i = 0; i < F; i++) {
      const k = i / F;
      out[i] = raw[i] * k + raw[L + i] * (1 - k);
    }
    // normaliza para pico seguro
    let peak = 0;
    for (let i = 0; i < L; i++) peak = Math.max(peak, Math.abs(out[i]));
    if (peak > 0) { const g = 0.9 / peak; for (let i = 0; i < L; i++) out[i] *= g; }
    cache[type] = buf;
    return buf;
  }

  function startSource(type) {
    stopSource();
    source = ctx.createBufferSource();
    source.buffer = makeBuffer(type);
    source.loop = true;
    source.connect(master);
    source.start();
  }

  function stopSource() {
    if (source) { try { source.stop(); } catch (e) { /* já parado */ } source.disconnect(); source = null; }
  }

  const Noise = {
    get type() { return current; },
    get playing() { return !!current; },

    /** Deve ser chamado DIRETAMENTE no handler de clique/toque (antes de qualquer await/timeout). */
    unlock() { return ensureCtx(); },

    play(type, volume) {
      if (!ensureCtx()) return false;   // chama audioCtx.resume() ainda dentro do gesto
      startSource(type);
      current = type;
      Noise.setVolume(volume);
      return true;
    },

    setVolume(v) {
      if (!master) return;
      // curva quadrática = percepção de volume mais natural; rampa suave evita cliques
      const g = Math.pow(Math.max(0, Math.min(1, v)), 2) * 0.6;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(g, ctx.currentTime, 0.08);
    },

    stop() {
      if (!ctx || !current) { current = null; return; }
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      const s = source;
      setTimeout(function () { if (source === s && !current) stopSource(); }, 500);
      current = null;
    }
  };

  NE.Noise = Noise;
})(window);
