import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { ENV } from "../../config/env.js";

const prisma = new PrismaClient();

export const register = async (email, password) => {
  const hashed = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { email, password: hashed },
  });
};

export const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const token = jwt.sign({ id: user.id }, ENV.JWT_SECRET);

  return { token };
};
