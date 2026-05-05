import cron from "node-cron";
import prisma from "../config/db.js";
import {
  saveUnusedAlerts,
  saveDuplicateAlerts,
} from "../services/detection.service.js";

export const startLeakDetectionJob = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running daily leak detection...");

    const users = await prisma.user.findMany();

    for (const user of users) {
      await saveUnusedAlerts(user.id);
      await saveDuplicateAlerts(user.id);
    }
  });
};
