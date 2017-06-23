"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Pipeline step to generate eslint configuration.
 */
const esLintConfiguration_1 = require("../../configuration/models/eslint/esLintConfiguration");
const esLintParserOptions_1 = require("../../configuration/models/eslint/esLintParserOptions");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class EsLint extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDependencies(["eslint"], uniteConfiguration.linter === "ESLint", true);
            if (uniteConfiguration.linter === "ESLint") {
                try {
                    if (uniteConfiguration.sourceLanguage !== "JavaScript") {
                        throw new Error("You can only use ESLint when the source language is JavaScript");
                    }
                    _super("log").call(this, logger, display, `Generating ${EsLint.FILENAME}`);
                    let existing;
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.rootFolder, EsLint.FILENAME);
                        if (exists) {
                            existing = yield fileSystem.fileReadJson(engineVariables.rootFolder, EsLint.FILENAME);
                        }
                    }
                    catch (err) {
                        _super("error").call(this, logger, display, `Reading existing ${EsLint.FILENAME} failed`, err);
                        return 0;
                    }
                    const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                    yield fileSystem.fileWriteJson(engineVariables.rootFolder, EsLint.FILENAME, config);
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${EsLint.FILENAME} failed`, err);
                    return 1;
                }
                try {
                    const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.rootFolder, EsLint.FILENAME2);
                    if (hasGeneratedMarker) {
                        _super("log").call(this, logger, display, `Generating ${EsLint.FILENAME2} Configuration`);
                        const lines = [];
                        lines.push("dist/*");
                        lines.push("build/*");
                        lines.push("test/unit/unit-bootstrap.js");
                        lines.push("test/unit/unit-module-config.js");
                        lines.push(_super("wrapGeneratedMarker").call(this, "# ", ""));
                        yield fileSystem.fileWriteLines(engineVariables.rootFolder, EsLint.FILENAME2, lines);
                    }
                    else {
                        _super("log").call(this, logger, display, `Skipping ${EsLint.FILENAME2} as it has no generated marker`);
                    }
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${EsLint.FILENAME2} failed`, err);
                    return 1;
                }
            }
            else {
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.rootFolder, EsLint.FILENAME);
                    if (exists) {
                        yield fileSystem.fileDelete(engineVariables.rootFolder, EsLint.FILENAME);
                    }
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Deleting ${EsLint.FILENAME} failed`, err);
                    return 1;
                }
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.rootFolder, EsLint.FILENAME2);
                    if (exists) {
                        yield fileSystem.fileDelete(engineVariables.rootFolder, EsLint.FILENAME2);
                    }
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Deleting ${EsLint.FILENAME2} failed`, err);
                    return 1;
                }
            }
            return 0;
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, existing) {
        const config = new esLintConfiguration_1.EsLintConfiguration();
        config.parserOptions = new esLintParserOptions_1.EsLintParserOptions();
        config.parserOptions.ecmaVersion = 6;
        config.parserOptions.sourceType = "module";
        config.extends = "eslint:recommended";
        config.env = {};
        config.globals = {};
        config.rules = {};
        if (existing) {
            config.globals = existing.globals || config.globals;
            config.rules = existing.rules || config.rules;
            config.env = existing.env || config.env;
            config.extends = existing.extends || config.extends;
        }
        config.env.browser = true;
        if (uniteConfiguration.unitTestFramework === "Jasmine") {
            config.env.jasmine = true;
            if (config.env.mocha) {
                delete config.env.mocha;
            }
        }
        else if (uniteConfiguration.unitTestFramework === "Mocha-Chai") {
            config.env.mocha = true;
            if (config.env.jasmine) {
                delete config.env.jasmine;
            }
        }
        return config;
    }
}
EsLint.FILENAME = ".eslintrc.json";
EsLint.FILENAME2 = ".eslintignore";
exports.EsLint = EsLint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvbGludC9lc0xpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsK0ZBQTRGO0FBQzVGLCtGQUE0RjtBQUU1RixnRkFBNkU7QUFNN0UsWUFBb0IsU0FBUSwrQ0FBc0I7SUFJakMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTdGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUM7b0JBQ0QsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQ3JELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztvQkFDdEYsQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFFNUQsSUFBSSxRQUFRLENBQUM7b0JBQ2IsSUFBSSxDQUFDO3dCQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDeEYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDVCxRQUFRLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUFzQixlQUFlLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDL0csQ0FBQztvQkFDTCxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FB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
