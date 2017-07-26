/**
 * Gulp tasks for bundling RequireJS modules.
 */
const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const uc = require("./util/unite-config");
const display = require("./util/display");
const clientPackages = require("./util/client-packages");
const requireJs = require("requirejs");

gulp.task("build-bundle-vendor", (cb) => {
    const uniteConfig = uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration();

    if (buildConfiguration.bundle) {
        display.info("Running", "Require js optimizer for Vendor");

        const modulesConfig = clientPackages.buildModuleConfig(uniteConfig, ["app", "both"], buildConfiguration.minify);
        const keys = [];

        if (modulesConfig.paths.requirejs) {
            modulesConfig.paths.requireLib = modulesConfig.paths.requirejs;
            delete modulesConfig.paths.requirejs;
        }
        for (const key in modulesConfig.paths) {
            modulesConfig.paths[key] = `../${modulesConfig.paths[key].replace(/(\.js)$/, "")}`;
            keys.push(key);
        }
        modulesConfig.packages.forEach(pkg => {
            pkg.location = `../${pkg.location}`;
            keys.push(pkg.name);
        });

        fs.writeFile(path.join(uniteConfig.directories.dist, "vendor-bundle-init.js"),
            `define(${JSON.stringify(keys)}, function () {});`,
            (err) => {
                if (err) {
                    display.error(err);
                    process.exit(1);
                }

                try {
                    requireJs.optimize({
                        "baseUrl": uniteConfig.directories.dist,
                        "generateSourceMaps": buildConfiguration.sourcemaps,
                        "logLevel": 2,
                        "name": "vendor-bundle-init",
                        "optimize": buildConfiguration.minify ? "uglify" : "none",
                        "out": path.join(uniteConfig.directories.dist, "vendor-bundle.js"),
                        "paths": modulesConfig.paths,
                        "packages": modulesConfig.packages
                    }, (result) => {
                        display.log(result);
                        cb();
                    }, (err2) => {
                        display.error(err2);
                        process.exit(1);
                    });
                } catch (err3) {
                    display.error(err3);
                    process.exit(1);
                }
            });
    } else {
        cb();
    }
});

/* Generated by UniteJS */
