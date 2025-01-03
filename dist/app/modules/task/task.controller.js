"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const task_service_1 = require("./task.service");
const AppError_1 = __importDefault(require("../../errors/AppError"));
// Create a new task
const createTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_service_1.TaskService.createTask(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Task created successfully",
        data: result,
    });
}));
// Update a task by ID
const updateTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield task_service_1.TaskService.updateTask(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Task updated successfully",
        data: result,
    });
}));
// Delete a task by ID
const deleteTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield task_service_1.TaskService.deleteTask(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.NO_CONTENT,
        message: "Task deleted successfully",
        data: null,
    });
}));
// Delete all completed tasks
const deleteAllCompletedTasks = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_service_1.TaskService.deleteAllCompletedTasks();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: result.message,
        data: null,
    });
}));
// Get tasks by date
const getTasksByDate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.query;
    if (!date) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Date query parameter is required");
    }
    const result = yield task_service_1.TaskService.getTasksByDate(new Date(date));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Tasks retrieved successfully",
        data: result,
    });
}));
exports.TaskController = {
    createTask,
    updateTask,
    deleteTask,
    deleteAllCompletedTasks,
    getTasksByDate,
};
