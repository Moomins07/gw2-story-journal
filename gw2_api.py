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

    # This endpoint returns numeric quest IDs, not public mission descriptions.
    character_quest_ids = response.json()

    # Return character-specific progress to the caller.
    return character_quest_ids


# Fetch API quest records: individual missions containing goals, not chapters.
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


# Fetch literal API story records; their chapters field may contain names or be empty.
# An API story is not always an entire expansion or the journal's act grouping.
def get_stories(story_ids):
    # Collect the IDs as strings because join requires string values.
    id_strings = []

    # Convert each integer and add it to the list.
    for story_id in story_ids:
        id_strings.append(str(story_id))

    # Put a comma between each string, with no trailing comma.
    ids_parameter = ",".join(id_strings)

    response = requests.get(
    "https://api.guildwars2.com/v2/stories",
    params={"ids": ids_parameter},
    timeout=10,
)

    response.raise_for_status()

    # Convert the JSON response into Python data.
    stories = response.json()
    
    return stories


# Translate API quests into journal missions while preserving their API story IDs.
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


# Group missions by the API quest's story reference; this does not map them to acts.
def group_missions_by_story(missions):
    story_groups = {}

    for mission in missions:
        story_id = mission["story_id"]

        if story_id not in story_groups:#
            story_groups[story_id] = []

        story_groups[story_id].append(mission)

    return story_groups


# Add API story names to mission groups; API chapter metadata is a separate field.
def build_journal_stories(api_stories, story_groups):
    journal_stories = []

    for story in api_stories:
        # Create one journal record using the API story's ID and name.
        journal = {}
        journal["id"] = story["id"]
        journal["title"] = story["name"]

        # Match prepared missions by story ID rather than by list position.
        journal["missions"] = story_groups[story["id"]]

        # Retain every combined record, not just the last story in the loop.
        journal_stories.append(journal)

    return journal_stories




# Combine a catalogue act with prepared missions in catalogue order.
def build_journal_act(act, missions):
    # Create a lookup to retrieve each complete mission dictionary by its quest ID.
    missions_by_id = {}

    for mission in missions:
        # Store the entire mission dictionary under its numeric quest ID for later lookup.
        missions_by_id[mission['id']] = mission


    # Build the display list in the order defined by the act catalogue.
    ordered_missions = []

    for quest_id in act["quest_ids"]:
        # Add available mission dictionaries in catalogue order; missing records are skipped.
        if quest_id in missions_by_id:
            ordered_missions.append(missions_by_id[quest_id])
    

    # Start at zero and count only missions whose character-progress flag is True.
    # Return this count with the act so Flask and the script can share the summary.
    completed_count = 0
    for mission in ordered_missions:
        if mission['completed'] == True:
            completed_count += 1
   

    journal_act = {
        "id": act['id'],
        "title": act['title'],
        "missions": ordered_missions,
        "completed_count": completed_count,
        "mission_count": len(ordered_missions)
    }

    

    # Return the finished act dictionary to the script or Flask route that called us.
    return journal_act
