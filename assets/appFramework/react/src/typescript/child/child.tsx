/**
 * Child class.
 *
 * @export
 * @class Child
 */
import /* Synthetic Import */ React from "react";
import "./child.css";

export class Child extends React.Component {
    /**
     * Message displayed in the view.
     * @type {string}
     */
    public message: string;

    /**
     * Creates an instance of Child.
     */
    constructor () {
        super();
        this.message = "Hello UniteJS World!";
    }

    /**
     * Render the component.
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <span className="child">{ this.message }</span>;
    }
}

// Generated by UniteJS
