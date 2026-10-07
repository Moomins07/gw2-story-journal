# Read settings from this Python process's environment.
import os
# Load local settings from .env when the script starts.
from dotenv import load_dotenv

# Reuse the functions that request GW2 data and prepare it for the journal.
from gw2_api import get_character_quest_ids, get_quests, build_mission_records, get_stories, group_missions_by_story, build_journal_stories, build_journal_act

from journal_catalog import act

# Unlike Flask's startup command, this script must explicitly load .env.
# Existing environment settings take precedence over values in the file.
load_dotenv()

# Read the key and character name without prompting or displaying the key.
api_key = os.environ.get("GW2_API_KEY")
character_name = os.environ.get("GW2_CHARACTER_NAME")

# Stop before making requests if either setting is missing, empty, or only spaces.
if not api_key or not api_key.strip() or not character_name or not character_name.strip():
    raise SystemExit("Configure GW2_API_KEY and GW2_CHARACTER_NAME in .env.")

# Request the quest IDs reported by GW2 for this character.
# These are numbers identifying missions, not mission names or descriptions.
character_quest_ids = get_character_quest_ids(api_key, character_name)

# Use a set to efficiently check whether a mission ID is reported complete.
completed_ids = set(character_quest_ids)

# Select the act's expected mission IDs from our journal catalogue.
# This checklist is independent of which missions the character has completed.
selected_quest_ids = act['quest_ids']

# Look up the selected IDs to get public mission names and parent story IDs.
quests = get_quests(selected_quest_ids)

# Prepare journal records: id, title, story_id, and a completed flag.
# Completion is checked against character progress, not assumed from catalogue selection.
missions = build_mission_records(quests, completed_ids)

# Prepare the act's ordered mission checklist and reusable progress counts.
journal_act = build_journal_act(act, missions)
# Check whether the available mission records cover the catalogue's expected checklist.
print(f"Expected: {journal_act['expected_count']}  Missing:{journal_act['missing_count']}")


# Display the progress summary returned by the reusable helper.
print(f"{journal_act['completed_count']} of {journal_act['mission_count']}")


# Build a dictionary whose keys are story IDs and values are mission lists.
story_groups = group_missions_by_story(missions)

# Extract the dictionary's unique story IDs for the next API request.
story_ids = list(story_groups.keys())

# Fetch public story descriptions so numeric group IDs can have readable titles.
api_stories = get_stories(story_ids)

# Match each story description to its mission list using the shared story ID.
# The result is a list of records containing id, title, and missions.
journal_stories = build_journal_stories(api_stories, story_groups)

# Print the prepared journal data for inspection; never print the API key.
# print(journal_stories)


   


    
