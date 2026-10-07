# Flask handles requests; render_template produces HTML and jsonify produces JSON.
from flask import Flask, render_template, jsonify
# Read configuration supplied to this Python process.
import os
# Reuse our helpers for requesting GW2 data and preparing journal records.
from gw2_api import get_character_quest_ids, get_quests, build_mission_records, group_missions_by_story, get_stories, build_journal_stories
# Catch expected HTTP and network failures from Requests.
from requests.exceptions import RequestException

# Create Flask's application; __name__ helps it locate templates and static files.
app = Flask(__name__)


# Supply local sample data for the original JSON exercise, separate from the Chronicle.
def get_practice_chapters():
    return [{'id': 1, 'title': "Chapter 1"},
    {'id': 2, 'title': 'Chapter 2'},
    {'id': 3, 'title': 'Chapter 3'},
    ]


# Register the homepage function for GET requests at the root URL.
@app.get("/")
def home():
    # Render the homepage template and send the resulting HTML to the browser.
    return render_template("index.html")

# Register the page that displays a sample of this character's real mission progress.
@app.get("/chronicle")
def chronicle():
    # Flask's CLI loads .env when python-dotenv is installed; read those values here.
    # Missing settings return None. Never print the key or pass it to the template.
    api_key = os.environ.get("GW2_API_KEY")
    character_name = os.environ.get("GW2_CHARACTER_NAME")

    # Stop before making API requests if either required setting is blank or missing.
    if not api_key or not api_key.strip() or not character_name or not character_name.strip():
        # Exit before calling the API. Empty lists give the template consistent inputs.
        # error_code supplies the displayed number; the final 503 sets the HTTP status.
        return render_template(
            "chronicle.html",
            missions=[],
            stories=[],
            error="The journal needs a GW2 API key and character name configured.",
            error_code=503
        ), 503

    # Label the next request for diagnostics; this assignment makes no API call.
    request_stage = "character progress"
    try:
        # Request character-specific progress as a list of numeric quest IDs.
        # The helper checks the HTTP status and parses the returned JSON.
        character_quest_ids = get_character_quest_ids(api_key, character_name)

        # Keep a set for membership checks and the original list for selecting a sample.
        completed_ids = set(character_quest_ids)

        # Select up to ten reported IDs to limit this development sample.
        # This list slice does not fetch data or establish chronological play order.
        selected_quest_ids = character_quest_ids[:100]
        # Label and fetch public mission descriptions for the selected numeric IDs.
        request_stage = "mission descriptions"
        quests = get_quests(selected_quest_ids)

        # Prepare id/title/story_id/completed records without making another request.
        # The completed flag checks whether each mission ID appears in the character set.
        missions = build_mission_records(quests, completed_ids)

        # Build a dictionary mapping each parent story ID to its list of missions.
        story_groups = group_missions_by_story(missions)
        # Extract the unique story IDs needed for the story-description request.
        story_ids = list(story_groups.keys())

        # Label and request public story records to give the groups readable names.
        request_stage = "story descriptions"
        api_stories = get_stories(story_ids)

        # Match story descriptions to mission groups by ID, producing named story records.
        # Each record has id, title, and missions for the template's nested loops.
        journal_stories = build_journal_stories(api_stories, story_groups)

    # Handle expected Requests failures; programming errors remain visible in development.
    except RequestException as error:
        # HTTP failures have a response; network failures may have none.
        # Error responses are falsey, so check explicitly for None to preserve their status.
        status = error.response.status_code if error.response is not None else "no HTTP response"
        # Log only the stage, exception type, and status; keep secrets out of diagnostics.
        app.logger.warning(
            "GW2 API failure: stage=%s, type=%s, status=%s",
            request_stage, type(error).__name__, status,
        )
        # Return the friendly error page with no mission data.
        # HTTP 502 signals that the upstream API request failed.
        return render_template(
            "chronicle.html",
            missions=[],
            stories=[],
            error="Unable to load mission progress from the GW2 API. Please try again later.",
            error_code=502
        ), 502

    # Jinja builds the final HTML before Flask sends it to the browser.
    # missions supplies the flat quest/mission count; stories supplies prepared API story groups.
    return render_template("chronicle.html", missions=missions, stories=journal_stories)

# Keep the practice JSON endpoint independent from the real Chronicle page.
@app.get("/api/chapters")
def get_chapters():
    
    # Obtain sample records locally; this route does not call the GW2 API.
    chapters = get_practice_chapters()
    
    # Send JSON data instead of rendering an HTML page.
    return jsonify(chapters)
