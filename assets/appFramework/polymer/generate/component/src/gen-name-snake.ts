/**
 * Gen Name Human component class.
 *
 * @export
 * @class GenNamePascal
 */
import {customElement, property} from "@polymer/decorators/src/decorators";
import {Element as PolymerElement} from "@polymer/polymer/polymer-element";
import /* Synthetic Import */ style from "./gen-name-snake.css";
import /* Synthetic Import */ template from "./gen-name-snake.html";

@customElement("co-gen-name-snake")
export class GenNamePascal extends PolymerElement {
    /**
     * Message to be displayed in the view.
     * @type {string}
     */
    @property({type: String})
    public message: string;

    /**
     * Creates an instance of GenNamePascal.
     */
    constructor() {
        super();
        this.message = "Gen Name Human";
    }

    /**
     * Get the template.
     * @readonly
     * @static
     * @returns {string}
     */
    static get template(): string {
        return `<style>${style}</style>
        ${template}`;
    }
}

// Generated by UniteJS
