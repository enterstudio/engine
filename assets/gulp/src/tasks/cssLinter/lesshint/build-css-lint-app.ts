/**
 * Gulp tasks for linting app with less hint.
 */
import * as gulp from "gulp";
import * as lessHint from "gulp-lesshint";
import * as path from "path";
import * as streamToPromise from "stream-to-promise";
import * as display from "../../util/display";
import * as uc from "../../util/unite-config";

gulp.task("build-css-lint-app", async () => {
    display.info("Running", "LessHint for App");

    const uniteConfig = await uc.getUniteConfig();

    return streamToPromise(gulp.src(path.join(uniteConfig.dirs.www.cssSrc, `**/*.${uniteConfig.styleExtension}`))
        .pipe(lessHint())
        .pipe(lessHint.reporter())
        .pipe(lessHint.failOnError())
        .on("error", (err) => {
            display.error("LessHint failed", err);
            process.exit(1);
        }));
});

// Generated by UniteJS
