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
 * Tests for Engine Command Base.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../dist/configuration/models/unite/uniteConfiguration");
const engineCommandBase_1 = require("../../../../dist/engine/engineCommandBase");
const engineVariables_1 = require("../../../../dist/engine/engineVariables");
const readOnlyFileSystem_mock_1 = require("../readOnlyFileSystem.mock");
class TestCommand extends engineCommandBase_1.EngineCommandBase {
    testLoadConfiguration(outputDirectory, profileSource, profile, force) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("loadConfiguration").call(this, outputDirectory, profileSource, profile, force);
        });
    }
    testLoadProfile(profileSource, profile) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("loadProfile").call(this, profileSource, profile);
        });
    }
    testCreateEngineVariables(outputDirectory, uniteConfiguration, engineVariables) {
        return super.createEngineVariables(outputDirectory, uniteConfiguration, engineVariables);
    }
    testMapParser(input) {
        return super.mapParser(input);
    }
    testMapFromArrayParser(input) {
        return super.mapFromArrayParser(input);
    }
}
describe("EngineCommandBase", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };
        fileSystemStub = new readOnlyFileSystem_mock_1.ReadOnlyFileSystemMock();
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
    }));
    it("can be created", () => {
        const obj = new TestCommand();
        Chai.should().exist(obj);
    });
    describe("create", () => {
        it("can be called", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            const res = obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
    });
    describe("loadConfiguration", () => {
        it("can be called with no existing config", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(false);
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with exception loading config", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").rejects("error");
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.equal(null);
        }));
        it("can be called with force", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadConfiguration(undefined, undefined, undefined, true);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with existing config", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ packageName: "fred" });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadConfiguration(undefined, undefined, undefined, false);
            Chai.expect(res).to.be.deep.equal({ packageName: "fred" });
        }));
    });
    describe("loadProfile", () => {
        it("can be called with parameters", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile(undefined, undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with non existing profile", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(false);
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with exception loading profile", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").rejects("error");
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(null);
        }));
        it("can be called with no profiles", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({});
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(null);
        }));
        it("can be called with unknown profile", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ myProfile: {} });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.equal(null);
        }));
        it("can be called with known profile", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ testProfile: { a: 1 } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.deep.equal({ a: 1 });
        }));
        it("can be called with known profile mismatched case", () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fileSystemStub, "fileExists").resolves(true);
            sandbox.stub(fileSystemStub, "fileReadJson").resolves({ TESTPROFILE: { a: 1 } });
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = yield obj.testLoadProfile("configure", "testProfile");
            Chai.expect(res).to.be.deep.equal({ a: 1 });
        }));
    });
    describe("createEngineVariables", () => {
        it("can be called with parameters", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const engineVariables = new engineVariables_1.EngineVariables();
            const uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
            obj.testCreateEngineVariables(undefined, uniteConfiguration, engineVariables);
            Chai.expect(engineVariables.force).to.be.equal(false);
        }));
    });
    describe("mapParser", () => {
        it("can be called with no parameters", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapParser(undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with broken input", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            try {
                obj.testMapParser(["khjlkjlk"]);
            }
            catch (err) {
                Chai.expect(err.toString()).to.contain("not formed");
            }
        }));
        it("can be called with broken input", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapParser(["a=1", "b=2"]);
            Chai.expect(res).to.be.deep.equal({ a: "1", b: "2" });
        }));
    });
    describe("mapFromArrayParser", () => {
        it("can be called with no parameters", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapFromArrayParser(undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with broken input", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            try {
                obj.testMapFromArrayParser(["khjlkjlk"]);
            }
            catch (err) {
                Chai.expect(err.toString()).to.contain("not formed");
            }
        }));
        it("can be called with broken input", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestCommand();
            obj.create(loggerStub, fileSystemStub, undefined, undefined, undefined);
            const res = obj.testMapFromArrayParser(["a", "b"]);
            Chai.expect(res).to.be.deep.equal({ a: "b" });
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL2VuZ2luZUNvbW1hbmRCYXNlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQixzR0FBbUc7QUFDbkcsZ0ZBQTZFO0FBQzdFLDRFQUF5RTtBQUN6RSx3RUFBb0U7QUFFcEUsaUJBQWtCLFNBQVEscUNBQWlCO0lBQzFCLHFCQUFxQixDQUFDLGVBQXVCLEVBQUUsYUFBcUIsRUFBRSxPQUFrQyxFQUFFLEtBQWM7OztZQUNqSSxNQUFNLENBQUMsMkJBQXVCLFlBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO1FBQ25GLENBQUM7S0FBQTtJQUVZLGVBQWUsQ0FBSSxhQUFxQixFQUFFLE9BQWtDOzs7WUFDckYsTUFBTSxDQUFDLHFCQUFpQixZQUFJLGFBQWEsRUFBRSxPQUFPLEVBQUU7UUFDeEQsQ0FBQztLQUFBO0lBRU0seUJBQXlCLENBQUMsZUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQztRQUM5SCxNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBRU0sYUFBYSxDQUFDLEtBQWU7UUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLHNCQUFzQixDQUFDLEtBQWU7UUFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0NBQ0o7QUFFRCxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO0lBQy9CLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLFVBQW1CLENBQUM7SUFDeEIsSUFBSSxjQUEyQixDQUFDO0lBRWhDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxVQUFVLEdBQVksRUFBRSxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLFVBQVUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLGNBQWMsR0FBRyxJQUFJLGdEQUFzQixFQUFFLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMsR0FBUyxFQUFFO1FBQ2pCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN0QixDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUNwQixFQUFFLENBQUMsZUFBZSxFQUFFLEdBQVMsRUFBRTtZQUMzQixNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQzlCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUMvQixFQUFFLENBQUMsdUNBQXVDLEVBQUUsR0FBUyxFQUFFO1lBQ25ELE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFTLEVBQUU7WUFDekQsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVELE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEUsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMscUJBQXFCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDcEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQVMsRUFBRTtZQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFTLEVBQUU7WUFDaEQsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFELE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQy9FLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEUsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMscUJBQXFCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDcEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsK0JBQStCLEVBQUUsR0FBUyxFQUFFO1lBQzNDLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEUsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseUNBQXlDLEVBQUUsR0FBUyxFQUFFO1lBQ3JELE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQVMsRUFBRTtZQUMxRCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUM5QixHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RSxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFTLEVBQUU7WUFDNUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFELE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLEdBQVMsRUFBRTtZQUNoRCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUQsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDekUsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUM5QixHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RSxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxHQUFTLEVBQUU7WUFDOUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFELE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDakYsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUM5QixHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RSxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxHQUFTLEVBQUU7WUFDOUQsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFELE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDakYsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUM5QixHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RSxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtRQUNuQyxFQUFFLENBQUMsK0JBQStCLEVBQUUsR0FBUyxFQUFFO1lBQzNDLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEUsTUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7WUFDOUMsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7WUFDcEQsR0FBRyxDQUFDLHlCQUF5QixDQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN2QixFQUFFLENBQUMsa0NBQWtDLEVBQUUsR0FBUyxFQUFFO1lBQzlDLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEUsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUUsR0FBUyxFQUFFO1lBQzdDLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEUsSUFBSSxDQUFDO2dCQUNELEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6RCxDQUFDO1FBQ0wsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFTLEVBQUU7WUFDN0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUM5QixHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RSxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEdBQVMsRUFBRTtZQUM5QyxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUUsR0FBUyxFQUFFO1lBQzdDLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEUsSUFBSSxDQUFDO2dCQUNELEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3pELENBQUM7UUFDTCxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQVMsRUFBRTtZQUM3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZUNvbW1hbmRCYXNlLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBFbmdpbmUgQ29tbWFuZCBCYXNlLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZUNvbW1hbmRCYXNlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9lbmdpbmUvZW5naW5lQ29tbWFuZEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUmVhZE9ubHlGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi9yZWFkT25seUZpbGVTeXN0ZW0ubW9ja1wiO1xuXG5jbGFzcyBUZXN0Q29tbWFuZCBleHRlbmRzIEVuZ2luZUNvbW1hbmRCYXNlIHtcbiAgICBwdWJsaWMgYXN5bmMgdGVzdExvYWRDb25maWd1cmF0aW9uKG91dHB1dERpcmVjdG9yeTogc3RyaW5nLCBwcm9maWxlU291cmNlOiBzdHJpbmcsIHByb2ZpbGU6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwsIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxVbml0ZUNvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgfCBudWxsPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5sb2FkQ29uZmlndXJhdGlvbihvdXRwdXREaXJlY3RvcnksIHByb2ZpbGVTb3VyY2UsIHByb2ZpbGUsIGZvcmNlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgdGVzdExvYWRQcm9maWxlPFQ+KHByb2ZpbGVTb3VyY2U6IHN0cmluZywgcHJvZmlsZTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCk6IFByb21pc2U8VCB8IHVuZGVmaW5lZCB8IG51bGw+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmxvYWRQcm9maWxlPFQ+KHByb2ZpbGVTb3VyY2UsIHByb2ZpbGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0ZXN0Q3JlYXRlRW5naW5lVmFyaWFibGVzKG91dHB1dERpcmVjdG9yeTogc3RyaW5nLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNyZWF0ZUVuZ2luZVZhcmlhYmxlcyhvdXRwdXREaXJlY3RvcnksIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdGVzdE1hcFBhcnNlcihpbnB1dDogc3RyaW5nW10pOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgICAgICByZXR1cm4gc3VwZXIubWFwUGFyc2VyKGlucHV0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdGVzdE1hcEZyb21BcnJheVBhcnNlcihpbnB1dDogc3RyaW5nW10pOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgICAgICByZXR1cm4gc3VwZXIubWFwRnJvbUFycmF5UGFyc2VyKGlucHV0KTtcbiAgICB9XG59XG5cbmRlc2NyaWJlKFwiRW5naW5lQ29tbWFuZEJhc2VcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1TdHViOiBJRmlsZVN5c3RlbTtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBzYW5kYm94ID0gU2lub24uc2FuZGJveC5jcmVhdGUoKTtcbiAgICAgICAgbG9nZ2VyU3R1YiA9IDxJTG9nZ2VyPnt9O1xuICAgICAgICBsb2dnZXJTdHViLmJhbm5lciA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLndhcm5pbmcgPSAoKSA9PiB7IH07XG5cbiAgICAgICAgZmlsZVN5c3RlbVN0dWIgPSBuZXcgUmVhZE9ubHlGaWxlU3lzdGVtTW9jaygpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgfSk7XG5cbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDb21tYW5kKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiY3JlYXRlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJsb2FkQ29uZmlndXJhdGlvblwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vIGV4aXN0aW5nIGNvbmZpZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZUV4aXN0c1wiKS5yZXNvbHZlcyhmYWxzZSk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnRlc3RMb2FkQ29uZmlndXJhdGlvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4Y2VwdGlvbiBsb2FkaW5nIGNvbmZpZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZUV4aXN0c1wiKS5yZWplY3RzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnRlc3RMb2FkQ29uZmlndXJhdGlvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBmb3JjZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnRlc3RMb2FkQ29uZmlndXJhdGlvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZXhpc3RpbmcgY29uZmlnXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpLnJlc29sdmVzKHRydWUpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVSZWFkSnNvblwiKS5yZXNvbHZlcyh7IHBhY2thZ2VOYW1lOiBcImZyZWRcIiB9KTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRDb25maWd1cmF0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7IHBhY2thZ2VOYW1lOiBcImZyZWRcIiB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImxvYWRQcm9maWxlXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggcGFyYW1ldGVyc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnRlc3RMb2FkUHJvZmlsZSh1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vbiBleGlzdGluZyBwcm9maWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpLnJlc29sdmVzKGZhbHNlKTtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmoudGVzdExvYWRQcm9maWxlKFwiY29uZmlndXJlXCIsIFwidGVzdFByb2ZpbGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGV4Y2VwdGlvbiBsb2FkaW5nIHByb2ZpbGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVFeGlzdHNcIikucmVqZWN0cyhcImVycm9yXCIpO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai50ZXN0TG9hZFByb2ZpbGUoXCJjb25maWd1cmVcIiwgXCJ0ZXN0UHJvZmlsZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwobnVsbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIG5vIHByb2ZpbGVzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpLnJlc29sdmVzKHRydWUpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVSZWFkSnNvblwiKS5yZXNvbHZlcyh7fSk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnRlc3RMb2FkUHJvZmlsZShcImNvbmZpZ3VyZVwiLCBcInRlc3RQcm9maWxlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbChudWxsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5rbm93biBwcm9maWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlRXhpc3RzXCIpLnJlc29sdmVzKHRydWUpO1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVSZWFkSnNvblwiKS5yZXNvbHZlcyh7IG15UHJvZmlsZToge30gfSk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnRlc3RMb2FkUHJvZmlsZShcImNvbmZpZ3VyZVwiLCBcInRlc3RQcm9maWxlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbChudWxsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGgga25vd24gcHJvZmlsZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZUV4aXN0c1wiKS5yZXNvbHZlcyh0cnVlKTtcbiAgICAgICAgICAgIHNhbmRib3guc3R1YihmaWxlU3lzdGVtU3R1YiwgXCJmaWxlUmVhZEpzb25cIikucmVzb2x2ZXMoeyB0ZXN0UHJvZmlsZTogeyBhOiAxIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLnRlc3RMb2FkUHJvZmlsZShcImNvbmZpZ3VyZVwiLCBcInRlc3RQcm9maWxlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHsgYTogMSB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGgga25vd24gcHJvZmlsZSBtaXNtYXRjaGVkIGNhc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1TdHViLCBcImZpbGVFeGlzdHNcIikucmVzb2x2ZXModHJ1ZSk7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbVN0dWIsIFwiZmlsZVJlYWRKc29uXCIpLnJlc29sdmVzKHsgVEVTVFBST0ZJTEU6IHsgYTogMSB9IH0pO1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RDb21tYW5kKCk7XG4gICAgICAgICAgICBvYmouY3JlYXRlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai50ZXN0TG9hZFByb2ZpbGUoXCJjb25maWd1cmVcIiwgXCJ0ZXN0UHJvZmlsZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7IGE6IDEgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJjcmVhdGVFbmdpbmVWYXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBwYXJhbWV0ZXJzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCBlbmdpbmVWYXJpYWJsZXMgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgICAgICAgICBjb25zdCB1bml0ZUNvbmZpZ3VyYXRpb24gPSBuZXcgVW5pdGVDb25maWd1cmF0aW9uKCk7XG4gICAgICAgICAgICBvYmoudGVzdENyZWF0ZUVuZ2luZVZhcmlhYmxlcyh1bmRlZmluZWQsIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGVuZ2luZVZhcmlhYmxlcy5mb3JjZSkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwibWFwUGFyc2VyXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm8gcGFyYW1ldGVyc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gb2JqLnRlc3RNYXBQYXJzZXIodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYnJva2VuIGlucHV0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9iai50ZXN0TWFwUGFyc2VyKFtcImtoamxramxrXCJdKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIENoYWkuZXhwZWN0KGVyci50b1N0cmluZygpKS50by5jb250YWluKFwibm90IGZvcm1lZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYnJva2VuIGlucHV0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBvYmoudGVzdE1hcFBhcnNlcihbXCJhPTFcIiwgXCJiPTJcIl0pO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHsgYTogXCIxXCIsIGI6IFwiMlwiIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwibWFwRnJvbUFycmF5UGFyc2VyXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggbm8gcGFyYW1ldGVyc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdENvbW1hbmQoKTtcbiAgICAgICAgICAgIG9iai5jcmVhdGUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gb2JqLnRlc3RNYXBGcm9tQXJyYXlQYXJzZXIodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYnJva2VuIGlucHV0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9iai50ZXN0TWFwRnJvbUFycmF5UGFyc2VyKFtcImtoamxramxrXCJdKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIENoYWkuZXhwZWN0KGVyci50b1N0cmluZygpKS50by5jb250YWluKFwibm90IGZvcm1lZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYnJva2VuIGlucHV0XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0Q29tbWFuZCgpO1xuICAgICAgICAgICAgb2JqLmNyZWF0ZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBvYmoudGVzdE1hcEZyb21BcnJheVBhcnNlcihbXCJhXCIsIFwiYlwiXSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmRlZXAuZXF1YWwoeyBhOiBcImJcIiB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
