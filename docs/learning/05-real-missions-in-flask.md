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

## Follow-up: Configuration and request failures

I added a configuration guard returning a friendly page with HTTP 503, and a `RequestException` handler returning HTTP 502 for failed API requests. Initially, the guard followed the character request, so a missing character name reached `quote()` and caused a TypeError. Moving validation before the helper call fixed that; I reported the configuration error page working.

The successful return remains after the try/except. Missing configuration and unsuccessful external requests are separate paths. Exporting settings establishes their presence, not their validity or API availability.

On my explicit request, the guide replaced a misleading character-not-found message with a general API failure message and added safe diagnostics reporting the failed request stage, exception class, and HTTP status. No API key, request headers, or response body is logged. The current unexpected 502 remains under investigation; its cause has not yet been established.

**I learned:** Requests responses with error status codes are falsey. Checking `error.response is not None` preserves access to their status codes; a generic truthiness check would miss those responses.

The user shared diagnostics showing `stage=character progress, type=HTTPError, status=401`. This identifies an authentication rejection on the character request rather than missing configuration or a network timeout. The exact cause remains unverified. Next diagnostic: request `/v2/tokeninfo` using the exported key, print only the status and permissions, and distinguish a rejected key from a character-endpoint-specific failure.

## Diagnosing authentication and terminal configuration

The initial token-info check returned 401 with no surrounding whitespace. After replacing the exported key, the user reported HTTP 200 and permissions including account, characters, and progression. The exact reason the earlier key value was rejected was not established.

The website subsequently returned 503. Checking the launching terminal showed both settings absent. After entering the working key and exporting both settings in that same terminal, the user reported the website working again.

**I learned:** Exported variables belong to a shell session and are inherited by programs it launches. They are not shared automatically with other terminals or saved across sessions. This explained why a successful key check in one session did not configure another server session.

The user has reported successful normal operation, the missing-configuration path, and an API-failure path. The guide reviewed the code and diagnostics but did not independently run authenticated requests. Useful commit point: `Handle Chronicle configuration and API request failures`.

Next step: configure a local Git-ignored `.env` file and Flask's dotenv support so new development sessions can load settings consistently. A sample file should contain placeholders only.

## Local configuration with dotenv

I followed the exercise to install `python-dotenv`, record the dependency, and supply local configuration through `.env`. I reported the website working after the exercise to unset the exported variables and launch Flask again. The guide checked the dependency and ignore rule without reading the secret file; the runtime result is user-reported.

**What I liked:** The website can now load its local settings without repeatedly exporting them in each terminal. This makes development feel much simpler.

**I learned:** A `.env` file stores local configuration, and Flask's CLI loads it when `python-dotenv` is installed. My route still reads `os.environ`; it does not need separate file-reading code. An ordinary Python script does not automatically load this file. Existing exported values can take precedence, so unsetting them makes a useful test of file-based loading.

The local `.env` is excluded by `.gitignore` and should never be committed. A shareable `.env.example` should contain configuration names and placeholders, never the working key. The guide has not inspected that example's contents.

Suggested final check: `git check-ignore .env` should identify the ignored file. Useful commit point: `Add dotenv support for local GW2 configuration`, including the dependency and placeholder example, excluding `.env`.

Blog idea: why exported variables disappeared between terminals, and how Flask's dotenv support simplified local setup.
