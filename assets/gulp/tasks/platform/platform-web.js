/**
 * Gulp tasks for web platform.
 */
const display = require("./util/display");
const uc = require("./util/unite-config");
const gulp = require("gulp");
const runSequence = require("run-sequence");
const util = require("util");
const path = require("path");
const del = require("del");
const asyncUtil = require("./util/async-util");
const packageConfig = require("./util/package-config");
const platformUtils = require("./util/platform-utils");

gulp.task("platform-web-package", async () => {
    try {
        await util.promisify(runSequence)(
            "platform-web-clean",
            "platform-web-gather",
            "platform-web-compress"
        );
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("platform-web-clean", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const packageJson = await packageConfig.getPackageJson();

    const toClean = [
        path.join("../", uniteConfig.dirs.packagedRoot, `/${packageJson.version}/web/**/*`),
        path.join("../", uniteConfig.dirs.packagedRoot, `/${packageJson.version}_web.zip`)
    ];
    display.info("Cleaning", toClean);
    return del(toClean, {"force": true});
});

gulp.task("platform-web-gather", () => {
    return platformUtils.gatherFiles("Web");
});

gulp.task("platform-web-compress", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const packageJson = await packageConfig.getPackageJson();

    display.info("Compressing Files", "Web");
    const zipName = `${packageJson.version}_web.zip`;
    display.info("To File", zipName);

    return asyncUtil.zipFolder(
        path.join("../",
            uniteConfig.dirs.packagedRoot,
            `/${packageJson.version}/web/`),
        path.join("../", uniteConfig.dirs.packagedRoot, zipName)
    );
});

/* Generated by UniteJS */
