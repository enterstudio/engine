/**
 * Pipeline step to generate phantom JS configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class PhantomJs extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.unitTestEngine, "PhantomJS");
    }

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["karma-phantomjs-launcher", "bluebird"], super.condition(uniteConfiguration.unitTestRunner, "Karma"));

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.browsers, "PhantomJS", super.condition(uniteConfiguration.unitTestRunner, "Karma"));

            const bbInclude = fileSystem.pathToWeb(
                fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "bluebird/js/browser/bluebird.js")));

            ArrayHelper.addRemove(karmaConfiguration.files, { pattern: bbInclude, included: true, includeType: "polyfill" },
                                  super.condition(uniteConfiguration.unitTestRunner, "Karma"),
                                  (obj, item) => obj.pattern === item.pattern);
        }

        return 0;
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["karma-phantomjs-launcher", "bluebird"], false);

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.browsers, "PhantomJS", false);

            const bbInclude = fileSystem.pathToWeb(
                fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "bluebird/js/browser/bluebird.js")));

            ArrayHelper.addRemove(karmaConfiguration.files, { pattern: bbInclude, included: true, includeType: "polyfill" },
                                  false,
                                  (obj, item) => obj.pattern === item.pattern);
        }

        return 0;
    }
}
