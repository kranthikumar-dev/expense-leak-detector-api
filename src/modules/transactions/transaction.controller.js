import * as service from "./transaction.service.js";
import prisma from "../../config/db.js";
import {
  detectSubscriptions,
  detectUnusedSubscriptions,
  detectDuplicateCharges,
  saveUnusedAlerts,
} from "../../services/detection.service.js";

export const addTransaction = async (req, res) => {
  const tx = await service.addTransaction(req.user.id, req.body);
  res.json(tx);
};

export const getSubscriptions = async (req, res) => {
  const data = await detectSubscriptions(req.user.id);
  res.json(data);
};

export const getUnusedAlerts = async (req, res) => {
  const data = await detectUnusedSubscriptions(req.user.id);
  res.json(data);
};

export const getDuplicateAlerts = async (req, res) => {
  const data = await detectDuplicateCharges(req.user.id);
  res.json(data);
};

export const triggerAlerts = async (req, res) => {
  await saveUnusedAlerts(req.user.id);
  res.json({ msg: "alerts generated" });
};

export const getAlerts = async (req, res) => {
  const alerts = await prisma.alert.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(alerts);
};

export const resolveAlert = async (req, res) => {
  const { id } = req.params;

  await prisma.alert.update({
    where: { id },
    data: { status: "RESOLVED" },
  });

  res.json({ message: "Alert resolved" });
};