// Small, optional entrance cinematic. Decorative behaviour, separate from journal logic.
(() => {
  const root = document.documentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'gw2-story-intro-seen';
  // Avoid replaying or blocking the page if storage is unavailable.
  try {
    if (motion.matches || sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, '1');
  } catch { return; }

  root.classList.add('intro-pending');
  let finished = false;
  let intro, skip, content = [], revealTimer, finishTimer;
  const previousFocus = document.activeElement;

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(revealTimer); clearTimeout(finishTimer); clearTimeout(watchdog);
    const restoreFocus = intro && intro.contains(document.activeElement);
    if (intro) intro.hidden = true;
    root.classList.remove('intro-pending', 'intro-playing', 'intro-revealing');
    content.forEach(element => { element.inert = false; });
    document.removeEventListener('keydown', onKey);
    motion.removeEventListener('change', onMotion);
    if (restoreFocus) {
      const target = previousFocus && previousFocus !== document.body && previousFocus.isConnected
        ? previousFocus : document.querySelector('main h1');
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    }
  }
  function onKey(event) {
    if (event.key === 'Escape') finish();
    if (event.key === 'Tab' && skip) { event.preventDefault(); skip.focus(); }
  }
  function onMotion() { if (motion.matches) finish(); }
  // Even if initialisation encounters an error, never leave the homepage covered.
  const watchdog = setTimeout(finish, 5500);
  document.addEventListener('DOMContentLoaded', () => {
    if (finished) return;
    intro = document.getElementById('story-intro');
    skip = document.getElementById('skip-intro');
    if (!intro || !skip || motion.matches) { finish(); return; }
    content = [...document.querySelectorAll('body > header, body > main')];
    content.forEach(element => { element.inert = true; });
    const emberField = intro.querySelector('.intro-embers');
    for (let i = 0; i < 22; i++) {
      const ember = document.createElement('span');
      ember.className = 'intro-ember';
      ember.style.setProperty('--left', `${(i * 37 + 7) % 100}%`);
      ember.style.setProperty('--delay', `${-(i % 7) * .6}s`);
      ember.style.setProperty('--travel', `${(i % 2 ? 1 : -1) * (15 + i * 4)}px`);
      emberField.append(ember);
    }
    intro.hidden = false;
    root.classList.add('intro-playing');
    skip.addEventListener('click', finish);
    document.addEventListener('keydown', onKey);
    motion.addEventListener('change', onMotion);
    skip.focus({ preventScroll: true });
    revealTimer = setTimeout(() => root.classList.add('intro-revealing'), 2400);
    finishTimer = setTimeout(finish, 3500);
  }, { once: true });
})();