import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TaskService } from "./task.service";
import AppError from "../../errors/AppError";

// Create a new task
const createTask = catchAsync(async (req, res) => {
  const result = await TaskService.createTask(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Task created successfully",
    data: result,
  });
});

// Update a task by ID
const updateTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TaskService.updateTask(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Task updated successfully",
    data: result,
  });
});

// Delete a task by ID
const deleteTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  await TaskService.deleteTask(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.NO_CONTENT,
    message: "Task deleted successfully",
    data: null,
  });
});

// Delete all completed tasks
const deleteAllCompletedTasks = catchAsync(async (_req, res) => {
  const result = await TaskService.deleteAllCompletedTasks();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

// Get tasks by date
const getTasksByDate = catchAsync(async (req, res) => {
  const { date } = req.query;
  if (!date) {
    throw new AppError(httpStatus.BAD_REQUEST, "Date query parameter is required");
  }

  const result = await TaskService.getTasksByDate(new Date(date as string));
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tasks retrieved successfully",
    data: result,
  });
});

export const TaskController = {
  createTask,
  updateTask,
  deleteTask,
  deleteAllCompletedTasks,
  getTasksByDate,
};
