/**
 * Variables used by the engine.
 */
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { ISpdxLicense } from "../configuration/models/spdx/ISpdxLicense";
import { IncludeMode } from "../configuration/models/unite/includeMode";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IPackageManager } from "../interfaces/IPackageManager";
import { EngineVariablesHtml } from "./engineVariablesHtml";
export declare class EngineVariables {
    coreFolder: string;
    rootFolder: string;
    srcFolder: string;
    distFolder: string;
    unitTestFolder: string;
    unitTestSrcFolder: string;
    unitTestDistFolder: string;
    cssSrcFolder: string;
    cssDistFolder: string;
    e2eTestFolder: string;
    e2eTestSrcFolder: string;
    e2eTestDistFolder: string;
    reportsFolder: string;
    packageFolder: string;
    assetsFolder: string;
    assetsSourceFolder: string;
    gulpBuildFolder: string;
    gulpTasksFolder: string;
    gulpUtilFolder: string;
    packageAssetsDirectory: string;
    sourceLanguageExt: string;
    styleLanguageExt: string;
    gitIgnore: string[];
    license: ISpdxLicense;
    htmlNoBundle: EngineVariablesHtml;
    htmlBundle: EngineVariablesHtml;
    packageManager: IPackageManager;
    corePackageJson: PackageConfiguration;
    protractorPlugins: {
        [id: string]: boolean;
    };
    lintFeatures: {
        [id: string]: {
            required: boolean;
            object: any;
        };
    };
    lintExtends: {
        [id: string]: boolean;
    };
    lintPlugins: {
        [id: string]: boolean;
    };
    lintEnv: {
        [id: string]: boolean;
    };
    lintGlobals: {
        [id: string]: boolean;
    };
    transpileProperties: {
        [id: string]: {
            required: boolean;
            object: any;
        };
    };
    transpilePresets: {
        [id: string]: boolean;
    };
    private _requiredDevDependencies;
    private _removedDevDependencies;
    private _requiredClientPackages;
    private _removedClientPackages;
    constructor();
    toggleClientPackage(name: string, main: string, mainMinified: string, preload: boolean, includeMode: IncludeMode, isPackage: boolean, required: boolean): void;
    getTestClientPackages(): string[];
    toggleDevDependency(dependencies: string[], required: boolean): void;
    buildDependencies(uniteConfiguration: UniteConfiguration, packageJsonDependencies: {
        [id: string]: string;
    }): void;
    buildDevDependencies(packageJsonDevDependencies: {
        [id: string]: string;
    }): void;
    findDependencyVersion(requiredDependency: string): string;
}
