/**
 * Gulp tasks for electron platform.
 */
const display = require("./util/display");
const uc = require("./util/unite-config");
const gulp = require("gulp");
const runSequence = require("run-sequence");
const util = require("util");
const path = require("path");
const del = require("del");
const deleteEmpty = require("delete-empty");
const fs = require("fs");
const os = require("os");
const exec = require("./util/exec");
const asyncUtil = require("./util/async-util");
const platformUtils = require("./util/platform-utils");
const packageConfig = require("./util/package-config");

const DEF_RUNTIME_VERSION = "1.7.9";

function getDefaultArchs () {
    let defArch = [];
    const platform = os.platform();
    const arch = os.arch();

    if (platform === "win32") {
        if (arch === "x64") {
            defArch = ["win32/x64"];
        } else {
            defArch = ["win32/ia32"];
        }
    } else if (platform === "darwin") {
        defArch = ["darwin/x64"];
    } else if (platform === "linux" ||
        platform === "openbsd" ||
        platform === "freebsd" ||
        platform === "aix") {
        if (arch === "x64") {
            defArch = ["linux/x64"];
        } else {
            defArch = ["linux/ia32"];
        }
    } else {
        display.error("Unable to determine your platform/architecture combination.");
        display.error("Please specify the --platformArch command line option or");
        display.error("add values in unite.json->platforms->electron->platformArch.");
        process.exit(1);
    }

    return defArch;
}

