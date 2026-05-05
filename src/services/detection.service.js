import prisma from "../config/db.js";

export const detectSubscriptions = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { transactionDate: "asc" },
  });

  // group by merchant
  const groups = {};

  for (const tx of transactions) {
    if (!groups[tx.merchantNormalized]) {
      groups[tx.merchantNormalized] = [];
    }
    groups[tx.merchantNormalized].push(tx);
  }

  const subscriptions = [];

  for (const merchant in groups) {
    const txs = groups[merchant];

    // rule: at least 2 transactions with same amount
    if (txs.length >= 2) {
      const amounts = txs.map((t) => t.amount);
      const sameAmount = amounts.every((a) => a === amounts[0]);

      if (sameAmount) {
        subscriptions.push({
          merchant,
          amount: amounts[0],
          occurrences: txs.length,
        });
      }
    }
  }

  return subscriptions;
};

export const detectUnusedSubscriptions = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { transactionDate: "asc" },
  });

  const groups = {};

  for (const tx of transactions) {
    if (!groups[tx.merchantNormalized]) {
      groups[tx.merchantNormalized] = [];
    }
    groups[tx.merchantNormalized].push(tx);
  }

  const alerts = [];
  const today = new Date();

  for (const merchant in groups) {
    const txs = groups[merchant];

    if (txs.length >= 2) {
      const lastTx = txs[txs.length - 1];

      const diffDays =
        (today - new Date(lastTx.transactionDate)) / (1000 * 60 * 60 * 24);

      if (diffDays > 20) {
        alerts.push({
          merchant,
          message: `You haven't used ${merchant} in ${Math.floor(diffDays)} days`,
        });
      }
    }
  }

  return alerts;
};

export const detectDuplicateCharges = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { transactionDate: "asc" },
  });

  const duplicates = [];
  const seen = new Set();

  for (let i = 0; i < transactions.length; i++) {
    for (let j = i + 1; j < transactions.length; j++) {
      const t1 = transactions[i];
      const t2 = transactions[j];

      if (
        t1.merchantNormalized === t2.merchantNormalized &&
        t1.amount === t2.amount
      ) {
        const diffDays =
          Math.abs(
            new Date(t2.transactionDate) - new Date(t1.transactionDate),
          ) /
          (1000 * 60 * 60 * 24);

        if (diffDays <= 1) {
          const key = `${t1.merchantNormalized}-${t1.amount}`;

          if (!seen.has(key)) {
            seen.add(key);

            duplicates.push({
              merchant: t1.merchantNormalized,
              amount: t1.amount,
              message: "Possible duplicate charge detected",
            });
          }
        }
      }
    }
  }

  return duplicates;
};

export const saveUnusedAlerts = async (userId) => {
  const alerts = await detectUnusedSubscriptions(userId);

  for (const alert of alerts) {
    // check if already exists
    const exists = await prisma.alert.findFirst({
      where: {
        userId,
        type: "unused",
        merchant: alert.merchant,
        message: alert.message,
      },
    });

    if (!exists) {
      await prisma.alert.create({
        data: {
          userId,
          type: "unused",
          message: alert.message,
          merchant: alert.merchant,
        },
      });
    }
  }

  return alerts;
};

export const saveDuplicateAlerts = async (userId) => {
  const alerts = await detectDuplicateCharges(userId);

  for (const alert of alerts) {
    await prisma.alert.create({
      data: {
        userId,
        type: "duplicate",
        message: alert.message,
        merchant: alert.merchant,
      },
    });
  }

  return alerts;
};

