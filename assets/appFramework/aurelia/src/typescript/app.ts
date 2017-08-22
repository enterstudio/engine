/**
 * Main application class.
 */
import { Router, RouterConfiguration } from "aurelia-router";

export class App {
    public router: Router;

    public configureRouter(config: RouterConfiguration, router: Router): any {
        config.map([
            {
                route: "", name: "child", moduleId: "./child/child"
            }
        ]);

        this.router = router;
    }
}

// Generated by UniteJS
