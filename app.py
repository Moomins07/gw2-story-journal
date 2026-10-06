from flask import Flask, render_template, jsonify
import os
# Reuse API requests and journal data preparation.
from gw2_api import get_character_quest_ids, get_quests, build_mission_records
# Catch expected HTTP and network failures from Requests.
from requests.exceptions import RequestException

app = Flask(__name__)


def get_practice_chapters():
    return [{'id': 1, 'title': "Chapter 1"},
    {'id': 2, 'title': 'Chapter 2'},
    {'id': 3, 'title': 'Chapter 3'},
    ]


@app.get("/")
def home():
    return render_template("index.html")

@app.get("/chronicle")
def chronicle():
    api_key = os.environ.get("GW2_API_KEY")
    character_name = os.environ.get("GW2_CHARACTER_NAME")

    # Stop before making API requests if either required setting is blank or missing.
    if not api_key or not api_key.strip() or not character_name or not character_name.strip():
        # Render a useful message with no mission records.
        return render_template(
            "chronicle.html",
            chapters=[],
            error="The journal needs a GW2 API key and character name configured.",
            error_code=503
        ), 503

    # Track which request fails without logging keys or request headers.
    request_stage = "character progress"
    try:
    # Retrieve the character's reported progress and prepare membership checks.
        completed_ids = set(get_character_quest_ids(api_key, character_name))

    # Fetch three mission descriptions while testing the website connection.
        # Identify failures in the public mission request separately.
        request_stage = "mission descriptions"
        quests = get_quests([71, 72, 77])

    # Prepare the titles and completion flags expected by the journal.
        missions = build_mission_records(quests, completed_ids)
    except RequestException as error:
        # Failed HTTP responses are falsey, so check explicitly for None.
        status = error.response.status_code if error.response is not None else "no HTTP response"
        # Log only the stage, exception type, and status; keep secrets out of diagnostics.
        app.logger.warning(
            "GW2 API failure: stage=%s, type=%s, status=%s",
            request_stage, type(error).__name__, status,
        )
        return render_template(
            "chronicle.html",
            chapters=[],
            error="Unable to load mission progress from the GW2 API. Please try again later.",
            error_code=502
        ), 502

    # Supply real mission records to the existing template loop.
    return render_template("chronicle.html", chapters=missions)

@app.get("/api/chapters")
def get_chapters():
    
    chapters = get_practice_chapters()
    
    return jsonify(chapters)



