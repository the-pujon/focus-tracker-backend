import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FocusSessionService } from "./focusSession.service";

// Create a new focus session
const createFocusSession = catchAsync(async (req, res) => {
    console.log(req.body);
  const result = await FocusSessionService.createFocusSession(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Focus session created successfully",
    data: result,
  });
});

// Get active session for a user
const getActiveSession = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await FocusSessionService.getActiveSessionByUserId(userId);

  if (!result) {
    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "No active session found for this user",
      data: null,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Active session fetched successfully",
    data: result,
  });
});

// Get focus session by ID
const getFocusSessionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FocusSessionService.getFocusSessionById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Focus session fetched successfully",
    data: result,
  });
});

// Update focus session by ID
const updateFocusSession = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FocusSessionService.updateFocusSession(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Focus session updated successfully",
    data: result,
  });
});

// Delete focus session by ID
const deleteFocusSession = catchAsync(async (req, res) => {
  const { id } = req.params;
  await FocusSessionService.deleteFocusSession(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.NO_CONTENT,
    message: "Focus session deleted successfully",
    data: null,
  });
});

// List all focus sessions for a user
const listFocusSessions = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await FocusSessionService.listFocusSessions(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Focus sessions listed successfully",
    data: result,
  });
});


const updateFocusSessionStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  const result = await FocusSessionService.updateFocusSessionStatus(userId, status);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Focus session status updated successfully",
    data: result,
  });
});

const startFocusSession = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await FocusSessionService.startFocusSession(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Focus session started successfully",
    data: result,
  });
});

export const FocusSessionController = {
  createFocusSession,
  getActiveSession,
  getFocusSessionById,
  updateFocusSession,
  deleteFocusSession,
  listFocusSessions,
  updateFocusSessionStatus,
  startFocusSession
};
