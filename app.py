from flask import Flask, render_template, jsonify
import os
# Reuse API requests and journal data preparation.
from gw2_api import get_character_quest_ids, get_quests, build_mission_records

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
    # Retrieve the character's reported progress and prepare membership checks.
    completed_ids = set(get_character_quest_ids(api_key, character_name))

    # Fetch three mission descriptions while testing the website connection.
    quests = get_quests([71, 72, 77])

    # Prepare the titles and completion flags expected by the journal.
    missions = build_mission_records(quests, completed_ids)

    # Supply real mission records to the existing template loop.
    return render_template("chronicle.html", chapters=missions)

@app.get("/api/chapters")
def get_chapters():
    
    chapters = get_practice_chapters()
    
    return jsonify(chapters)




