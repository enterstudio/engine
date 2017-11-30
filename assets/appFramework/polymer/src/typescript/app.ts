/**
 * Main Application class.
 *
 * @export
 * @class App
 */
import "@polymer/app-route/app-location";
import "@polymer/app-route/app-route";
import {customElement} from "@polymer/decorators/src/decorators";
import "@polymer/iron-pages/iron-pages";
import {Element as PolymerElement} from "@polymer/polymer/polymer-element";
import /* Synthetic Import */ template from "./app.html";
import "./child/child";

@customElement("unite-app")
export class App extends PolymerElement {
    /**
     * Get the template.
     * @readonly
     * @static
     * @returns {string}
     */
    static get template(): string {
        return `${template}`;
    }
}

// Generated by UniteJS
