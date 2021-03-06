/**
 * Tests for EsLint.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../../../../src/configuration/models/eslint/esLintConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { EsLint } from "../../../../../src/pipelineSteps/linter/esLint";
import { FileSystemMock } from "../../fileSystem.mock";

describe("EsLint", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.linter = "ESLint";
        uniteConfigurationStub.sourceLanguage = "JavaScript";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new EsLint();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new EsLint();
            uniteConfigurationStub.linter = undefined;
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new EsLint();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("intitialise", () => {
        it("can be called with mismatched language", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(engineVariablesStub.getConfiguration("EsLint")).to.be.equal(undefined);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("JavaScript");
        });

        it("can be called with mismatched main condition", async () => {
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration("EsLint")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint")).to.be.equal(undefined);
        });

        it("can succeed when file does exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().onFirstCall().resolves(true);
            fileSystemMock.fileReadJson = sandbox.stub().resolves({ extends: ["eslint:recommended2" ] });
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").extends).to.contain("eslint:recommended2");
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").extends).to.contain("eslint:recommended");
        });

        it("can succeed when ignore file does exist", async () => {
            fileSystemMock.fileExists = sandbox.stub().onSecondCall().resolves(true);
            fileSystemMock.fileReadLines = sandbox.stub().resolves(["", "# Generated by UniteJS"]);
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
        });

        it("can succeed when file does not exist", async () => {
            const obj = new EsLint();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<EsLintConfiguration>("ESLint").extends).to.contain("eslint:recommended");
        });
    });

    describe("configure", () => {
        it("can be called", async () => {
            const obj = new EsLint();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.eslint).to.be.equal("1.2.3");
        });

        it("can be called with false mainCondition", async () => {
            const obj = new EsLint();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { eslint: "1.2.3"};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies.eslint).to.be.equal(undefined);
        });
    });

    describe("finalise", () => {
        it("can fail writing", async () => {
            sandbox.stub(fileSystemMock, "fileWriteJson").rejects();

            const obj = new EsLint();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can succeed writing", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");

            const obj = new EsLint();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/", ".eslintrc.json");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.fileExists("./test/unit/temp/www/", ".eslintignore");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can be called and failed to delete with false mainCondition", async () => {
            sandbox.stub(fileSystemMock, "fileExists").rejects();

            const obj = new EsLint();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(1);
        });

        it("can be called with false mainCondition", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            await fileSystemMock.fileWriteJson("./test/unit/temp/www/", ".eslintrc.json", {});
            await fileSystemMock.fileWriteLines("./test/unit/temp/www/", ".eslintignore", ["Generated by UniteJS"]);

            const obj = new EsLint();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/", ".eslintrc.json");
            Chai.expect(exists).to.be.equal(false);

            exists = await fileSystemMock.fileExists("./test/unit/temp/www/", ".eslintignore");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
