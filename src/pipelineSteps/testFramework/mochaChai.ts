/**
 * Pipeline step to generate mocha configuration.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class MochaChai extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        super.log(logger, display, "Generating Mocha-Chai Configuration");

        engineVariables.toggleDevDependency(["mocha"], uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai");
        engineVariables.toggleDevDependency(["@types/mocha", "@types/chai"],
                                            (uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai")
                                             && uniteConfiguration.sourceLanguage === "TypeScript");

        engineVariables.toggleClientPackage(
            "chai",
            "chai.js",
            undefined,
            true,
            "test",
            false,
            uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai");

        engineVariables.lintEnv.mocha = uniteConfiguration.linter === "ESLint" && (uniteConfiguration.unitTestFramework === "Mocha-Chai" || uniteConfiguration.e2eTestFramework === "Mocha-Chai");

        return 0;
    }
}
