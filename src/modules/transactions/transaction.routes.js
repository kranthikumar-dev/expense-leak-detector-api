import express from "express";
import { saveUnusedAlerts } from "../../services/detection.service.js";
import {
  addTransaction,
  getSubscriptions,
  getUnusedAlerts,
  getDuplicateAlerts,
  triggerAlerts,
  getAlerts,
  resolveAlert,
} from "./transaction.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addTransaction);
router.get("/subscriptions", authMiddleware, getSubscriptions);
router.get("/alerts/unused", authMiddleware, getUnusedAlerts);
router.get("/alerts/duplicates", authMiddleware, getDuplicateAlerts);
router.post("/alerts/generate", authMiddleware, triggerAlerts);
router.get("/alerts", authMiddleware, getAlerts);
router.patch("/alerts/:id/resolve", authMiddleware, resolveAlert);

export default router;
