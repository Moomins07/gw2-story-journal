# 06 — Preserving story relationships and grouping missions

Recorded: 7 October 2026.

## Step 1: Preserve the parent story ID

I added `"story_id": quest['story']` to the dictionary created by `build_mission_records()`. The guide reviewed the saved code and confirmed that mission records now retain this relationship. The updated script's runtime output has not yet been supplied or independently verified.

**I learned:** A field here means a named dictionary entry: a key and its value. The API field `story` becomes the journal field `story_id`, just as `name` becomes `title`. A mission ID and its parent story ID identify different records.

Preserving the story ID lets later code group missions belonging to the same story and look up that story's name. It does not establish story order, applicable branches, or a complete progress percentage.

Remaining readability task: add a comment explaining the parent-story relationship and format the dictionary over multiple lines.

## Next exercise

Build a dictionary mapping each story ID to a list of its mission records. Start in the exploration script so the grouping can be inspected before it changes Flask or the frontend. This exercise is not yet completed.

## Step 2: Group mission records

I implemented the loop in the exploration script. It reads each mission's story ID, creates an empty list only when that ID is absent, and appends the mission outside the conditional. The guide reviewed this logic and found it correct. Runtime output for this grouping has not yet been supplied or independently verified.

**I learned:** The conditional initializes a group once; the append runs for every mission. Placing the append inside the conditional would keep only the first mission per story. Reinitializing the list every iteration would keep only the last. This creates a dictionary of lists without changing the original mission list.

Suggested check: confirm the total number of grouped missions equals the input count. Also use a small local fixture with two missions sharing a story ID and a third with a different story ID; expect two groups, containing two and one records. No API call is needed to check this data transformation.

Remaining cleanup: replace completed TODO comments with descriptions of the implemented behavior. Useful commit point after checking: `Group mission records by parent story`.

### Reported grouping result

I supplied output with one dictionary key, `1`, whose value is a list containing Chain of Command, Time for a Promotion, and Fury of the Dead. All three mission records have `story_id: 1` and `completed: True`. This confirms the reported run retained all three missions in the same group. A multiple-story fixture has not yet been checked.

Next, look up the parent story's readable name through a reusable public story request helper. Story 1 was previously observed as `My Story`; grouping by this ID is not yet grouping by the individual chapter names within that story.

## Step 3: Fetch parent story descriptions

I added `get_stories(story_ids)` using the public `/v2/stories` endpoint. It converts IDs to strings, joins them, passes the resulting value as the `ids` parameter, checks the response, and returns JSON. The exploration script collects `list(story_groups.keys())` and calls the helper.

The guide reviewed the helper and caller and found their connections correct. I reported that it appeared to work, but have not supplied the returned story record for this version; the guide did not independently execute it.

**I learned:** Dictionary keys provide the unique story IDs already discovered during grouping. Fetching public story descriptions lets us replace numeric group labels with readable names. The helper's local result is currently named `quests`; renaming it to `stories` improves clarity without changing behavior.

Useful commit point after checking: `Fetch parent story descriptions for mission groups`. Next, combine each story description with its matching mission list using the story ID, not list position.

## Step 4: Combine story names and mission groups

I supplied successful script output containing one journal record: ID 1, title `My Story`, and a `missions` list with Chain of Command, Time for a Promotion, and Fury of the Dead. Each mission retains its ID, story ID, and `completed: True`. This is user-reported execution evidence; the guide did not independently run the authenticated script.

**I learned:** `stories` contains API descriptions, while `story_groups` is a dictionary built by my own code. `story_groups[story['id']]` uses the shared ID to retrieve the matching prepared mission list. The combined record must be appended inside the story loop so every story is retained.

I initially used `story['chapters']` as the mission list. Those are chapter-name records, not the prepared missions with completion flags. In the game, chapters contain missions, but quest records link directly to a parent story without an explicit chapter ID. We deliberately paused chapter mapping to keep this exercise manageable.

The current structure is story → selected missions. It does not represent the complete story catalogue, chronological mission order, or chapter completion. Next, extract this already-working grouping and combination into reusable functions, one at a time, then render the same structure on the Chronicle page.

Useful commit point: `Combine story titles with grouped mission records`. Blog idea: understanding the difference between an API response and a data structure I build from it.

## Extracting the grouping helper and restoring the caller

I moved the mission-grouping loop into `group_missions_by_story(missions)` in `gw2_api.py`. The guide reviewed the corrected helper; I subsequently reported its grouping result working. The loop stays in the helper and is replaced by one function call in the exploration script.

During this refactor, I accidentally removed the separate story-combination loop. At my explicit request, the guide restored it with explanatory comments. The guide also restored the story-description request and moved the grouping call before `story_groups.keys()`, so the dictionary exists before it is used.

The restored sequence is: prepare missions → group missions → collect story IDs → fetch story descriptions → combine named stories with mission lists → print the result. The authenticated script has not been independently run after this restoration.

**I learned:** Refactoring relocates behavior; the helper's loop still runs when called. Grouping and adding story names are separate jobs. Variables must be created before later statements use them.

### Restoration verified by the user

After initially sharing output from the grouping stage, I reran the script and supplied the combined list containing `My Story` and all three prepared missions with completion flags. This confirms the restored flow in the user-reported run; the guide did not independently execute the authenticated script. The grouping-helper extraction and caller restoration are now complete.

Useful commit point: `Extract mission grouping helper and preserve named story output`.

## Step 5: Extract story combination

I moved the named-story construction loop into `build_journal_stories(stories, story_groups)` in `gw2_api.py`. It creates a list, builds each record using the story ID and name, attaches the matching mission list by ID, appends inside the loop, and returns after the loop. The exploration script imports and calls it after fetching story descriptions.

