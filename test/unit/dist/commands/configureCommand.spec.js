"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests for Build Configuration Command.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const configureCommand_1 = require("../../../../dist/commands/configureCommand");
const uniteBuildConfiguration_1 = require("../../../../dist/configuration/models/unite/uniteBuildConfiguration");
const fileSystem_mock_1 = require("../fileSystem.mock");
const readOnlyFileSystem_mock_1 = require("../readOnlyFileSystem.mock");
describe("ConfigureCommand", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    let loggerErrorSpy;
    let loggerWarningSpy;
    let loggerBannerSpy;
    let uniteJson;
    let uniteJsonWritten;
    let uniteJsonThemeWritten;
    let profileErrors;
    let profileExists;
    let enginePeerPackages;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };
        fileSystemStub = new readOnlyFileSystem_mock_1.ReadOnlyFileSystemMock();
        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        loggerWarningSpy = sandbox.spy(loggerStub, "warning");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");
        uniteJson = undefined;
        uniteJsonWritten = undefined;
        uniteJsonThemeWritten = undefined;
        profileExists = true;
        profileErrors = false;
        const originalFileExists = fileSystemStub.fileExists;
        const stubExists = sandbox.stub(fileSystemStub, "fileExists");
        stubExists.callsFake((folder, filename) => __awaiter(this, void 0, void 0, function* () {
            if (filename === "unite.json") {
                return Promise.resolve(uniteJson === undefined ? false : true);
            }
            else if (filename === "configure.json") {
                if (!profileExists) {
                    return false;
                }
                else if (profileErrors) {
                    throw (new Error("fail"));
                }
                else {
                    return originalFileExists(folder, filename);
                }
            }
            else {
                return originalFileExists(folder, filename);
            }
        }));
        const originalFileReadJson = fileSystemStub.fileReadJson;
        const stubreadJson = sandbox.stub(fileSystemStub, "fileReadJson");
        stubreadJson.callsFake((folder, filename) => __awaiter(this, void 0, void 0, function* () {
            if (filename === "unite.json") {
                return uniteJson === null ? Promise.reject("err") : Promise.resolve(uniteJson);
            }
            else {
                return originalFileReadJson(folder, filename);
            }
        }));
        const originalFileWriteJson = fileSystemStub.fileWriteJson;
        const stubWriteJson = sandbox.stub(fileSystemStub, "fileWriteJson");
        stubWriteJson.callsFake((folder, filename, obj) => __awaiter(this, void 0, void 0, function* () {
            if (filename === "unite.json") {
                uniteJsonWritten = obj;
                return Promise.resolve();
            }
            else if (filename === "unite-theme.json") {
                uniteJsonThemeWritten = obj;
                return Promise.resolve();
            }
            else {
                return originalFileWriteJson(folder, filename, obj);
            }
        }));
        uniteJson = {
            packageName: "my-package",
            license: "MIT",
            sourceLanguage: "JavaScript",
            moduleType: "AMD",
            bundler: "RequireJS",
            unitTestRunner: "Karma",
            unitTestFramework: "Jasmine",
            unitTestEngine: "PhantomJS",
            e2eTestRunner: "Protractor",
            e2eTestFramework: "MochaChai",
            cssPre: "Sass",
            cssPost: "None",
            cssLinter: "None",
            documenter: "None",
            linter: "ESLint",
            packageManager: "Yarn",
            taskManager: "Gulp",
            server: "BrowserSync",
            applicationFramework: "Vanilla",
            ides: ["VSCode"],
            uniteVersion: "0.0.0",
            sourceExtensions: [],
            viewExtensions: [],
            styleExtension: "",
            clientPackages: undefined,
            dirs: undefined,
            srcDistReplace: undefined,
            srcDistReplaceWith: undefined,
            buildConfigurations: undefined,
            platforms: undefined
        };
        enginePeerPackages = yield fileSystemStub.fileReadJson(fileSystemStub.pathCombine(__dirname, "../../../../node_modules/unitejs-packages/assets/"), "peerPackages.json");
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        const obj = new fileSystem_mock_1.FileSystemMock();
        yield obj.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => {
        const obj = new configureCommand_1.ConfigureCommand();
        Chai.should().exist(obj);
    });
    describe("configure", () => {
        it("can fail when calling with undefined packageName", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        }));
        it("can fail when calling with undefined sourceLanguage", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("sourceLanguage");
        }));
        it("can fail when calling with undefined moduleType", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("moduleType");
        }));
        it("can fail when calling with undefined bundler", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("bundler");
        }));
        it("can fail when calling with undefined unitTestRunner", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("unitTestRunner");
        }));
        it("can fail when calling with unitTestRunner None and unitTestFramework", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "None",
                unitTestFramework: "Jasmine",
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("is not valid");
        }));
        it("can fail when calling with unitTestRunner None and unitTestEngine", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "None",
                unitTestFramework: undefined,
                unitTestEngine: "PhantomJS",
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("is not valid");
        }));
        it("can fail when calling with unitTestRunner Karma and missing unitTestFramework", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("unitTestFramework");
        }));
        it("can fail when calling with undefined unitTestEngine", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("unitTestEngine");
        }));
        it("can fail when calling with undefined e2eTestRunner", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("e2eTestRunner");
        }));
        it("can fail when calling with e2eTestRunner None and e2eTestFramework", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "None",
                e2eTestFramework: "MochaChai",
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("is not valid");
        }));
        it("can fail when calling with e2eTestRunner Protractor and missing e2eTestFramework", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("e2eTestFramework");
        }));
        it("can fail when calling with undefined linter", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "None",
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: "None",
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("linter");
        }));
        it("can fail when calling with undefined cssPre", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("cssPre");
        }));
        it("can fail when calling with undefined cssPost", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                taskManager: undefined,
                server: undefined,
                ides: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("cssPost");
        }));
        it("can fail when calling with undefined cssLinter", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "aaa",
                documenter: undefined,
                taskManager: undefined,
                server: undefined,
                ides: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("cssLinter");
        }));
        it("can fail when calling with undefined documenter", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "aaa",
                taskManager: undefined,
                server: undefined,
                ides: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("documenter");
        }));
        it("can fail when calling with undefined server", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "PostCss",
                cssLinter: "StyleLint",
                documenter: "ESDoc",
                ides: ["VSCode"],
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("server");
        }));
        it("can fail when calling with undefined taskManager", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "PostCss",
                cssLinter: undefined,
                documenter: undefined,
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("taskManager");
        }));
        it("can fail when calling with invalid packageManager", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "blah",
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        }));
        it("can fail when calling with undefined applicationFramework", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("applicationFramework");
        }));
        it("can fail when pipeline step fails", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "TSLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("TSLint");
        }));
        it("can fail when pipeline module does not exist", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            let counter = 0;
            const stub = fileSystemStub.directoryGetFiles = sandbox.stub();
            stub.callsFake((dir) => __awaiter(this, void 0, void 0, function* () {
                if (dir.indexOf("linter") >= 0) {
                    if (counter > 0) {
                        return Promise.resolve([]);
                    }
                    else {
                        counter++;
                        return new readOnlyFileSystem_mock_1.ReadOnlyFileSystemMock().directoryGetFiles(dir);
                    }
                }
                else {
                    return new readOnlyFileSystem_mock_1.ReadOnlyFileSystemMock().directoryGetFiles(dir);
                }
            }));
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "None",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("could not be located");
        }));
        it("can fail when pipeline module throws error with label", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            fileSystemStub.directoryGetFiles = sandbox.stub().rejects("error");
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed to load");
        }));
        it("can fail when pipeline module throws error", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            fileSystemStub.directoryGetFiles = sandbox.stub().onSecondCall().rejects("error");
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed to load");
        }));
        it("can succeed when calling with none linter", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with undefined outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with www outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "None",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: "./test/unit/temp/www"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed when calling with defined outputDirectory", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed with existing unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.buildConfigurations = { dev: new uniteBuildConfiguration_1.UniteBuildConfiguration() };
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: "My App",
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can fail with invalid unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = null;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: undefined,
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("existing unite.json");
        }));
        it("can fail when called with just unknown profile", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                ides: undefined,
                documenter: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: "aaaaa",
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("does not exist");
        }));
        it("can fail when called when profile files does not exist", () => __awaiter(this, void 0, void 0, function* () {
            profileExists = false;
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: "AureliaTypeScript",
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        }));
        it("can fail when called when profile file throws exception", () => __awaiter(this, void 0, void 0, function* () {
            profileErrors = true;
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: "AureliaTypeScript",
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("profile file");
        }));
        it("can fail when called with just known profile and no packageName", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: undefined,
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                ides: undefined,
                documenter: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: "AureliaTypeScript",
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        }));
        it("can succeed when called with known profile", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: "My Package",
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: undefined,
                profile: "AureliaTypeScript",
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteJsonWritten.packageName).to.be.equal("my-package");
            Chai.expect(uniteJsonWritten.applicationFramework).to.be.equal("Aurelia");
            Chai.expect(uniteJsonWritten.sourceLanguage).to.be.equal("TypeScript");
        }));
        it("can succeed when called with known and override parameters", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson = undefined;
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: "My Package",
                shortName: undefined,
                keywords: undefined,
                description: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: undefined,
                sourceLanguage: undefined,
                moduleType: undefined,
                bundler: undefined,
                unitTestRunner: undefined,
                unitTestFramework: undefined,
                unitTestEngine: undefined,
                e2eTestRunner: undefined,
                e2eTestFramework: undefined,
                linter: undefined,
                cssPre: undefined,
                cssPost: undefined,
                cssLinter: undefined,
                documenter: undefined,
                ides: undefined,
                taskManager: undefined,
                server: undefined,
                packageManager: undefined,
                applicationFramework: "Angular",
                profile: "AureliaTypeScript",
                force: undefined,
                noCreateSource: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteJsonWritten.packageName).to.be.equal("my-package");
            Chai.expect(uniteJsonWritten.applicationFramework).to.be.equal("Angular");
            Chai.expect(uniteJsonWritten.sourceLanguage).to.be.equal("TypeScript");
        }));
        it("can succeed with force and existing unite.json", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.buildConfigurations = { dev: new uniteBuildConfiguration_1.UniteBuildConfiguration() };
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: true,
                noCreateSource: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed with noCreateSource", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.buildConfigurations = { dev: new uniteBuildConfiguration_1.UniteBuildConfiguration() };
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: undefined,
                shortName: undefined,
                description: undefined,
                keywords: undefined,
                organization: undefined,
                copyright: undefined,
                webSite: undefined,
                author: undefined,
                authorEmail: undefined,
                authorWebSite: undefined,
                namespace: undefined,
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: undefined,
                noCreateSource: true,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        }));
        it("can succeed with meta data", () => __awaiter(this, void 0, void 0, function* () {
            uniteJson.buildConfigurations = { dev: new uniteBuildConfiguration_1.UniteBuildConfiguration() };
            const obj = new configureCommand_1.ConfigureCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = yield obj.run({
                packageName: "my-package",
                title: "my-app",
                shortName: "short",
                description: "desc",
                keywords: ["a", "b"],
                organization: "org",
                copyright: "copy",
                webSite: "web",
                namespace: "ns",
                author: "auth",
                authorEmail: "authE",
                authorWebSite: "authW",
                license: "MIT",
                sourceLanguage: "JavaScript",
                moduleType: "AMD",
                bundler: "RequireJS",
                unitTestRunner: "Karma",
                unitTestFramework: "Jasmine",
                unitTestEngine: "PhantomJS",
                e2eTestRunner: "Protractor",
                e2eTestFramework: "MochaChai",
                linter: "ESLint",
                cssPre: "Sass",
                cssPost: "None",
                cssLinter: "None",
                documenter: "None",
                ides: ["VSCode"],
                server: "BrowserSync",
                taskManager: "Gulp",
                packageManager: "Npm",
                applicationFramework: "Vanilla",
                profile: undefined,
                force: true,
                noCreateSource: undefined,
                outputDirectory: "./test/unit/temp"
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("you should update");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonThemeWritten.title).to.be.equal("my-app");
            Chai.expect(uniteJsonThemeWritten.shortName).to.be.equal("short");
            Chai.expect(uniteJsonThemeWritten.metaDescription).to.be.equal("desc");
            Chai.expect(uniteJsonThemeWritten.metaKeywords).to.be.deep.equal(["a", "b"]);
            Chai.expect(uniteJsonThemeWritten.organization).to.be.equal("org");
            Chai.expect(uniteJsonThemeWritten.copyright).to.be.equal("copy");
            Chai.expect(uniteJsonThemeWritten.webSite).to.be.equal("web");
            Chai.expect(uniteJsonThemeWritten.namespace).to.be.equal("ns");
            Chai.expect(uniteJsonThemeWritten.metaAuthor).to.be.equal("auth");
            Chai.expect(uniteJsonThemeWritten.metaAuthorEmail).to.be.equal("authE");
            Chai.expect(uniteJsonThemeWritten.metaAuthorWebSite).to.be.equal("authW");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29tbWFuZHMvY29uZmlndXJlQ29tbWFuZC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFHL0IsZ0ZBQTZFO0FBQzdFLGdIQUE2RztBQUc3Ryx3REFBb0Q7QUFDcEQsd0VBQW9FO0FBRXBFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsSUFBSSxPQUEyQixDQUFDO0lBQ2hDLElBQUksVUFBbUIsQ0FBQztJQUN4QixJQUFJLGNBQTJCLENBQUM7SUFDaEMsSUFBSSxjQUE4QixDQUFDO0lBQ25DLElBQUksZ0JBQWdDLENBQUM7SUFDckMsSUFBSSxlQUErQixDQUFDO0lBQ3BDLElBQUksU0FBNkIsQ0FBQztJQUNsQyxJQUFJLGdCQUFvQyxDQUFDO0lBQ3pDLElBQUkscUJBQThDLENBQUM7SUFDbkQsSUFBSSxhQUFzQixDQUFDO0lBQzNCLElBQUksYUFBc0IsQ0FBQztJQUMzQixJQUFJLGtCQUEyQyxDQUFDO0lBRWhELFVBQVUsQ0FBQyxHQUFTLEVBQUU7UUFDbEIsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsVUFBVSxHQUFZLEVBQUUsQ0FBQztRQUN6QixVQUFVLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QixVQUFVLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3QixVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUUvQixjQUFjLEdBQUcsSUFBSSxnREFBc0IsRUFBRSxDQUFDO1FBRTlDLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUs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QUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4RSxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiY29tbWFuZHMvY29uZmlndXJlQ29tbWFuZC5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0cyBmb3IgQnVpbGQgQ29uZmlndXJhdGlvbiBDb21tYW5kLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgQ29uZmlndXJlQ29tbWFuZCB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlndXJlQ29tbWFuZFwiO1xuaW1wb3J0IHsgVW5pdGVCdWlsZENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQnVpbGRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlVGhlbWUvdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL2ZpbGVTeXN0ZW0ubW9ja1wiO1xuaW1wb3J0IHsgUmVhZE9ubHlGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi9yZWFkT25seUZpbGVTeXN0ZW0ubW9ja1wiO1xuXG5kZXNjcmliZShcIkNvbmZpZ3VyZUNvbW1hbmRcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1TdHViOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgbG9nZ2VyRXJyb3JTcHk6IFNpbm9uLlNpbm9uU3B5O1xuICAgIGxldCBsb2dnZXJXYXJuaW5nU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbG9nZ2VyQmFubmVyU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgdW5pdGVKc29uOiBVbml0ZUNvbmZpZ3VyYXRpb247XG4gICAgbGV0IHVuaXRlSnNvbldyaXR0ZW46IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgdW5pdGVKc29uVGhlbWVXcml0dGVuOiBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgcHJvZmlsZUVycm9yczogYm9vbGVhbjtcbiAgICBsZXQgcHJvZmlsZUV4aXN0czogYm9vbGVhbjtcbiAgICBsZXQgZW5naW5lUGVlclBhY2thZ2VzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nfTtcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uc2FuZGJveC5jcmVhdGUoKTtcbiAgICAgICAgbG9nZ2VyU3R1YiA9IDxJTG9nZ2VyPnt9O1xuICAgICAgICBsb2dnZXJTdHViLmJhbm5lciA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLndhcm5pbmcgPSAoKSA9PiB7IH07XG5cbiAgICAgICAgZmlsZVN5c3RlbVN0dWIgPSBuZXcgUmVhZE9ubHlGaWxlU3lzdGVtTW9jaygpO1xuXG4gICAgICAgIGxvZ2dlckVycm9yU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJlcnJvclwiKTtcbiAgICAgICAgbG9nZ2VyV2FybmluZ1NweSA9IHNhbmRib3guc3B5KGxvZ2dlclN0dWIsIFwid2FybmluZ1wiKTtcbiAgICAgICAgbG9nZ2VyQmFubmVyU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJiYW5uZXJcIik7XG5cbiAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICB1bml0ZUpzb25Xcml0dGVuID0gdW5kZWZpbmVkO1xuICAgICAgICB1bml0ZUpzb25UaGVtZVdyaXR0ZW4gPSB1bmRlZmluZWQ7XG4gICAgICAgIHByb2ZpbGVFeGlzdHMgPSB0cnVlO1xuICAgICAgICBwcm9maWxlRXJyb3JzID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlRXhpc3RzID0gZmlsZVN5c3RlbVN0dWIuZmlsZUV4aXN0cztcbiAgICAgICAgY29uc3Qgc3R1YkV4aXN0cyA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpO1xuICAgICAgICBzdHViRXhpc3RzLmNhbGxzRmFrZShhc3luYyAoZm9sZGVyLCBmaWxlbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodW5pdGVKc29uID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWxlbmFtZSA9PT0gXCJjb25maWd1cmUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwcm9maWxlRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2ZpbGVFcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgKG5ldyBFcnJvcihcImZhaWxcIikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVFeGlzdHMoZm9sZGVyLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGaWxlRXhpc3RzKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlUmVhZEpzb24gPSBmaWxlU3lzdGVtU3R1Yi5maWxlUmVhZEpzb247XG4gICAgICAgIGNvbnN0IHN0dWJyZWFkSnNvbiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlUmVhZEpzb25cIik7XG4gICAgICAgIHN0dWJyZWFkSnNvbi5jYWxsc0Zha2UoYXN5bmMgKGZvbGRlciwgZmlsZW5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlbmFtZSA9PT0gXCJ1bml0ZS5qc29uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5pdGVKc29uID09PSBudWxsID8gUHJvbWlzZS5yZWplY3QoXCJlcnJcIikgOiBQcm9taXNlLnJlc29sdmUodW5pdGVKc29uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRmlsZVJlYWRKc29uKGZvbGRlciwgZmlsZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlV3JpdGVKc29uID0gZmlsZVN5c3RlbVN0dWIuZmlsZVdyaXRlSnNvbjtcbiAgICAgICAgY29uc3Qgc3R1YldyaXRlSnNvbiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlV3JpdGVKc29uXCIpO1xuICAgICAgICBzdHViV3JpdGVKc29uLmNhbGxzRmFrZShhc3luYyAoZm9sZGVyLCBmaWxlbmFtZSwgb2JqKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUgPT09IFwidW5pdGUuanNvblwiKSB7XG4gICAgICAgICAgICAgICAgdW5pdGVKc29uV3JpdHRlbiA9IG9iajtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGVuYW1lID09PSBcInVuaXRlLXRoZW1lLmpzb25cIikge1xuICAgICAgICAgICAgICAgIHVuaXRlSnNvblRoZW1lV3JpdHRlbiA9IG9iajtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZpbGVXcml0ZUpzb24oZm9sZGVyLCBmaWxlbmFtZSwgb2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdW5pdGVKc29uID0ge1xuICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgIGRvY3VtZW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiWWFyblwiLFxuICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJWYW5pbGxhXCIsXG4gICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICB1bml0ZVZlcnNpb246IFwiMC4wLjBcIixcbiAgICAgICAgICAgIHNvdXJjZUV4dGVuc2lvbnM6IFtdLFxuICAgICAgICAgICAgdmlld0V4dGVuc2lvbnM6IFtdLFxuICAgICAgICAgICAgc3R5bGVFeHRlbnNpb246IFwiXCIsXG4gICAgICAgICAgICBjbGllbnRQYWNrYWdlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZGlyczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc3JjRGlzdFJlcGxhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHNyY0Rpc3RSZXBsYWNlV2l0aDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgYnVpbGRDb25maWd1cmF0aW9uczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgcGxhdGZvcm1zOiB1bmRlZmluZWRcbiAgICAgICAgfTtcblxuICAgICAgICBlbmdpbmVQZWVyUGFja2FnZXMgPSBhd2FpdCBmaWxlU3lzdGVtU3R1Yi5maWxlUmVhZEpzb248eyBbaWQ6IHN0cmluZyBdOiBzdHJpbmd9PihcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdW5pdGVqcy1wYWNrYWdlcy9hc3NldHMvXCIpLCBcInBlZXJQYWNrYWdlcy5qc29uXCIpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBGaWxlU3lzdGVtTW9jaygpO1xuICAgICAgICBhd2FpdCBvYmouZGlyZWN0b3J5RGVsZXRlKFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNvbmZpZ3VyZVwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHBhY2thZ2VOYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInBhY2thZ2VOYW1lXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBzb3VyY2VMYW5ndWFnZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJzb3VyY2VMYW5ndWFnZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgbW9kdWxlVHlwZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIm1vZHVsZVR5cGVcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIGJ1bmRsZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiYnVuZGxlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgdW5pdFRlc3RSdW5uZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInVuaXRUZXN0UnVubmVyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuaXRUZXN0UnVubmVyIE5vbmUgYW5kIHVuaXRUZXN0RnJhbWV3b3JrXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiaXMgbm90IHZhbGlkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuaXRUZXN0UnVubmVyIE5vbmUgYW5kIHVuaXRUZXN0RW5naW5lXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJpcyBub3QgdmFsaWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5pdFRlc3RSdW5uZXIgS2FybWEgYW5kIG1pc3NpbmcgdW5pdFRlc3RGcmFtZXdvcmtcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInVuaXRUZXN0RnJhbWV3b3JrXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCB1bml0VGVzdEVuZ2luZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJ1bml0VGVzdEVuZ2luZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgZTJlVGVzdFJ1bm5lclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZTJlVGVzdFJ1bm5lclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCBlMmVUZXN0UnVubmVyIE5vbmUgYW5kIGUyZVRlc3RGcmFtZXdvcmtcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImlzIG5vdCB2YWxpZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCBlMmVUZXN0UnVubmVyIFByb3RyYWN0b3IgYW5kIG1pc3NpbmcgZTJlVGVzdEZyYW1ld29ya1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJlMmVUZXN0RnJhbWV3b3JrXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIHVuZGVmaW5lZCBsaW50ZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJsaW50ZXJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIGNzc1ByZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImNzc1ByZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgY3NzUG9zdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiY3NzUG9zdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgY3NzTGludGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogXCJhYWFcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJjc3NMaW50ZXJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIGRvY3VtZW50ZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiBcImFhYVwiLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZG9jdW1lbnRlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgc2VydmVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiUG9zdENzc1wiLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogXCJTdHlsZUxpbnRcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiBcIkVTRG9jXCIsXG4gICAgICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJzZXJ2ZXJcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBjYWxsaW5nIHdpdGggdW5kZWZpbmVkIHRhc2tNYW5hZ2VyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiUG9zdENzc1wiLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInRhc2tNYW5hZ2VyXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGluZyB3aXRoIGludmFsaWQgcGFja2FnZU1hbmFnZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcImJsYWhcIixcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJwYWNrYWdlTWFuYWdlclwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgYXBwbGljYXRpb25GcmFtZXdvcmtcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImFwcGxpY2F0aW9uRnJhbWV3b3JrXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gcGlwZWxpbmUgc3RlcCBmYWlsc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiVFNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiVmFuaWxsYVwiLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJUU0xpbnRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBwaXBlbGluZSBtb2R1bGUgZG9lcyBub3QgZXhpc3RcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgY29uc3Qgc3R1YiA9IGZpbGVTeXN0ZW1TdHViLmRpcmVjdG9yeUdldEZpbGVzID0gc2FuZGJveC5zdHViKCk7XG4gICAgICAgICAgICBzdHViLmNhbGxzRmFrZShhc3luYyAoZGlyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRpci5pbmRleE9mKFwibGludGVyXCIpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ZXIgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVhZE9ubHlGaWxlU3lzdGVtTW9jaygpLmRpcmVjdG9yeUdldEZpbGVzKGRpcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlYWRPbmx5RmlsZVN5c3RlbU1vY2soKS5kaXJlY3RvcnlHZXRGaWxlcyhkaXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRlcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogXCJCcm93c2VyU3luY1wiLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiBcIkd1bHBcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJOcG1cIixcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJWYW5pbGxhXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImNvdWxkIG5vdCBiZSBsb2NhdGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gcGlwZWxpbmUgbW9kdWxlIHRocm93cyBlcnJvciB3aXRoIGxhYmVsXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHViLmRpcmVjdG9yeUdldEZpbGVzID0gc2FuZGJveC5zdHViKCkucmVqZWN0cyhcImVycm9yXCIpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlZhbmlsbGFcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZmFpbGVkIHRvIGxvYWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2hlbiBwaXBlbGluZSBtb2R1bGUgdGhyb3dzIGVycm9yXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHViLmRpcmVjdG9yeUdldEZpbGVzID0gc2FuZGJveC5zdHViKCkub25TZWNvbmRDYWxsKCkucmVqZWN0cyhcImVycm9yXCIpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlZhbmlsbGFcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZmFpbGVkIHRvIGxvYWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBjYWxsaW5nIHdpdGggbm9uZSBsaW50ZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlZhbmlsbGFcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJXYXJuaW5nU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJ5b3Ugc2hvdWxkIHVwZGF0ZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGNhbGxpbmcgd2l0aCB1bmRlZmluZWQgb3V0cHV0RGlyZWN0b3J5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogXCJteS1wYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRlcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogXCJCcm93c2VyU3luY1wiLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiBcIkd1bHBcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJOcG1cIixcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJWYW5pbGxhXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyV2FybmluZ1NweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwieW91IHNob3VsZCB1cGRhdGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBjYWxsaW5nIHdpdGggd3d3IG91dHB1dERpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlZhbmlsbGFcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wL3d3d1wiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJXYXJuaW5nU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJ5b3Ugc2hvdWxkIHVwZGF0ZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGNhbGxpbmcgd2l0aCBkZWZpbmVkIG91dHB1dERpcmVjdG9yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiVmFuaWxsYVwiLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBcIi4vdGVzdC91bml0L3RlbXBcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyV2FybmluZ1NweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwieW91IHNob3VsZCB1cGRhdGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBleGlzdGluZyB1bml0ZS5qc29uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5idWlsZENvbmZpZ3VyYXRpb25zID0geyBkZXY6IG5ldyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbigpIH07XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJNeSBBcHBcIixcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJXYXJuaW5nU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJ5b3Ugc2hvdWxkIHVwZGF0ZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIGludmFsaWQgdW5pdGUuanNvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSBudWxsO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiZXhpc3RpbmcgdW5pdGUuanNvblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxlZCB3aXRoIGp1c3QgdW5rbm93biBwcm9maWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBDb25maWd1cmVDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBmaWxlU3lzdGVtU3R1Yi5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vLi4vXCIpLCBcIjAuMC4xXCIsIGVuZ2luZVBlZXJQYWNrYWdlcyk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoucnVuKHtcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogXCJhYWFhYVwiLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcImRvZXMgbm90IGV4aXN0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGVkIHdoZW4gcHJvZmlsZSBmaWxlcyBkb2VzIG5vdCBleGlzdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBwcm9maWxlRXhpc3RzID0gZmFsc2U7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaWRlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiQXVyZWxpYVR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJwYWNrYWdlTmFtZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aGVuIGNhbGxlZCB3aGVuIHByb2ZpbGUgZmlsZSB0aHJvd3MgZXhjZXB0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHByb2ZpbGVFcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29weXJpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBidW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlkZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcm9maWxlOiBcIkF1cmVsaWFUeXBlU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwicHJvZmlsZSBmaWxlXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdoZW4gY2FsbGVkIHdpdGgganVzdCBrbm93biBwcm9maWxlIGFuZCBubyBwYWNrYWdlTmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2VydmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IFwiQXVyZWxpYVR5cGVTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJwYWNrYWdlTmFtZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aGVuIGNhbGxlZCB3aXRoIGtub3duIHByb2ZpbGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJNeSBQYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogXCJBdXJlbGlhVHlwZVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5wYWNrYWdlTmFtZSkudG8uYmUuZXF1YWwoXCJteS1wYWNrYWdlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5hcHBsaWNhdGlvbkZyYW1ld29yaykudG8uYmUuZXF1YWwoXCJBdXJlbGlhXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uV3JpdHRlbi5zb3VyY2VMYW5ndWFnZSkudG8uYmUuZXF1YWwoXCJUeXBlU2NyaXB0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdoZW4gY2FsbGVkIHdpdGgga25vd24gYW5kIG92ZXJyaWRlIHBhcmFtZXRlcnNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdW5pdGVKc29uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJNeSBQYWNrYWdlXCIsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGludGVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBpZGVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIkFuZ3VsYXJcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiBcIkF1cmVsaWFUeXBlU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBub0NyZWF0ZVNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnBhY2thZ2VOYW1lKS50by5iZS5lcXVhbChcIm15LXBhY2thZ2VcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLmFwcGxpY2F0aW9uRnJhbWV3b3JrKS50by5iZS5lcXVhbChcIkFuZ3VsYXJcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25Xcml0dGVuLnNvdXJjZUxhbmd1YWdlKS50by5iZS5lcXVhbChcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBmb3JjZSBhbmQgZXhpc3RpbmcgdW5pdGUuanNvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB1bml0ZUpzb24uYnVpbGRDb25maWd1cmF0aW9ucyA9IHsgZGV2OiBuZXcgVW5pdGVCdWlsZENvbmZpZ3VyYXRpb24oKSB9O1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IENvbmZpZ3VyZUNvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIGZpbGVTeXN0ZW1TdHViLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi8uLi8uLi9cIiksIFwiMC4wLjFcIiwgZW5naW5lUGVlclBhY2thZ2VzKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5ydW4oe1xuICAgICAgICAgICAgICAgIHBhY2thZ2VOYW1lOiBcIm15LXBhY2thZ2VcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb3B5cmlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB3ZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYXV0aG9yRW1haWw6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JXZWJTaXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbGljZW5zZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICBzb3VyY2VMYW5ndWFnZTogXCJKYXZhU2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbW9kdWxlVHlwZTogXCJBTURcIixcbiAgICAgICAgICAgICAgICBidW5kbGVyOiBcIlJlcXVpcmVKU1wiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0UnVubmVyOiBcIkthcm1hXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RGcmFtZXdvcms6IFwiSmFzbWluZVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RW5naW5lOiBcIlBoYW50b21KU1wiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RSdW5uZXI6IFwiUHJvdHJhY3RvclwiLFxuICAgICAgICAgICAgICAgIGUyZVRlc3RGcmFtZXdvcms6IFwiTW9jaGFDaGFpXCIsXG4gICAgICAgICAgICAgICAgbGludGVyOiBcIkVTTGludFwiLFxuICAgICAgICAgICAgICAgIGNzc1ByZTogXCJTYXNzXCIsXG4gICAgICAgICAgICAgICAgY3NzUG9zdDogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgY3NzTGludGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBkb2N1bWVudGVyOiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBpZGVzOiBbXCJWU0NvZGVcIl0sXG4gICAgICAgICAgICAgICAgc2VydmVyOiBcIkJyb3dzZXJTeW5jXCIsXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXI6IFwiR3VscFwiLFxuICAgICAgICAgICAgICAgIHBhY2thZ2VNYW5hZ2VyOiBcIk5wbVwiLFxuICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uRnJhbWV3b3JrOiBcIlZhbmlsbGFcIixcbiAgICAgICAgICAgICAgICBwcm9maWxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZm9yY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgbm9DcmVhdGVTb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvdXRwdXREaXJlY3Rvcnk6IFwiLi90ZXN0L3VuaXQvdGVtcFwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJXYXJuaW5nU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJ5b3Ugc2hvdWxkIHVwZGF0ZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckJhbm5lclNweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIG5vQ3JlYXRlU291cmNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5idWlsZENvbmZpZ3VyYXRpb25zID0geyBkZXY6IG5ldyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbigpIH07XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgc2hvcnROYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHdlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBhdXRob3JFbWFpbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGF1dGhvcldlYlNpdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBsaWNlbnNlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgIHNvdXJjZUxhbmd1YWdlOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgICAgICBtb2R1bGVUeXBlOiBcIkFNRFwiLFxuICAgICAgICAgICAgICAgIGJ1bmRsZXI6IFwiUmVxdWlyZUpTXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RSdW5uZXI6IFwiS2FybWFcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEZyYW1ld29yazogXCJKYXNtaW5lXCIsXG4gICAgICAgICAgICAgICAgdW5pdFRlc3RFbmdpbmU6IFwiUGhhbnRvbUpTXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdFJ1bm5lcjogXCJQcm90cmFjdG9yXCIsXG4gICAgICAgICAgICAgICAgZTJlVGVzdEZyYW1ld29yazogXCJNb2NoYUNoYWlcIixcbiAgICAgICAgICAgICAgICBsaW50ZXI6IFwiRVNMaW50XCIsXG4gICAgICAgICAgICAgICAgY3NzUHJlOiBcIlNhc3NcIixcbiAgICAgICAgICAgICAgICBjc3NQb3N0OiBcIk5vbmVcIixcbiAgICAgICAgICAgICAgICBjc3NMaW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50ZXI6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGlkZXM6IFtcIlZTQ29kZVwiXSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiQnJvd3NlclN5bmNcIixcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlcjogXCJHdWxwXCIsXG4gICAgICAgICAgICAgICAgcGFja2FnZU1hbmFnZXI6IFwiTnBtXCIsXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25GcmFtZXdvcms6IFwiVmFuaWxsYVwiLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmb3JjZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIG91dHB1dERpcmVjdG9yeTogXCIuL3Rlc3QvdW5pdC90ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlcldhcm5pbmdTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcInlvdSBzaG91bGQgdXBkYXRlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyQmFubmVyU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW4oXCJTdWNjZXNzXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHdpdGggbWV0YSBkYXRhXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHVuaXRlSnNvbi5idWlsZENvbmZpZ3VyYXRpb25zID0geyBkZXY6IG5ldyBVbml0ZUJ1aWxkQ29uZmlndXJhdGlvbigpIH07XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQ29uZmlndXJlQ29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgZmlsZVN5c3RlbVN0dWIucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uLy4uLy4uL1wiKSwgXCIwLjAuMVwiLCBlbmdpbmVQZWVyUGFja2FnZXMpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnJ1bih7XG4gICAgICAgICAgICAgICAgcGFja2FnZU5hbWU6IFwibXktcGFja2FnZVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIm15LWFwcFwiLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogXCJzaG9ydFwiLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcImRlc2NcIixcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogW1wiYVwiLCBcImJcIl0sXG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiBcIm9yZ1wiLFxuICAgICAgICAgICAgICAgIGNvcHlyaWdodDogXCJjb3B5XCIsXG4gICAgICAgICAgICAgICAgd2ViU2l0ZTogXCJ3ZWJcIixcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IFwibnNcIixcbiAgICAgICAgICAgICAgICBhdXRob3I6IFwiYXV0aFwiLFxuICAgICAgICAgICAgICAgIGF1dGhvckVtYWlsOiBcImF1dGhFXCIsXG4gICAgICAgICAgICAgICAgYXV0aG9yV2ViU2l0ZTogXCJhdXRoV1wiLFxuICAgICAgICAgICAgICAgIGxpY2Vuc2U6IFwiTUlUXCIsXG4gICAgICAgICAgICAgICAgc291cmNlTGFuZ3VhZ2U6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIG1vZHVsZVR5cGU6IFwiQU1EXCIsXG4gICAgICAgICAgICAgICAgYnVuZGxlcjogXCJSZXF1aXJlSlNcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdFJ1bm5lcjogXCJLYXJtYVwiLFxuICAgICAgICAgICAgICAgIHVuaXRUZXN0RnJhbWV3b3JrOiBcIkphc21pbmVcIixcbiAgICAgICAgICAgICAgICB1bml0VGVzdEVuZ2luZTogXCJQaGFudG9tSlNcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0UnVubmVyOiBcIlByb3RyYWN0b3JcIixcbiAgICAgICAgICAgICAgICBlMmVUZXN0RnJhbWV3b3JrOiBcIk1vY2hhQ2hhaVwiLFxuICAgICAgICAgICAgICAgIGxpbnRlcjogXCJFU0xpbnRcIixcbiAgICAgICAgICAgICAgICBjc3NQcmU6IFwiU2Fzc1wiLFxuICAgICAgICAgICAgICAgIGNzc1Bvc3Q6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIGNzc0xpbnRlcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRlcjogXCJOb25lXCIsXG4gICAgICAgICAgICAgICAgaWRlczogW1wiVlNDb2RlXCJdLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogXCJCcm93c2VyU3luY1wiLFxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyOiBcIkd1bHBcIixcbiAgICAgICAgICAgICAgICBwYWNrYWdlTWFuYWdlcjogXCJOcG1cIixcbiAgICAgICAgICAgICAgICBhcHBsaWNhdGlvbkZyYW1ld29yazogXCJWYW5pbGxhXCIsXG4gICAgICAgICAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZvcmNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIG5vQ3JlYXRlU291cmNlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3V0cHV0RGlyZWN0b3J5OiBcIi4vdGVzdC91bml0L3RlbXBcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyV2FybmluZ1NweS5hcmdzWzBdWzBdKS50by5jb250YWluKFwieW91IHNob3VsZCB1cGRhdGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJCYW5uZXJTcHkuYXJnc1swXVswXSkudG8uY29udGFpbihcIlN1Y2Nlc3NcIik7XG5cbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvblRoZW1lV3JpdHRlbi50aXRsZSkudG8uYmUuZXF1YWwoXCJteS1hcHBcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25UaGVtZVdyaXR0ZW4uc2hvcnROYW1lKS50by5iZS5lcXVhbChcInNob3J0XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uVGhlbWVXcml0dGVuLm1ldGFEZXNjcmlwdGlvbikudG8uYmUuZXF1YWwoXCJkZXNjXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uVGhlbWVXcml0dGVuLm1ldGFLZXl3b3JkcykudG8uYmUuZGVlcC5lcXVhbChbXCJhXCIsIFwiYlwiXSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25UaGVtZVdyaXR0ZW4ub3JnYW5pemF0aW9uKS50by5iZS5lcXVhbChcIm9yZ1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvblRoZW1lV3JpdHRlbi5jb3B5cmlnaHQpLnRvLmJlLmVxdWFsKFwiY29weVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvblRoZW1lV3JpdHRlbi53ZWJTaXRlKS50by5iZS5lcXVhbChcIndlYlwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvblRoZW1lV3JpdHRlbi5uYW1lc3BhY2UpLnRvLmJlLmVxdWFsKFwibnNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUpzb25UaGVtZVdyaXR0ZW4ubWV0YUF1dGhvcikudG8uYmUuZXF1YWwoXCJhdXRoXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVKc29uVGhlbWVXcml0dGVuLm1ldGFBdXRob3JFbWFpbCkudG8uYmUuZXF1YWwoXCJhdXRoRVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHVuaXRlSnNvblRoZW1lV3JpdHRlbi5tZXRhQXV0aG9yV2ViU2l0ZSkudG8uYmUuZXF1YWwoXCJhdXRoV1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pO1xuIl19
