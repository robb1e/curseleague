# Curse League

The curse league application builds on top of CurseBird.com to include Twitter lists and be able to compare lists together.

## Requirements

 * nodejs v0.4.1
 * npm v0.2.1

## Installation

	git clone git@github.com:robb1e/curseleague.git
	cd curseleage
	npm install

## Running

	node server.js

This will start the application on port 3000.

## Deployment

Deployment is done through http://no.de and an ssh keypair is required.  Add the remote repository and push to:

	node@robb1e.no.de:/home/node/repo

This will kick off some post push hooks and deploy the application on port 80.

## How it all works

The application uses ExpressJS to do the routing and will serve the following URIs (in src/app.js)

 * /
 * /username/listname
 * /username/listname/vs/username/listname

Where username is a Twitter username and listname is a list of the user referenced.  The members of the list are then retrieved through the Twitter API, and can be hit multiple times as the API only returns 20 results.  Then each username found is looked up using the CurseBird.com API to get a curse score.

### Views

The resulting list is sorted by level and rendered into EJS templates (in views folder).  The layout.ejs file wraps all results and item.ejs is used as a partial template from list.ejs and vs.ejs.


### Cache

At all stages, aggressive caching is done on Twitter list memberships, Cursebird results and the curse league result itself.  If the cache is empty it can take some time to render the page.
