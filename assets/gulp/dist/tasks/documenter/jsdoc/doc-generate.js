/**
 * Gulp tasks for producing jsdoc documentation.
 */
const gulp = require("gulp");
const path = require("path");
const display = require("../../util/display");
const exec = require("../../util/exec");
gulp.task("doc-generate", async () => {
    display.info("Generating", "JSDoc");
    const configFile = path.join(process.cwd(), ".jsdoc.json");
    return exec.npmRun("jsdoc", ["--verbose", "--configure", configFile])
        .catch((err) => {
            display.error("JSDoc Failed", err);
            process.exit(1);
        });
});
// Generated by UniteJS
