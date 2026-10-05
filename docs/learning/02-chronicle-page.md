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
- The practice-data comment was subsequently moved into the chapter API function, where it describes the correct code.

## Follow-up: Homepage navigation

I changed the homepage chapter button into an `<a>` link, with `href="{{ url_for('chronicle') }}"` and the label **Our Chronicle**. I kept its visual classes and arrow, and removed the old button attributes, chapter script tag, output container, and loader template.

**I learned:** Links navigate to pages; buttons perform actions. `url_for('chronicle')` uses Flask's endpoint name (the function name by default) to generate the destination URL. Removing a control also requires checking scripts and CSS that refer to it.

The guide reviewed the navigation markup and removal of the old exercise hooks. Browser navigation has not been independently verified. The link's old explanatory comment still describes a button and should be updated.

The character-theme CSS originally targeted `#load-chapters`, so removing that ID stopped the custom link colours from following the selected character theme. I added `id="chronicle-link"` to the anchor. At my request, the guide updated both theme selectors in `static/css/input.css` to match and updated the CSS comment. The generated stylesheet still needs rebuilding (or the running watcher to finish); visual theme behavior has not been independently verified.

**I learned:** CSS ID selectors must match the element's actual ID. Changing an HTML ID can require updating its styling references. Edit `input.css`, then let Tailwind generate `output.css` rather than editing the generated file by hand.

Suggested checks: click the homepage link, verify `/chronicle` opens, and verify the link follows both character themes after the selector update.

Follow-up code review confirmed that the anchor ID and both source CSS selectors match. The generated `output.css` contains `#chronicle-link` and no longer contains `#load-chapters`, confirming the stylesheet was regenerated. The route and template still match, and the old exercise hooks are absent from the homepage. Visual browser checks remain separate from this code review.

Useful commit point after checking: `Connect homepage to Chronicle page`.

## Git and Boot.dev

This step adds a Flask route written by me and helps me understand routing and HTML responses.

Useful commit point: `Add basic Chronicle page`. A commit for this step has not been reported yet.

## Blog idea

How Flask connects a URL, a Python function, and an HTML template—and why my first page was unstyled.

## Next step

Rebuild the stylesheet and check the navigation link's themes, then connect chapter data to the Chronicle page. Its final layout comes later.
