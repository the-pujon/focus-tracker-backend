import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { IFocusSession } from "./focusSession.interface";

const createFocusSession = async (payload: IFocusSession) => {
  try {
    const result = await prisma.focusSession.create({
      data: payload,
    });
    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Error creating focus session");
  }
};

const getActiveSessionByUserId = async (userId: string) => {
    const activeSession = await prisma.focusSession.findFirst({
      where: {
        userId,
        status: {
          in: ["inprogress", "paused"],
        },
      },
    });
  
    return activeSession;
  };
  

const getFocusSessionById = async (id: string) => {
  try {
    const result = await prisma.focusSession.findUnique({
      where: { id },
    });

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Focus session not found");
    }

    return result;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error retrieving focus session"
    );
  }
};

const updateFocusSession = async (id: string, payload: Partial<IFocusSession>) => {
  try {
    const result = await prisma.focusSession.update({
      where: { id },
      data: payload,
    });

    return result;
  } catch (error) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Error updating focus session"
    );
  }
};

const deleteFocusSession = async (id: string) => {
  try {
    const result = await prisma.focusSession.delete({
      where: { id },
    });

    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Error deleting focus session");
  }
};

const listFocusSessions = async (userId: string) => {
  try {
    const result = await prisma.focusSession.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
    });

    return result;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error listing focus sessions"
    );
  }
};

export const FocusSessionService = {
  createFocusSession,
  getFocusSessionById,
  updateFocusSession,
  deleteFocusSession,
  listFocusSessions,
  getActiveSessionByUserId
};
