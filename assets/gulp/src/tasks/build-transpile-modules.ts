/**
 * Gulp tasks for transpiling modules.
 */
import * as gulp from "gulp";
import * as babel from "gulp-babel";
import * as typescript from "gulp-typescript";
import * as uglify from "gulp-uglify";
import * as gutil from "gulp-util";
import * as path from "path";
import * as asyncUtil from "./util/async-util";
import * as display from "./util/display";
import * as errorUtil from "./util/error-util";
import * as regExUtil from "./util/regex-utils";
import * as uc from "./util/unite-config";

gulp.task("build-transpile-modules", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig, false);

    const keys = Object.keys(uniteConfig.clientPackages);

    for (let i = 0; i < keys.length; i++) {
        const clientPackage = uniteConfig.clientPackages[keys[i]];
        if (clientPackage.transpile && clientPackage.transpile.alias) {
            const destFolder = path.join(uniteConfig.dirs.www.package, clientPackage.transpile.alias);

            const dirExists = await asyncUtil.directoryExists(destFolder);

            if (dirExists) {
                display.info("Skipping Transpile", `${clientPackage.name} to ${clientPackage.transpile.alias}`);
            } else {
                display.info("Transpiling", `${clientPackage.name} to ${clientPackage.transpile.alias}`);

                const baseFolder = path.join(
                    uniteConfig.dirs.www.package,
                    clientPackage.name
                );

                const srcs = (clientPackage.transpile.sources || ["**/*.js"])
                    .map(src => path.join(uniteConfig.dirs.www.package, clientPackage.name, src));

                let errorCount = 0;

                const transforms = clientPackage.transpile.transforms || {};
                const sourceExtension = clientPackage.transpile.language === "JavaScript" ? "js" : "ts";

                if (clientPackage.transpile.stripExt) {
                    transforms[`import(.*?)("|'|\`)(.*?)\\.${sourceExtension}\\2`] = "import$1$2$3$2";
                }

                if (clientPackage.transpile.modules) {
                    clientPackage.transpile.modules.forEach(module => {
                        transforms[`import(.*?)("|'|\`)(?:.*?)(?:\\.\\.\\/)${module}(.*)\\2`] =
                            `import$1$2${module}$3$2`;
                    });
                }

                const lowerModule = uniteConfig.moduleType.toLowerCase();
                if (clientPackage.transpile.language === "JavaScript") {
                    await asyncUtil.stream(gulp.src(srcs, {base: baseFolder})
                        .pipe(regExUtil.multiReplace(transforms))
                        .pipe(babel({
                            presets: [
                                [
                                    "env",
                                    {
                                        modules: lowerModule
                                    }
                                ]
                            ],
                            babelrc: false
                        }))
                        .on("error", (err) => {
                            display.error(err.message);
                            if (err.codeFrame) {
                                display.error(`\n${err.codeFrame}`);
                            }
                            errorCount++;
                        })
                        .on("error", errorUtil.handleErrorEvent)
                        .pipe(buildConfiguration.minify ? uglify()
                            .on("error", (err) => {
                                display.error(err.toString());
                            }) : gutil.noop())

                        .pipe(gulp.dest(destFolder))
                        .on("end", () => {
                            errorUtil.handleErrorCount(errorCount);
                        }));
                } else if (clientPackage.transpile.language === "TypeScript") {
                    const tsProject = typescript.createProject({
                        target: "es5",
                        experimentalDecorators: true,
                        module: lowerModule === "systemjs" ? "system" : lowerModule
                    });
                    await asyncUtil.stream(gulp.src(srcs, {base: baseFolder})
                        .pipe(regExUtil.multiReplace(transforms))
                        .pipe(tsProject(typescript.reporter.nullReporter()))
                        .on("error", (err) => {
                            display.error(err.message);
                            errorCount++;
                        })
                        .on("error", errorUtil.handleErrorEvent)
                        .js
                        .pipe(gulp.dest(destFolder))
                        .on("end", () => {
                            errorUtil.handleErrorCount(errorCount);
                        }));
                }
            }
        }
    }
});

// Generated by UniteJS
