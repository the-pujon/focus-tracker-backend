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
    throw new AppError(
      httpStatus.CONFLICT,
      "User already has an active session",
    );
  }

  try {
    const result = await prisma.focusSession.create({
      data: {
        ...payload,
        pausedTime: payload.sessionTime,
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
      "Error retrieving focus session",
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
    const sessionDurationInMilliseconds =
      activeSession!.sessionTime * 60 * 1000; // Convert sessionTime to milliseconds
    const endTime = new Date(
      startTime.getTime() + sessionDurationInMilliseconds,
    );

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
    throw new AppError(httpStatus.BAD_REQUEST, "Error starting focus session");
  }
};
const updateFocusSessionStatus = async (
    userId: string,
    status: { status: SessionStatus },
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
          "No active or paused focus session found to update",
        );
      }
  
      // Calculate remaining time if pausing
      let pausedTime = activeSession.pausedTime || 0;
      if (status.status === "paused" && activeSession.startTime) {
        const elapsedTime = Math.floor(
          (Date.now() - new Date(activeSession.startTime).getTime()) / 1000,
        );
        pausedTime = Math.max(activeSession.sessionTime - elapsedTime, 0);
      }
  
      let badge: string | undefined;
      const prevStreakfromDB = await prisma.user.findUnique({
        where: { id: userId },
        select: { streak: true, badges: true }, // Fetch user's streak and awarded badges
      });
  
      const prevStreak = prevStreakfromDB!.streak;
      const streak = prevStreak + 1;
  
      // Badge logic
      if (status.status === "finished") {
        if (prevStreakfromDB?.badges) {
          // Check if the badge has already been awarded
          if (!prevStreakfromDB.badges.includes("First Focus") && streak === 1) {
            badge = "First Focus";
          } else if (!prevStreakfromDB.badges.includes("Good Start") && streak === 3) {
            badge = "Good Start";
          } else if (!prevStreakfromDB.badges.includes("In the Zone") && streak === 5) {
            badge = "In the Zone";
          } else if (!prevStreakfromDB.badges.includes("Impressive Focus") && streak === 10) {
            badge = "Impressive Focus";
          } else if (!prevStreakfromDB.badges.includes("Laser-Focused Champion") && streak === 20) {
            badge = "Laser-Focused Champion";
          }
        }
  
        // If a new badge is awarded, update the user's badges
        if (badge) {
          await prisma.user.update({
            where: { id: userId },
            data: { streak, badges: { push: badge } },
          });
        }
      }
  
      if (status.status === "unfinished") {
        // Reset the streak if the session is unfinished
        await prisma.user.update({
          where: { id: userId },
          data: { streak: 0 },
        });
      }
  
      // Update the session
      const updatedSession = await prisma.focusSession.update({
        where: { id: activeSession.id },
        data: {
          status: status.status,
          pausedTime:
            status.status === "paused" ? pausedTime : activeSession.pausedTime,
        },
      });
  
      return updatedSession;
    } catch (error) {
      console.error("Error in updateFocusSessionStatus:", error);
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Error updating focus session status",
      );
    }
  };
  
const updateFocusSession = async (
  id: string,
  payload: Partial<IFocusSession>,
) => {
  try {
    const activeSession = await prisma.focusSession.findFirst({
      where: {
        userId: id,
        status: "active",
      },
    });

    const result = await prisma.focusSession.update({
      where: { id: activeSession!.id },
      data: { ...payload, pausedTime: payload.sessionTime },
    });

    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Error updating focus session");
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
      "Error listing focus sessions",
    );
  }
};

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

    const totalTimes = sessions.reduce(
      (sum, session) => sum + session.sessionTime,
      0,
    ); // Use sessionTime directly

    return { totalSessions, totalTimes };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error calculating today's focus sessions",
    );
  }
};

const getWeeklyData = async (userId: string) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const sessions = await prisma.focusSession.findMany({
      where: {
        userId,
        startTime: {
          gte: startOfWeek,
        },
        status: "finished",
      },
    });

    const weeklyFocusTime = Array(7).fill(0);
    const weeklySessions = Array(7).fill(0);

    sessions.forEach((session) => {
      const dayIndex = new Date(session.startTime as Date).getDay();
      weeklyFocusTime[dayIndex] += session.sessionTime;
      weeklySessions[dayIndex]++;
    });

    return { weeklyFocusTime, weeklySessions };
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Error fetching weekly data");
  }
};

const getMonthlyData = async (userId: string) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sessions = await prisma.focusSession.findMany({
      where: {
        userId,
        startTime: {
          gte: startOfMonth,
        },
        status: "finished",
      },
    });

    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    const monthlyFocusTime = Array(daysInMonth).fill(0);
    const monthlySessions = Array(daysInMonth).fill(0);

    sessions.forEach((session) => {
      const dayIndex = new Date(session.startTime as Date).getDate() - 1;
      monthlyFocusTime[dayIndex] += session.sessionTime;
      monthlySessions[dayIndex]++;
    });

    return { monthlyFocusTime, monthlySessions };
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Error fetching monthly data");
  }
};

const getFocusStreakByUserId = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        streak: true,
        longestStreak: true,
        badges: true,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching streak data:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error fetching streak data",
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
  todayFinishedFocusSessionsByUserId,
  getWeeklyData,
  getMonthlyData,
  getFocusStreakByUserId,
};
