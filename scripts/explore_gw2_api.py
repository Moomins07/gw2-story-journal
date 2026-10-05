# Use Requests to communicate with an external HTTP API.
import requests

# Request one public story record; no API key is needed here.
response = requests.get(
    "https://api.guildwars2.com/v2/stories/1",
    timeout=10,
)

# Raise an error for unsuccessful HTTP status codes before parsing JSON.
response.raise_for_status()

# Convert the JSON response into Python data.
story = response.json()

# Inspect the record before deciding how the journal should use it.
print(story)