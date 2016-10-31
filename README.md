# RAAR-UI

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
# api document for the app
npm run build.docs

# to start deving with livereload site and coverage as well as continuous testing
$ npm run start.deving

# dev build
$ npm run build.dev
# prod build
$ npm run build.prod
# prod build with AoT compilation
$ npm run build.prod.exp

# dev build of multiple applications (by default the value of --app is "app")
$ npm start -- --app baz
$ npm start -- --app foo
$ npm start -- --app bar
```

The project is based on [angular2-seed](https://github.com/mgechev/angular2-seed).

To update from there:

```
git remote add seed https://github.com/mgechev/angular2-seed.git
git pull seed master
```

## License

RAAR-UI is released under the terms of the GNU Affero General Public License.
Copyright 2016 Radio Rabe.
See `LICENSE` for further information.

angular-seed is licensed under MIT.
