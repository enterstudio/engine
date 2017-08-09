/**
 * Tests for App.
 */
/// <reference types="unitejs-plain-webdriver-plugin"/>

describe("App", () => {
    it("the title is set", () => {
        const uniteJson = require("../../../../unite.json");
        return browser
            .url("/")
            .getTitle()
            .then((title) => {
                expect(title).toEqual(uniteJson.title);
            });
    });

    it("the root text is set", () => {
        return browser
            .loadAndWaitForPlainPage("/")
            .element("#root")
            .getText()
            .then((rootContent) => {
                expect(rootContent).toEqual("Hello UniteJS World!");
            });
    });
});

/* Generated by UniteJS */
