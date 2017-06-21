/**
 * Variables used by the engine.
 */
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
import { IPackageManager } from "../interfaces/IPackageManager";

export class EngineVariables {
    public coreFolder: string;

    public rootFolder: string;
    public sourceFolder: string;
    public distFolder: string;
    public unitTestFolder: string;
    public unitTestSrcFolder: string;
    public unitTestDistFolder: string;
    public e2eTestSrcFolder: string;
    public e2eTestDistFolder: string;
    public reportsFolder: string;
    public packageFolder: string;

    public gulpBuildFolder: string;
    public gulpTasksFolder: string;
    public gulpUtilFolder: string;

    public assetsDirectory: string;

    public requiredDependencies: string[];
    public requiredDevDependencies: string[];

    public sourceLanguageExt: string;

    public gitIgnore: string[];
    public license: ISpdxLicense;
    public html: {
        head: string[],
        body: string[]
    };

    public packageManager: IPackageManager;
}
