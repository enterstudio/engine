/**
 * Pipeline step to generate .gitignore.
 */
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
import { IDisplay } from "../../interfaces/IDisplay";
import { IFileSystem } from "../../interfaces/IFileSystem";
import { ILogger } from "../../interfaces/ILogger";

export class GitIgnore extends EnginePipelineStepBase {
    private static FILENAME: string = ".gitignore";

    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            const hasGeneratedMarker = await super.fileHasGeneratedMarker(fileSystem, engineVariables.rootFolder, GitIgnore.FILENAME);

            if (hasGeneratedMarker) {
                super.log(logger, display, `Writing ${GitIgnore.FILENAME}`);

                engineVariables.gitIgnore.push("node_modules");
                engineVariables.gitIgnore.push(super.wrapGeneratedMarker("# ", ""));

                await fileSystem.fileWriteLines(engineVariables.rootFolder, GitIgnore.FILENAME, engineVariables.gitIgnore);
            } else {
                super.log(logger, display, `Skipping ${GitIgnore.FILENAME} as it has no generated marker`);
            }

            return 0;
        } catch (err) {
            super.error(logger, display, `Writing ${GitIgnore.FILENAME} failed`, err);
            return 1;
        }
    }
}