// Replayable paired jump. Normal wallpaper is preserved; extra assets load on demand.
(() => {
  const button = document.getElementById('jump-together');
  const scene = document.getElementById('jump-scene');
  const actors = document.getElementById('jump-actors');
  const status = document.getElementById('jump-status');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!button || !scene || !actors) return;
  let busy = false, timer;
  function reset() {
    clearTimeout(timer);
    document.documentElement.classList.remove('jump-active');
    scene.hidden = true;
    busy = false; button.disabled = false;
    button.textContent = 'Replay our jump ↗';
  }
  button.addEventListener('click', async () => {
    if (busy) return;
    if (motion.matches) { status.textContent = 'Jump animation skipped because reduced motion is enabled.'; return; }
    busy = true; button.disabled = true; button.textContent = 'Getting ready…';
    try {
      // Decode both layers before swapping them in, avoiding empty frames or duplicates.
      await Promise.all([...scene.querySelectorAll('img')].map(async image => {
        if (!image.getAttribute('src')) image.src = image.dataset.src;
        await image.decode();
      }));
      if (motion.matches) { reset(); return; }
      scene.hidden = false;
      document.documentElement.classList.add('jump-active');
      button.textContent = 'Off we go!';
      status.textContent = 'Kihto and Thya spring forward together.';
      // Leave a short beat after disappearing behind the ledge, then restore the still scene.
      timer = setTimeout(reset, 2600);
    } catch {
      reset(); status.textContent = 'The jump artwork could not be loaded. Please try again.';
    }
  });
  // Changing motion preference mid-jump restores the still foreground immediately.
  motion.addEventListener('change', () => { if (motion.matches && busy) reset(); });
})();