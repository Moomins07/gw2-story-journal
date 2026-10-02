// Decorative scene interaction only; chapter behaviour remains a learning exercise.
// Private setup for decoration only; chapter loading and journal behaviour remain separate.
(() => {
  const scene = document.getElementById('atmosphere');
  if (!scene) return;
  // Honour reduced motion; finePointer limits mouse-style parallax to hover-capable devices.
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const glow = scene.querySelector('.pointer-glow');
  const landscape = document.getElementById('landscape');
  const foreground = document.getElementById('charr-foreground');
  const islands = scene.querySelectorAll('.island-art');
  // A single transparent canvas holds all embers; its context supplies 2D drawing commands.
  const canvas = document.getElementById('ember-field');
  const context = canvas.getContext('2d');
  // frame is the drawing request ID; previous is its timestamp; x/y ease towards targetX/targetY.
  let frame = 0, previous = 0, width = innerWidth, height = innerHeight;
  let px = width / 2, py = height / 2, pointerActive = false;
  let x = 0, y = 0, targetX = 0, targetY = 0;
  let particles = [];

  // If either generated layer fails, use the unmodified wallpaper without duplicates.
  function fallback() {
    foreground.hidden = true;
    scene.classList.add('scene-fallback');
    if (landscape.getAttribute('src') !== landscape.dataset.fallback) {
      landscape.src = landscape.dataset.fallback;
    }
  }
  // Check all assets, including earlier load failures, and switch to the original wallpaper if needed.
  landscape.addEventListener('error', fallback);
  foreground.addEventListener('error', fallback);
  islands.forEach(island => island.addEventListener('error', fallback));
  [landscape, foreground, ...islands].forEach(image => {
    if (image.complete && !image.naturalWidth) fallback();
  });

  // Randomise position, speed, size, sway and depth; recycled particles start below the screen.
  function particle(randomY = true) {
    return { x: Math.random() * width, y: randomY ? Math.random() * height : height + 12,
      speed: 12 + Math.random() * 25, radius: .7 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2, depth: .3 + Math.random() * .7 };
  }
  // Match viewport size; cap high-density rendering at 2x and use fewer particles on small screens.
  function resize() {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    // Keep drawing in normal screen pixels even when the canvas buffer uses more pixels.
    if (context) context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: width < 640 ? 30 : 64 }, () => particle());
  }
  // Let parallax return to rest and hide the glow after the pointer leaves.
  function clearPointer() {
    pointerActive = false; targetX = targetY = 0;
    glow.style.opacity = '0';
  }
  // Cancel drawing, reset offsets and clear the surface when the page should not animate.
  function stop() {
    cancelAnimationFrame(frame); frame = 0; previous = 0;
    clearPointer(); x = y = 0;
    for (const property of ['--depth-x', '--depth-y']) {
      scene.style.setProperty(property, '0px');
    }
    if (context) context.clearRect(0, 0, width, height);
  }
  // Draw one frame and request another; the browser supplies now in milliseconds.
  function render(now) {
    if (motion.matches || document.hidden) { stop(); return; }
    // Move by elapsed seconds, capped at 0.04 so delayed frames cannot throw particles across the screen.
    const dt = previous ? Math.min((now - previous) / 1000, .04) : 0;
    previous = now;
    // Exponential smoothing makes parallax gentle and consistent across different frame rates.
    const smoothing = 1 - Math.exp(-5 * dt);
    x += (targetX - x) * smoothing; y += (targetY - y) * smoothing;
    // Apply pointer movement only to distant scenery. The foreground stays fixed.
    scene.style.setProperty('--depth-x', `${x.toFixed(2)}px`);
    scene.style.setProperty('--depth-y', `${y.toFixed(2)}px`);
    if (context) {
      context.clearRect(0, 0, width, height);
      // Additive blending makes particles behave like light rather than opaque paint.
      context.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        // Rise with a sine-wave sway; the background offset adds a little wind.
        p.y -= p.speed * dt;
        p.x += (Math.sin(now / 2200 + p.phase) * 9 + x * p.depth * .7) * dt;
        // Repel particles within 125px; force decreases with distance from the pointer.
        if (pointerActive) {
          const dx = p.x - px, dy = p.y - py, distance = Math.hypot(dx, dy);
          if (distance > 1 && distance < 125) {
            const force = (1 - distance / 125) * 90 * dt;
            p.x += dx / distance * force; p.y += dy / distance * force;
          }
        }
        // Recycle particles outside the viewport instead of allocating new objects every frame.
        if (p.y < -20 || p.x < -30 || p.x > width + 30) Object.assign(p, particle(false));
        // Vary opacity for gentle flicker, then draw a glowing circle.
        const alpha = .25 + .4 * (.5 + .5 * Math.sin(now / 950 + p.phase));
        context.beginPath(); context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        context.shadowBlur = 8; context.shadowColor = '#ffad5b';
        context.fillStyle = `rgba(255,207,135,${alpha})`; context.fill();
      }
      context.shadowBlur = 0;
    }
    frame = requestAnimationFrame(render);
  }
  // Prevent duplicate loops; hidden pages and reduced-motion mode cannot start drawing.
  function start() {
    if (!motion.matches && !document.hidden && !frame) frame = requestAnimationFrame(render);
  }
  // Initialise or rebuild the scene after motion preferences change.
  function configure() {
    stop(); resize();
    document.documentElement.classList.toggle('atmosphere-paused', document.hidden);
    start();
  }
  // Convert pointer coordinates to a small background offset and pass positions to CSS custom properties.
  window.addEventListener('pointermove', event => {
    if (motion.matches || !finePointer.matches || document.hidden) return;
    px = event.clientX; py = event.clientY; pointerActive = true;
    targetX = (px / width - .5) * -32; targetY = (py / height - .5) * -18;
    scene.style.setProperty('--glow-x', `${px}px`);
    scene.style.setProperty('--glow-y', `${py}px`);
    glow.style.opacity = '1';
    start();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', clearPointer);
  // Pause JavaScript drawing and CSS motion together when unfocused or hidden.
  window.addEventListener('blur', () => {
    document.documentElement.classList.add('atmosphere-paused'); stop();
  });
  window.addEventListener('focus', () => {
    document.documentElement.classList.remove('atmosphere-paused'); start();
  });
  document.addEventListener('visibilitychange', () => {
    document.documentElement.classList.toggle('atmosphere-paused', document.hidden);
    if (document.hidden) stop(); else start();
  });
  // Recalculate canvas size and respond to motion/device changes.
  window.addEventListener('resize', resize, { passive: true });
  motion.addEventListener('change', configure);
  finePointer.addEventListener('change', clearPointer);
  // This deferred script runs after the HTML exists; begin initial setup now.
  configure();
})();