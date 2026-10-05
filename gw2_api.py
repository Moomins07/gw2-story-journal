# Encode character names safely inside URLs.
from urllib.parse import quote

# Send HTTP requests to Guild Wars 2.
import requests



# Return the quest IDs reported for one character.
def get_character_quest_ids(api_key, character_name):
    # Encode this character's name as one URL segment.
    encoded_name = quote(character_name, safe="")

    # Include the Authorization header and timeout.
    response = requests.get(
    f"https://api.guildwars2.com/v2/characters/{encoded_name}/quests",
    headers={"Authorization": f"Bearer {api_key}"},
    timeout=10,
)
    # Raise an error for unsuccessful HTTP status codes before parsing JSON.
    response.raise_for_status()

    # Convert the JSON response into Python data.
    quests = response.json()

    # Inspect the record before deciding how the journal should use it.
    return quests