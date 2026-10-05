# 03 — Passing Python data into a Jinja template

## What I did

I created a chapter list inside `chronicle()` and passed it to `render_template("chronicle.html", chapters=chapters)`. In the template, I used a Jinja loop to create a list item for each chapter and inserted its title with `{{ chapter.title }}`.

## What I learned

`render_template` explicitly chooses the HTML file. The template filename does not have to match the Python function name. The template receives the variables passed to it; it does not need to know which function supplied them.

In `chapters=chapters`, the left side names the template variable and the right side refers to the Python variable holding the data.

The route URL, function name, and template filename have separate jobs. Renaming `chronicle()` would not change the template it renders, but it would require updating `url_for('chronicle')` because Flask uses the function name as its default endpoint name.

`{% ... %}` contains template instructions. `{{ ... }}` inserts a value. Jinja's `chapter.title` can read the dictionary's `title` field.

Unlike the JavaScript fetch exercise, this loop runs on the server before Flask sends the HTML. The browser receives the resulting list items, not the Jinja instructions.

## Review and checks

The guide reviewed the Python data passing and Jinja loop and found them correctly connected. The guide did not independently run the page, and a browser result for this step has not yet been reported.

Suggested check: refresh `/chronicle` and confirm both chapter titles appear. View page source to see the generated list items instead of a Jinja loop.

The Chronicle currently uses string IDs such as `"01"`, while the API exercise uses integer IDs such as `1`. Both work for displaying titles, but the next step will give both routes one shared source with consistent integer IDs.

## Git and Boot.dev

This adds Python and template logic written by me with guidance. Useful commit point: `Render practice chapters in Chronicle template`. A commit for this step has not been reported.

## Blog idea

Two ways to get Python data onto a page: server-rendered Jinja HTML and browser-side JSON requests.

## Next step

Move the duplicated practice lists into one helper function that both routes call. This prepares one place to replace practice data with API data later.

## Follow-up: One shared helper

I added `get_practice_chapters()` with three practice chapters using integer IDs. Both routes now call it. The Chronicle passes its result directly into `render_template`; the API route stores it in a variable before calling `jsonify`. Both approaches are valid.

**I learned:** A helper is a normal Python function, without a route decorator. It supplies data; the routes decide whether to return HTML or JSON. Keeping one list avoids duplicated data drifting apart. Later, a helper can fetch API data and translate it into the journal's expected fields.

The guide reviewed the shared helper and both callers and found their connections correct. I reported that the exercise seemed to work correctly; the guide did not independently run it. Explanatory comments and consistent list indentation are useful remaining readability improvements.

Useful commit point: `Share practice chapter data between routes`. Next, make an isolated Python request to public GW2 story data before connecting it to the website.
