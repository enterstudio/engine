/**
 * Tests for {GEN_NAME_PASCAL}Module.
 */
import * as chaiModule from "chai";
const chai = (chaiModule as any).default || chaiModule;
import { {GEN_NAME_PASCAL}Module } from "{GEN_UNIT_TEST_RELATIVE}{GEN_NAME_SNAKE}{ADDITIONAL_EXTENSION}";

describe("{GEN_NAME_PASCAL}Module", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}Module();
        chai.should().exist(obj);
    });
});
