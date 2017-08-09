/**
 * Gulp utils for async utils.
 */
const display = require("./display");
const util = require("util");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

function stream (gulpStream, storeMethod) {
    return new Promise((resolve, reject) => {
        gulpStream.on("error", reject);
        gulpStream.on("end", resolve);
        if (storeMethod) {
            storeMethod(resolve, reject);
        }
    });
}

async function fileExists (filename) {
    try {
        const stat = await util.promisify(fs.stat)(filename);
        return stat.isFile();
    } catch (err) {
        if (err.code !== "ENOENT") {
            display.error(`Error accessing '${filename}`, err);
            process.exit(1);
        }
        return false;
    }
}

function zipFolder (sourceFolder, destFile) {
    return new Promise((resolve) => {
        const fullPath = path.resolve(sourceFolder);

        const output = fs.createWriteStream(destFile);
        const archive = archiver("zip");

        output.on("close", () => {
            resolve();
        });

        archive.on("warning", (err) => {
            if (err.code === "ENOENT") {
                display.warning(err);
            } else {
                display.error(err);
                process.exit(1);
            }
        });

        archive.on("error", (err) => {
            display.error(err);
            process.exit(1);
        });

        archive.on("entry", (entryData) => {
            display.info("Adding", entryData.name);
        });

        archive.pipe(output);

        archive.directory(fullPath, "");

        archive.finalize();
    });
}

module.exports = {
    stream,
    fileExists,
    zipFolder
};

/* Generated by UniteJS */
