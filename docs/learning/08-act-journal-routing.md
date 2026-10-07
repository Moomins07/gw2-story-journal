# Act Journal routing

## Capturing an act ID from a URL

I added a GET route at `/chronicle/acts/<act_id>` with a function accepting act_id. Flask captures that part of the URL and passes it to the function. The value is a local journal catalogue identifier, not a numeric GW2 quest or story ID.

Initially I passed a constructed URL into render_template. That function expects a template filename, so it tried to find a template at that path. For the routing exercise, returning an f-string directly supplies the browser response without needing a template.

The guide confirmed the direct string return in the source, and I reported that the route works. No independent live server check was performed. The new function still needs a purpose comment above its return.

## Next exercise

Compare the captured act_id with the catalogue act's id. An unknown value should return HTTP 404 using Flask's abort function; a matching value can return the catalogue title for now. Check both the known URL and a made-up ID. This teaches validation before looking up progress or rendering a journal.

Useful commit point after validation: `Add catalogue-aware act route`. This contributes original Python routing and error handling toward Boot.dev. Blog idea: the difference between a URL, a template filename, and a returned response.

## Act ID validation reviewed

I compared act_id with the catalogue's id, returned its title for a match, and called abort(404) otherwise. The guide reviewed this as correct. Returning inside the matching branch exits the function, so a valid ID never reaches the abort below it.

The guide checked Python syntax and exercised the actual route function offline with a substitute abort function: the known ID returned Act 1, and an unknown ID called abort with 404. This did not test Flask's HTTP response or a live browser. Suggested browser checks remain the known act URL and /chronicle/acts/banana. Inline comments explaining the two branches still need adding. The validation logic step is complete.
