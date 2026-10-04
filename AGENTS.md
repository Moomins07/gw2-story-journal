# Project guidance

## Design reference

Use `docs/design/our-story-concept.png` as the visual reference for all frontend design work. The reference shows the homepage, Chronicle chapter list, and chapter detail with character notes.

- Maintain an atmospheric Guild Wars 2 fantasy journal: near-black charcoal surfaces, painterly Tyria landscapes, warm muted gold borders and accents, ivory text, and restrained ember effects.
- Use elegant serif display headings and small, widely spaced navigation and metadata labels. Keep body text readable.
- Follow the reference composition: immersive landscape homepage with two Charr, a chronological chapter list with completion/current/locked states, and chapter details with progress and dated character notes.
- Carry the same typography, spacing, panel treatments, and visual language into additional pages. Adapt layouts for mobile and preserve accessible contrast, focus indicators, and reduced-motion support.
- Treat the image as a visual target; do not infer implemented features or real journal content from its illustrative text.

## Character colours and theme easter egg

- Shared/default styling uses the concept's gold accents. Character branding is a deliberate exception: Thya Pyrewatcher (the wife's character) is green; Kihto Pyrewalker (the user's male Charr) is purple. Preserve those identities throughout the website, including portraits, notes, author labels, progress indicators, and character-specific UI, regardless of the selected theme.
- Use `static/images/favicon.png` and the coloured loading-screen emblem, `static/images/pyre-emblem-colour.png`, as existing brand references: green and purple Charr around shared gold fire.
- Preserve the homepage character-selection easter egg implemented in `static/js/theme.js`: selecting a character changes the site's accent theme to their colour; selecting the same character again restores shared gold. The choice is remembered in localStorage under `gw2-character-theme`.
- Future pages and components must respect the active character theme using the existing theme tokens in `static/css/input.css`, rather than hardcoding gold accents. Maintain the dark fantasy composition, readable contrast, and character identities across all three palettes.
## Code explanations

The user requires inline comments explaining any code added, in every language. Place explanations alongside the relevant code using the language's comment syntax (Python, JavaScript, HTML/Jinja, CSS, shell, etc.). Explain purpose and behavior so the user can understand, change, and debug it. Comment meaningful statements and blocks, including frontend styling and decorative effects. For formats that cannot contain comments, such as JSON, provide the explanation in a directly accompanying document rather than producing invalid syntax. Do not hand-edit generated files solely to add comments; explain their source and generation instead.

## Collaboration and scope

The user has substantial web development experience and delegates most frontend implementation to Codex to prioritize Python/backend learning. Build frontend layout, styling, and decorative effects when requested, and explain the changes. Follow the README's learning boundary: the user writes Python and JavaScript application logic with guidance; do not take over backend or application logic without authorization. Keep implementation proportional to the project's local Flask, Tailwind, and SQLite scope.

