# RAAR-UI

[![Build Status](https://travis-ci.org/radiorabe/raar-ui.svg)](https://travis-ci.org/radiorabe/raar-ui)

An Angular2 web client for the Radio Archive [RAAR](https://github.com/radiorabe/raar).


## Development

This project requires node v4.x.x or higher and npm 2.14.7.

In order to start developing use:

```bash
# install the project's dependencies (via Yarn, https://yarnpkg.com)
$ yarn install  # or yarn

# start the development server (watches your files and uses livereload by default)
$ yarn start

# start the admin app for Development
$ yarn start -- --app admin

# prod build
$ yarn run build.prod
# prod build with AoT compilation
$ yarn run build.prod.rollup.aot

# prod build for admin app
$ yarn run build.prod.rollup.aot -- --app admin --base /admin/
```

The project is based on [angular2-seed](https://github.com/mgechev/angular2-seed).

To update from there:

```
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
* Searching for shows works.
* Picking a date via months works.


## Deployment

Run the following command to build and deploy either the archive or the admin frontend.
You need a correct SSH host alias called `archiv` pointing to your server.

```bash
$ ./deploy.sh [archive|admin]
```


## License

raar-ui is released under the terms of the GNU Affero General Public License.
Copyright 2016-2017 Radio RaBe.
See `LICENSE` for further information.

angular-seed is licensed under MIT.
