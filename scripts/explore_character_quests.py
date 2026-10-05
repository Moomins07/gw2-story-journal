# Read a secret without displaying it in the terminal.
from getpass import getpass

from gw2_api import get_character_quest_ids, get_quests

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

for quest in quests:

    if quest['id'] in completed_ids:
        quest['status'] = "complete"
    else:
        quest['status'] = "not reported complete"

    print(quest['name'], quest['status'])
    

