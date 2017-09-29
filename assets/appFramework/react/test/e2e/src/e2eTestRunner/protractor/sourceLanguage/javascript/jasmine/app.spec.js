/**
 * Tests for App.
 */
describe("App", () => {
    it("the title is set", (done) => {
        const uniteJson = require("../../../../unite.json");
        browser.get("/")
            .then(() => {
                browser.getTitle()
                    .then((title) => {
                        expect(title).toEqual(uniteJson.title);
                        done();
                    });
            });
    });

    it("the root text is set", (done) => {
        browser.loadAndWaitForReactPage("/")
            .then(() => {
                $("#root > span").getText()
                    .then((rootContent) => {
                        expect(rootContent).toEqual("Hello UniteJS World!");
                        done();
                    });
            });
    });

    it("the font size is set", (done) => {
        browser.loadAndWaitForReactPage("/")
            .then(() => {
                $(".child-style").getCssValue("font-size")
                    .then((fontSize) => {
                        expect(fontSize).toEqual("20px");
                        done();
                    });
            });
    });
});

/* Generated by UniteJS */
