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
$ yarn run build.prod.rollup.aot -- --app admin
```

The project is based on [angular2-seed](https://github.com/mgechev/angular2-seed).

To update from there:

```
$ ./upgrade-seed.sh
```

## License

raar-ui is released under the terms of the GNU Affero General Public License.
Copyright 2016-2017 Radio RaBe.
See `LICENSE` for further information.

angular-seed is licensed under MIT.
