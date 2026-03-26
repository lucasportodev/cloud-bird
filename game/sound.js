// ─────────────────────────────────────────
//  CLOUD BIRD — sound.js
//  Web Audio API, zero arquivos externos
// ─────────────────────────────────────────

const SFX = (() => {
  let ctx = null;

  // Inicializa AudioContext lazy (precisa de gesto do usuário)
  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Toca um oscillator simples com envelope de volume
  function playTone({ type = 'sine', freq, freqEnd, duration, volume = 0.4, delay = 0 }) {
    if (!ctx) return;
    const t = ctx.currentTime + delay;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration);
    }

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  // ── Sons ────────────────────────────────

  function jump() {
    if (!enabled || !ctx) return;
    // "fwip" — sweep rápido descendente
    playTone({ type: 'sine', freq: 600, freqEnd: 300, duration: 0.12, volume: 0.25 });
  }

  function score() {
    if (!enabled || !ctx) return;
    // "ding" — nota alegre curta
    playTone({ type: 'sine', freq: 880, freqEnd: 1100, duration: 0.15, volume: 0.3 });
  }

  function die() {
    if (!enabled || !ctx) return;
    // "boing" — descida triste
    playTone({ type: 'sine',   freq: 400, freqEnd: 120, duration: 0.35, volume: 0.35 });
    playTone({ type: 'square', freq: 200, freqEnd: 80,  duration: 0.3,  volume: 0.15, delay: 0.05 });
  }

  function newRecord() {
    if (!enabled || !ctx) return;
    // Fanfarra: 3 notas subindo
    playTone({ type: 'sine', freq: 660,  freqEnd: 660,  duration: 0.12, volume: 0.3,  delay: 0.0  });
    playTone({ type: 'sine', freq: 880,  freqEnd: 880,  duration: 0.12, volume: 0.3,  delay: 0.14 });
    playTone({ type: 'sine', freq: 1100, freqEnd: 1200, duration: 0.2,  volume: 0.35, delay: 0.28 });
  }

  // ── Toggle ──────────────────────────────

  let enabled = localStorage.getItem('cloudbird_sound') !== 'off';

  function toggle() {
    enabled = !enabled;
    localStorage.setItem('cloudbird_sound', enabled ? 'on' : 'off');
  }

  function isEnabled() {
    return enabled;
  }

  return { init, jump, score, die, newRecord, toggle, isEnabled };
})();
