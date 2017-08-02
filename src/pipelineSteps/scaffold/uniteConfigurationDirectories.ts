/**
 * Pipeline step to generate unite.json.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UniteDirectories } from "../../configuration/models/unite/uniteDirectories";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class UniteConfigurationDirectories extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating directories configuration", { rootFolder: engineVariables.rootFolder });

            uniteConfiguration.directories = new UniteDirectories();
            uniteConfiguration.directories.src = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.srcFolder));
            uniteConfiguration.directories.dist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.distFolder));

            if (uniteConfiguration.unitTestRunner !== "None") {
                uniteConfiguration.directories.unitTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestFolder));
                uniteConfiguration.directories.unitTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestSrcFolder));
                uniteConfiguration.directories.unitTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.unitTestDistFolder));
            }

            uniteConfiguration.directories.cssSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.cssSrcFolder));
            uniteConfiguration.directories.cssDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.cssDistFolder));

            if (uniteConfiguration.e2eTestRunner !== "None") {
                uniteConfiguration.directories.e2eTest = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.e2eTestFolder));
                uniteConfiguration.directories.e2eTestSrc = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.e2eTestSrcFolder));
                uniteConfiguration.directories.e2eTestDist = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.e2eTestDistFolder));
            }

            uniteConfiguration.directories.reports = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.reportsFolder));

            uniteConfiguration.directories.assets = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.assetsFolder));
            uniteConfiguration.directories.assetsSource = fileSystem.pathToWeb(fileSystem.pathDirectoryRelative(engineVariables.rootFolder, engineVariables.assetsSourceFolder));
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating directories configuration failed", err, { rootFolder: engineVariables.rootFolder });
            return 1;
        }
    }
}
