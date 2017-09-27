/**
 * Tests for AppModule.
 */
import * as coreTesting from "@angular/core/testing";
import * as browserTesting from "@angular/platform-browser-dynamic/testing";
import * as chaiModule from "chai";
const chai = (chaiModule as any).default || chaiModule;
import {AppModule} from "../../../src/app.module";

describe("AppModule", () => {
    beforeEach(() => {
        coreTesting.TestBed.initTestEnvironment(
            browserTesting.BrowserDynamicTestingModule,
            browserTesting.platformBrowserDynamicTesting());
    });

    it("can be created", () => {
        const app = new AppModule();
        chai.should().exist(app);
    });
});

// Generated by UniteJS
