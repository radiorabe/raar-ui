import * as colorguard from 'colorguard';
import * as doiuse from 'doiuse';
import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as merge from 'merge-stream';
import * as reporter from 'postcss-reporter';
import * as stylelint from 'stylelint';
import { join} from 'path';

import Config from '../../config';

const plugins = <any>gulpLoadPlugins();

const isProd = Config.BUILD_TYPE === 'prod';

const processors = [
  doiuse({
    browsers: Config.BROWSER_LIST,
  }),
  colorguard(),
  stylelint(),
  reporter({clearMessages: true})
];

/**
 * Lints the component SCSS files.
 */
function lintComponentScss() {
  return gulp.src([
    join(Config.APP_SRC, '**', '*.scss'),
    '!' + join(Config.APP_SRC, 'assets', '**', '*.scss')
  ])
    .pipe(isProd ? plugins.cached('css-lint') : plugins.util.noop())
    .pipe(plugins.postcss(processors));
}

function lintExternalScss() {
  return gulp.src(getExternalScss().map(r => r.src))
    .pipe(isProd ? plugins.cached('scss-lint') : plugins.util.noop())
    .pipe(plugins.postcss(processors));
}

function getExternalScss() {
  return Config.DEPENDENCIES.filter(d => /\.scss/.test(d.src) && !d.vendor);
}


export = () => merge(lintComponentScss(), lintExternalScss());
