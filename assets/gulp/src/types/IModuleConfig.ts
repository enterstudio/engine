/**
 * Module Config
 */
export interface IModuleConfig {
    paths: { [id: string]: string };
    packages: { name: string; location: string; main: string }[];
    preload: string[];
    map: { [id: string]: string };
    loaders: { [id: string]: string };
}

// Generated by UniteJS
