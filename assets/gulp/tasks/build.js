/**
 * Gulp tasks for building JavaScript.
 */
const display = require('./util/display');
const template = require('./util/template');
const uc = require('./util/unite-config');
const buildTranspile = require('./build-transpile');
const buildBundle = require('./build-bundle');
const buildLint = require('./build-lint');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const path = require('path');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('build-clean', (callback) => {
    const uniteConfig = uc.getUniteConfig();
    const toClean = path.resolve(uniteConfig.directories.dist) + "**/!(app-module-config).js";
    display.info('Cleaning', toClean);
    return del(toClean, callback);
});

gulp.task('build', (cb) => {
    runSequence('build-clean', 'build-lint', 'build-transpile', 'build-bundle', cb);
});

