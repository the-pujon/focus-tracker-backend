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
exports.FocusSessionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const focusSession_service_1 = require("./focusSession.service");
// Create a new focus session
const createFocusSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const result = yield focusSession_service_1.FocusSessionService.createFocusSession(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Focus session created successfully",
        data: result,
    });
}));
// Get active session for a user
const getActiveSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield focusSession_service_1.FocusSessionService.getActiveSessionByUserId(userId);
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "No active session found for this user",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Active session fetched successfully",
        data: result,
    });
}));
// Get focus session by ID
const getFocusSessionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield focusSession_service_1.FocusSessionService.getFocusSessionById(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Focus session fetched successfully",
        data: result,
    });
}));
// Update focus session by ID
const updateFocusSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield focusSession_service_1.FocusSessionService.updateFocusSession(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Focus session updated successfully",
        data: result,
    });
}));
// Delete focus session by ID
const deleteFocusSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield focusSession_service_1.FocusSessionService.deleteFocusSession(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.NO_CONTENT,
        message: "Focus session deleted successfully",
        data: null,
    });
}));
// List all focus sessions for a user
const listFocusSessions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield focusSession_service_1.FocusSessionService.listFocusSessions(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Focus sessions listed successfully",
        data: result,
    });
}));
const updateFocusSessionStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { status } = req.body;
    const result = yield focusSession_service_1.FocusSessionService.updateFocusSessionStatus(userId, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Focus session status updated successfully",
        data: result,
    });
}));
const startFocusSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield focusSession_service_1.FocusSessionService.startFocusSession(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Focus session started successfully",
        data: result,
    });
}));
const todayFocusSessionByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield focusSession_service_1.FocusSessionService.todayFinishedFocusSessionsByUserId(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Focus sessions listed successfully",
        data: result,
    });
}));
const weeklyFocusSessionByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield focusSession_service_1.FocusSessionService.getWeeklyData(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Focus sessions listed successfully",
        data: result,
    });
}));
const monthlyFocusSessionByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield focusSession_service_1.FocusSessionService.getMonthlyData(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Focus sessions listed successfully",
        data: result,
    });
}));
const getFocusStreak = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield focusSession_service_1.FocusSessionService.getFocusStreakByUserId(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Focus session updated successfully",
        data: result,
    });
}));
exports.FocusSessionController = {
    createFocusSession,
    getActiveSession,
    getFocusSessionById,
    updateFocusSession,
    deleteFocusSession,
    listFocusSessions,
    updateFocusSessionStatus,
    startFocusSession,
    todayFocusSessionByUserId,
    weeklyFocusSessionByUserId,
    monthlyFocusSessionByUserId,
    getFocusStreak
};
