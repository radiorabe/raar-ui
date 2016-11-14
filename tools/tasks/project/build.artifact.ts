import * as gulp from 'gulp';
import { join } from 'path';

var tar = require('gulp-tar');
var gzip = require('gulp-gzip');

import Config from '../../config';

var debug = require('gulp-debug');

export = () => {

    return gulp.src([
          join(Config.APP_DEST, '**'),
          join(Config.APP_SRC, '.htaccess')
        ])
        .pipe(debug())
        .pipe(tar('raar-ui.tar'))
        .pipe(gzip('raar-ui.tgz'))
        .pipe(gulp.dest(Config.ARTIFACT_DEST));
};
