import { Router } from "express";
import { FocusSessionController } from "./focusSession.controller";

const router = Router();

// Route to create a new focus session
router.post("/", FocusSessionController.createFocusSession);

// Route to get active session for a user
router.get("/:userId/active", FocusSessionController.getActiveSession);

// Route to get a focus session by ID
router.get("/:id", FocusSessionController.getFocusSessionById);

// Route to update a focus session by ID
router.put("/:id", FocusSessionController.updateFocusSession);

// Route to delete a focus session by ID
router.delete("/:id", FocusSessionController.deleteFocusSession);

// Route to list all focus sessions for a user
router.get("/:userId", FocusSessionController.listFocusSessions);

// Route to update focus session status for a user
router.put("/:userId/status", FocusSessionController.updateFocusSessionStatus);

// Route to start a focus session for a user
router.put("/:userId/start", FocusSessionController.startFocusSession);

// Route to get today's finished focus sessions for a user
router.get("/:userId/today", FocusSessionController.todayFocusSessionByUserId);

export const FocusSessionRoutes = router;
