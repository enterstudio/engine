/**
 * Gulp tasks for protractor e2e testing.
 */
const gulp = require("gulp");
const minimist = require("minimist");
const display = require("../../util/display");
const exec = require("../../util/exec");
gulp.task("e2e-install", async () => {
    display.info("Running", "Webdriver Manager");
    const allDrivers = ["chrome", "firefox", "edge", "ie"];
    const knownOptions = {
        default: {
            drivers: allDrivers.join(",")
        },
        string: [
            "drivers"
        ]
    };
    const options = minimist(process.argv.slice(2), knownOptions);
    const args = ["update"];
    const selectedDrivers = options.drivers.split(",").map(selected => selected.split("@"));
    allDrivers.forEach(driver => {
        const foundDriver = selectedDrivers.find(selected => selected[0] === driver);
        const actualDriver = driver === "firefox" ? "gecko" : driver;
        args.push(`--${actualDriver}${foundDriver ? "=true" : "=false"}`);
        if (foundDriver && foundDriver.length === 2) {
            args.push(`--versions.${actualDriver}=${foundDriver[1]}`);
        }
    });
    display.info("Args", args);
    try {
        await exec.npmRun("webdriver-manager", args);
    } catch (err) {
        display.error("Executing webdriver-manager", err);
        process.exit(1);
    }
});
// Generated by UniteJS
