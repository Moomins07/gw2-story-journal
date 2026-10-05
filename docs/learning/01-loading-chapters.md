# 01 — Connecting the chapter button to Flask

Recorded: 5 October 2026. Reconstructed from the guide conversation and current code.

## Goal

Click **Load chapters** and display data supplied by Python. This is a temporary practice exercise before building the real Chronicle page. The chapters are practice data, not GW2 API data.

## Step 1: Return chapter data from Flask

In `app.py`, I added a GET route at `/api/chapters`. Its function creates a list of dictionaries, each with an `id` and a `title`. I imported `jsonify` and returned the whole list through it.

**I learned:** A route connects a URL and HTTP method to a Python function. Flask can return HTML for a page or JSON for code to use. JSON is a text format for transferring structured data.

My first attempt returned one dictionary inside a loop. `return` exits the function immediately, so that would only send the first chapter. Returning the whole list sends all chapters together.

I also changed dictionaries such as `{'01': 'Chapter 1'}` to separate `id` and `title` fields. Predictable field names make the data easier to use.

**Reported check:** I opened the endpoint in my browser and saw the JSON data.

## Step 2: Connect the button to JavaScript

In `static/js/chapters.js`, I selected the button and output container by their HTML IDs. I added a click listener that calls a function. The homepage loads the script using a Flask-generated static URL and `defer`.

**I learned:** An event listener connects an action to code. Passing a function name lets the browser call it when the click happens. `defer` waits until HTML parsing finishes, so the elements exist when the script selects them.

## Step 3: Reuse a loading template

The homepage has a `<template>` containing the loading artwork. Its contents are not displayed automatically. My loading function copies them into the chapter area:

```javascript
// Copy the template and its nested elements, replacing the current display.
chapterContainer.replaceChildren(loaderTemplate.content.cloneNode(true))
```

**I learned:** `cloneNode(true)` makes a deep copy, including nested elements. Copying keeps the original template available to reuse. `replaceChildren()` replaces the container's contents, preventing duplicate loaders. Called without arguments, it clears the container.

**What I liked:** The design stays in HTML, and JavaScript only needs to copy it. This feels neat and reusable. `cloneNode(true)` handles copying; `replaceChildren()` prevents the copies from accumulating.

## Step 4: Request Flask data

I made `loadChapters()` async. It uses `fetch('/api/chapters')` to request the endpoint, then `response.json()` to read its body. Both operations use `await`. Initially, I logged the data to the console before displaying it.

**I learned:** The browser and backend communicate through HTTP. `await` pauses this async function while waiting without freezing the browser. JSON parsing turns the transferred data into a JavaScript array of objects.

## Step 5: Display the chapters

I clear the loader, loop through the chapters, create a paragraph for each, assign its `textContent`, and append it to the container. Each paragraph shows the chapter ID and title.

**I learned:** Creating an element does not display it; appending it attaches it to the page. `textContent` treats titles as plain text rather than HTML. Clearing the container prevents repeated loads from accumulating results.

I corrected `for (item of chapters)` to `for (const item of chapters)`. Declaring the variable keeps it local to the loop and avoids an accidental global variable. Each iteration gets a new binding.

## Step 6: Handle failures

I wrapped the request and rendering in `try`. In `catch`, I replace the loader with a readable error message and log the technical error.

Immediately after `fetch`, I check `response.ok`. If the status is unsuccessful, I throw an error before attempting JSON parsing.

**I learned:** `fetch` does not automatically throw for HTTP errors such as 404 or 500. Network failures and invalid JSON can also throw errors. `catch` handles these failures.

Checking status before parsing gives a clearer error: Flask's default 404 response can be HTML, which would fail JSON parsing before reporting the HTTP status.

## Step 7: Disable and restore the button

I disable the button at the start of loading and re-enable it in `finally`. The loader function is inside `try`, so errors while showing the loader also reach cleanup.

**I learned:** `try` attempts the work, `catch` handles failure, and `finally` runs cleanup after success or failure. Disabling the button prevents normal repeated clicks from starting overlapping requests.

I initially misspelled `disabled` as `diabled`. JavaScript accepted a different property, but the browser did not use it to control the button. The button stayed disabled without an obvious error.

**What I liked:** `finally` gives cleanup one clear home. I do not need to repeat the code that restores the button in both success and failure paths.

## The complete flow

1. Click the button.
2. JavaScript disables it and shows the loader.
3. JavaScript requests `/api/chapters`.
4. Flask returns practice data as JSON.
5. JavaScript checks the status and parses the data.
6. JavaScript displays chapters or an error message.
7. `finally` restores the button.

Tailwind controls appearance. JavaScript controls browser interaction. Flask supplies data.

## Checks to repeat

The guide reviewed the current code. These final browser checks have not been independently verified by the guide:

- The correct endpoint displays both chapters and restores the button.
- Repeated completed loads replace previous results.
- Temporarily requesting `/api/chapters-missing` displays an error and restores the button. Restore the correct URL afterward.
- Slowing requests in browser developer tools makes the loader and disabled state easier to observe.

## Git and Boot.dev

I reported committing the chapter-loading work. The final corrections and these notes are useful changes for the next commit after checking them.

Possible commit message: `Document chapter-loading exercise and restore button after requests`.

This exercise contributes application code written by me with guidance. I practised Python routes, JSON, HTTP requests, browser updates, debugging, error handling, and small commits.

## Blog ideas

- Connecting my first JavaScript button to a Flask JSON endpoint.
- Reusable loaders with `cloneNode(true)` and `replaceChildren()`.
- Managing a button with `try`, `catch`, and `finally`.
- Debugging a misspelled JavaScript property.

## Next

Confirm the success and failure checks, then begin the Chronicle page. GW2 API integration and persistent storage come later.
