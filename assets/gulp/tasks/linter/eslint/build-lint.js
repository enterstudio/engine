/**
 * Gulp tasks for linting modules.
 */
const display = require('./util/display');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const path = require('path');
const uc = require('./util/unite-config');

gulp.task('build-lint', function () {
    display.info('Running', "ESLint");

    const uniteConfig = uc.getUniteConfig();

    return gulp.src(path.join(uniteConfig.directories.src, '**/*.js'))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on('error', function() {
            process.exit(1);
        });        
});

