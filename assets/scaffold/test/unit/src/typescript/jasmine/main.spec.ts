/**
 * Tests for Main.
 */
import { entryPoint } from "../../../src/main";

describe("Main", () => {
    it("should contain entryPoint", (done) => {
        expect(entryPoint).toBeDefined();
        done();
    });
});
