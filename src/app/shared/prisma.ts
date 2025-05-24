import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

prisma
  .$connect()
  .then(() => console.log("Connected to database"))
  .catch((err: any) => console.error("Failed to connect:", err));

export default prisma;
