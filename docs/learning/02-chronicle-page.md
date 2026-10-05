# 02 — Creating the Chronicle page

Recorded: 5 October 2026.

## Goal

Create the real page where our chapter list will eventually live. Start with plain HTML to check the route before adding navigation and styling.

## What I did

1. Created `templates/chronicle.html` with a page title, heading, and introductory paragraph.
2. Added `@app.get("/chronicle")` above a new `chronicle()` function in `app.py`.
3. Returned `render_template("chronicle.html")` from that function.
4. Opened `/chronicle` in the browser and reported seeing the basic page.

## What I learned

The decorator belongs immediately above the function it applies to, at the same indentation level. It registers the function with Flask when Python defines it. It does not go inside the function body.

The route URL, function name, and template filename are separate things. The decorator connects a URL to a function. The function uses `render_template` to choose an HTML file from Flask's templates folder.

The practice `/api/chapters` endpoint returns JSON data. The new `/chronicle` endpoint returns an HTML page. Both are HTTP responses, but they serve different purposes.

The page uses the browser's default appearance because it does not load the Tailwind stylesheet or use the project's styling yet. A plain page is expected at this stage.

## Review and checks

- The user reported that `/chronicle` displayed the heading and paragraph in the browser.
- The guide reviewed the route and template and found their structure correct. The guide did not independently run the page.
- A comment describing practice chapter data currently sits after the return inside `chronicle()`. Move it above the chapter API decorator at the left margin so it describes the right route. This is a readability change.

## Git and Boot.dev

This step adds a Flask route written by me and helps me understand routing and HTML responses.

Useful commit point: `Add basic Chronicle page`. A commit for this step has not been reported yet.

## Blog idea

How Flask connects a URL, a Python function, and an HTML template—and why my first page was unstyled.

## Next step

Connect the homepage to the Chronicle page using a navigation link. Styling and chapter data come afterward.
