/**
 * Tests for App.
 */
import { App } from "../../../src/app";

describe("App", () => {
    it("can be created", (done) => {
        const app = new App();
        expect(app).toBeDefined();
        done();
    });
});
