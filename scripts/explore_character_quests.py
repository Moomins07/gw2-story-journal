# Read a secret without displaying it in the terminal.
from getpass import getpass

# Send HTTP requests to GW2.
import requests

from gw2_api import get_character_quest_ids

# Keep the key in memory for this script run.
api_key = getpass("GW2 API key: ").strip()

# Enter the character's exact in-game name.
character_name = input("Character name: ").strip()

# Convert the JSON response into Python data.
# Retrieve character progress using the shared request function.
character_quest_ids = get_character_quest_ids(api_key, character_name)

# Prepare efficient membership checks.
completed_ids = set(character_quest_ids)

quest_response = requests.get(
    "https://api.guildwars2.com/v2/quests",
    params={"ids": "71,72,77"},
    timeout=10,
)

# Check success before converting the JSON into a list of dictionaries.
quest_response.raise_for_status()
quests = quest_response.json()

for quest in quests:

    if quest['id'] in completed_ids:
        quest['status'] = "complete"
    else:
        quest['status'] = "not reported complete"

    print(quest['name'], quest['status'])
    

