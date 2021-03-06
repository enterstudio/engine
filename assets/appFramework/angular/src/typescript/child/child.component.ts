/**
 * Child component class.
 */
import { Component } from "@angular/core";

@Component({
    moduleId: "genModuleId",
    templateUrl: "./child.component.html",
    styleUrls: ["./child.component.css"]
})
export class ChildComponent {
    /**
     * Message displayed in the view.
     * @type {string}
     */
    public message: string;

    /**
     * Creates an instance of ChildComponent.
     */
    constructor() {
        this.message = "Hello UniteJS World!";
    }
}

// Generated by UniteJS
