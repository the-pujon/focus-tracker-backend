import httpStatus from "http-status";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import { ITask } from "./task.interface";


 const createTask = async (taskData: ITask) => {
  try {
    const task = await prisma.task.create({
      data: taskData,
    });
    return task;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error creating task");
  }
};

 const updateTask = async (id: string, updatedData: ITask) => {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: updatedData,
    });

    return task;
  } catch (error) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found or update failed");
  }
};

 const deleteTask = async (id: string) => {
  try {
    await prisma.task.delete({
      where: { id },
    });
    return { message: "Task deleted successfully" };
  } catch (error) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }
};

 const deleteAllCompletedTasks = async () => {
  try {
    const result = await prisma.task.deleteMany({
      where: { completed: true },
    });
    return {
      message: `${result.count} completed tasks deleted successfully`,
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error deleting completed tasks"
    );
  }
};

 const getTasksByDate = async (date: Date) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        dueDate: {
          gte: new Date(date.setHours(0, 0, 0, 0)), // Start of the day
          lt: new Date(date.setHours(24, 0, 0, 0)), // End of the day
        },
      },
    });

    if (!tasks.length) {
      throw new AppError(httpStatus.NOT_FOUND, "No tasks found for the date");
    }

    return tasks;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error retrieving tasks by date"
    );
  }
};

export const TaskService = {
  createTask,
  updateTask,
  deleteTask,
  deleteAllCompletedTasks,
  getTasksByDate,
};
