"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusSessionRoutes = void 0;
const express_1 = require("express");
const focusSession_controller_1 = require("./focusSession.controller");
const router = (0, express_1.Router)();
// Route to create a new focus session
router.post("/", focusSession_controller_1.FocusSessionController.createFocusSession);
// Route to get active session for a user
router.get("/:userId/active", focusSession_controller_1.FocusSessionController.getActiveSession);
// Route to get a focus session by ID
router.get("/:id", focusSession_controller_1.FocusSessionController.getFocusSessionById);
// Route to update a focus session by ID
router.put("/:id", focusSession_controller_1.FocusSessionController.updateFocusSession);
// Route to delete a focus session by ID
router.delete("/:id", focusSession_controller_1.FocusSessionController.deleteFocusSession);
// Route to list all focus sessions for a user
router.get("/:userId", focusSession_controller_1.FocusSessionController.listFocusSessions);
// Route to update focus session status for a user
router.put("/:userId/status", focusSession_controller_1.FocusSessionController.updateFocusSessionStatus);
// Route to start a focus session for a user
router.put("/:userId/start", focusSession_controller_1.FocusSessionController.startFocusSession);
// Route to get today's finished focus sessions for a user
router.get("/:userId/today", focusSession_controller_1.FocusSessionController.todayFocusSessionByUserId);
// Route to get weekly focus sessions for a user
router.get("/:userId/weekly", focusSession_controller_1.FocusSessionController.weeklyFocusSessionByUserId);
// Route to get monthly focus sessions for a user
router.get("/:userId/monthly", focusSession_controller_1.FocusSessionController.monthlyFocusSessionByUserId);
// Route to get focus session streak for a user
router.get("/:userId/streak", focusSession_controller_1.FocusSessionController.getFocusStreak);
exports.FocusSessionRoutes = router;
