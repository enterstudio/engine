/**
 * Gulp utils for CommonJS module configuration.
 */
const os = require("os");
const clientPackages = require("./client-packages");

function create (uniteConfig, includeModes, isBundle) {
    /* We use the SystemJS loader for CommonJS modules when testing and unbundled, 
    we need to specify the module format as cjs for it to work */
    const moduleConfig = clientPackages.buildModuleConfig(uniteConfig, includeModes, false);

    if (isBundle && moduleConfig.paths.systemjs) {
        moduleConfig.paths.systemjs = `${moduleConfig.paths.systemjs}-production`;
    }

    const sjsPackages = {};
    sjsPackages[""] = {"defaultExtension": "js"};

    Object.keys(moduleConfig.paths).forEach(key => {
        moduleConfig.paths[key] = moduleConfig.paths[key].replace(/\.\//, "");
    });
    moduleConfig.packages.forEach((pkg) => {
        moduleConfig.paths[pkg.name] = pkg.location.replace(/\.\//, "");
        sjsPackages[pkg.name] = {
            "main": pkg.main
        };
    });

    const sjsConfig = {
        "paths": moduleConfig.paths,
        "packages": sjsPackages,
        "map": {
            "text": "systemjs-plugin-text"
        },
        "meta": {
            "dist/*": {
                "format": "cjs"
            },
            "*.html": {
                "loader": "text"
            },
            "*.css": {
                "loader": "css"
            }
        }
    };

    const jsonConfig = JSON.stringify(sjsConfig, undefined, "\t");
    const jsonPreload = JSON.stringify(moduleConfig.preload, undefined, "\t");

    let config = `SystemJS.config(${jsonConfig});${os.EOL}`;
    config += `preloadModules = ${jsonPreload};${os.EOL}`;

    return config;
}

module.exports = {
    create
};

/* Generated by UniteJS */
