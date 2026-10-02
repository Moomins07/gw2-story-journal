// Character selection changes accent colours, not the wallpaper or saved journal.
// Apply the remembered palette before paint to avoid a gold flash on refresh.
(() => {
  const root = document.documentElement;
  const key = 'gw2-character-theme';
  let selected = '';
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'green' || saved === 'purple') selected = saved;
  } catch { /* This easter egg also works when browser storage is unavailable. */ }
  if (selected) root.dataset.characterTheme = selected;

  document.addEventListener('DOMContentLoaded', () => {
    const buttons = [...document.querySelectorAll('[data-character] > button')];
    const status = document.getElementById('theme-status');
    function update() {
      buttons.forEach(button => {
        const colour = button.parentElement.dataset.character;
        // Pressed is theme selection; expanded still describes the profile card.
        button.setAttribute('aria-pressed', String(selected === colour));
        button.title = `Select ${colour === 'green' ? 'Thya’s green' : 'Kihto’s purple'} theme; select again to restore gold`;
      });
    }
    buttons.forEach(button => button.addEventListener('click', () => {
      const colour = button.parentElement.dataset.character;
      // Selecting the same character again returns to the original shared gold palette.
      selected = selected === colour ? '' : colour;
      if (selected) root.dataset.characterTheme = selected;
      else delete root.dataset.characterTheme;
      try {
        if (selected) localStorage.setItem(key, selected);
        else localStorage.removeItem(key);
      } catch { /* Keep the current page interactive even without persistence. */ }
      update();
      if (status) status.textContent = selected ? `${selected === 'green' ? 'Thya’s green' : 'Kihto’s purple'} theme selected.` : 'Shared gold theme restored.';
    }));
    update();
  }, { once: true });
})();