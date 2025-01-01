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
});

export default prisma;
