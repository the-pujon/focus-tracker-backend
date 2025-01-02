import { Router } from "express";
import { TaskController } from "./task.controller";

const router = Router();

// Route to create a new task
router.post("/", TaskController.createTask);

// Route to update a task by ID
router.put("/:id", TaskController.updateTask);

// Route to delete a task by ID
router.delete("/:id", TaskController.deleteTask);

// Route to delete all completed tasks
router.delete("/", TaskController.deleteAllCompletedTasks);

// Route to get tasks by date
router.get("/", TaskController.getTasksByDate);

export const TaskRoutes = router;