gulp.task("platform-electron-package", async () => {
    try {
        await util.promisify(runSequence)(
            "platform-electron-clean",
            "platform-electron-gather",
            "platform-electron-bundle",
            "platform-electron-compress"
        );
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("platform-electron-clean", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const packageJson = await packageConfig.getPackageJson();
    const platformSettings = platformUtils.getConfig(uniteConfig, "Electron");
    const platformArchs = platformSettings.platformArch || getDefaultArchs();

    const toClean = [
        path.join(
            "../",
            uniteConfig.dirs.packagedRoot,
            `/${packageJson.version}/electron/**/*`
        )
    ];

    platformArchs.forEach(platformArch => {
        const parts = platformArch.split("/");
        if (parts.length === 2) {
            toClean.push(path.join(
                "../",
                uniteConfig.dirs.packagedRoot,
                `/${packageJson.version}/electron_${parts[0]}_${parts[1]}/**/*`
            ));
            toClean.push(path.join(
                "../",
                uniteConfig.dirs.packagedRoot,
                `/${packageJson.version}_electron_${parts[0]}_${parts[1]}.zip`
            ));
        }
    });

    display.info("Cleaning", toClean);
    try {
        await del(toClean, {"force": true});
        await util.promisify(deleteEmpty)(
            path.join(
                "../",
                uniteConfig.dirs.packagedRoot,
                `/${packageJson.version}/`
            ),
            {"verbose": false}
        );
    } catch (err) {
        display.error(err);
        process.exit(1);
    }
});

gulp.task("platform-electron-gather", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const uniteThemeConfig = await uc.getUniteThemeConfig(uniteConfig);
    const platformSrc = await platformUtils.gatherFiles("Electron");

    const platformSettings = platformUtils.getConfig(uniteConfig, "Electron");

    const platformArchs = platformSettings.platformArch || getDefaultArchs();

    const hasLinux = platformArchs.filter(platformArch => platformArch.startsWith("linux")).length > 0;
    const hasDarwin = platformArchs.filter(platformArch =>
        platformArch.startsWith("darwin") || platformArch.startsWith("mas")).length > 0;

    const linuxPng = path.join(platformSrc, "/assets/favicon/", "linux-1024.png");
    const osxIcns = path.join(platformSrc, "/assets/favicon/", "osx.icns");

    if (hasLinux) {
        try {
            const args = [
                "svgToPng",
                `--sourceFile=${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
                `--destFile=${linuxPng}`,
                "--width=1024",
                "--height=1024",
                "--marginX=102",
                "--marginY=102",
                `--background=${uniteThemeConfig.backgroundColor}`
            ];
            await exec.npmRun("unite-image", args);
        } catch (err) {
            display.error("Executing unite-image", err);
            process.exit(1);
        }
    }

    if (hasDarwin) {
        try {
            const darwinTransparentPng = path.join(platformSrc, "/assets/favicon/", "darwin-transparent-1024.png");
            const args = [
                "svgToPng",
                `--sourceFile=${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-transparent.svg")}`,
                `--destFile=${darwinTransparentPng}`,
                "--width=1024",
                "--height=1024",
                "--marginX=102",
                "--marginY=102"
            ];
            await exec.npmRun("unite-image", args);

            const args2 = [
                "pngToIcns",
                `--sourceFile=${darwinTransparentPng}`,
                `--destFile=${osxIcns}`
            ];
            await exec.npmRun("unite-image", args2);
        } catch (err) {
            display.error("Executing unite-image", err);
            process.exit(1);
        }
    }

    await asyncUtil.stream(gulp.src(path.join(platformSrc, "index.html"))
        .pipe(gulp.dest(platformSrc)));

    return asyncUtil.stream(gulp.src(path.join(uniteConfig.dirs.www.build, "/assets/platform/electron/main.js"))
        .pipe(gulp.dest(platformSrc)));
});

gulp.task("platform-electron-bundle", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const packageJson = await packageConfig.getPackageJson();

    const platformSettings = platformUtils.getConfig(uniteConfig, "Electron");

    const platformArchs = platformSettings.platformArch || getDefaultArchs();
    const runtimeVersion = platformSettings.runtimeVersion || DEF_RUNTIME_VERSION;

    const srcFolder = path.join(
        "../",
        uniteConfig.dirs.packagedRoot,
        `/${packageJson.version}/electron/`
    );

    const electronPackageVersion = {
        "name": packageJson.name,
        "version": packageJson.version,
        "main": "main.js"
    };

    try {
        await util.promisify(fs.writeFile)(
            path.join(srcFolder, "package.json"),
            JSON.stringify(electronPackageVersion, undefined, "\t")
        );
    } catch (err) {
        display.error("Writing package.json", err);
        process.exit(1);
    }

    for (let i = 0; i < platformArchs.length; i++) {
        display.info("Bundling Electron", platformArchs[i]);

        const parts = platformArchs[i].split("/");
        if (parts.length === 2) {
            const platform = parts[0];
            const architecture = parts[1];

            const bundleFolder = path.join(
                "../",
                uniteConfig.dirs.packagedRoot,
                `/${packageJson.version}/`
            );
            const args = [
                srcFolder,
                packageJson.name,
                `--platform=${platform}`,
                `--arch=${architecture}`,
                "--no-prune",
                "--overwrite",
                `--out=${bundleFolder}`,
                `--electron-version=${runtimeVersion}`,
                "--asar"
            ];

            let iconFilename = "";
            if (platform === "win32") {
                iconFilename = "favicon.ico";
            } else if (platform === "linux") {
                iconFilename = "linux-1024.png";
            } else if (platform === "darwin" || platform === "mas") {
                iconFilename = "osx.icns";
            }
            if (iconFilename.length > 0) {
                const iconFile = path.join(bundleFolder, "/electron/assets/favicon/", iconFilename);
                const iconExists = await asyncUtil.fileExists(iconFile);
                if (iconExists) {
                    args.push(`--icon=${iconFile}`);
                }
            }

            Object.keys(platformSettings).forEach(platformSetting => {
                if (platformSetting !== "runtimeVersion" && platformSetting !== "platformArch") {
                    args.push(`--${platformSetting}`, platformSettings[platformSetting]);
                }
            });

            try {
                await exec.npmRun("electron-packager", args);
            } catch (err) {
                display.error("Executing electron-packager", err);
                process.exit(1);
            }
            try {
                await util.promisify(fs.rename)(
                    path.join(bundleFolder, `${packageJson.name}-${platform}-${architecture}`),
                    path.join(bundleFolder, `electron_${platform}_${architecture}`)
                );
            } catch (err) {
                display.error("Renaming folder", err);
                process.exit(1);
            }
        } else {
            display.error(`Malformed platformArch '${platformArchs[i]}'`);
            process.exit(1);
        }
    }
});

gulp.task("platform-electron-compress", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const packageJson = await packageConfig.getPackageJson();
    const platformSettings = platformUtils.getConfig(uniteConfig, "Electron");
    const platformArchs = platformSettings.platformArch || getDefaultArchs();

    for (let i = 0; i < platformArchs.length; i++) {
        const parts = platformArchs[i].split("/");
        if (parts.length === 2) {
            const platform = parts[0];
            const architecture = parts[1];

            display.info("Zipping File", "Electron");
            const zipName = `${packageJson.version}_electron_${platform}_${architecture}.zip`;

            display.info("To File", zipName);
            await asyncUtil.zipFolder(
                path.join(
                    "../",
                    uniteConfig.dirs.packagedRoot,
                    `/${packageJson.version}/electron_${platform}_${architecture}/`
                ),
                path.join("../", uniteConfig.dirs.packagedRoot, zipName)
            );
        } else {
            display.error(`Malformed platformArch '${platformArchs[i]}'`);
            process.exit(1);
        }
    }
});

