"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRoutes = void 0;
const express_1 = require("express");
const task_controller_1 = require("./task.controller");
const router = (0, express_1.Router)();
// Route to create a new task
router.post("/", task_controller_1.TaskController.createTask);
// Route to update a task by ID
router.put("/:id", task_controller_1.TaskController.updateTask);
// Route to delete a task by ID
router.delete("/:id", task_controller_1.TaskController.deleteTask);
// Route to delete all completed tasks
router.delete("/", task_controller_1.TaskController.deleteAllCompletedTasks);
// Route to get tasks by date
router.get("/", task_controller_1.TaskController.getTasksByDate);
exports.TaskRoutes = router;
