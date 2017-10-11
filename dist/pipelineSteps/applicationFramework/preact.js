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
 * Pipeline step to generate scaffolding for Preact application.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const sharedAppFramework_1 = require("../sharedAppFramework");
class Preact extends sharedAppFramework_1.SharedAppFramework {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.applicationFramework, "Preact");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                if (_super("condition").call(this, uniteConfiguration.moduleType, "AMD") || _super("condition").call(this, uniteConfiguration.moduleType, "SystemJS")) {
                    logger.error(`Preact does not support moduleType ${uniteConfiguration.moduleType}`);
                    return 1;
                }
                arrayHelper_1.ArrayHelper.addRemove(uniteConfiguration.viewExtensions, "html", true);
                arrayHelper_1.ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "tsx", _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript"));
                arrayHelper_1.ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "jsx", _super("condition").call(this, uniteConfiguration.sourceLanguage, "JavaScript"));
            }
            return 0;
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["babel-plugin-transform-react-jsx"], mainCondition && _super("condition").call(this, uniteConfiguration.sourceLanguage, "JavaScript"));
            engineVariables.toggleDevDependency(["eslint-plugin-react"], mainCondition && _super("condition").call(this, uniteConfiguration.linter, "ESLint"));
            engineVariables.toggleDevDependency(["unitejs-preact-protractor-plugin"], mainCondition && _super("condition").call(this, uniteConfiguration.e2eTestRunner, "Protractor"));
            engineVariables.toggleDevDependency(["unitejs-preact-webdriver-plugin"], mainCondition && _super("condition").call(this, uniteConfiguration.e2eTestRunner, "WebdriverIO"));
            engineVariables.toggleClientPackage("preact", "dist/preact.dev.js", "dist/preact.min.js", undefined, false, "both", "none", false, undefined, undefined, undefined, undefined, mainCondition);
            engineVariables.toggleClientPackage("preact-router", "dist/preact-router.js", undefined, undefined, false, "both", "none", false, undefined, undefined, undefined, undefined, mainCondition);
            engineVariables.toggleClientPackage("systemjs-plugin-css", "css.js", undefined, undefined, false, "both", "none", false, undefined, { css: "systemjs-plugin-css" }, { "*.css": "css" }, undefined, mainCondition &&
                (_super("condition").call(this, uniteConfiguration.bundler, "Browserify") ||
                    _super("condition").call(this, uniteConfiguration.bundler, "SystemJSBuilder") ||
                    _super("condition").call(this, uniteConfiguration.bundler, "Webpack")));
            const esLintConfiguration = engineVariables.getConfiguration("ESLint");
            if (esLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.parserOptions.ecmaFeatures, "jsx", true, mainCondition);
                arrayHelper_1.ArrayHelper.addRemove(esLintConfiguration.extends, "plugin:react/recommended", mainCondition);
                arrayHelper_1.ArrayHelper.addRemove(esLintConfiguration.plugins, "react", mainCondition);
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.rules, "no-unused-vars", 1, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(esLintConfiguration.settings, "react", { pragma: "h" }, mainCondition);
            }
            const tsLintConfiguration = engineVariables.getConfiguration("TSLint");
            if (tsLintConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty", { severity: "warning" }, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "no-empty-interface", { severity: "warning" }, mainCondition);
                objectHelper_1.ObjectHelper.addRemove(tsLintConfiguration.rules, "variable-name", [true, "allow-leading-underscore"], mainCondition);
            }
            const babelConfiguration = engineVariables.getConfiguration("Babel");
            if (babelConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(babelConfiguration.plugins, ["transform-react-jsx", { pragma: "h" }], mainCondition, (obj, item) => Array.isArray(item) && item.length > 0 && item[0] === obj[0]);
            }
            const protractorConfiguration = engineVariables.getConfiguration("Protractor");
            if (protractorConfiguration) {
                const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "unitejs-preact-protractor-plugin")));
                arrayHelper_1.ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, mainCondition, (object, item) => object.path === item.path);
            }
            const webdriverIoPlugins = engineVariables.getConfiguration("WebdriverIO.Plugins");
            if (webdriverIoPlugins) {
                arrayHelper_1.ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-preact-webdriver-plugin", mainCondition);
            }
            const typeScriptConfiguration = engineVariables.getConfiguration("TypeScript");
            if (typeScriptConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "jsx", "react", mainCondition);
                objectHelper_1.ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "jsxFactory", "h", mainCondition);
                objectHelper_1.ObjectHelper.addRemove(typeScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
            }
            const javaScriptConfiguration = engineVariables.getConfiguration("JavaScript");
            if (javaScriptConfiguration) {
                objectHelper_1.ObjectHelper.addRemove(javaScriptConfiguration.compilerOptions, "experimentalDecorators", true, mainCondition);
            }
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                const sourceExtension = _super("condition").call(this, uniteConfiguration.sourceLanguage, "TypeScript") ? ".ts" : ".js";
                let ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [
                    `app${sourceExtension}x`,
                    `child/child${sourceExtension}x`,
                    `bootstrapper${sourceExtension}`,
                    `entryPoint${sourceExtension}`
                ]);
                if (ret === 0) {
                    ret = yield _super("generateAppCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables, [`child/child`]);
                    if (ret === 0) {
                        ret = yield _super("generateE2eTest").call(this, logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`]);
                        if (ret === 0) {
                            ret = yield this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`app.spec${sourceExtension}`, `bootstrapper.spec${sourceExtension}`], true);
                            if (ret === 0) {
                                ret = yield _super("generateCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables);
                            }
                        }
                    }
                }
                return ret;
            }
            else {
                return 0;
            }
        });
    }
}
exports.Preact = Preact;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3ByZWFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RUFBeUU7QUFDekUsOEVBQTJFO0FBVzNFLDhEQUEyRDtBQUUzRCxZQUFvQixTQUFRLHVDQUFrQjtJQUNuQyxhQUFhLENBQUMsa0JBQXNDLEVBQUUsZUFBZ0M7UUFDekYsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVZLFVBQVUsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7WUFDOUosRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsRUFBRSxDQUFDLENBQUMsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsS0FBSyxLQUFLLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEgsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQ0FBc0Msa0JBQWtCLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztvQkFDcEYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRXZFLHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFDMUMsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsWUFBWSxFQUFFLENBQUM7Z0JBRXhGLHlCQUFXLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFDMUMsbUJBQWUsWUFB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QUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNaLEdBQUcsR0FBRyxNQUFNLHlCQUFxQixZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLENBQUMsV0FBVyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBRTNILEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNaLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxDQUFDLFdBQVcsZUFBZSxFQUFFLEVBQUUsb0JBQW9CLGVBQWUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBRXhLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNaLEdBQUcsR0FBRyxNQUFNLHFCQUFpQixZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7NEJBQzNGLENBQUM7d0JBQ0wsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBL0pELHdCQStKQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3ByZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBzY2FmZm9sZGluZyBmb3IgUHJlYWN0IGFwcGxpY2F0aW9uLlxuICovXG5pbXBvcnQgeyBBcnJheUhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvYXJyYXlIZWxwZXJcIjtcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IEJhYmVsQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9iYWJlbC9iYWJlbENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVzTGludENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvZXNsaW50L2VzTGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFByb3RyYWN0b3JDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3Byb3RyYWN0b3IvcHJvdHJhY3RvckNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFRzTGludENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdHNsaW50L3RzTGludENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFR5cGVTY3JpcHRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3R5cGVTY3JpcHQvdHlwZVNjcmlwdENvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEphdmFTY3JpcHRDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3ZzY29kZS9qYXZhU2NyaXB0Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFNoYXJlZEFwcEZyYW1ld29yayB9IGZyb20gXCIuLi9zaGFyZWRBcHBGcmFtZXdvcmtcIjtcblxuZXhwb3J0IGNsYXNzIFByZWFjdCBleHRlbmRzIFNoYXJlZEFwcEZyYW1ld29yayB7XG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrLCBcIlByZWFjdFwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAobWFpbkNvbmRpdGlvbikge1xuICAgICAgICAgICAgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSwgXCJBTURcIikgfHwgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlLCBcIlN5c3RlbUpTXCIpKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBQcmVhY3QgZG9lcyBub3Qgc3VwcG9ydCBtb2R1bGVUeXBlICR7dW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGV9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZSh1bml0ZUNvbmZpZ3VyYXRpb24udmlld0V4dGVuc2lvbnMsIFwiaHRtbFwiLCB0cnVlKTtcblxuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHVuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VFeHRlbnNpb25zLCBcInRzeFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiVHlwZVNjcmlwdFwiKSk7XG5cbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZSh1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlRXh0ZW5zaW9ucywgXCJqc3hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLCBcIkphdmFTY3JpcHRcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbmZpZ3VyZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLXJlYWN0LWpzeFwiXSwgbWFpbkNvbmRpdGlvbiAmJiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLCBcIkphdmFTY3JpcHRcIikpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJlc2xpbnQtcGx1Z2luLXJlYWN0XCJdLCBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubGludGVyLCBcIkVTTGludFwiKSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1widW5pdGVqcy1wcmVhY3QtcHJvdHJhY3Rvci1wbHVnaW5cIl0sIG1haW5Db25kaXRpb24gJiYgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLCBcIlByb3RyYWN0b3JcIikpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ1bml0ZWpzLXByZWFjdC13ZWJkcml2ZXItcGx1Z2luXCJdLCBtYWluQ29uZGl0aW9uICYmIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJXZWJkcml2ZXJJT1wiKSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXG4gICAgICAgICAgICBcInByZWFjdFwiLFxuICAgICAgICAgICAgXCJkaXN0L3ByZWFjdC5kZXYuanNcIixcbiAgICAgICAgICAgIFwiZGlzdC9wcmVhY3QubWluLmpzXCIsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIFwiYm90aFwiLFxuICAgICAgICAgICAgXCJub25lXCIsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG1haW5Db25kaXRpb24pO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFxuICAgICAgICAgICAgXCJwcmVhY3Qtcm91dGVyXCIsXG4gICAgICAgICAgICBcImRpc3QvcHJlYWN0LXJvdXRlci5qc1wiLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBcImJvdGhcIixcbiAgICAgICAgICAgIFwibm9uZVwiLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcbiAgICAgICAgICAgIFwic3lzdGVtanMtcGx1Z2luLWNzc1wiLFxuICAgICAgICAgICAgXCJjc3MuanNcIixcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgXCJib3RoXCIsXG4gICAgICAgICAgICBcIm5vbmVcIixcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgeyBjc3M6IFwic3lzdGVtanMtcGx1Z2luLWNzc1wiIH0sXG4gICAgICAgICAgICB7IFwiKi5jc3NcIiA6IFwiY3NzXCIgfSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG1haW5Db25kaXRpb24gJiZcbiAgICAgICAgICAgIChzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIsIFwiQnJvd3NlcmlmeVwiKSB8fFxuICAgICAgICAgICAgICAgIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uYnVuZGxlciwgXCJTeXN0ZW1KU0J1aWxkZXJcIikgfHxcbiAgICAgICAgICAgICAgICBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIsIFwiV2VicGFja1wiKSkpO1xuXG4gICAgICAgIGNvbnN0IGVzTGludENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxFc0xpbnRDb25maWd1cmF0aW9uPihcIkVTTGludFwiKTtcbiAgICAgICAgaWYgKGVzTGludENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUoZXNMaW50Q29uZmlndXJhdGlvbi5wYXJzZXJPcHRpb25zLmVjbWFGZWF0dXJlcywgXCJqc3hcIiwgdHJ1ZSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoZXNMaW50Q29uZmlndXJhdGlvbi5leHRlbmRzLCBcInBsdWdpbjpyZWFjdC9yZWNvbW1lbmRlZFwiLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShlc0xpbnRDb25maWd1cmF0aW9uLnBsdWdpbnMsIFwicmVhY3RcIiwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24ucnVsZXMsIFwibm8tdW51c2VkLXZhcnNcIiwgMSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKGVzTGludENvbmZpZ3VyYXRpb24uc2V0dGluZ3MsIFwicmVhY3RcIiwgeyBwcmFnbWE6IFwiaFwiIH0sIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHNMaW50Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFRzTGludENvbmZpZ3VyYXRpb24+KFwiVFNMaW50XCIpO1xuICAgICAgICBpZiAodHNMaW50Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZSh0c0xpbnRDb25maWd1cmF0aW9uLnJ1bGVzLCBcIm5vLWVtcHR5XCIsIHsgc2V2ZXJpdHk6IFwid2FybmluZ1wiIH0sIG1haW5Db25kaXRpb24pO1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZSh0c0xpbnRDb25maWd1cmF0aW9uLnJ1bGVzLCBcIm5vLWVtcHR5LWludGVyZmFjZVwiLCB7IHNldmVyaXR5OiBcIndhcm5pbmdcIiB9LCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUodHNMaW50Q29uZmlndXJhdGlvbi5ydWxlcywgXCJ2YXJpYWJsZS1uYW1lXCIsIFt0cnVlLCBcImFsbG93LWxlYWRpbmctdW5kZXJzY29yZVwiXSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiYWJlbENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxCYWJlbENvbmZpZ3VyYXRpb24+KFwiQmFiZWxcIik7XG4gICAgICAgIGlmIChiYWJlbENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShiYWJlbENvbmZpZ3VyYXRpb24ucGx1Z2lucywgWyBcInRyYW5zZm9ybS1yZWFjdC1qc3hcIiwgeyBwcmFnbWE6IFwiaFwifSBdLCBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvYmosIGl0ZW0pID0+IEFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbS5sZW5ndGggPiAwICYmIGl0ZW1bMF0gPT09IG9ialswXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm90cmFjdG9yQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFByb3RyYWN0b3JDb25maWd1cmF0aW9uPihcIlByb3RyYWN0b3JcIik7XG4gICAgICAgIGlmIChwcm90cmFjdG9yQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgY29uc3QgcGx1Z2luID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLnd3dy5wYWNrYWdlRm9sZGVyLCBcInVuaXRlanMtcHJlYWN0LXByb3RyYWN0b3ItcGx1Z2luXCIpKSk7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUocHJvdHJhY3RvckNvbmZpZ3VyYXRpb24ucGx1Z2lucywgeyBwYXRoOiBwbHVnaW4gfSwgbWFpbkNvbmRpdGlvbiwgKG9iamVjdCwgaXRlbSkgPT4gb2JqZWN0LnBhdGggPT09IGl0ZW0ucGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgd2ViZHJpdmVySW9QbHVnaW5zID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248c3RyaW5nW10+KFwiV2ViZHJpdmVySU8uUGx1Z2luc1wiKTtcbiAgICAgICAgaWYgKHdlYmRyaXZlcklvUGx1Z2lucykge1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHdlYmRyaXZlcklvUGx1Z2lucywgXCJ1bml0ZWpzLXByZWFjdC13ZWJkcml2ZXItcGx1Z2luXCIsIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHlwZVNjcmlwdENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxUeXBlU2NyaXB0Q29uZmlndXJhdGlvbj4oXCJUeXBlU2NyaXB0XCIpO1xuICAgICAgICBpZiAodHlwZVNjcmlwdENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUodHlwZVNjcmlwdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLCBcImpzeFwiLCBcInJlYWN0XCIsIG1haW5Db25kaXRpb24pO1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLmFkZFJlbW92ZSh0eXBlU2NyaXB0Q29uZmlndXJhdGlvbi5jb21waWxlck9wdGlvbnMsIFwianN4RmFjdG9yeVwiLCBcImhcIiwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuYWRkUmVtb3ZlKHR5cGVTY3JpcHRDb25maWd1cmF0aW9uLmNvbXBpbGVyT3B0aW9ucywgXCJleHBlcmltZW50YWxEZWNvcmF0b3JzXCIsIHRydWUsIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgamF2YVNjcmlwdENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxKYXZhU2NyaXB0Q29uZmlndXJhdGlvbj4oXCJKYXZhU2NyaXB0XCIpO1xuICAgICAgICBpZiAoamF2YVNjcmlwdENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5hZGRSZW1vdmUoamF2YVNjcmlwdENvbmZpZ3VyYXRpb24uY29tcGlsZXJPcHRpb25zLCBcImV4cGVyaW1lbnRhbERlY29yYXRvcnNcIiwgdHJ1ZSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKG1haW5Db25kaXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZUV4dGVuc2lvbiA9IHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UsIFwiVHlwZVNjcmlwdFwiKSA/IFwiLnRzXCIgOiBcIi5qc1wiO1xuXG4gICAgICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5nZW5lcmF0ZUFwcFNvdXJjZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXG4gICAgICAgICAgICAgICAgYGFwcCR7c291cmNlRXh0ZW5zaW9ufXhgLFxuICAgICAgICAgICAgICAgIGBjaGlsZC9jaGlsZCR7c291cmNlRXh0ZW5zaW9ufXhgLFxuICAgICAgICAgICAgICAgIGBib290c3RyYXBwZXIke3NvdXJjZUV4dGVuc2lvbn1gLFxuICAgICAgICAgICAgICAgIGBlbnRyeVBvaW50JHtzb3VyY2VFeHRlbnNpb259YFxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUFwcENzcyhsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbYGNoaWxkL2NoaWxkYF0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUUyZVRlc3QobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW2BhcHAuc3BlYyR7c291cmNlRXh0ZW5zaW9ufWBdKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCB0aGlzLmdlbmVyYXRlVW5pdFRlc3QobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW2BhcHAuc3BlYyR7c291cmNlRXh0ZW5zaW9ufWAsIGBib290c3RyYXBwZXIuc3BlYyR7c291cmNlRXh0ZW5zaW9ufWBdLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlQ3NzKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
