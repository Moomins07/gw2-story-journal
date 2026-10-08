# Deploying Flask from main with Render

## Planning and code review

On 2026-10-08, I requested a walkthrough for deploying main automatically while developing on dev. The guide inspected app.py, requirements.txt, package.json and .gitignore. Gunicorn is not currently listed. The Chronicle reads GW2_API_KEY and GW2_CHARACTER_NAME from the process environment and returns 503 if they are missing. The generated static/css/output.css exists and is not ignored.

No hosted deployment, branch creation, installation, authenticated request, or live-site check has been performed or confirmed in this step. The following is the planned setup.

## Why it works

GitHub stores the source. Render connects to the repository's main branch, installs Python dependencies, and runs the Flask application with Gunicorn. Flask renders Jinja and handles API requests; GitHub Pages cannot run that backend.

For the first setup, build Tailwind locally and commit output.css. Render only needs to install Python dependencies. Build the stylesheet before publishing future styling changes too.

## Setup reference

1. Disable GitHub Pages and any dedicated Pages workflow.
2. Commit or otherwise preserve existing work before changing branches. Prepare a working main revision.
3. Install Gunicorn into the local virtual environment and record the dependency in requirements.txt.
4. Build CSS and test the local site.
5. Push the prepared main revision.
6. Create a Render Python Web Service through the connected GitHub provider, branch main, root directory blank.
7. Build command: pip install -r requirements.txt.
8. Start command: gunicorn app:app --bind 0.0.0.0:$PORT.
9. Set GW2_API_KEY and GW2_CHARACTER_NAME in Render's environment settings. Do not commit .env or paste the key into documentation. Public visitors will see the configured character's displayed progress.
10. Set health check path / and Auto-Deploy to On Commit. Use After CI Checks Pass only after actual CI exists.
11. Verify the hosted homepage, styles, /api/chapters and /chronicle. Deployment is not confirmed until those checks succeed.
12. Create dev from the deployed main revision, work and commit there, and merge through a pull request targeting main when ready.

## Commands and concepts

```bash
# Install the production server in the project's existing Python environment.
.venv/bin/python -m pip install gunicorn

# Record installed versions; inspect the diff before committing the updated file.
.venv/bin/python -m pip freeze > requirements.txt

# Generate the stylesheet that will be committed and served on Render.
npm run build:css
```

In app:app, the first app names app.py and the second names the Flask object inside it. PORT comes from Render. Local npm run dev still uses the development server; the hosted site uses Gunicorn.

## Limitations and useful checks

Render's free service sleeps after inactivity and cannot preserve a writable SQLite database across restarts or deployments. Use persistent storage before relying on hosted journal entries. A successful health check on / does not establish that authenticated Chronicle requests work. Inspect the Chronicle separately. No test results are claimed here.

Useful commit point after local validation: Prepare Flask app for Render deployment. Blog idea: moving from a local Flask project to branch-based automatic deployment. This adds deployment and dependency-management learning to the Boot.dev project; it does not establish completed hosting or development hours.

References: https://render.com/docs/deploy-flask, https://render.com/docs/web-services, https://render.com/docs/deploys, https://render.com/docs/free.
