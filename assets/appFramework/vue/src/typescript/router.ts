/**
 * Main Router.
 */
import {SYNTHETIC_IMPORT}Vue from "vue";
import {SYNTHETIC_IMPORT}Router from "vue-router";
import { Child } from "./child/child";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "Child",
            component: Child
        }
    ]
});

// Generated by UniteJS
