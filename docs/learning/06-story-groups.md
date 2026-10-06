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

## Git and blog ideas

Useful commit point after checking: `Preserve parent story IDs in mission records`.

Blog idea: how retaining an API relationship lets a flat mission list become a grouped journal. This contributes Python data modelling and dictionary practice to the Boot.dev project.
