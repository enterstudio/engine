/**
 * Tests for {GEN_NAME_PASCAL}Component.
 */
import * as chaiModule from "chai";
const chai = (chaiModule as any).default || chaiModule;
import { {GEN_NAME_PASCAL}Component } from "{GEN_UNIT_TEST_RELATIVE}{GEN_NAME_SNAKE}{ADDITIONAL_EXTENSION}";

describe("{GEN_NAME_PASCAL}Component", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}Component();
        chai.should().exist(obj);
    });
});
