# Read settings from this Python process's environment.
import os
# Load local settings from .env when the script starts.
from dotenv import load_dotenv

# Reuse the functions that request GW2 data and prepare it for the journal.
from gw2_api import load_journal_act

from journal_catalog import act

# Unlike Flask's startup command, this script must explicitly load .env.
# Existing environment settings take precedence over values in the file.
load_dotenv()

# Read the key and character name without prompting or displaying the key.
api_key = os.environ.get("GW2_API_KEY")
character_name = os.environ.get("GW2_CHARACTER_NAME")

# Stop before making requests if either setting is missing, empty, or only spaces.
if not api_key or not api_key.strip() or not character_name or not character_name.strip():
    raise SystemExit("Configure GW2_API_KEY and GW2_CHARACTER_NAME in .env.")


journal_act = load_journal_act(api_key, character_name, act)

print(journal_act)


   


    
