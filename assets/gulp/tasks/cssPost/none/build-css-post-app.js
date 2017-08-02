/**
 * Gulp tasks for post building css.
 */
const display = require("./util/display");
const gulp = require("gulp");
const path = require("path");
const rename = require("gulp-rename");
const uc = require("./util/unite-config");
const cssnano = require("gulp-cssnano");
const gutil = require("gulp-util");
const merge = require("merge2");

gulp.task("build-css-post-app", () => {
    display.info("Running", "CSS None for App");

    const uniteConfig = uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    const streams = [];

    streams.push(gulp.src(path.join(uniteConfig.directories.cssDist, "main.css"))
        .pipe(rename("style.css"))
        .pipe(buildConfiguration.minify ? cssnano() : gutil.noop())
        .pipe(gulp.dest(uniteConfig.directories.cssDist)));

    if (buildConfiguration.minify) {
        streams.push(gulp.src(path.join(uniteConfig.directories.cssDist, "**/!(style).css"))
            .pipe(cssnano())
            .pipe(gulp.dest(uniteConfig.directories.cssDist)));
    }

    return merge(streams);
});

/* Generated by UniteJS */