gulp.task("platform-electron-dev", async () => {
    try {
        await util.promisify(runSequence)(
            "platform-electron-dev-clean",
            "platform-electron-dev-create",
            "platform-electron-post-clean",
        );
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("platform-electron-dev-clean", async () => {
    const uniteConfig = await uc.getUniteConfig();

    const devFolder = path.join(
        "../",
        uniteConfig.dirs.platformRoot,
        "/electron/"
    );

    const toClean = [devFolder];

    display.info("Cleaning", toClean);
    try {
        await del(toClean, {"force": true});
        await util.promisify(deleteEmpty)(
            devFolder,
            {"verbose": false}
        );
    } catch (err) {
        display.error(err);
        process.exit(1);
    }
});

gulp.task("platform-electron-dev-create", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const packageJson = await packageConfig.getPackageJson();

    const platformSettings = platformUtils.getConfig(uniteConfig, "Electron");

    const platformArchs = platformSettings.platformArch || getDefaultArchs();
    const runtimeVersion = platformSettings.runtimeVersion || DEF_RUNTIME_VERSION;

    const electronFolder = path.join(
        "../",
        uniteConfig.dirs.platformRoot,
        "/electron/"
    );

    try {
        await util.promisify(fs.mkdir)(electronFolder);
    } catch (err) {
        display.error("Creating directory failed", err);
        process.exit(1);
    }

    const devTempFolder = path.join(electronFolder, "temp");

    try {
        await util.promisify(fs.mkdir)(devTempFolder);
    } catch (err) {
        display.error("Creating directory failed", err);
        process.exit(1);
    }

    const electronPackageVersion = {
        "name": packageJson.name,
        "version": packageJson.version,
        "main": "main-dev.js"
    };

    try {
        await util.promisify(fs.writeFile)(
            path.join(devTempFolder, "package.json"),
            JSON.stringify(electronPackageVersion, undefined, "\t")
        );
    } catch (err) {
        display.error("Writing package.json", err);
        process.exit(1);
    }

    try {
        const wwwBuildAssetFolder = path.join(
            "../",
            uniteConfig.dirs.wwwRoot,
            uniteConfig.dirs.www.build,
            "/assets/platform/electron/"
        );

        const content = await util.promisify(fs.readFile)(path.join(wwwBuildAssetFolder, "main-dev.js"));

        await util.promisify(fs.writeFile)(path.join(
            devTempFolder,
            "main-dev.js"
        ), content);
    } catch (err) {
        display.error("Copying file", err);
        process.exit(1);
    }

    for (let i = 0; i < platformArchs.length; i++) {
        display.info("Creating Electron Dev", platformArchs[i]);

        const parts = platformArchs[i].split("/");

        if (parts.length === 2) {
            const platform = parts[0];
            const architecture = parts[1];

            const devFolder = path.join(
                "../",
                uniteConfig.dirs.platformRoot,
                "/electron/"
            );
            const args = [
                devTempFolder,
                packageJson.name,
                `--platform=${platform}`,
                `--arch=${architecture}`,
                "--no-prune",
                "--overwrite",
                `--out=${devFolder}`,
                `--electron-version=${runtimeVersion}`
            ];

            Object.keys(platformSettings).forEach(platformSetting => {
                if (platformSetting !== "runtimeVersion" && platformSetting !== "platformArch") {
                    args.push(`--${platformSetting}`, platformSettings[platformSetting]);
                }
            });

            try {
                await exec.npmRun("electron-packager", args);
            } catch (err) {
                display.error("Executing electron-packager", err);
                process.exit(1);
            }
            try {
                await util.promisify(fs.rename)(
                    path.join(devFolder, `${packageJson.name}-${platform}-${architecture}`),
                    path.join(devFolder, `${platform}-${architecture}`)
                );
            } catch (err) {
                display.error("Renaming folder", err);
                process.exit(1);
            }
        } else {
            display.error(`Malformed platformArch '${platformArchs[i]}'`);
            process.exit(1);
        }
    }
});

gulp.task("platform-electron-post-clean", async () => {
    const uniteConfig = await uc.getUniteConfig();

    const devTempFolder = path.join(
        "../",
        uniteConfig.dirs.platformRoot,
        "/electron/temp/"
    );

    const toClean = [devTempFolder];

    display.info("Cleaning", toClean);
    try {
        await del(toClean, {"force": true});
    } catch (err) {
        display.error(err);
        process.exit(1);
    }
});

/* Generated by UniteJS */
