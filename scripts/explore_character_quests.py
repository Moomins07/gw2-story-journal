# Read a secret without displaying it in the terminal.
from getpass import getpass

from gw2_api import get_character_quest_ids, get_quests, build_mission_records

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

# Collect mission records under their parent story IDs.
story_groups = {}

for mission in missions:
  
    # Read the parent story for this mission.
    story_id = mission["story_id"]

    # Check if story id is in story_groups dict
    if story_id not in story_groups:#
        #create empty list for that story_id
        story_groups[story_id] = []
    
    #append mission to empty list in story_groups
    story_groups[story_id].append(mission)

# Inspect the groups before using them on the website.
print(story_groups)
    

