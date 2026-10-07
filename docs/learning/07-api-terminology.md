# 07 — Clear API and journal terminology

Recorded: 7 October 2026.

## Why we clarified the names

I noticed that API story 1, `My Story`, contains a `chapters` list naming Getting the Band Back Together, Sins of the Father, and Crystal Corruption. These larger sections are what I had been calling acts. My existing template also called individual missions `chapter`, which made the distinction harder to understand.

At my request, the guide renamed the flat Chronicle template input from `chapters` to `missions`, including both error responses and the mission count. The inner loop now uses `mission`, not `chapter`. Raw story descriptions are named `api_stories` in the route, exploration script, and combination helper. The character request helper now names its returned numeric list `character_quest_ids`. Comments explain the different levels.

## Names to use

| Name | Meaning |
| --- | --- |
| API season | A catalogue grouping from `/v2/stories/seasons`; useful for expansion/season storyline selection. |
| API story | A record from `/v2/stories`; the quest's `story` field references its ID. |
| API chapters | The literal `chapters` array inside a story record; may contain chapter names or be empty. |
| Quest / mission | A record from `/v2/quests`, such as Fury of the Dead. Our prepared display records are called missions. |
| Goal | An objective inside a quest's `goals` array. Its `complete` text is a narrative, not a character completion flag. |
| Journal act | A desired navigation and note grouping in our site concept, whose mapping must be verified for each storyline. |
| story_groups | Our own dictionary mapping API story IDs to prepared mission lists. It is not an API field. |

## Important difference between examples

For the Charr personal story, API story 1 is called My Story and has three named chapters. That example does not establish the hierarchy for every expansion. The API documentation also shows story 41 named `3. Establishing a Foothold`, under the Heart of Thorns season, with an empty `chapters` array. In-game Heart of Thorns Act I groups several missions, including Establishing a Foothold. Therefore we should not globally rename API stories to expansion storylines or API chapters to acts.

