# Read a secret without displaying it in the terminal.
from getpass import getpass

# Encode character names safely for use inside a URL.
from urllib.parse import quote

# Send HTTP requests to GW2.
import requests

# Keep the key in memory for this script run.
api_key = getpass("GW2 API key: ").strip()

# Enter the character's exact in-game name.
character_name = input("Character name: ").strip()

# Encode spaces and other characters as part of one URL segment.
encoded_name = quote(character_name, safe="")

# Request this character's quest IDs.
response = requests.get(
    f"https://api.guildwars2.com/v2/characters/{encoded_name}/quests",
    headers={"Authorization": f"Bearer {api_key}"},
    timeout=10,
)

# Raise an error for unsuccessful HTTP status codes before parsing JSON.
response.raise_for_status()

# Convert the JSON response into Python data.
character_quest_ids = response.json()

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
    