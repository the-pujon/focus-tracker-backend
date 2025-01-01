import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient().$extends({
  name: "HashPasswordMiddleware",
  query: {
    user: {
      create: async ({ args, query }) => {
        if (args.data.password) {
          const salt = await bcrypt.genSalt(10);
          args.data.password = await bcrypt.hash(args.data.password, salt);
        }
        return query(args);
      },
      update: async ({ args, query }) => {
        if (args.data.password) {
          const salt = await bcrypt.genSalt(10);
          args.data.password = await bcrypt.hash(args.data.password as string, salt);
        }
        return query(args);
      },
      
    },
  },
  model: {
    user: {
      isUserExist: async (email: string) => {
        return prisma.user.findUnique({
          where: { email },
          select: {
            email: true,
            password: true, // Explicitly include password if it's excluded by default in your schema
          },
        });
      },
    },
  },
});

export default prisma;
