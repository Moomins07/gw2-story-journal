# 05 — Displaying real GW2 missions in Flask

Recorded: 6 October 2026.

## What I did

I configured the Flask process with a GW2 API key and character name through environment variables. I then imported my shared helpers into `app.py` and called them from `chronicle()`.

The route requests the character's quest IDs, converts them to a set, fetches descriptions for missions 71, 72, and 77, and prepares journal records. It passes those records to `chronicle.html` as `chapters`. The Jinja loop displays each title and uses an if/else to show Complete or Not reported complete.

## What I learned

The complete path is: browser requests the page, Flask reads configuration, Python requests GW2 data, the helper prepares records, and Jinja produces HTML for the browser.

The API key stays on the backend. The template receives the prepared mission records, not the key.

My temporary print statements appeared in the server terminal, not on the webpage. They were initially buffered when Flask ran through the combined npm development command. Adding `flush=True` made the diagnostics appear immediately. I reported both configuration presence checks as True and later removed those prints.

Successful configuration checks show values exist. Successful authenticated API requests show the supplied key works for that request. Those are different checks.

The page remains unstyled because it has not loaded the project's stylesheet yet. It is currently showing three selected missions, not the full story journal. The variable name `chapters` is reused for convenience, but these records represent individual missions.

## Evidence and limits

I supplied a browser screenshot showing Chain of Command, Time for a Promotion, and Fury of the Dead, all marked Complete. The guide also reviewed the route and template and confirmed the data flow. The guide did not independently run the authenticated website.

The successful path works. Missing configuration, invalid keys, network failures, and unavailable API data have not yet been handled in the route. Each visit currently makes two external requests; caching is not implemented. The old `/api/chapters` route still returns practice data independently.

## Git and Boot.dev

This connects my Python helpers to a real Flask page and contributes meaningful application code written by me with guidance.

Useful commit point: `Display real GW2 mission progress on Chronicle page`. A commit for this milestone has not yet been reported.

## Blog idea

From a practice button to a live journal: connecting environment configuration, API helpers, and Jinja templates.

## Next step

Validate missing configuration and handle expected API request failures with a useful page message before expanding coverage or styling the Chronicle.