Sources: [Story API examples](https://wiki.guildwars2.com/wiki/API:2/stories), [quest fields](https://wiki.guildwars2.com/wiki/API:2/quests), [Heart of Thorns act grouping](https://wiki.guildwars2.com/wiki/Heart_of_Thorns_story).

## What I learned

API terminology and screen labels can differ. Keep literal API names at the request boundary and use explicit journal names when transforming data. A chapter-name list does not itself contain mission IDs or goals. Our current output remains API story → selected missions; it is not yet the final storyline → act/chapter → mission hierarchy.

The original `/api/chapters` exercise remains unchanged because it intentionally returns sample chapter data and is separate from the real Chronicle.

## Verification and next step

The guide checked renamed references in the source, verified Python syntax for the three changed Python files, and exercised the data-preparation helpers with a local fixture preserving a completed mission under My Story. A template-rendering check could not run because the available bundled Python lacks Jinja2. The authenticated page still needs refreshing to confirm the same titles, mission count, and completion labels; no authenticated API request was run by the guide.

Useful commit point: `Clarify API story chapter and mission terminology`.

Next, verify the actual Heart of Thorns act-to-mission mapping before building navigation and progress totals from it. This contributes data modelling and readable naming to the Boot.dev project.

## Catalogue scaffold reviewed

I created `journal_catalog.py` with an `act` dictionary containing local ID `heart-of-thorns-act-1`, title `Act 1`, and an empty `quest_ids` list. After correcting a missing quote in the title key, the guide reviewed the scaffold as correct. A purpose comment remains to be added.

The local ID identifies a journal group, not an API story, chapter, or quest. The checklist's quest IDs will be verified independently of character progress so missions absent from a character response can still be displayed. Next, populate this one act using the documented Heart of Thorns Act 1 mission mapping, then inspect its public quest records before integrating it into Flask.

## Act 1 checklist selected in the exploration script

The guide reviewed the catalogue containing `[411, 409, 419, 405, 421, 410]` and the script's `selected_quest_ids = act['quest_ids']`. The public quest request now uses the intended Act 1 checklist, while completion is still compared with the character's full progress set.

The script's final output still groups by API story IDs, so it may display several API story titles rather than a single Act 1 heading. This does not itself indicate incorrect quests. Suggested diagnostic: print each returned quest's ID and name immediately after `get_quests`, before grouping. The latest output has not yet been supplied or independently verified.

The comments about selecting ten IDs and all selected IDs coming from character progress are now obsolete. Catalogue selection defines expected missions independently of completion. API response order also needs checking before assuming it matches the catalogue's desired order.

### Act 1 mission lookup verified by the user

I supplied output containing all six expected IDs and names. The returned order was 405, 409, 410, 411, 419, 421, different from the catalogue's intended narrative order. All six were reported complete for Kihto in this run.

The output also showed six distinct API story records, one for each selected mission. This directly demonstrates why grouping by API story is different from grouping the six missions into the journal's Act 1. The guide checked this supplied output but did not independently make authenticated requests.

Next exercise: index prepared missions by quest ID and assemble an ordered list by walking the catalogue IDs. This preserves the journal's order without relying on the API response order. A named act record can then contain that ordered list.

## Ordering the mission dictionaries: code reviewed

I created `missions_by_id` and stored each entire mission dictionary under its numeric ID. I then iterated over the catalogue's quest IDs and appended matching dictionaries to `ordered_missions`. The guide reviewed both loops as correct. Runtime output for this ordering step has not yet been supplied or independently verified.

**I learned:** A record here simply means one dictionary containing a mission's fields. Indexing by ID lets me retrieve the whole dictionary, not just its title. Walking the catalogue list determines the resulting display order.

My `if quest_id in missions_by_id` check skips records missing from the public API response. It prevents a KeyError but also means missing data needs explicit handling before calculating completion totals. An unavailable mission description is not the same as a mission absent from character progress.

The old API-story grouping still uses `missions`, not `ordered_missions`; this exercise currently orders the printed list only. Suggested check: print the six IDs in catalogue order, starting with 411 and ending with 410. Update obsolete comments about ten IDs and guaranteed completion, and replace completed TODO comments with descriptions.

At my request, the guide replaced those obsolete comments and completed TODOs in the exploration script. The comments now explain catalogue selection, independent completion checks, indexing whole mission dictionaries, and skipping unavailable records during ordering. This comment-only change preserves behavior.

## Combining the act with its missions

I created `journal_act` with the catalogue's `id` and `title`, and assigned `ordered_missions` to its `missions` field. This gives the journal one Act 1 dictionary containing its mission checklist in narrative order. The catalogue supplies the grouping and order; the prepared mission dictionaries supply titles and character completion flags.

The guide reviewed this code as correct, checked the script's Python syntax, and exercised the actual ordering and act-building statements with local sample dictionaries in reverse order. The resulting IDs matched the catalogue, and completion flags were preserved. This was an offline check, not an authenticated GW2 request. Live output for this step has not yet been supplied.

The script still performs the earlier API-story grouping after printing `journal_act`. That code is a separate exploration and is not needed to build this act. Next, move act preparation into a reusable helper so the script and Flask can share it without copying the loops. Keep API requests outside that helper.

Useful commit point after checking the live script output: `Build ordered journal act from mission records`. This contributes original Python data modelling and reusable functions toward the Boot.dev project, and offers a blog topic: turning API records into the structure a journal page needs.

## Extracting the reusable act helper

I moved the lookup, ordering, and act dictionary creation into `build_journal_act(act, missions)` in `gw2_api.py`. The exploration script imports and calls this helper, then prints its returned dictionary. The helper makes no API requests: it transforms data already supplied by its caller.

The guide reviewed the extraction as correct. I supplied live script output showing Act 1 with all six missions in catalogue order: 411, 409, 419, 405, 421, 410. All six completion flags were True in this run. This is user-reported authenticated output, not a live request independently made by the guide.

This refactor preserves the result while allowing Flask to reuse the same preparation. Some exercise comments still need cleanup: replace the instruction to move code with an explanation of the lookup, place the return explanation above the return, and describe the script's helper call as preparing the whole act. The earlier API-story exploration still runs separately after the print.

Useful commit point: `Extract reusable journal act builder`. Next, connect catalogue selection and this helper to Flask, then adapt the template to consume the act. This adds original reusable Python code toward the Boot.dev requirements.
