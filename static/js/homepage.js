// Homepage interactions stay separate from the chapter-loading learning exercise.
// Small browser-local records are user-entered; no GW2 completion data is invented.
(() => {
  const key = 'gw2-home-journal-v1';
  const dialog = document.getElementById('journal-editor');
  const form = document.getElementById('journal-form');
  if (!dialog || !form) return;
  const fields = ['story', 'act', 'episode', 'memory', 'author'];
  let record = {};
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) record = saved;
  } catch { /* Storage may be unavailable; the editor can still work for this visit. */ }

  // Use textContent rather than HTML so journal text is always treated as text.
  function render() {
    document.getElementById('journey-heading').textContent = record.episode || 'Where will we go next?';
    document.getElementById('journey-location').textContent = [record.story, record.act].filter(Boolean).join(' · ') || 'Choose a story and your next chapter.';
    document.getElementById('latest-memory').textContent = record.memory || 'The little moments deserve a place in our story.';
    const date = record.updated ? new Date(record.updated) : null;
    document.getElementById('memory-date').textContent = date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'A page waiting to be written';
    for (const colour of ['green', 'purple']) {
      const done = record[colour] === true;
      const label = document.getElementById(`journey-${colour}`);
      label.textContent = `${colour === 'green' ? 'Thya' : 'Kihto'} · ${done ? '✓ Complete' : 'Not marked complete'}`;
    }
    const author = document.getElementById('memory-author');
    author.textContent = record.memory ? ({ green: 'Thya’s memory', purple: 'Kihto’s memory', shared: 'A shared memory' }[record.author] || 'A shared memory') : 'Our journal';
  }

  // Native dialog provides keyboard focus containment, Escape and a modal backdrop.
  document.querySelectorAll('[data-open-journal]').forEach(button => {
    button.addEventListener('click', () => {
      for (const field of fields) form.elements[field].value = typeof record[field] === 'string' ? record[field] : (field === 'author' ? 'shared' : '');
      for (const colour of ['green', 'purple']) form.elements[colour].checked = record[colour] === true;
      document.getElementById('journal-save-status').textContent = '';
      dialog.showModal();
      form.elements[button.dataset.openJournal === 'memory' ? 'memory' : 'story'].focus();
    });
  });
  document.getElementById('journal-cancel').addEventListener('click', () => dialog.close());
  form.addEventListener('submit', event => {
    event.preventDefault();
    const next = {};
    for (const field of fields) next[field] = form.elements[field].value.trim();
    for (const colour of ['green', 'purple']) next[colour] = form.elements[colour].checked;
    // Update the memory date only when the note or its author changes.
    next.updated = next.memory !== record.memory || next.author !== record.author ? new Date().toISOString() : record.updated;
    record = next;
    render();
    try {
      localStorage.setItem(key, JSON.stringify(record));
      dialog.close();
      document.getElementById('home-save-status').textContent = 'Your journal has been saved in this browser.';
    } catch {
      document.getElementById('journal-save-status').textContent = 'Updated for this visit, but browser storage is unavailable. Copy your note before leaving.';
    }
  });

  // Desktop hotspots and mobile chips open the same character cards.
  // Buttons also work with keyboard/touch; hover is just an extra way to preview.
  const profiles = [...document.querySelectorAll('[data-character]')];
  function closeProfiles() {
    profiles.forEach(group => {
      group.classList.remove('profile-open');
      group.querySelector('button').setAttribute('aria-expanded', 'false');
    });
  }
  profiles.forEach(group => {
    const button = group.querySelector('button');
    button.addEventListener('click', () => {
      const open = group.classList.contains('profile-open');
      closeProfiles();
      if (!open) { group.classList.add('profile-open'); button.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', event => {
    if (!profiles.some(group => group.contains(event.target))) closeProfiles();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeProfiles(); if (profiles.some(group => group.contains(document.activeElement))) document.activeElement.blur(); } });
  render();
})();