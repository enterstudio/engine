/**
 * Pipeline step to create asset sources.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Assets extends PipelineStepBase {
    private static FILENAME: string = "logo-tile.svg";
    private static FILENAME2: string = "logo-transparent.svg";

    public async install(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["unitejs-image-cli"], true);
        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info("Creating Directory", { assetsSrcFolder: engineVariables.www.assetsSrcFolder });

            await fileSystem.directoryCreate(engineVariables.www.assetsSrcFolder);
        } catch (err) {
            logger.error("Creating Assets Source folder failed", err);
            return 1;
        }

        try {
            logger.info("Creating Directory", { assetsFolder: engineVariables.www.assetsFolder });

            await fileSystem.directoryCreate(engineVariables.www.assetsFolder);

        } catch (err) {
            logger.error("Creating Assets folder failed", err);
            return 1;
        }

        try {
            const sourceThemeFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "assetsSrc/theme/");
            const destThemeFolder = fileSystem.pathCombine(engineVariables.www.assetsSrcFolder, "theme/");

            let ret = await super.copyFile(logger, fileSystem, sourceThemeFolder, Assets.FILENAME, destThemeFolder, Assets.FILENAME, engineVariables.force);

            if (ret === 0) {
                ret = await super.copyFile(logger, fileSystem, sourceThemeFolder, Assets.FILENAME2, destThemeFolder, Assets.FILENAME2, engineVariables.force);
            }

            return ret;
        } catch (err) {
            logger.error("Copy Assets failed", err);
            return 1;
        }
    }

    public async uninstall(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["unitejs-image-cli"], false);
        return 0;
    }
}
