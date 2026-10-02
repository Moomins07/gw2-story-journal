// Ambient soundtrack: begins silently and fades in when the opening cinematic ends.
(() => {
  const audio = document.getElementById('background-music');
  const controls = document.getElementById('music-controls');
  const toggle = document.getElementById('music-toggle');
  const slider = document.getElementById('music-volume');
  const output = document.getElementById('music-volume-value');
  const status = document.getElementById('music-status');
  const waves = document.getElementById('music-waves');
  const off = document.getElementById('music-off');
  if (!audio || !controls || !toggle || !slider) return;
  const key = 'gw2-background-music';
  let volume = .25, muted = false, playing = false, pending = false, failed = false;
  let ready = !document.documentElement.classList.contains('intro-pending');
  let fadeFrame = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && Number.isFinite(saved.volume)) volume = Math.max(0, Math.min(1, saved.volume));
    if (saved && typeof saved.muted === 'boolean') muted = saved.muted;
  } catch { /* Preferences are optional when storage is unavailable. */ }
  audio.volume = 0;
  audio.muted = muted;
  controls.hidden = false;

  function save() {
    try { localStorage.setItem(key, JSON.stringify({ volume, muted })); } catch {}
  }
  function update() {
    const audible = playing && !muted && volume > 0;
    waves.style.display = audible ? '' : 'none';
    waves.removeAttribute('hidden');
    off.style.display = audible ? 'none' : '';
    toggle.setAttribute('aria-pressed', String(audible));
    const label = failed ? 'Background music unavailable' : audible ? 'Mute background music' : 'Play background music';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    slider.value = String(Math.round(volume * 100));
    output.textContent = `${Math.round(volume * 100)}%`;
  }
  function fadeTo(target, duration = 2500) {
    cancelAnimationFrame(fadeFrame);
    const from = audio.volume, start = performance.now();
    function step(now) {
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      // Smooth start and finish, without an abrupt jump in volume.
      audio.volume = from + (target - from) * (progress * progress * (3 - 2 * progress));
      if (progress < 1) fadeFrame = requestAnimationFrame(step);
      else fadeFrame = 0;
    }
    fadeFrame = requestAnimationFrame(step);
  }
  function start() {
    if (pending || failed || muted || volume === 0) return;
    if (playing) {
      if (ready) fadeTo(volume);
      return;
    }
    pending = true;
    // Call play inside the gesture itself so browser autoplay rules can authorise it.
    audio.play().then(() => {
      pending = false; playing = true;
      audio.muted = muted;
      if (ready && !muted) fadeTo(volume);
      status.textContent = ready && !muted ? 'Background music playing' : '';
      update();
    }).catch(() => {
      pending = false;
      status.textContent = ready ? 'Select the speaker to play background music' : '';
      update();
    });
  }
  function onGesture(event) {
    if (event.type === 'keydown' && !['Enter', ' ', 'Escape'].includes(event.key)) return;
    if (event.target && controls.contains(event.target)) return;
    if (!playing) start();
  }
  toggle.addEventListener('click', () => {
    if (playing && !muted && volume > 0) {
      muted = true;
      cancelAnimationFrame(fadeFrame); fadeFrame = 0;
      audio.muted = true;
      status.textContent = 'Background music muted';
    } else {
      muted = false;
      if (volume === 0) volume = .25;
      audio.muted = false; audio.volume = 0;
      start();
    }
    save(); update();
  });
  slider.addEventListener('input', () => {
    volume = Number(slider.value) / 100;
    muted = volume === 0;
    audio.muted = muted;
    cancelAnimationFrame(fadeFrame); fadeFrame = 0;
    if (playing && ready) fadeTo(volume, 150);
    else start();
    save(); update();
  });
  audio.addEventListener('pause', () => {
    playing = false;
    cancelAnimationFrame(fadeFrame); fadeFrame = 0;
    update();
  });
  audio.addEventListener('error', () => {
    failed = true; playing = false;
    cancelAnimationFrame(fadeFrame);
    toggle.disabled = true; slider.disabled = true;
    status.textContent = 'Background music could not be loaded';
    update();
  });
  document.addEventListener('story-intro-finished', () => {
    ready = true;
    start();
  }, { once: true });
  document.addEventListener('pointerdown', onGesture, { passive: true });
  document.addEventListener('keydown', onGesture);
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(fadeFrame);
    audio.pause();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted && ready) start();
  });
  update();
  if (ready) start();
})();