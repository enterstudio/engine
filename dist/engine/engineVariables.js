"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uniteClientPackage_1 = require("../configuration/models/unite/uniteClientPackage");
class EngineVariables {
    constructor() {
        this._configuration = {};
        this.syntheticImport = "";
        this.moduleId = "";
        this.buildTranspileInclude = [];
        this.buildTranspilePreBuild = [];
        this.buildTranspilePostBuild = [];
        this._requiredDevDependencies = {};
        this._removedDevDependencies = {};
        this._requiredClientPackages = {};
        this._removedClientPackages = {};
        this._existingClientPackages = {};
        this.additionalCompletionMessages = [];
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
        this.platformRootFolder = fileSystem.pathCombine(this.rootFolder, "platform");
        this.docsRootFolder = fileSystem.pathCombine(this.rootFolder, "docs");
        this.www = {
            src: fileSystem.pathCombine(this.wwwRootFolder, "src"),
            dist: fileSystem.pathCombine(this.wwwRootFolder, "dist"),
            css: fileSystem.pathCombine(this.wwwRootFolder, "cssSrc"),
            cssDist: fileSystem.pathCombine(this.wwwRootFolder, "css"),
            e2eRoot: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e"),
            e2e: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e/src"),
            e2eDist: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e/dist"),
            unitRoot: fileSystem.pathCombine(this.wwwRootFolder, "test/unit"),
            unit: fileSystem.pathCombine(this.wwwRootFolder, "test/unit/src"),
            unitDist: fileSystem.pathCombine(this.wwwRootFolder, "test/unit/dist"),
            reports: fileSystem.pathCombine(this.wwwRootFolder, "test/reports"),
            assets: fileSystem.pathCombine(this.wwwRootFolder, "assets"),
            assetsSrc: fileSystem.pathCombine(this.wwwRootFolder, "assetsSrc"),
            build: fileSystem.pathCombine(this.wwwRootFolder, "build"),
            package: fileSystem.pathCombine(this.wwwRootFolder, "node_modules"),
            configuration: fileSystem.pathCombine(this.wwwRootFolder, "configuration")
        };
    }
    initialisePackages(clientPackages) {
        this._existingClientPackages = clientPackages;
    }
    toggleClientPackage(key, clientPackage, required) {
        if (required) {
            this.addClientPackage(key, clientPackage);
        }
        else {
            this.removeClientPackage(key, clientPackage);
        }
    }
    addClientPackage(key, clientPackage) {
        if (!clientPackage.version) {
            clientPackage.version = this.findDependencyVersion(clientPackage.name);
        }
        this._requiredClientPackages[key] = clientPackage;
    }
    removeClientPackage(key, clientPackage) {
        this._removedClientPackages[key] = clientPackage;
    }
    toggleDevDependency(dependencies, required) {
        if (required) {
            this.addDevDependency(dependencies);
        }
        else {
            this.removeDevDependency(dependencies);
        }
    }
    addDevDependency(dependencies) {
        dependencies.forEach(dep => {
            const clientPackage = new uniteClientPackage_1.UniteClientPackage();
            clientPackage.name = dep;
            this._requiredDevDependencies[dep] = clientPackage;
        });
    }
    removeDevDependency(dependencies) {
        dependencies.forEach(dep => {
            const clientPackage = new uniteClientPackage_1.UniteClientPackage();
            clientPackage.name = dep;
            this._removedDevDependencies[dep] = clientPackage;
        });
    }
    addVersionedDevDependency(dependency, version) {
        const clientPackage = new uniteClientPackage_1.UniteClientPackage();
        clientPackage.name = dependency;
        clientPackage.version = version;
        this._requiredDevDependencies[dependency] = clientPackage;
    }
    buildDependencies(uniteConfiguration, packageJsonDependencies) {
        for (const key in this._removedClientPackages) {
            const pkg = this._removedClientPackages[key];
            if (packageJsonDependencies[pkg.name]) {
                delete packageJsonDependencies[pkg.name];
            }
            if (this._existingClientPackages[key] &&
                !this._existingClientPackages[key].hasOverrides) {
                delete this._existingClientPackages[key];
            }
        }
        for (const key in this._existingClientPackages) {
            const pkg = this._existingClientPackages[key];
            if (pkg.hasOverrides || !this._requiredClientPackages[key]) {
                this._requiredClientPackages[key] = pkg;
            }
        }
        const addedDevDependencies = [];
        const removedDevDependencies = [];
        for (const key in this._requiredClientPackages) {
            const pkg = this._requiredClientPackages[key];
            uniteConfiguration.clientPackages[key] = pkg;
            if (pkg.includeMode === undefined || pkg.includeMode === "app" || pkg.includeMode === "both") {
                packageJsonDependencies[pkg.name] = pkg.version;
                if (this._requiredDevDependencies[pkg.name]) {
                    delete this._requiredDevDependencies[pkg.name];
                }
                removedDevDependencies.push(pkg.name);
            }
            else {
                addedDevDependencies.push(pkg.name);
            }
        }
        this.toggleDevDependency(addedDevDependencies, true);
        this.toggleDevDependency(removedDevDependencies, false);
    }
    buildDevDependencies(packageJsonDevDependencies) {
        Object.keys(this._removedDevDependencies)
            .forEach(dependency => {
            if (packageJsonDevDependencies[dependency]) {
                delete packageJsonDevDependencies[dependency];
            }
        });
        Object.keys(this._requiredDevDependencies)
            .forEach(requiredDependency => {
            if (this._requiredDevDependencies[requiredDependency].version) {
                packageJsonDevDependencies[requiredDependency] = this._requiredDevDependencies[requiredDependency].version;
            }
            else {
                packageJsonDevDependencies[requiredDependency] = this.findDependencyVersion(requiredDependency);
            }
        });
    }
    findDependencyVersion(requiredDependency) {
        if (this.engineDependencies) {
            if (this.engineDependencies[requiredDependency]) {
                return this.engineDependencies[requiredDependency];
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEseUZBQXNGO0FBS3RGO0lBdURJO1FBQ0ksSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFFekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFFbkIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFFbEMsSUFBSSxDQUFDLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBRWxDLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUVNLGdCQUFnQixDQUFDLElBQVksRUFBRSxNQUFXO1FBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxnQkFBZ0IsQ0FBSSxJQUFZO1FBQ25DLE1BQU0sQ0FBSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxVQUF1QixFQUFFLFVBQWtCO1FBQy9ELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFD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QixHQUFHLENBQUMsQ0FBQztZQUNsRSxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ25ELENBQUM7SUFDTCxDQUFDO0NBQ0o7QUExT0QsMENBME9DIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmVWYXJpYWJsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFZhcmlhYmxlcyB1c2VkIGJ5IHRoZSBlbmdpbmUuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgVW5pdGVDbGllbnRQYWNrYWdlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ2xpZW50UGFja2FnZVwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBhY2thZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXNNZXRhIH0gZnJvbSBcIi4vZW5naW5lVmFyaWFibGVzTWV0YVwiO1xuXG5leHBvcnQgY2xhc3MgRW5naW5lVmFyaWFibGVzIHtcbiAgICBwdWJsaWMgbWV0YTogRW5naW5lVmFyaWFibGVzTWV0YTtcbiAgICBwdWJsaWMgZm9yY2U6IGJvb2xlYW47XG4gICAgcHVibGljIG5vQ3JlYXRlU291cmNlOiBib29sZWFuO1xuXG4gICAgcHVibGljIGVuZ2luZVJvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgZW5naW5lQXNzZXRzRm9sZGVyOiBzdHJpbmc7XG4gICAgcHVibGljIGVuZ2luZVZlcnNpb246IHN0cmluZztcbiAgICBwdWJsaWMgZW5naW5lRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgICBwdWJsaWMgcm9vdEZvbGRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyB3d3dSb290Rm9sZGVyOiBzdHJpbmc7XG4gICAgcHVibGljIHBhY2thZ2VkUm9vdEZvbGRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBwbGF0Zm9ybVJvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgZG9jc1Jvb3RGb2xkZXI6IHN0cmluZztcblxuICAgIHB1YmxpYyB3d3c6IHtcbiAgICAgICAgW2lkOiBzdHJpbmddOiBzdHJpbmc7XG4gICAgICAgIHNyYzogc3RyaW5nO1xuICAgICAgICBkaXN0OiBzdHJpbmc7XG4gICAgICAgIHVuaXRSb290OiBzdHJpbmc7XG4gICAgICAgIHVuaXQ6IHN0cmluZztcbiAgICAgICAgdW5pdERpc3Q6IHN0cmluZztcbiAgICAgICAgY3NzOiBzdHJpbmc7XG4gICAgICAgIGNzc0Rpc3Q6IHN0cmluZztcbiAgICAgICAgZTJlUm9vdDogc3RyaW5nO1xuICAgICAgICBlMmU6IHN0cmluZztcbiAgICAgICAgZTJlRGlzdDogc3RyaW5nO1xuICAgICAgICByZXBvcnRzOiBzdHJpbmc7XG4gICAgICAgIHBhY2thZ2U6IHN0cmluZztcbiAgICAgICAgYnVpbGQ6IHN0cmluZztcbiAgICAgICAgY29uZmlndXJhdGlvbjogc3RyaW5nO1xuXG4gICAgICAgIGFzc2V0czogc3RyaW5nO1xuICAgICAgICBhc3NldHNTcmM6IHN0cmluZztcbiAgICB9O1xuXG4gICAgcHVibGljIGJ1aWxkVHJhbnNwaWxlSW5jbHVkZTogc3RyaW5nW107XG4gICAgcHVibGljIGJ1aWxkVHJhbnNwaWxlUHJlQnVpbGQ6IHN0cmluZ1tdO1xuICAgIHB1YmxpYyBidWlsZFRyYW5zcGlsZVBvc3RCdWlsZDogc3RyaW5nW107XG5cbiAgICBwdWJsaWMgc3ludGhldGljSW1wb3J0OiBzdHJpbmc7XG4gICAgcHVibGljIG1vZHVsZUlkOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgcGFja2FnZU1hbmFnZXI6IElQYWNrYWdlTWFuYWdlcjtcbiAgICBwdWJsaWMgYWRkaXRpb25hbENvbXBsZXRpb25NZXNzYWdlczogc3RyaW5nW107XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IF9jb25maWd1cmF0aW9uOiB7IFtpZDogc3RyaW5nXTogYW55IH07XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yZXF1aXJlZERldkRlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IFVuaXRlQ2xpZW50UGFja2FnZSB9O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX3JlbW92ZWREZXZEZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBVbml0ZUNsaWVudFBhY2thZ2UgfTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yZXF1aXJlZENsaWVudFBhY2thZ2VzOiB7IFtpZDogc3RyaW5nXTogVW5pdGVDbGllbnRQYWNrYWdlIH07XG4gICAgcHJpdmF0ZSByZWFkb25seSBfcmVtb3ZlZENsaWVudFBhY2thZ2VzOiB7IFtpZDogc3RyaW5nXTogVW5pdGVDbGllbnRQYWNrYWdlIH07XG4gICAgcHJpdmF0ZSBfZXhpc3RpbmdDbGllbnRQYWNrYWdlczogeyBbaWQ6IHN0cmluZ106IFVuaXRlQ2xpZW50UGFja2FnZSB9O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSB7fTtcblxuICAgICAgICB0aGlzLnN5bnRoZXRpY0ltcG9ydCA9IFwiXCI7XG4gICAgICAgIHRoaXMubW9kdWxlSWQgPSBcIlwiO1xuXG4gICAgICAgIHRoaXMuYnVpbGRUcmFuc3BpbGVJbmNsdWRlID0gW107XG4gICAgICAgIHRoaXMuYnVpbGRUcmFuc3BpbGVQcmVCdWlsZCA9IFtdO1xuICAgICAgICB0aGlzLmJ1aWxkVHJhbnNwaWxlUG9zdEJ1aWxkID0gW107XG5cbiAgICAgICAgdGhpcy5fcmVxdWlyZWREZXZEZXBlbmRlbmNpZXMgPSB7fTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlZERldkRlcGVuZGVuY2llcyA9IHt9O1xuICAgICAgICB0aGlzLl9yZXF1aXJlZENsaWVudFBhY2thZ2VzID0ge307XG4gICAgICAgIHRoaXMuX3JlbW92ZWRDbGllbnRQYWNrYWdlcyA9IHt9O1xuICAgICAgICB0aGlzLl9leGlzdGluZ0NsaWVudFBhY2thZ2VzID0ge307XG5cbiAgICAgICAgdGhpcy5hZGRpdGlvbmFsQ29tcGxldGlvbk1lc3NhZ2VzID0gW107XG4gICAgfVxuXG4gICAgcHVibGljIHNldENvbmZpZ3VyYXRpb24obmFtZTogc3RyaW5nLCBjb25maWc6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uW25hbWVdID0gY29uZmlnO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDb25maWd1cmF0aW9uPFQ+KG5hbWU6IHN0cmluZyk6IFQge1xuICAgICAgICByZXR1cm4gPFQ+dGhpcy5fY29uZmlndXJhdGlvbltuYW1lXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0dXBEaXJlY3RvcmllcyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgcm9vdEZvbGRlcjogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICB0aGlzLnJvb3RGb2xkZXIgPSByb290Rm9sZGVyO1xuICAgICAgICB0aGlzLnd3d1Jvb3RGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMucm9vdEZvbGRlciwgXCJ3d3dcIik7XG4gICAgICAgIHRoaXMucGFja2FnZWRSb290Rm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnJvb3RGb2xkZXIsIFwicGFja2FnZWRcIik7XG4gICAgICAgIHRoaXMucGxhdGZvcm1Sb290Rm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnJvb3RGb2xkZXIsIFwicGxhdGZvcm1cIik7XG4gICAgICAgIHRoaXMuZG9jc1Jvb3RGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMucm9vdEZvbGRlciwgXCJkb2NzXCIpO1xuICAgICAgICB0aGlzLnd3dyA9IHtcbiAgICAgICAgICAgIHNyYzogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwic3JjXCIpLFxuICAgICAgICAgICAgZGlzdDogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwiZGlzdFwiKSxcbiAgICAgICAgICAgIGNzczogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwiY3NzU3JjXCIpLFxuICAgICAgICAgICAgY3NzRGlzdDogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwiY3NzXCIpLFxuICAgICAgICAgICAgZTJlUm9vdDogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwidGVzdC9lMmVcIiksXG4gICAgICAgICAgICBlMmU6IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy53d3dSb290Rm9sZGVyLCBcInRlc3QvZTJlL3NyY1wiKSxcbiAgICAgICAgICAgIGUyZURpc3Q6IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy53d3dSb290Rm9sZGVyLCBcInRlc3QvZTJlL2Rpc3RcIiksXG4gICAgICAgICAgICB1bml0Um9vdDogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwidGVzdC91bml0XCIpLFxuICAgICAgICAgICAgdW5pdDogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwidGVzdC91bml0L3NyY1wiKSxcbiAgICAgICAgICAgIHVuaXREaXN0OiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJ0ZXN0L3VuaXQvZGlzdFwiKSxcbiAgICAgICAgICAgIHJlcG9ydHM6IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy53d3dSb290Rm9sZGVyLCBcInRlc3QvcmVwb3J0c1wiKSxcbiAgICAgICAgICAgIGFzc2V0czogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwiYXNzZXRzXCIpLFxuICAgICAgICAgICAgYXNzZXRzU3JjOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJhc3NldHNTcmNcIiksXG4gICAgICAgICAgICBidWlsZDogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwiYnVpbGRcIiksXG4gICAgICAgICAgICBwYWNrYWdlOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJub2RlX21vZHVsZXNcIiksXG4gICAgICAgICAgICBjb25maWd1cmF0aW9uOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJjb25maWd1cmF0aW9uXCIpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGluaXRpYWxpc2VQYWNrYWdlcyhjbGllbnRQYWNrYWdlczogeyBbaWQ6IHN0cmluZ106IFVuaXRlQ2xpZW50UGFja2FnZSB9KTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2V4aXN0aW5nQ2xpZW50UGFja2FnZXMgPSBjbGllbnRQYWNrYWdlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9nZ2xlQ2xpZW50UGFja2FnZShrZXk6IHN0cmluZywgY2xpZW50UGFja2FnZTogVW5pdGVDbGllbnRQYWNrYWdlLCByZXF1aXJlZDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2xpZW50UGFja2FnZShrZXksIGNsaWVudFBhY2thZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVDbGllbnRQYWNrYWdlKGtleSwgY2xpZW50UGFja2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkQ2xpZW50UGFja2FnZShrZXk6IHN0cmluZywgY2xpZW50UGFja2FnZTogVW5pdGVDbGllbnRQYWNrYWdlKTogdm9pZCB7XG4gICAgICAgIGlmICghY2xpZW50UGFja2FnZS52ZXJzaW9uKSB7XG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlLnZlcnNpb24gPSB0aGlzLmZpbmREZXBlbmRlbmN5VmVyc2lvbihjbGllbnRQYWNrYWdlLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXNba2V5XSA9IGNsaWVudFBhY2thZ2U7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZUNsaWVudFBhY2thZ2Uoa2V5OiBzdHJpbmcsIGNsaWVudFBhY2thZ2U6IFVuaXRlQ2xpZW50UGFja2FnZSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9yZW1vdmVkQ2xpZW50UGFja2FnZXNba2V5XSA9IGNsaWVudFBhY2thZ2U7XG4gICAgfVxuXG4gICAgcHVibGljIHRvZ2dsZURldkRlcGVuZGVuY3koZGVwZW5kZW5jaWVzOiBzdHJpbmdbXSwgcmVxdWlyZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZERldkRlcGVuZGVuY3koZGVwZW5kZW5jaWVzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRGV2RGVwZW5kZW5jeShkZXBlbmRlbmNpZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFkZERldkRlcGVuZGVuY3koZGVwZW5kZW5jaWVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaChkZXAgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2xpZW50UGFja2FnZSA9IG5ldyBVbml0ZUNsaWVudFBhY2thZ2UoKTtcbiAgICAgICAgICAgIGNsaWVudFBhY2thZ2UubmFtZSA9IGRlcDtcbiAgICAgICAgICAgIHRoaXMuX3JlcXVpcmVkRGV2RGVwZW5kZW5jaWVzW2RlcF0gPSBjbGllbnRQYWNrYWdlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlRGV2RGVwZW5kZW5jeShkZXBlbmRlbmNpZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKGRlcCA9PiB7XG4gICAgICAgICAgICBjb25zdCBjbGllbnRQYWNrYWdlID0gbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpO1xuICAgICAgICAgICAgY2xpZW50UGFja2FnZS5uYW1lID0gZGVwO1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlZERldkRlcGVuZGVuY2llc1tkZXBdID0gY2xpZW50UGFja2FnZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFZlcnNpb25lZERldkRlcGVuZGVuY3koZGVwZW5kZW5jeTogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2xpZW50UGFja2FnZSA9IG5ldyBVbml0ZUNsaWVudFBhY2thZ2UoKTtcbiAgICAgICAgY2xpZW50UGFja2FnZS5uYW1lID0gZGVwZW5kZW5jeTtcbiAgICAgICAgY2xpZW50UGFja2FnZS52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgdGhpcy5fcmVxdWlyZWREZXZEZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV0gPSBjbGllbnRQYWNrYWdlO1xuICAgIH1cblxuICAgIHB1YmxpYyBidWlsZERlcGVuZGVuY2llcyh1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgcGFja2FnZUpzb25EZXBlbmRlbmNpZXM6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfSk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLl9yZW1vdmVkQ2xpZW50UGFja2FnZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBrZyA9IHRoaXMuX3JlbW92ZWRDbGllbnRQYWNrYWdlc1trZXldO1xuXG4gICAgICAgICAgICBpZiAocGFja2FnZUpzb25EZXBlbmRlbmNpZXNbcGtnLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzW3BrZy5uYW1lXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2V4aXN0aW5nQ2xpZW50UGFja2FnZXNba2V5XSAmJlxuICAgICAgICAgICAgICAgICF0aGlzLl9leGlzdGluZ0NsaWVudFBhY2thZ2VzW2tleV0uaGFzT3ZlcnJpZGVzKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2V4aXN0aW5nQ2xpZW50UGFja2FnZXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuX2V4aXN0aW5nQ2xpZW50UGFja2FnZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBrZyA9IHRoaXMuX2V4aXN0aW5nQ2xpZW50UGFja2FnZXNba2V5XTtcblxuICAgICAgICAgICAgaWYgKHBrZy5oYXNPdmVycmlkZXMgfHwgIXRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXNba2V5XSA9IHBrZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFkZGVkRGV2RGVwZW5kZW5jaWVzID0gW107XG4gICAgICAgIGNvbnN0IHJlbW92ZWREZXZEZXBlbmRlbmNpZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5fcmVxdWlyZWRDbGllbnRQYWNrYWdlcykge1xuICAgICAgICAgICAgY29uc3QgcGtnID0gdGhpcy5fcmVxdWlyZWRDbGllbnRQYWNrYWdlc1trZXldO1xuXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uY2xpZW50UGFja2FnZXNba2V5XSA9IHBrZztcbiAgICAgICAgICAgIGlmIChwa2cuaW5jbHVkZU1vZGUgPT09IHVuZGVmaW5lZCB8fCBwa2cuaW5jbHVkZU1vZGUgPT09IFwiYXBwXCIgfHwgcGtnLmluY2x1ZGVNb2RlID09PSBcImJvdGhcIikge1xuICAgICAgICAgICAgICAgIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzW3BrZy5uYW1lXSA9IHBrZy52ZXJzaW9uO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3JlcXVpcmVkRGV2RGVwZW5kZW5jaWVzW3BrZy5uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcmVxdWlyZWREZXZEZXBlbmRlbmNpZXNbcGtnLm5hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZW1vdmVkRGV2RGVwZW5kZW5jaWVzLnB1c2gocGtnLm5hbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhZGRlZERldkRlcGVuZGVuY2llcy5wdXNoKHBrZy5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvZ2dsZURldkRlcGVuZGVuY3koYWRkZWREZXZEZXBlbmRlbmNpZXMsIHRydWUpO1xuICAgICAgICB0aGlzLnRvZ2dsZURldkRlcGVuZGVuY3kocmVtb3ZlZERldkRlcGVuZGVuY2llcywgZmFsc2UpO1xuICAgIH1cblxuICAgIHB1YmxpYyBidWlsZERldkRlcGVuZGVuY2llcyhwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9KTogdm9pZCB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3JlbW92ZWREZXZEZXBlbmRlbmNpZXMpXG4gICAgICAgICAgICAuZm9yRWFjaChkZXBlbmRlbmN5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3JlcXVpcmVkRGV2RGVwZW5kZW5jaWVzKVxuICAgICAgICAgICAgLmZvckVhY2gocmVxdWlyZWREZXBlbmRlbmN5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcmVxdWlyZWREZXZEZXBlbmRlbmNpZXNbcmVxdWlyZWREZXBlbmRlbmN5XS52ZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzW3JlcXVpcmVkRGVwZW5kZW5jeV0gPSB0aGlzLl9yZXF1aXJlZERldkRlcGVuZGVuY2llc1tyZXF1aXJlZERlcGVuZGVuY3ldLnZlcnNpb247XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGFja2FnZUpzb25EZXZEZXBlbmRlbmNpZXNbcmVxdWlyZWREZXBlbmRlbmN5XSA9IHRoaXMuZmluZERlcGVuZGVuY3lWZXJzaW9uKHJlcXVpcmVkRGVwZW5kZW5jeSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGZpbmREZXBlbmRlbmN5VmVyc2lvbihyZXF1aXJlZERlcGVuZGVuY3k6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmVuZ2luZURlcGVuZGVuY2llcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZW5naW5lRGVwZW5kZW5jaWVzW3JlcXVpcmVkRGVwZW5kZW5jeV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbmdpbmVEZXBlbmRlbmNpZXNbcmVxdWlyZWREZXBlbmRlbmN5XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIERlcGVuZGVuY3kgJyR7cmVxdWlyZWREZXBlbmRlbmN5fSdgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRlcGVuZGVuY3kgVmVyc2lvbnMgbWlzc2luZ1wiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
