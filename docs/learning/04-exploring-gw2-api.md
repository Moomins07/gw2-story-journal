# 04 — Exploring the real GW2 API

## What I did

Following an exercise to request `/v2/stories/1` from Python, I shared the returned record. It contained `My Story`, the Charr race, and three named chapters. The guide has not yet reviewed my exploration script or dependency changes.

## What I learned

The parsed result is a Python dictionary. Its `name` field holds the story name. Its `chapters` field is a list of dictionaries, each containing a `name`.

This public response describes a story. It does not identify an account or character, and it contains no completion state. Story catalogue data and player progress are separate concerns.

I noticed the missing completion information and raised it before integrating the data. Inspecting real responses early helps check whether an API supports the features I want.

The character-specific `/v2/characters/:id/quests` endpoint requires an API key with account, characters, and progression permissions. Its documented response contains quest IDs, not chapter completion percentages. We need to inspect actual character data and its mapping to quests and stories before deciding how to calculate progress. Missing data should not automatically mean incomplete.

Reference: [Character quests API documentation](https://wiki.guildwars2.com/wiki/API:2/characters/:id/quests).

## Checks and next step

The user supplied the successful story response. An authenticated character request and reliable chapter completion mapping have not been verified yet. Next, inspect character-specific quest data with the key kept on the backend and out of Git and chat. Journal notes and manual completion can remain available where API coverage is insufficient.

## Blog idea

Why a story catalogue is different from player progress, and what inspecting my first API response taught me about project scope.

## Follow-up: Authenticated character request

The guide reviewed my public exploration script and confirmed Requests was recorded in `requirements.txt`. I then reported successfully running the character quest script with an API key and shared its list of quest IDs. The authenticated script itself has not yet been reviewed by the guide.

I learned that the argument to `getpass` is a prompt label, not the secret. I enter the actual key at runtime, where input is hidden. Calling `.strip()` on the returned string removes surrounding whitespace.

The quest response is a list of references, not quest descriptions. The public `/v2/quests` endpoint resolves these IDs into records with names and story IDs. A story ID in a quest record refers to `/v2/stories`; it is not the same kind of ID as a quest ID.

Next exercise: look up one returned quest, inspect its `name` and `story`, and compare it with known in-game progress. The authenticated result is confirmed by the user; complete chapter-level coverage and completion mapping remain unverified.

## Follow-up: Completion text versus completion status

I looked up quest 77 and shared its record: `Fury of the Dead`, linked to story 1. Its goals contain `active` instructions and a `complete` narrative description.

**I learned:** A field named `complete` is not necessarily a completion flag. Here it is public text describing the finished goal, available even without identifying a character. It does not prove that my character completed the quest.

Character-specific quest IDs supply the progress information; public quest records supply names and descriptions. My returned list contains specific IDs, not every quest between 71 and 667, and the numeric ordering is not a play timeline.

The user reported a successful lookup. API completion coverage can be incomplete, and replaying a chapter can reset reported completion, so this list should not be treated as a permanent, exhaustive play history. Reference: [Story Journal API limitations](https://wiki.guildwars2.com/wiki/Story_Journal/table).

## Combining names and progress: review in progress

I requested three mission records together using `params={"ids": "71,72,77"}`. I looped over the records, checked each ID against `completed_ids`, added a readable `status`, and printed the name and status. The guide found this loop correct.

I reported output showing only Fury of the Dead complete, consistent with the exercise's temporary `{77}` comparison set. The saved script reviewed afterward instead contained `completed_ids = {set(character_quest_ids)}`. That line would raise `TypeError: unhashable type: 'set'` before printing mission statuses, so the reported output came from a different version or state of the script.

**I learned:** `set(character_quest_ids)` creates the set of IDs I need. Wrapping it in braces attempts to create another set containing that mutable set, which Python cannot do. Use `completed_ids = set(character_quest_ids)` to restore the real character data. Final output from the corrected saved script is still to be checked.

### Reported successful check

After the correction, I shared output for Kihto Pyrewalker showing Chain of Command, Time for a Promotion, and Fury of the Dead all marked complete. This matches the three IDs in my previously reported character response. The guide has not independently executed the authenticated script.

This completes the small exercise of combining public mission names with character-specific quest membership. Both label branches were exercised through user-reported outputs, including the earlier temporary comparison set. Useful commit point: `Explore GW2 mission names and character progress`.

Next, extract reusable request and data-preparation functions before connecting the real data to Flask. Terminal prompts should remain in the exploration script rather than run during website requests.

## Refactoring into a shared module: review in progress

I created root-level `gw2_api.py` with `get_character_quest_ids(api_key, character_name)` and imported it into the exploration script. The helper encodes the name, sends an authenticated request with a timeout, checks the status, and returns JSON data. It does not prompt or print.

I corrected indentation so the status check, JSON parsing, and return are inside the function. I also encountered `ModuleNotFoundError` while running the script directly. Running `.venv/bin/python -m scripts.explore_character_quests` from the project root makes the root module discoverable.

The latest code review found the helper structurally correct and its returned data used by the script. However, the old inline character request still remains before the helper call, so the script requests character progress twice. Remove that old block and the now-unused `quote` import before considering the refactor complete. The guide has not independently executed this version.

**I learned:** Extracting a function means replacing the original code with a call, not keeping both. Multiline arguments inside parentheses allow flexible indentation, but consistent indentation and comments aligned with the function body make the structure easier to understand.

### Shared character helper completed

The follow-up review confirmed the original inline character request and unused `quote` import were removed from the exploration script. Character progress now comes from one helper call. The user reported the step complete; the guide checked the code but did not independently run the authenticated request.

The helper's multiline request arguments could still be indented more clearly, and its return comment should describe returning quest IDs rather than inspecting a record. These are readability improvements, not functional blockers.

Useful commit point: `Extract character quest request into reusable helper`. Next, extract the public mission-description request into a second helper.

## Public mission helper completed

I added `get_quests(quest_ids)` to `gw2_api.py`. It converts integer IDs into strings, joins them with commas, and supplies that string through `params={"ids": ids_parameter}`. It checks the response status and returns parsed mission records. The exploration script calls `get_quests([71, 72, 77])` instead of making this request itself.

**I learned:** `join` is a string method: the string before it is the separator. The explicit loop I chose builds a list of strings before joining them. The compact alternative uses a generator expression: `",".join(str(quest_id) for quest_id in quest_ids)` supplies converted strings one at a time.

`params` needs a dictionary mapping the API parameter name to its value. `{ids_parameter}` is a set, not that dictionary. A comma is also needed between the `params` and `timeout` arguments.

While debugging an unexpectedly broad response, I changed the public URL to `/v2/quests` without a trailing slash and corrected the loop to compare `quest['id']` rather than the entire quest dictionary against the set of integers. I subsequently reported that it worked. The guide verified these changes in the saved code, but did not independently reproduce the API response or isolate the trailing slash as its cause.

Both requests are now in reusable helpers. The remaining `import requests` in the exploration script is unused and can be removed. Consistent indentation of multiline request arguments is a useful readability cleanup.

Useful commit point: `Extract public quest lookup into reusable helper`.

Next, prepare journal-friendly mission records with IDs, titles, and completion flags in a separate function, then use those records from the exploration script before integrating Flask.

## Journal-friendly mission records

On 6 October 2026, the guide reviewed my `build_mission_records(quests, completed_ids)` function and its caller. It builds a new list of dictionaries containing `id`, `title`, and a Boolean `completed`, using quest-ID membership to choose the flag. The exploration script imports and calls it, then prints the prepared records. This code is correctly connected; a runtime result for this specific version has not yet been reported or independently verified.

**I learned:** Data preparation can be a separate function that takes existing data and returns a new structure without making requests or prompting. The API uses `name`, while the journal uses `title`; this function translates between them. Membership expressions already return Booleans, so `is_completed = quest['id'] in completed_ids` can replace the longer if/else. The initial `None` assignment is unnecessary because both branches overwrite it.

Explanatory comments should be added to this new function. Suggested checks: all three real IDs produce `True`; using `{77}` as a temporary comparison set produces two `False` values and one `True`. A `False` means not reported complete, rather than proof the mission was never completed.

Useful commit point after checking: `Prepare mission records for journal display`. Next, configure the Flask process to read its API key and character name from environment variables, keeping terminal prompts in the exploration script.

## Environment configuration: implementation reviewed, check pending

I reported following the terminal steps to export `GW2_API_KEY` and `GW2_CHARACTER_NAME`. The guide confirmed `app.py` imports `os` and reads both settings inside `chronicle()`. These values are not yet used by an API request, so the page still displays practice chapters.

**I learned:** Environment variables are named configuration values supplied to a running process. `read -s` collects the key without displaying input; `export` allows programs launched from that shell to inherit the value. `os.environ.get` reads a value in Python and returns `None` when it is absent. This is separate from an `.env` file; these terminal commands do not create one.

An already-running Flask process does not gain later shell changes, so it must be restarted from the configured terminal. A different terminal or a fresh shell may need the variables set again.

Suggested verification: run the project's Python from the configured WSL terminal and print only whether each variable contains a nonblank value. Do not print the key. Then restart Flask in that terminal and temporarily report only the same presence checks inside the route. Presence checks do not establish that the key is valid or has the necessary permissions; that requires an API request. Runtime verification remains pending.
