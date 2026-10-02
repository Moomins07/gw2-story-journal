# Our Story — GW2 Journal

A personal Guild Wars 2 story journal for my wife and me as we play through Tyria together as two Charr. Built as a 20–40 hour Boot.dev personal project using Python and JavaScript.

## Planned features

- An atmospheric homepage with character artwork and subtle animations.
- A story progress page with chapters that open into our journal entries.
- Dated notes, impressions, and character lore from our adventures.
- GW2 API integration where story progress data is available, with manual journal entries independent of API coverage.

## How it will work

Flask runs the Python backend and serves HTML pages. Tailwind generates the CSS, while JavaScript runs in the browser to load story data and handle journal interactions. The backend will fetch GW2 data and save notes in a local SQLite database. API keys will stay on the backend and out of Git.

The first version runs locally. Public hosting and user accounts are outside the initial scope.

## What I am learning

- Python web development: routes, requests, responses, and templates.
- Working with APIs, JSON, and errors.
- Connecting browser JavaScript to Python using HTTP requests.
- Processing story data and storing and retrieving journal entries.
- Git, dependency management, debugging, and testing important behaviour.

AI helps with setup, layout, styling, and decorative effects. I write the Python and JavaScript application logic with guidance so I can explain, change, and debug it myself.

## Current progress

Flask serves a starter homepage and Tailwind builds its stylesheet. Story data, API integration, and journal storage are still to be implemented.

## Clone and run

Requires Python 3, Node.js, and npm. Commands below assume WSL Ubuntu/Linux and the npm scripts described during setup have been added.

```bash
git clone <your-repository-url>
cd <repository-folder>
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
npm ci
```

Run these in two terminals from the project directory:

```bash
npm run css
```

```bash
npm run server
```

Open http://127.0.0.1:5000. Stop each process with Ctrl+C.

With the optional `concurrently` script installed, `npm run dev` starts both processes in one terminal.

Replace the repository placeholders above before publishing this README.
