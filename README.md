# RAAR-UI

[![Build Status](https://travis-ci.org/radiorabe/raar-ui.svg)](https://travis-ci.org/radiorabe/raar-ui)

An Angular2 web client for the Radio Archive
[RAAR](https://github.com/radiorabe/raar).

This repository actually contains two applications: The public frontend of the
archive for browsing and listening (`src/archive`), and an admin frontend to
configure the archival (`src/admin`). Each application must be started and
built independently, but they do share some code (`src/shared`, `src/scss`).


## Development

This project requires node v4.x.x or higher and yarn >= 1.

In order to start developing use:

```bash
# install the project's dependencies (via Yarn, https://yarnpkg.com)
$ yarn install  # or yarn

# start the development server with the archive app
# (watches your files and uses livereload by default)
$ yarn start

# start the development server with the admin app
$ yarn start --app admin

# prod build with AoT compilation for the archive app
$ yarn run build.prod.rollup.aot

# prod build with AoT compilation for the admin app
$ yarn run build.prod.rollup.aot --app admin --base /admin/

# simple prod build
$ yarn run build.prod
```

The project is based on [angular2-seed](https://github.com/mgechev/angular2-seed).
Please find additional documentation about the used setup there.

To update from angular2-seed:

```bash
$ ./upgrade-seed.sh
```


## Smoke Tests

So far, there is no automatic test suite for raar-ui. Use the following list
of smoke tests to verify a basically correct behavior:

* Load broadcasts for a show. Infinite scrolling should load more broadcasts
  when the end of the page is reached. Reloading the page displays the
  show's broadcasts again.
* Load broadcasts for a day. Navigating back and forward should update the
  broadcasts as well as the datepicker. Reloading the page displays the
  last date's broadcasts and the correct datepicker selection again.
* Listen to an audio file. Reloading the page plays the audio file again.
  Manually change the audio position and the volume.
* Login with username/password or an access token reloads the broadcast list.
  Locked broadcasts should become available. Logout locks them again.
* When the window size is decreased, the player still looks fine. The left
  menu disappears and must be manually toggled for small sizes.
* Searching for shows works.
* Picking a date via months works.


## Deployment

Run the following command to build and deploy either the archive or the admin
frontend. You need a correct SSH host alias called `archiv` pointing to your
server.

```bash
$ ./deploy.sh [archive|admin]
```

The archive app will be installed in a top-level path (`BASE = /`), the
admin app in a subpath called `/admin/`.


## License

raar-ui is released under the terms of the GNU Affero General Public License.
Copyright 2016-2017 Radio RaBe.
See `LICENSE` for further information.

angular-seed is licensed under MIT.
