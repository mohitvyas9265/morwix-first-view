Housekeeping
Create a second repo for the source: on github.com click + → New repository, name it morwix-source, keep it Private, click Create.
In that repo: uploading files → drag in the whole extracted morwix-saas folder contents (morwix-app, morwix-server, README.md). Commit. The zip already excludes node_modules, so this stays small.
Back on your live site repo, link to the app: open the landing page's index.html, click the pencil ✏️ icon, and change the header button's line from
<a class="btn btn-solid" href="#demo">Book a demo</a>
to
<a class="btn btn-solid" href="./app/">Sign in</a>
Commit.


If something looks wrong
App page loads but is unstyled/blank: the assets folder didn't upload as a folder. Check the repo shows app/assets/index-….js and app/assets/index-….css.
404 at /app/: the folder is named something else, or the deploy hasn't finished — check the Actions tab for a green check.
Old version still showing: hard-refresh with Ctrl+Shift+R.

One check worth doing at step 1: confirm whether your landing page's index.html sits at the repo root or inside a folder like docs/. If it's in docs/, then create docs/app/ instead of app/ in steps 3–4. Tell me which it is and I'll confirm the exact paths.
