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


def get_quests(quest_ids):
    # Collect the IDs as strings because join requires string values.
    id_strings = []

    # Convert each integer and add it to the list.
    for quest_id in quest_ids:
        id_strings.append(str(quest_id))

    # Put a comma between each string, with no trailing comma.
    ids_parameter = ",".join(id_strings)

    response = requests.get(
    "https://api.guildwars2.com/v2/quests",
    params={"ids": ids_parameter},
    timeout=10,
)

    response.raise_for_status()

    # Convert the JSON response into Python data.
    quests = response.json()
    
    return quests



def build_mission_records(quests, completed_ids):
    missions = []

    for quest in quests: 
        is_completed = None
        if quest['id'] in completed_ids:
            is_completed = True
        else: is_completed = False

        missions.append({
        "id": quest['id'], 
        "title": quest['name'], 
        "story_id": quest['story'],
        "completed": is_completed
        })

    return missions