# Flask handles requests; render_template produces HTML and jsonify produces JSON.
# abort stops a request with an HTTP error, such as 404 for an unknown act.
from flask import Flask, render_template, jsonify, abort
# Read configuration supplied to this Python process.
import os
# Reuse our helpers for requesting GW2 data and preparing journal records.
from gw2_api import load_journal_act

# Use the catalogue's expected checklist independently of character completion.
from journal_catalog import act

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

# Register the page showing the catalogue act and this character's mission progress.
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
            acts=[],
            error="The journal needs a GW2 API key and character name configured.",
            error_code=503
        ), 503

    # Label the next request for diagnostics; this assignment makes no API call.
    request_stage = "act loading"
    try:
        # Load the expected missions and prepare this character's ordered act progress.
        journal_act = load_journal_act(api_key, character_name, act)
        


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
            acts=[],
            error="Unable to load mission progress from the GW2 API. Please try again later.",
            error_code=502
        ), 502

    # Jinja builds the final HTML before Flask sends it to the browser.
    # missions supplies the displayed mission count; acts supplies the outer template loop.
    # Wrap the single prepared act in a list so each loop item is an act dictionary.
    return render_template(
        "chronicle.html",
        missions=journal_act["missions"],
        acts=[journal_act],
    )


# Capture the journal act ID from the URL and pass it to the function below.
@app.get("/chronicle/acts/<act_id>")
def chronicle_acts(act_id):

    # Render the shared journal template only for an ID present in our catalogue.
    if act_id == act['id']:
        # Supply catalogue data for now; live mission progress will be connected next.
        return render_template(
            "acts_journal.html",
            journal_act=act
            )

    # Stop unknown act requests with Flask's Not Found response.
    abort(404)
    


    

# Keep the practice JSON endpoint independent from the real Chronicle page.
@app.get("/api/chapters")
def get_chapters():
    
    # Obtain sample records locally; this route does not call the GW2 API.
    chapters = get_practice_chapters()
    
    # Send JSON data instead of rendering an HTML page.
    return jsonify(chapters)
