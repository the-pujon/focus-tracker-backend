"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const focusSession_routes_1 = require("../modules/focusSession/focusSession.routes");
const task_routes_1 = require("../modules/task/task.routes");
// import { AuthRoutes } from "../modules/auth/auth.route";
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/focusSession",
        route: focusSession_routes_1.FocusSessionRoutes,
    },
    {
        path: "/task",
        route: task_routes_1.TaskRoutes,
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
