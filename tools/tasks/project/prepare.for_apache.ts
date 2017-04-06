import * as gulp from 'gulp';
import * as merge from 'merge-stream';
import { join } from 'path';

var gzip = require('gulp-gzip');

import Config from '../../config';

export = () => {
  return merge(gzipJsCss(), addHtaccesses());
};

function gzipJsCss() {
  return merge(gzipFiles('js'), gzipFiles('css'));
}

function gzipFiles(folder: string) {
  return gulp.src(join(Config.APP_DEST, folder, '**'))
          .pipe(gzip())
          .pipe(gulp.dest(join(Config.APP_DEST, folder)));
}

function addHtaccesses() {
  return merge(gulp.src(join(Config.APP_SRC, '.htaccess')).pipe(gulp.dest(Config.APP_DEST)),
               addHtaccess('assets', 'js'),
               addHtaccess('assets', 'css'));
}

function addHtaccess(source: string, dest: string) {
  return gulp.src(join(Config.APP_SRC, source, '.htaccess'))
          .pipe(gulp.dest(join(Config.APP_DEST, dest)));
}
