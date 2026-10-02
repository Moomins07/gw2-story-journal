// Small, optional entrance cinematic. Decorative behaviour, separate from journal logic.
// Run early in the head, with private variables; DOM setup waits until HTML is parsed.
(() => {
  // Classes on <html> coordinate the overlay, homepage crossfade and hidden music controls.
  const root = document.documentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  // sessionStorage lasts for this tab session, so refreshes do not replay the intro.
  const storageKey = 'gw2-story-intro-seen';
  // Avoid replaying or blocking the page if storage is unavailable.
  try {
    if (motion.matches || sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, '1');
  } catch { return; }

  // Set the class early to prevent the homepage flashing before the overlay appears.
  root.classList.add('intro-pending');
  let finished = false;
  let intro, skip, content = [], revealTimer, finishTimer;
  const previousFocus = document.activeElement;

  // Shared cleanup for normal completion, Skip, Escape, reduced motion and watchdog; finished prevents duplicates.
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(revealTimer); clearTimeout(finishTimer); clearTimeout(watchdog);
    const restoreFocus = intro && intro.contains(document.activeElement);
    if (intro) intro.hidden = true;
    root.classList.remove('intro-pending', 'intro-playing', 'intro-revealing');
    // inert blocks background clicks/focus during the intro; restore the homepage here.
    content.forEach(element => { element.inert = false; });
    // music.js listens for this signal and begins fading in.
    document.dispatchEvent(new Event('story-intro-finished'));
    document.removeEventListener('keydown', onKey);
    motion.removeEventListener('change', onMotion);
    // Move keyboard focus out of the hidden overlay to the previous control or the homepage heading.
    if (restoreFocus) {
      const target = previousFocus && previousFocus !== document.body && previousFocus.isConnected
        ? previousFocus : document.querySelector('main h1');
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    }
  }
  // Escape skips; Tab stays on Skip, the only available control while the intro covers the page.
  function onKey(event) {
    if (event.key === 'Escape') finish();
    if (event.key === 'Tab' && skip) { event.preventDefault(); skip.focus(); }
  }
  // End the animation if reduced motion is enabled while it is playing.
  function onMotion() { if (motion.matches) finish(); }
  // Even if initialisation encounters an error, never leave the homepage covered.
  const watchdog = setTimeout(finish, 5500);
  // Wait until HTML elements exist before selecting controls and creating particles.
  document.addEventListener('DOMContentLoaded', () => {
    if (finished) return;
    intro = document.getElementById('story-intro');
    skip = document.getElementById('skip-intro');
    if (!intro || !skip || motion.matches) { finish(); return; }
    content = [...document.querySelectorAll('body > header, body > main')];
    // inert blocks background clicks/focus during the intro; restore the homepage here.
    content.forEach(element => { element.inert = true; });
    // CSS animates these spans. Positions vary; negative delays start particles part-way through their journeys.
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
    // This class starts brush, title and halo animations defined in input.css.
    root.classList.add('intro-playing');
    skip.addEventListener('click', finish);
    document.addEventListener('keydown', onKey);
    motion.addEventListener('change', onMotion);
    skip.focus({ preventScroll: true });
    // Start a 1.05-second crossfade at 2.4 seconds; clean up and release the page at 3.5 seconds.
    revealTimer = setTimeout(() => root.classList.add('intro-revealing'), 2400);
    finishTimer = setTimeout(finish, 3500);
  }, { once: true });
})();