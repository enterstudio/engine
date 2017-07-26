/**
 * Gulp tasks for bundling vendor modules.
 */
const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const insert = require("gulp-insert");
const uc = require("./util/unite-config");
const clientPackages = require("./util/client-packages");
const display = require("./util/display");
const Builder = require("systemjs-builder");

gulp.task("build-bundle-vendor", (cb) => {
    const uniteConfig = uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration();

    if (buildConfiguration.bundle) {
        display.info("Running", "Systemjs builder for Vendor");

        const modulesConfig = clientPackages.buildModuleConfig(uniteConfig, ["app", "both"], buildConfiguration.minify);
        let keys = [];
        let systemJsLoaderFile = "";

        for (const key in modulesConfig.paths) {
            if (key === "systemjs") {
                systemJsLoaderFile = `${modulesConfig.paths[key]}.js`;
            } else {
                keys.push(key);
            }
        }
        keys = keys.concat(modulesConfig.packages.map(pkg => pkg.name));

        fs.readFile(systemJsLoaderFile, (err, systemJsScript) => {
            if (err) {
                display.error(err);
                process.exit(1);
            } else {
                fs.writeFile(path.join(uniteConfig.directories.dist, "vendor-bundle-init.js"),
                    `System.register(${JSON.stringify(keys)}, function () {});`,
                    (err2) => {
                        if (err2) {
                            display.error(err2);
                            process.exit(1);
                        }

                        const builder = new Builder("./", `${uniteConfig.directories.dist}app-module-config.js`);

                        builder.bundle(path.join(uniteConfig.directories.dist, "vendor-bundle-init.js"),
                            path.join(uniteConfig.directories.dist, "vendor-bundle.js"),
                            {
                                "minify": buildConfiguration.minify
                            })
                            .then(() => {
                                return gulp.src(path.join(uniteConfig.directories.dist, "vendor-bundle.js"))
                                    .pipe(insert.prepend(systemJsScript))
                                    .pipe(gulp.dest(uniteConfig.directories.dist))
                                    .on("end", cb);
                            })
                            .catch((err3) => {
                                display.error(err3);
                                process.exit(1);
                            });
                    });
            }
        });
    } else {
        cb();
    }
});

/* Generated by UniteJS */
