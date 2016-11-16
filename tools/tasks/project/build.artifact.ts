import * as gulp from 'gulp';
import * as merge from 'merge-stream';
import { join } from 'path';

var tar = require('gulp-tar');
var gzip = require('gulp-gzip');

import Config from '../../config';

export = () => {
  return gulp.src(join(Config.APP_DEST, '**'), { dot: true })
          .pipe(tar('raar-ui.tar'))
          .pipe(gzip())
          .pipe(gulp.dest(Config.ARTIFACT_DEST));
};
