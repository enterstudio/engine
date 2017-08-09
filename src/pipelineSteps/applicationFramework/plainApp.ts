/**
 * Pipeline step to generate scaffolding for plain application.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { SharedAppFramework } from "./sharedAppFramework";

export class PlainApp extends SharedAppFramework {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["unitejs-plain-protractor-plugin"], uniteConfiguration.applicationFramework === "PlainApp" && uniteConfiguration.e2eTestRunner === "Protractor");
        engineVariables.e2ePlugins["unitejs-plain-protractor-plugin"] = uniteConfiguration.applicationFramework === "PlainApp" && uniteConfiguration.e2eTestRunner === "Protractor";

        engineVariables.toggleDevDependency(["unitejs-plain-webdriver-plugin"], uniteConfiguration.applicationFramework === "PlainApp" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
        engineVariables.e2ePlugins["unitejs-plain-webdriver-plugin"] = uniteConfiguration.applicationFramework === "PlainApp" && uniteConfiguration.e2eTestRunner === "WebdriverIO";

        if (uniteConfiguration.applicationFramework === "PlainApp") {
            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper", "entryPoint"]);

            if (ret === 0) {
                ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app"]);

                if (ret === 0) {
                    ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper"]);

                    if (ret === 0) {
                        ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
                    }
                }
            }

            return ret;
        }
        return 0;
    }
}
