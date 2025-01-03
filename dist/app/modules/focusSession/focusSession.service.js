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
exports.FocusSessionService = exports.startFocusSession = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createFocusSession = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user already has an active session (inprogress or paused)
    const activeSession = yield prisma_1.default.focusSession.findFirst({
        where: {
            userId: payload.userId,
            status: {
                in: ["inprogress", "paused", "active"],
            },
        },
    });
    // If there is an active session, throw an error
    if (activeSession) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "User already has an active session");
    }
    try {
        const result = yield prisma_1.default.focusSession.create({
            data: Object.assign(Object.assign({}, payload), { pausedTime: payload.sessionTime }),
        });
        return result;
    }
    catch (error) {
        console.error("Error creating focus session:", error);
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Error creating focus session");
    }
});
const getActiveSessionByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const activeSession = yield prisma_1.default.focusSession.findFirst({
        where: {
            userId,
            status: {
                in: ["inprogress", "paused", "active"],
            },
        },
    });
    return activeSession;
});
const getFocusSessionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.focusSession.findUnique({
            where: { id },
        });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Focus session not found");
        }
        return result;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Error retrieving focus session");
    }
});
const startFocusSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the active session for the user
        const activeSession = yield prisma_1.default.focusSession.findFirst({
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
        const sessionDurationInMilliseconds = activeSession.sessionTime * 60 * 1000; // Convert sessionTime to milliseconds
        const endTime = new Date(startTime.getTime() + sessionDurationInMilliseconds);
        // Update the focus session
        const updatedSession = yield prisma_1.default.focusSession.update({
            where: { id: activeSession.id },
            data: {
                status: "inprogress",
                startTime,
                endTime,
            },
        });
        return updatedSession;
    }
    catch (error) {
        console.error("error in startFocusSession", error);
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Error starting focus session");
    }
});
exports.startFocusSession = startFocusSession;
const updateFocusSessionStatus = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the active session
        const activeSession = yield prisma_1.default.focusSession.findFirst({
            where: {
                userId,
                status: {
                    in: ["inprogress", "paused", "active"],
                },
            },
        });
        if (!activeSession) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No active or paused focus session found to update");
        }
        // Calculate remaining time if pausing
        let pausedTime = activeSession.pausedTime || 0;
        if (status.status === "paused" && activeSession.startTime) {
            const elapsedTime = Math.floor((Date.now() - new Date(activeSession.startTime).getTime()) / 1000);
            pausedTime = Math.max(activeSession.sessionTime - elapsedTime, 0);
        }
        let badge;
        const prevStreakfromDB = yield prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { streak: true, badges: true }, // Fetch user's streak and awarded badges
        });
        const prevStreak = prevStreakfromDB.streak;
        const streak = prevStreak + 1;
        // Badge logic
        if (status.status === "finished") {
            if (prevStreakfromDB === null || prevStreakfromDB === void 0 ? void 0 : prevStreakfromDB.badges) {
                // Check if the badge has already been awarded
                if (!prevStreakfromDB.badges.includes("First Focus") && streak === 1) {
                    badge = "First Focus";
                }
                else if (!prevStreakfromDB.badges.includes("Good Start") && streak === 3) {
                    badge = "Good Start";
                }
                else if (!prevStreakfromDB.badges.includes("In the Zone") && streak === 5) {
                    badge = "In the Zone";
                }
                else if (!prevStreakfromDB.badges.includes("Impressive Focus") && streak === 10) {
                    badge = "Impressive Focus";
                }
                else if (!prevStreakfromDB.badges.includes("Laser-Focused Champion") && streak === 20) {
                    badge = "Laser-Focused Champion";
                }
            }
            // If a new badge is awarded, update the user's badges
            if (badge) {
                yield prisma_1.default.user.update({
                    where: { id: userId },
                    data: { streak, badges: { push: badge } },
                });
            }
        }
        if (status.status === "unfinished") {
            // Reset the streak if the session is unfinished
            yield prisma_1.default.user.update({
                where: { id: userId },
                data: { streak: 0 },
            });
        }
        // Update the session
        const updatedSession = yield prisma_1.default.focusSession.update({
            where: { id: activeSession.id },
            data: {
                status: status.status,
                pausedTime: status.status === "paused" ? pausedTime : activeSession.pausedTime,
            },
        });
        return updatedSession;
    }
    catch (error) {
        console.error("Error in updateFocusSessionStatus:", error);
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Error updating focus session status");
    }
});
const updateFocusSession = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activeSession = yield prisma_1.default.focusSession.findFirst({
            where: {
                userId: id,
                status: "active",
            },
        });
        const result = yield prisma_1.default.focusSession.update({
            where: { id: activeSession.id },
            data: Object.assign(Object.assign({}, payload), { pausedTime: payload.sessionTime }),
        });
        return result;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Error updating focus session");
    }
});
const deleteFocusSession = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.focusSession.delete({
            where: { id },
        });
        return result;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Error deleting focus session");
    }
});
const listFocusSessions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.focusSession.findMany({
            where: { userId },
            orderBy: { startTime: "desc" },
        });
        return result;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Error listing focus sessions");
    }
});
const todayFinishedFocusSessionsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0); // Start of today (00:00:00)
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999); // End of today (23:59:59)
        const sessions = yield prisma_1.default.focusSession.findMany({
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
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Error calculating today's focus sessions");
    }
});
const getWeeklyData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const sessions = yield prisma_1.default.focusSession.findMany({
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
            const dayIndex = new Date(session.startTime).getDay();
            weeklyFocusTime[dayIndex] += session.sessionTime;
            weeklySessions[dayIndex]++;
        });
        return { weeklyFocusTime, weeklySessions };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Error fetching weekly data");
    }
});
const getMonthlyData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const sessions = yield prisma_1.default.focusSession.findMany({
            where: {
                userId,
                startTime: {
                    gte: startOfMonth,
                },
                status: "finished",
            },
        });
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const monthlyFocusTime = Array(daysInMonth).fill(0);
        const monthlySessions = Array(daysInMonth).fill(0);
        sessions.forEach((session) => {
            const dayIndex = new Date(session.startTime).getDate() - 1;
            monthlyFocusTime[dayIndex] += session.sessionTime;
            monthlySessions[dayIndex]++;
        });
        return { monthlyFocusTime, monthlySessions };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Error fetching monthly data");
    }
});
const getFocusStreakByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                streak: true,
                longestStreak: true,
                badges: true,
            },
        });
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        return user;
    }
    catch (error) {
        console.error("Error fetching streak data:", error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Error fetching streak data");
    }
});
exports.FocusSessionService = {
    createFocusSession,
    getFocusSessionById,
    updateFocusSession,
    deleteFocusSession,
    listFocusSessions,
    getActiveSessionByUserId,
    updateFocusSessionStatus,
    startFocusSession: exports.startFocusSession,
    todayFinishedFocusSessionsByUserId,
    getWeeklyData,
    getMonthlyData,
    getFocusStreakByUserId,
};
