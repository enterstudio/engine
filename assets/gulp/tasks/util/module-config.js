/**
 * Gulp utils for AMD module configuration.
 */
const os = require("os");
const clientPackages = require("./client-packages");

function createRequireJS (uniteConfig, includeModes, isBundle, mapBase) {
    const moduleConfig = clientPackages.buildModuleConfig(uniteConfig, includeModes, isBundle);

    const rjsConfig = {
        "paths": moduleConfig.paths,
        "packages": moduleConfig.packages,
        "map": {
            "*": {}
        }
    };

    if (mapBase) {
        rjsConfig.baseUrl = mapBase;
    }

    Object.keys(moduleConfig.map).forEach(key => {
        rjsConfig.map["*"][key] = moduleConfig.map[key];
    });

    const jsonConfig = JSON.stringify(rjsConfig, undefined, "\t");
    const jsonPreload = JSON.stringify(moduleConfig.preload, undefined, "\t");

    let config = `require.config(${jsonConfig});${os.EOL}`;
    config += `preloadModules = ${jsonPreload};${os.EOL}`;

    return config;
}

function createSystemJS (uniteConfig, includeModes, isBundle, mapBase) {
    const moduleConfig = clientPackages.buildModuleConfig(uniteConfig, includeModes, isBundle);

    let format = null;

    const moduleTypeLower = uniteConfig.moduleType.toLowerCase();
    if (moduleTypeLower === "amd") {
        format = "amd";
    } else if (moduleTypeLower === "commonjs") {
        format = "cjs";
    } else if (moduleTypeLower === "systemjs") {
        format = "system";
    }

    const sjsConfig = {
        "paths": moduleConfig.paths,
        "packages": {},
        "map": {},
        "meta": {
            "dist/*": {
                format
            }
        }
    };

    if (mapBase) {
        sjsConfig.baseURL = mapBase;
    }

    sjsConfig.packages[""] = {"defaultExtension": "js"};

    Object.keys(moduleConfig.paths).forEach(key => {
        moduleConfig.paths[key] = moduleConfig.paths[key].replace(/\.\//, "");
    });
    Object.keys(moduleConfig.map).forEach(key => {
        moduleConfig.map[key] = moduleConfig.map[key].replace(/\.\//, mapBase);
    });
    moduleConfig.packages.forEach((pkg) => {
        moduleConfig.paths[pkg.name] = pkg.location.replace(/\.\//, "");
        sjsConfig.packages[pkg.name] = {
            "main": pkg.main
        };
    });
    Object.keys(moduleConfig.map).forEach(key => {
        sjsConfig.map[key] = moduleConfig.map[key];
    });
    Object.keys(moduleConfig.loaders).forEach(key => {
        sjsConfig.meta[key] = {"loader": moduleConfig.loaders[key]};
    });

    const jsonConfig = JSON.stringify(sjsConfig, undefined, "\t");
    const jsonPreload = JSON.stringify(moduleConfig.preload, undefined, "\t");

    let config = `SystemJS.config(${jsonConfig});${os.EOL}`;
    config += `preloadModules = ${jsonPreload};${os.EOL}`;

    return config;
}

function create (uniteConfig, includeModes, isBundle, mapBase) {
    let loader = null;
    const bundlerLower = uniteConfig.bundler.toLowerCase();

    if (bundlerLower === "requirejs") {
        loader = "rjs";
    } else if ((isBundle && bundlerLower === "systemjsbuilder") ||
            (!isBundle && (bundlerLower === "browserify" ||
                bundlerLower === "systemjsbuilder" ||
                bundlerLower === "webpack"))) {
        loader = "sjs";
    }

    if (loader === "rjs") {
        return createRequireJS(uniteConfig, includeModes, isBundle, mapBase);
    } else if (loader === "sjs") {
        return createSystemJS(uniteConfig, includeModes, isBundle, mapBase);
    }
}

module.exports = {
    create
};

/* Generated by UniteJS */
