from flask import Flask, render_template

app = Flask(__name__)


@app.get("/")
def home():
    return render_template("index.html")

    # Provide practice chapter data for the browser to request.
@app.get("/api/chapters")
def get_chapters():
    # Each dictionary represents one chapter with an ID and title.
    chapters = [
        # TODO: Add two dictionaries containing "id" and "title".
        {'01': 'Chapter 1'},
        {'02': 'Chapter 2'}

    ]

    # TODO: Return the list as a JSON response using jsonify.
    for chapter in chapters:
        return jsonify(chapter)