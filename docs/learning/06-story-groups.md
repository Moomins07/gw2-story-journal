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

## Git and blog ideas

Useful commit point after checking: `Preserve parent story IDs in mission records`.

Blog idea: how retaining an API relationship lets a flat mission list become a grouped journal. This contributes Python data modelling and dictionary practice to the Boot.dev project.
