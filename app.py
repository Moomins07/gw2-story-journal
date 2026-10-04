from flask import Flask, render_template, jsonify

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
        {"id": 1,"title": 'Chapter 1'},
        {"id": 2,"title": 'Chapter 2'}
        

    ]

    # TODO: Return the list as a JSON response using jsonify.
  
    return jsonify(chapters)