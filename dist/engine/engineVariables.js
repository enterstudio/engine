"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uniteClientPackage_1 = require("../configuration/models/unite/uniteClientPackage");
class EngineVariables {
    constructor() {
        this._configuration = {};
        this._requiredDevDependencies = [];
        this._removedDevDependencies = [];
        this._requiredClientPackages = {};
        this._removedClientPackages = {};
    }
    setConfiguration(name, config) {
        this._configuration[name] = config;
    }
    getConfiguration(name) {
        return this._configuration[name];
    }
    setupDirectories(fileSystem, rootFolder) {
        this.rootFolder = rootFolder;
        this.wwwRootFolder = fileSystem.pathCombine(this.rootFolder, "www");
        this.packagedRootFolder = fileSystem.pathCombine(this.rootFolder, "packaged");
        this.www = {
            srcFolder: fileSystem.pathCombine(this.wwwRootFolder, "src"),
            distFolder: fileSystem.pathCombine(this.wwwRootFolder, "dist"),
            cssSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "cssSrc"),
            cssDistFolder: fileSystem.pathCombine(this.wwwRootFolder, "css"),
            e2eTestFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e"),
            e2eTestSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e/src"),
            e2eTestDistFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e/dist"),
            unitTestFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/unit"),
            unitTestSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/unit/src"),
            unitTestDistFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/unit/dist"),
            reportsFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/reports"),
            assetsFolder: fileSystem.pathCombine(this.wwwRootFolder, "assets"),
            assetsSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "assetsSrc"),
            buildFolder: fileSystem.pathCombine(this.wwwRootFolder, "build"),
            packageFolder: fileSystem.pathCombine(this.wwwRootFolder, "node_modules")
        };
    }
    initialisePackages(clientPackages) {
        this._requiredClientPackages = clientPackages;
    }
    toggleClientPackage(name, main, mainMinified, testingAdditions, preload, includeMode, scriptIncludeMode, isPackage, assets, map, loaders, required) {
        const clientPackage = new uniteClientPackage_1.UniteClientPackage();
        clientPackage.includeMode = includeMode;
        clientPackage.preload = preload;
        clientPackage.main = main;
        clientPackage.mainMinified = mainMinified;
        clientPackage.testingAdditions = testingAdditions;
        clientPackage.isPackage = isPackage;
        clientPackage.version = this.findDependencyVersion(name);
        clientPackage.assets = assets;
        clientPackage.map = map;
        clientPackage.loaders = loaders;
        clientPackage.scriptIncludeMode = scriptIncludeMode;
        let opArr;
        if (required) {
            opArr = this._requiredClientPackages;
        }
        else {
            opArr = this._removedClientPackages;
        }
        opArr[name] = clientPackage;
    }
    getTestClientPackages() {
        const packages = {};
        Object.keys(this._requiredClientPackages)
            .filter(key => this._requiredClientPackages[key].includeMode === "test" || this._requiredClientPackages[key].includeMode === "both")
            .forEach(key => {
            packages[key] = this._requiredClientPackages[key];
        });
        return packages;
    }
    getAppClientPackages() {
        const packages = {};
        Object.keys(this._requiredClientPackages)
            .filter(key => this._requiredClientPackages[key].includeMode === "app" || this._requiredClientPackages[key].includeMode === "both")
            .forEach(key => {
            packages[key] = this._requiredClientPackages[key];
        });
        return packages;
    }
    toggleDevDependency(dependencies, required) {
        let opArr;
        if (required) {
            opArr = this._requiredDevDependencies;
        }
        else {
            opArr = this._removedDevDependencies;
        }
        dependencies.forEach(dep => {
            if (opArr.indexOf(dep) < 0) {
                opArr.push(dep);
            }
        });
    }
    buildDependencies(uniteConfiguration, packageJsonDependencies) {
        for (const key in this._removedClientPackages) {
            if (packageJsonDependencies[key]) {
                delete packageJsonDependencies[key];
            }
        }
        const addedTestDependencies = [];
        const removedTestDependencies = [];
        for (const pkg in this._requiredClientPackages) {
            uniteConfiguration.clientPackages[pkg] = this._requiredClientPackages[pkg];
            if (this._requiredClientPackages[pkg].includeMode === "app" || this._requiredClientPackages[pkg].includeMode === "both") {
                packageJsonDependencies[pkg] = this._requiredClientPackages[pkg].version;
                const idx = this._requiredDevDependencies.indexOf(pkg);
                if (idx >= 0) {
                    this._requiredDevDependencies.splice(idx, 1);
                    removedTestDependencies.push(pkg);
                }
            }
            else {
                addedTestDependencies.push(pkg);
            }
        }
        this.toggleDevDependency(addedTestDependencies, true);
        this.toggleDevDependency(removedTestDependencies, false);
    }
    buildDevDependencies(packageJsonDevDependencies) {
        this._removedDevDependencies.forEach(dependency => {
            if (packageJsonDevDependencies[dependency]) {
                delete packageJsonDevDependencies[dependency];
            }
        });
        this._requiredDevDependencies.forEach(requiredDependency => {
            packageJsonDevDependencies[requiredDependency] = this.findDependencyVersion(requiredDependency);
        });
    }
    findDependencyVersion(requiredDependency) {
        if (this.enginePackageJson && this.enginePackageJson.peerDependencies) {
            if (this.enginePackageJson.peerDependencies[requiredDependency]) {
                return this.enginePackageJson.peerDependencies[requiredDependency];
            }
            else {
                throw new Error(`Missing Dependency '${requiredDependency}'`);
            }
        }
        else {
            throw new Error("Dependency Versions missing");
        }
    }
}
exports.EngineVariables = EngineVariables;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEseUZBQXNGO0FBSXRGO0lBMkNJO1FBQ0ksSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFFekIsSUFBSSxDQUFDLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsSUFBWSxFQUFFLE1BQVc7UUFDN0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDdkMsQ0FBQztJQUVNLGdCQUFnQixDQUFJLElBQVk7UUFDbkMsTUFBTSxDQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLGdCQUFnQixDQUFDLFVBQXVCLEVBQUUsVUFBa0I7UUFDL0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsR0FBRyxHQUFHO1lBQ1AsU0FBUyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUM7WUFDNUQsVUFBVSxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7WUFDOUQsWUFBWSxFQUFFLFVBQVUs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QUFnQixDQUFDLENBQUMsQ0FBQztZQUNwRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN2RSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1lBQ2xFLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbkQsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQW5ORCwwQ0FtTkMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZVZhcmlhYmxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVmFyaWFibGVzIHVzZWQgYnkgdGhlIGVuZ2luZS5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSVNwZHhMaWNlbnNlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3NwZHgvSVNwZHhMaWNlbnNlXCI7XG5pbXBvcnQgeyBJbmNsdWRlTW9kZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS9pbmNsdWRlTW9kZVwiO1xuaW1wb3J0IHsgU2NyaXB0SW5jbHVkZU1vZGUgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvc2NyaXB0SW5jbHVkZU1vZGVcIjtcbmltcG9ydCB7IFVuaXRlQ2xpZW50UGFja2FnZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNsaWVudFBhY2thZ2VcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElQYWNrYWdlTWFuYWdlciB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lQYWNrYWdlTWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgRW5naW5lVmFyaWFibGVzIHtcbiAgICBwdWJsaWMgZm9yY2U6IGJvb2xlYW47XG4gICAgcHVibGljIGVuZ2luZVJvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgZW5naW5lQXNzZXRzRm9sZGVyOiBzdHJpbmc7XG4gICAgcHVibGljIGVuZ2luZVBhY2thZ2VKc29uOiBQYWNrYWdlQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyByb290Rm9sZGVyOiBzdHJpbmc7XG4gICAgcHVibGljIHd3d1Jvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgcGFja2FnZWRSb290Rm9sZGVyOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgd3d3OiB7XG4gICAgICAgIHNyY0ZvbGRlcjogc3RyaW5nO1xuICAgICAgICBkaXN0Rm9sZGVyOiBzdHJpbmc7XG4gICAgICAgIHVuaXRUZXN0Rm9sZGVyOiBzdHJpbmc7XG4gICAgICAgIHVuaXRUZXN0U3JjRm9sZGVyOiBzdHJpbmc7XG4gICAgICAgIHVuaXRUZXN0RGlzdEZvbGRlcjogc3RyaW5nO1xuICAgICAgICBjc3NTcmNGb2xkZXI6IHN0cmluZztcbiAgICAgICAgY3NzRGlzdEZvbGRlcjogc3RyaW5nO1xuICAgICAgICBlMmVUZXN0Rm9sZGVyOiBzdHJpbmc7XG4gICAgICAgIGUyZVRlc3RTcmNGb2xkZXI6IHN0cmluZztcbiAgICAgICAgZTJlVGVzdERpc3RGb2xkZXI6IHN0cmluZztcbiAgICAgICAgcmVwb3J0c0ZvbGRlcjogc3RyaW5nO1xuICAgICAgICBwYWNrYWdlRm9sZGVyOiBzdHJpbmc7XG4gICAgICAgIGJ1aWxkRm9sZGVyOiBzdHJpbmc7XG5cbiAgICAgICAgYXNzZXRzRm9sZGVyOiBzdHJpbmc7XG4gICAgICAgIGFzc2V0c1NyY0ZvbGRlcjogc3RyaW5nO1xuICAgIH07XG5cbiAgICBwdWJsaWMgc291cmNlTGFuZ3VhZ2VFeHQ6IHN0cmluZztcbiAgICBwdWJsaWMgc3R5bGVMYW5ndWFnZUV4dDogc3RyaW5nO1xuXG4gICAgcHVibGljIGxpY2Vuc2U6IElTcGR4TGljZW5zZTtcblxuICAgIHB1YmxpYyBwYWNrYWdlTWFuYWdlcjogSVBhY2thZ2VNYW5hZ2VyO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogeyBbaWQ6IHN0cmluZ106IGFueSB9O1xuXG4gICAgcHJpdmF0ZSBfcmVxdWlyZWREZXZEZXBlbmRlbmNpZXM6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgX3JlbW92ZWREZXZEZXBlbmRlbmNpZXM6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgX3JlcXVpcmVkQ2xpZW50UGFja2FnZXM6IHsgW2lkOiBzdHJpbmddOiBVbml0ZUNsaWVudFBhY2thZ2UgfTtcbiAgICBwcml2YXRlIF9yZW1vdmVkQ2xpZW50UGFja2FnZXM6IHsgW2lkOiBzdHJpbmddOiBVbml0ZUNsaWVudFBhY2thZ2UgfTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0ge307XG5cbiAgICAgICAgdGhpcy5fcmVxdWlyZWREZXZEZXBlbmRlbmNpZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlZERldkRlcGVuZGVuY2llcyA9IFtdO1xuICAgICAgICB0aGlzLl9yZXF1aXJlZENsaWVudFBhY2thZ2VzID0ge307XG4gICAgICAgIHRoaXMuX3JlbW92ZWRDbGllbnRQYWNrYWdlcyA9IHt9O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDb25maWd1cmF0aW9uKG5hbWU6IHN0cmluZywgY29uZmlnOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbltuYW1lXSA9IGNvbmZpZztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29uZmlndXJhdGlvbjxUPihuYW1lOiBzdHJpbmcpOiBUIHtcbiAgICAgICAgcmV0dXJuIDxUPnRoaXMuX2NvbmZpZ3VyYXRpb25bbmFtZV07XG4gICAgfVxuXG4gICAgcHVibGljIHNldHVwRGlyZWN0b3JpZXMoZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHJvb3RGb2xkZXI6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yb290Rm9sZGVyID0gcm9vdEZvbGRlcjtcbiAgICAgICAgdGhpcy53d3dSb290Rm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnJvb3RGb2xkZXIsIFwid3d3XCIpO1xuICAgICAgICB0aGlzLnBhY2thZ2VkUm9vdEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5yb290Rm9sZGVyLCBcInBhY2thZ2VkXCIpO1xuICAgICAgICB0aGlzLnd3dyA9IHtcbiAgICAgICAgICAgIHNyY0ZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwic3JjXCIpLFxuICAgICAgICAgICAgZGlzdEZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwiZGlzdFwiKSxcbiAgICAgICAgICAgIGNzc1NyY0ZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwiY3NzU3JjXCIpLFxuICAgICAgICAgICAgY3NzRGlzdEZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwiY3NzXCIpLFxuICAgICAgICAgICAgZTJlVGVzdEZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwidGVzdC9lMmVcIiksXG4gICAgICAgICAgICBlMmVUZXN0U3JjRm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJ0ZXN0L2UyZS9zcmNcIiksXG4gICAgICAgICAgICBlMmVUZXN0RGlzdEZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwidGVzdC9lMmUvZGlzdFwiKSxcbiAgICAgICAgICAgIHVuaXRUZXN0Rm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJ0ZXN0L3VuaXRcIiksXG4gICAgICAgICAgICB1bml0VGVzdFNyY0ZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwidGVzdC91bml0L3NyY1wiKSxcbiAgICAgICAgICAgIHVuaXRUZXN0RGlzdEZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwidGVzdC91bml0L2Rpc3RcIiksXG4gICAgICAgICAgICByZXBvcnRzRm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJ0ZXN0L3JlcG9ydHNcIiksXG4gICAgICAgICAgICBhc3NldHNGb2xkZXI6IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy53d3dSb290Rm9sZGVyLCBcImFzc2V0c1wiKSxcbiAgICAgICAgICAgIGFzc2V0c1NyY0ZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwiYXNzZXRzU3JjXCIpLFxuICAgICAgICAgICAgYnVpbGRGb2xkZXI6IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy53d3dSb290Rm9sZGVyLCBcImJ1aWxkXCIpLFxuICAgICAgICAgICAgcGFja2FnZUZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwibm9kZV9tb2R1bGVzXCIpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGluaXRpYWxpc2VQYWNrYWdlcyhjbGllbnRQYWNrYWdlczogeyBbaWQ6IHN0cmluZ106IFVuaXRlQ2xpZW50UGFja2FnZSB9KTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXMgPSBjbGllbnRQYWNrYWdlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9nZ2xlQ2xpZW50UGFja2FnZShuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5NaW5pZmllZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RpbmdBZGRpdGlvbnM6ICB7IFtpZDogc3RyaW5nXTogc3RyaW5nfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVsb2FkOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVNb2RlOiBJbmNsdWRlTW9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRJbmNsdWRlTW9kZTogU2NyaXB0SW5jbHVkZU1vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWNrYWdlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0czogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcDogeyBbaWQ6IHN0cmluZ106IHN0cmluZ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVyczogeyBbaWQ6IHN0cmluZ106IHN0cmluZ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2xpZW50UGFja2FnZSA9IG5ldyBVbml0ZUNsaWVudFBhY2thZ2UoKTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5pbmNsdWRlTW9kZSA9IGluY2x1ZGVNb2RlO1xuICAgICAgICBjbGllbnRQYWNrYWdlLnByZWxvYWQgPSBwcmVsb2FkO1xuICAgICAgICBjbGllbnRQYWNrYWdlLm1haW4gPSBtYWluO1xuICAgICAgICBjbGllbnRQYWNrYWdlLm1haW5NaW5pZmllZCA9IG1haW5NaW5pZmllZDtcbiAgICAgICAgY2xpZW50UGFja2FnZS50ZXN0aW5nQWRkaXRpb25zID0gdGVzdGluZ0FkZGl0aW9ucztcbiAgICAgICAgY2xpZW50UGFja2FnZS5pc1BhY2thZ2UgPSBpc1BhY2thZ2U7XG4gICAgICAgIGNsaWVudFBhY2thZ2UudmVyc2lvbiA9IHRoaXMuZmluZERlcGVuZGVuY3lWZXJzaW9uKG5hbWUpO1xuICAgICAgICBjbGllbnRQYWNrYWdlLmFzc2V0cyA9IGFzc2V0cztcbiAgICAgICAgY2xpZW50UGFja2FnZS5tYXAgPSBtYXA7XG4gICAgICAgIGNsaWVudFBhY2thZ2UubG9hZGVycyA9IGxvYWRlcnM7XG4gICAgICAgIGNsaWVudFBhY2thZ2Uuc2NyaXB0SW5jbHVkZU1vZGUgPSBzY3JpcHRJbmNsdWRlTW9kZTtcblxuICAgICAgICBsZXQgb3BBcnI6IHsgW2lkOiBzdHJpbmddOiBVbml0ZUNsaWVudFBhY2thZ2UgfTtcbiAgICAgICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICAgICAgICBvcEFyciA9IHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcEFyciA9IHRoaXMuX3JlbW92ZWRDbGllbnRQYWNrYWdlcztcbiAgICAgICAgfVxuXG4gICAgICAgIG9wQXJyW25hbWVdID0gY2xpZW50UGFja2FnZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VGVzdENsaWVudFBhY2thZ2VzKCk6IHsgW2lkOiBzdHJpbmddIDogVW5pdGVDbGllbnRQYWNrYWdlIH0ge1xuICAgICAgICBjb25zdCBwYWNrYWdlczogeyBbaWQ6IHN0cmluZ10gOiBVbml0ZUNsaWVudFBhY2thZ2UgfSA9IHt9O1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXMpXG4gICAgICAgICAgICAuZmlsdGVyKGtleSA9PiB0aGlzLl9yZXF1aXJlZENsaWVudFBhY2thZ2VzW2tleV0uaW5jbHVkZU1vZGUgPT09IFwidGVzdFwiIHx8IHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXNba2V5XS5pbmNsdWRlTW9kZSA9PT0gXCJib3RoXCIpXG4gICAgICAgICAgICAuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHBhY2thZ2VzW2tleV0gPSB0aGlzLl9yZXF1aXJlZENsaWVudFBhY2thZ2VzW2tleV07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcGFja2FnZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFwcENsaWVudFBhY2thZ2VzKCk6IHsgW2lkOiBzdHJpbmddIDogVW5pdGVDbGllbnRQYWNrYWdlIH0ge1xuICAgICAgICBjb25zdCBwYWNrYWdlczogeyBbaWQ6IHN0cmluZ10gOiBVbml0ZUNsaWVudFBhY2thZ2UgfSA9IHt9O1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXMpXG4gICAgICAgICAgICAuZmlsdGVyKGtleSA9PiB0aGlzLl9yZXF1aXJlZENsaWVudFBhY2thZ2VzW2tleV0uaW5jbHVkZU1vZGUgPT09IFwiYXBwXCIgfHwgdGhpcy5fcmVxdWlyZWRDbGllbnRQYWNrYWdlc1trZXldLmluY2x1ZGVNb2RlID09PSBcImJvdGhcIilcbiAgICAgICAgICAgIC5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgcGFja2FnZXNba2V5XSA9IHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXNba2V5XTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwYWNrYWdlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9nZ2xlRGV2RGVwZW5kZW5jeShkZXBlbmRlbmNpZXM6IHN0cmluZ1tdLCByZXF1aXJlZDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBsZXQgb3BBcnI6IHN0cmluZ1tdO1xuICAgICAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgICAgICAgIG9wQXJyID0gdGhpcy5fcmVxdWlyZWREZXZEZXBlbmRlbmNpZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcEFyciA9IHRoaXMuX3JlbW92ZWREZXZEZXBlbmRlbmNpZXM7XG4gICAgICAgIH1cblxuICAgICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaChkZXAgPT4ge1xuICAgICAgICAgICAgaWYgKG9wQXJyLmluZGV4T2YoZGVwKSA8IDApIHtcbiAgICAgICAgICAgICAgICBvcEFyci5wdXNoKGRlcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBidWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLl9yZW1vdmVkQ2xpZW50UGFja2FnZXMpIHtcbiAgICAgICAgICAgIGlmIChwYWNrYWdlSnNvbkRlcGVuZGVuY2llc1trZXldKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhZGRlZFRlc3REZXBlbmRlbmNpZXMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVtb3ZlZFRlc3REZXBlbmRlbmNpZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBwa2cgaW4gdGhpcy5fcmVxdWlyZWRDbGllbnRQYWNrYWdlcykge1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmNsaWVudFBhY2thZ2VzW3BrZ10gPSB0aGlzLl9yZXF1aXJlZENsaWVudFBhY2thZ2VzW3BrZ107XG4gICAgICAgICAgICBpZiAodGhpcy5fcmVxdWlyZWRDbGllbnRQYWNrYWdlc1twa2ddLmluY2x1ZGVNb2RlID09PSBcImFwcFwiIHx8IHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXNbcGtnXS5pbmNsdWRlTW9kZSA9PT0gXCJib3RoXCIpIHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlSnNvbkRlcGVuZGVuY2llc1twa2ddID0gdGhpcy5fcmVxdWlyZWRDbGllbnRQYWNrYWdlc1twa2ddLnZlcnNpb247XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLl9yZXF1aXJlZERldkRlcGVuZGVuY2llcy5pbmRleE9mKHBrZyk7XG4gICAgICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlcXVpcmVkRGV2RGVwZW5kZW5jaWVzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVkVGVzdERlcGVuZGVuY2llcy5wdXNoKHBrZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhZGRlZFRlc3REZXBlbmRlbmNpZXMucHVzaChwa2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudG9nZ2xlRGV2RGVwZW5kZW5jeShhZGRlZFRlc3REZXBlbmRlbmNpZXMsIHRydWUpO1xuICAgICAgICB0aGlzLnRvZ2dsZURldkRlcGVuZGVuY3kocmVtb3ZlZFRlc3REZXBlbmRlbmNpZXMsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYnVpbGREZXZEZXBlbmRlbmNpZXMocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9yZW1vdmVkRGV2RGVwZW5kZW5jaWVzLmZvckVhY2goZGVwZW5kZW5jeSA9PiB7XG4gICAgICAgICAgICBpZiAocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV0pIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgcGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3JlcXVpcmVkRGV2RGVwZW5kZW5jaWVzLmZvckVhY2gocmVxdWlyZWREZXBlbmRlbmN5ID0+IHtcbiAgICAgICAgICAgIHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzW3JlcXVpcmVkRGVwZW5kZW5jeV0gPSB0aGlzLmZpbmREZXBlbmRlbmN5VmVyc2lvbihyZXF1aXJlZERlcGVuZGVuY3kpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZmluZERlcGVuZGVuY3lWZXJzaW9uKHJlcXVpcmVkRGVwZW5kZW5jeTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuZW5naW5lUGFja2FnZUpzb24gJiYgdGhpcy5lbmdpbmVQYWNrYWdlSnNvbi5wZWVyRGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5lbmdpbmVQYWNrYWdlSnNvbi5wZWVyRGVwZW5kZW5jaWVzW3JlcXVpcmVkRGVwZW5kZW5jeV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbmdpbmVQYWNrYWdlSnNvbi5wZWVyRGVwZW5kZW5jaWVzW3JlcXVpcmVkRGVwZW5kZW5jeV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBEZXBlbmRlbmN5ICcke3JlcXVpcmVkRGVwZW5kZW5jeX0nYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEZXBlbmRlbmN5IFZlcnNpb25zIG1pc3NpbmdcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
