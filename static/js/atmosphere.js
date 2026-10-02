// Decorative effects only. Chapter loading stays in the guided learning exercise.
(() => {
  const scene = document.getElementById('atmosphere');
  if (!scene) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const glow = scene.querySelector('.pointer-glow');
  const embers = scene.querySelector('.embers');
  let frame = 0;
  let x = 0, y = 0, targetX = 0, targetY = 0;

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    x = y = targetX = targetY = 0;
    scene.style.setProperty('--depth-x', '0px');
    scene.style.setProperty('--depth-y', '0px');
    glow.style.opacity = '0';
  }

  function render() {
    x += (targetX - x) * 0.07;
    y += (targetY - y) * 0.07;
    scene.style.setProperty('--depth-x', `${x.toFixed(2)}px`);
    scene.style.setProperty('--depth-y', `${y.toFixed(2)}px`);
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.05) {
      frame = requestAnimationFrame(render);
    } else {
      frame = 0;
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function configure() {
    stop();
    embers.replaceChildren();
    if (motion.matches) return;
    for (let i = 0; i < 16; i++) {
      const ember = document.createElement('span');
      ember.className = 'ember';
      ember.style.setProperty('--ember-left', `${(i * 37 + 11) % 100}%`);
      ember.style.setProperty('--ember-size', `${2 + (i % 3)}px`);
      ember.style.setProperty('--ember-duration', `${15 + (i % 7) * 2}s`);
      ember.style.setProperty('--ember-delay', `${-i * 2.7}s`);
      ember.style.setProperty('--ember-drift', `${(i % 2 ? 1 : -1) * (30 + i * 4)}px`);
      embers.append(ember);
    }
  }

  window.addEventListener('pointermove', (event) => {
    if (motion.matches || !finePointer.matches || document.hidden) return;
    targetX = (event.clientX / window.innerWidth - 0.5) * -18;
    targetY = (event.clientY / window.innerHeight - 0.5) * -12;
    scene.style.setProperty('--glow-x', `${event.clientX}px`);
    scene.style.setProperty('--glow-y', `${event.clientY}px`);
    glow.style.opacity = '1';
    schedule();
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => {
    targetX = targetY = 0;
    glow.style.opacity = '0';
    if (!motion.matches) schedule();
  });
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', () => {
    document.documentElement.classList.toggle('atmosphere-paused', document.hidden);
    if (document.hidden) stop();
  });
  motion.addEventListener('change', configure);
  finePointer.addEventListener('change', stop);
  configure();
})();