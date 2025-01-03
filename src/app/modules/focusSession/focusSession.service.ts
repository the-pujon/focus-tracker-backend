import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { IFocusSession } from "./focusSession.interface";
import { SessionStatus } from "@prisma/client";


const createFocusSession = async (payload: IFocusSession) => {
      // Check if the user already has an active session (inprogress or paused)
      const activeSession = await prisma.focusSession.findFirst({
        where: {
          userId: payload.userId, 
          status: {
            in: ["inprogress", "paused", "active"], 
          },
        },
      });
  
      // If there is an active session, throw an error
      if (activeSession) {
        throw new AppError(httpStatus.CONFLICT, "User already has an active session");
      }
  
 
      try {
      const result = await prisma.focusSession.create({
        data: {
          ...payload,
          pausedTime: payload.sessionTime
        },
      });
  
      return result;
    } catch (error) {
      console.error("Error creating focus session:", error);
      throw new AppError(httpStatus.BAD_REQUEST, "Error creating focus session");
    }
  };
  

const getActiveSessionByUserId = async (userId: string) => {
    const activeSession = await prisma.focusSession.findFirst({
      where: {
        userId,
        status: {
          in: ["inprogress", "paused", "active"],
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


export const startFocusSession = async (userId: string) => {
  try {
    // Fetch the active session for the user
    const activeSession = await prisma.focusSession.findFirst({
      where: {
        userId,
        status: "active",
      },
    });

    // console.log("activeSession in startFocusSession", activeSession);

    // if (!activeSession) {
    //   throw new AppError(httpStatus.NOT_FOUND, "No active focus session found");
    // }

    // Calculate start and end times
    const startTime = new Date();
    const sessionDurationInMilliseconds = activeSession!.sessionTime * 60 * 1000; // Convert sessionTime to milliseconds
    const endTime = new Date(startTime.getTime() + sessionDurationInMilliseconds);

    // Update the focus session
    const updatedSession = await prisma.focusSession.update({
      where: { id: activeSession!.id },
      data: {
        status: "inprogress",
        startTime,
        endTime,
      },
    });

    return updatedSession;
  } catch (error) {
    console.error("error in startFocusSession", error);
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Error starting focus session"
    );
  }
};

const updateFocusSessionStatus = async (
    userId: string,
    status: { status: SessionStatus }
  ) => {
    try {
      // Find the active session
      const activeSession = await prisma.focusSession.findFirst({
        where: {
          userId,
          status: {
            in: ["inprogress", "paused", "active"],
          },
        },
      });
  
      if (!activeSession) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "No active or paused focus session found to update"
        );
      }
  
      // Calculate remaining time if pausing
      let pausedTime = activeSession.pausedTime || 0;
      if (status.status === "paused" && activeSession.startTime) {
        const elapsedTime = Math.floor(
          (Date.now() - new Date(activeSession.startTime).getTime()) / 1000
        );
        pausedTime = Math.max(activeSession.sessionTime - elapsedTime, 0);
      }
  
      // Update the session
      const updatedSession = await prisma.focusSession.update({
        where: { id: activeSession.id },
        data: {
          status: status.status,
          pausedTime: status.status === "paused" ? pausedTime : activeSession.pausedTime,
        },
      });
  
      return updatedSession;
    } catch (error) {
      console.error("Error in updateFocusSessionStatus:", error);
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Error updating focus session status"
      );
    }
  };
  
  
const updateFocusSession = async (id: string, payload: Partial<IFocusSession>) => {
  try {

    const activeSession = await prisma.focusSession.findFirst({
        where: {
          userId: id,
          status: "active",
        },
      });

    const result = await prisma.focusSession.update({
      where: { id: activeSession!.id },
      data: {...payload,
        pausedTime: payload.sessionTime
      },
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

// const dailyFocusSessionByUserId = async (userId: string) => {
//   try {
//     const result = await prisma.focusSession.findMany({
//       where: { userId },
//       orderBy: { startTime: "desc" },
//     });

//     return result;
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Error listing focus sessions"
//     );
//   }
// };


const todayFinishedFocusSessionsByUserId = async (userId: string) => {
    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0); // Start of today (00:00:00)
  
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999); // End of today (23:59:59)
  
      const sessions = await prisma.focusSession.findMany({
        where: {
          userId,
          status: "finished", // Fetch only finished sessions
          startTime: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      });
  
      const totalSessions = sessions.length;
  
      const totalTimes = sessions.reduce((sum, session) => sum + session.sessionTime, 0); // Use sessionTime directly
  
      return { totalSessions, totalTimes };
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Error calculating today's focus sessions"
      );
    }
  };
  

export const FocusSessionService = {
  createFocusSession,
  getFocusSessionById,
  updateFocusSession,
  deleteFocusSession,
  listFocusSessions,
  getActiveSessionByUserId,
  updateFocusSessionStatus,
  startFocusSession,
  todayFinishedFocusSessionsByUserId
};
