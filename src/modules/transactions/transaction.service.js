import { PrismaClient } from "@prisma/client";
import { normalizeMerchant } from "../../utils/merchantNormalizer.js";

const prisma = new PrismaClient();

export const addTransaction = async (userId, data) => {
  return prisma.transaction.create({
    data: {
      userId,
      amount: data.amount,
      merchantRaw: data.merchant,
      merchantNormalized: normalizeMerchant(data.merchant),
      transactionDate: new Date(data.date),
    },
  });
};
