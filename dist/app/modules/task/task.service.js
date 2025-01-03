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
exports.TaskService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createTask = (taskData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield prisma_1.default.task.create({
            data: taskData,
        });
        return task;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Error creating task");
    }
});
const updateTask = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield prisma_1.default.task.update({
            where: { id },
            data: updatedData,
        });
        return task;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Task not found or update failed");
    }
});
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.task.delete({
            where: { id },
        });
        return { message: "Task deleted successfully" };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Task not found");
    }
});
const deleteAllCompletedTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.task.deleteMany({
            where: { completed: true },
        });
        return {
            message: `${result.count} completed tasks deleted successfully`,
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Error deleting completed tasks");
    }
});
const getTasksByDate = (date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield prisma_1.default.task.findMany({
            where: {
                dueDate: {
                    gte: new Date(date.setHours(0, 0, 0, 0)), // Start of the day
                    lt: new Date(date.setHours(24, 0, 0, 0)), // End of the day
                },
            },
        });
        if (!tasks.length) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No tasks found for the date");
        }
        return tasks;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Error retrieving tasks by date");
    }
});
exports.TaskService = {
    createTask,
    updateTask,
    deleteTask,
    deleteAllCompletedTasks,
    getTasksByDate,
};
