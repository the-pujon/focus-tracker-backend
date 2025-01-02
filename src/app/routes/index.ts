import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { FocusSessionRoutes } from "../modules/focusSession/focusSession.routes";
import { TaskRoutes } from "../modules/task/task.routes";
// import { AuthRoutes } from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/focusSession",
    route: FocusSessionRoutes,
  },
  {
    path: "/task",
    route: TaskRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
