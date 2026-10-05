from flask import Flask, render_template, jsonify

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

    return render_template("chronicle.html", chapters=get_practice_chapters())

@app.get("/api/chapters")
def get_chapters():
    
    chapters = get_practice_chapters()
    
    return jsonify(chapters)




