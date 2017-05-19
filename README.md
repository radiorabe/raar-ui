# RAAR-UI

[![Build Status](https://travis-ci.org/radiorabe/raar-ui.svg)](https://travis-ci.org/radiorabe/raar-ui)

An Angular2 web client for the Radio Archive [RAAR](https://github.com/radiorabe/raar).

## Development

This project requires node v4.x.x or higher and npm 2.14.7.

In order to start developing use:

```bash
# install the project's dependencies
$ npm install
# fast install (via Yarn, https://yarnpkg.com)
$ yarn install  # or yarn

# watches your files and uses livereload by default
$ npm start

# prod build
$ npm run build.prod
# prod build with AoT compilation
$ npm run build.prod.rollup.aot
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
