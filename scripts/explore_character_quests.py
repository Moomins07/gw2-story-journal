# Read a secret without displaying it in the terminal.
from getpass import getpass

from gw2_api import get_character_quest_ids, get_quests, build_mission_records, get_stories, group_missions_by_story, build_journal_stories

# Keep the key in memory for this script run.
api_key = getpass("GW2 API key: ").strip()

# Enter the character's exact in-game name.
character_name = input("Character name: ").strip()

# Convert the JSON response into Python data.
# Retrieve character progress using the shared request function.
character_quest_ids = get_character_quest_ids(api_key, character_name)

# Prepare efficient membership checks.
completed_ids = set(character_quest_ids)

quests = get_quests([71, 72, 77])

# Combine mission descriptions with this character's reported progress.
missions = build_mission_records(quests, completed_ids)

# Group prepared missions using the shared helper.
story_groups = group_missions_by_story(missions)

# Collect parent story IDs after the grouping dictionary has been created.
story_ids = list(story_groups.keys())

# Request the descriptions used to give each group a readable story name.
stories = get_stories(story_ids)

# Collect named stories with their matching mission lists.

journal_stories = build_journal_stories(stories, story_groups)

# Inspect the combined story and mission structure.
print(journal_stories)


   


    
