# 06 — Styling the Chronicle frontend

Recorded: 6 October 2026.

## What changed

At my request, Codex built the Chronicle frontend while leaving Python, Flask routes, API access, and application logic untouched. The existing `chapters` loop still reads each mission's title and completion flag from my backend.

The page now has a landscape header, dark mission cards on a vertical timeline, expandable progress details, and a companion panel. Gold is the shared accent; the saved homepage theme also carries green or purple into the Chronicle. Thya's identity remains green and Kihto's remains purple in every theme.

## Why it works

The existing route already renders this template, so styling it does not require a new endpoint. The page loads the same stylesheet and theme script as the homepage. Its new styles are scoped to Chronicle classes and use existing theme variables with gold fallbacks.

Native HTML `details` and `summary` elements let visitors expand mission rows using a mouse or keyboard, without adding JavaScript application logic. The template preserves auto-escaping for mission titles. It uses the existing completion flag, rather than guessing which mission is current or locked. Completion refers to the backend's configured character, not automatically to both companions.

The scenery is decorative reused artwork, not a claim about each mission's location. The journal message describes a future feature; it does not fabricate notes or provide a save control before storage exists.

## Checks and limits

Independently verified by Codex:

- The Tailwind production stylesheet build completed successfully.
- An isolated Flask instance rendered the existing template with fixture records, without importing my application or contacting the GW2 API.
- Both completion states rendered; HTML in a fixture title was escaped; empty records produced the empty state; a long title remained intact.

These are template and build checks, not a live API test or a browser visual check. Responsive rules stack the companion panel and shrink thumbnails on narrow screens, but their appearance still needs browser review. No Python/backend files were changed.

Suggested browser checks: open `/chronicle` using my existing configured server, expand a mission using the keyboard, inspect a narrow screen, then select Thya and Kihto on the homepage and revisit the Chronicle to compare themes. Backend configuration or API errors can still prevent the existing route from responding; frontend work does not change that behavior.

## Git, blog ideas, and Boot.dev

Suggested commit after browser review: `Style Chronicle timeline and companion panel`. No commit or development hours are claimed here.

Blog idea: using native HTML disclosure elements and shared CSS variables to build a fantasy journal around real backend data.

This frontend makes my Python API work easier to inspect and demonstrates how server-supplied records become a usable page. Python data retrieval, error handling, journal storage, and application logic remain my learning work.

## Follow-up: Completed mission markers

The user supplied a screenshot showing the timeline visible through a completed marker and requested green completion ticks. Codex changed the completed tick to green in every character theme, gave the completed circle an opaque dark green fill, and placed markers above the rail. Following the requested refinement, the completed circle border is also green in every theme. Incomplete markers retain the selected theme colour.

The overlap came from the completed marker's translucent background: the rail remained visible through it. An opaque background covers the rail inside the circle without removing the line between missions. This is a CSS-only correction; completion data and backend behavior remain unchanged.

Verification: the stylesheet build and whitespace check passed. Browser appearance after this correction has not been independently verified. Suggested check: refresh the Chronicle in gold, green, and purple themes and confirm completed ticks remain green with no line through their circles.

## Follow-up: Illustrated 503 view

The user implemented a 503 response for missing API configuration and asked Codex to integrate the selected anime illustration. Code review confirmed the route supplies `chapters=[]` and an `error` string when configuration is missing. Codex left Python/backend files untouched and replaced the template's plain error paragraph with an illustrated panel, friendly copy, the escaped backend message, and links to retry or return home.

The panel uses `kihto-thya-api-503-anime-v2.png`, retaining serious Kihto and cute Thya. Tailwind utilities handle spacing, typography, sizing, and responsive layout; small custom CSS rules supply theme-aware borders and backgrounds. Inline comments explain the additions. The template's existing `error` variable chooses between this panel and the mission list, so an error no longer also shows a misleading zero-mission count or ordinary empty-state text.

Independently verified: the Tailwind build passed; isolated fixture rendering checked error, success, and empty-data branches, escaped diagnostic text, and the selected artwork reference. No application import or live API request was needed. Browser appearance and real route behavior were not independently verified. The current reviewed backend handles missing configuration; this frontend does not add handling for other API failures.

Suggested check: visit `/chronicle` with the existing missing-configuration setup, then restore configuration and verify missions return. Retry requests the same route, so missing configuration still requires fixing the settings. Suggested commit: `Add illustrated Chronicle error view`.

Blog idea: separating HTTP error handling from a friendly Jinja error presentation. This builds on the user's Python validation work while keeping frontend assistance distinct from backend ownership.

## Follow-up: Thya's brown hair
At the user's request, the 503 illustration was edited with the built-in image generator to give Thya chestnut brown hair. The template now uses static/images/kihto-thya-api-503.png, and the previous anime-v2 asset was deleted. The new asset and its template reference were checked; corner transparency was verified. Python/backend code remains unchanged.


The 503 illustration was subsequently corrected to give Kihto a lion tail with a tuft only at the tip. The existing asset was replaced in place, retaining the template reference and avoiding extra image variants. Corner transparency was checked; no backend code changed.


## Follow-up: Separate 502 and 503 presentation

The user added a RequestException branch returning HTTP 502 and requested matching artwork. Code review found the route returns the status but does not yet pass it into the template. A response status is not automatically a Jinja variable.

Codex added the 502 illustration and made the template use `error_code` for its label, image and copy. Known 502/503 values select matching artwork. Missing or other codes do not show misleading numbered artwork. Isolated fixture rendering passed for 502, 503, missing status and success. The existing Python code was left untouched to preserve the user's backend learning boundary; the live route still needs the following keyword argument inside each respective render_template call:

```python
# In the missing-configuration branch, pass the displayed code as template data.
error_code=503,
# In the RequestException branch instead, pass its displayed code as template data.
error_code=502,
```

Each line belongs in its own branch, alongside chapters and error; the existing response tuples still determine HTTP status. The fixture checks are not a live route check. Suggested commit after making and checking that connection: `Match Chronicle error artwork to response status`. Blog idea: why returning HTTP 502 does not give a template access to that status automatically.