The guide reviewed the helper and caller and found their structure and execution order correct. I reported completing the changes; unchanged runtime output for this specific refactor has not yet been supplied or independently verified.

**I learned:** Functions receive the data they need through parameters and return prepared data to their caller. This helper makes no HTTP requests and performs no printing. Keeping the transformation separate lets both the script and Flask reuse it.

Remaining readability improvement: add a purpose comment above the helper definition. Suggested check: rerun the script and confirm the same `My Story` record and three missions. Useful commit point: `Extract journal story preparation helper`.

Next, call these shared helpers from the Chronicle route, keeping its existing failure handling, before updating the frontend to show nested stories and missions.

## Step 6: Prepare named story groups in Flask

I imported the grouping, story-request, and story-combination helpers into `app.py`. Inside the existing try block, the Chronicle route groups prepared missions, collects story IDs, fetches descriptions, and builds `journal_stories`. The guide reviewed the sequence and found it correct. Runtime behavior for this route change has not yet been reported or independently verified.

I placed `request_stage = "story descriptions"` before `get_stories(story_ids)`. This correctly identifies a failure in that request. The variable labels the next operation for the exception logger; it does not initiate an API request.

The successful return deliberately still passes `missions` as `chapters`, so the current frontend remains unchanged. `journal_stories` is prepared but not yet passed to the template. Next, update the template contract and rendering together, including the error returns, to display stories containing missions.

## Step 7: Display nested stories and missions

I passed `journal_stories` into the successful template response as `stories`, and added `stories=[]` to both error returns. The existing `chapters` variable remains for the total mission count.

In `chronicle.html`, I added an outer Jinja loop over stories, displayed each story title, and changed the inner loop to use `story.missions`. Each story now has its own mission list. The guide reviewed the saved route and loop boundaries and found them correctly connected. I reported the page working; the guide did not independently run the authenticated page.

**I learned:** This is a Jinja template loop within HTML, rather than XML. The outer loop chooses a story and the inner loop renders that story's missions. Passing empty lists on error paths keeps the template's inputs consistent. The inner `loop.index` starts again for each story and is a display counter, not an API mission ID or verified story order.

Remaining readability task: comment the outer loop's purpose. Useful commit point: `Display story headings above grouped missions`. We still display only three selected missions; chapter mapping and wider catalogue coverage are separate future steps.

## Sampling character IDs and loading script configuration

I updated the exploration script to call `load_dotenv()` before reading the key and character name through `os.environ.get`. It exits with a clear message if either setting is missing or blank. The guide reviewed this order without reading the secret file.

I changed the sample to `selected_quest_ids = character_quest_ids[:10]`, then passed those IDs to `get_quests` once. Initially, I assigned the result of `get_quests` to `selected_quest_ids` and passed those mission dictionaries into another request; the corrected code keeps IDs and descriptions separate.

**I learned:** Flask's CLI loads dotenv configuration automatically when supported, but an ordinary script must explicitly load it. Slicing chooses a sample without making a request. A variable's name does not determine its type; the expression assigned to it does.

The current script was reviewed as correctly connected for the existing nonempty character response. The updated runtime output has not yet been supplied or independently verified. Suggested check: run without prompts and confirm the grouped output contains up to ten mission records, all reported complete. Their sample position is not verified play order. Empty character responses will need a separate guard before requesting descriptions.

Readability cleanup remains: remove the unused getpass import and its comment, and explain dotenv loading, configuration validation, and the sample selection with comments. Useful commit point after checking: `Load exploration settings from dotenv and sample character missions`.

At my request, the guide updated the exploration script's comments to explain each stage in plain language, including settings loading, validation, the distinction between IDs and descriptions, sampling, grouping, and matching stories by ID. The unused getpass import had already been removed. This documentation-only edit did not change the script's behavior or independently verify API results.

### Ten-mission sample verified by the user

I supplied a successful script run without key or character prompts. It returned one named story, `My Story`, containing ten mission records with IDs 71, 72, 74, 75, 76, 77, 88, 89, 90, and 91, all marked completed. The guide checked the supplied output; it did not independently execute the authenticated request.

This confirms the sample flow and local dotenv setup in the reported run. It does not verify chronological order, full story coverage, or unfinished mission selection. Next, apply the same limited selection in Flask while preserving the original character-ID list before converting it to a set.

## Ten-mission sample in Flask: code reviewed

I updated `chronicle()` to retain `character_quest_ids`, create a membership set from it, slice up to ten IDs, and pass that sample to `get_quests`. The existing preparation, grouping, story requests, and rendering remain connected. The guide reviewed this flow as correct for the current nonempty character response. Browser output for this route change has not yet been reported or independently verified.

**I learned:** The same data can have two useful representations: a list for sampling by slice and a set for membership checks. The list's order does not establish play chronology. Selected missions all come from the character progress list, so this page is currently a sample of reported completed missions, not a complete checklist.

Readability cleanup: replace the obsolete three-mission comment and explain the initial character request. Suggested check: refresh the Chronicle and confirm ten cards and a count of ten. A separate empty-response guard is still needed before public lookups to handle characters with no reported quests. Useful commit point after checking: `Display a sample of character missions in Chronicle`.

At my request, the guide expanded `app.py` comments to explain Flask setup, each route, environment configuration, early returns, API requests, list/set roles, mission preparation, grouping, safe failure diagnostics, and the template inputs. The obsolete three-mission description was removed. This comment-only change preserved application behavior; it did not independently verify browser output.

## Git and blog ideas

Useful commit point after checking: `Preserve parent story IDs in mission records`.

Blog idea: how retaining an API relationship lets a flat mission list become a grouped journal. This contributes Python data modelling and dictionary practice to the Boot.dev project.
