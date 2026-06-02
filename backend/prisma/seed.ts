import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";

const password = process.env.ADMIN_PASSWORD!;

await prisma.user.upsert({
  where: { username: "admin" },
  update: {},
  create: {
    username: "admin",
    password: await bcrypt.hash(password, 10),
    role: "ADMIN",
  },
});
