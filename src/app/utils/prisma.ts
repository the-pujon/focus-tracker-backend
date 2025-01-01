import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Hash password middleware
prisma.$use(async (params, next) => {
    if (params.model === 'User') {
      if (params.action === 'create' || params.action === 'update') {
        const userData = params.args.data;
        if (userData.password) {
          const salt = await bcrypt.genSalt(10);
          userData.password = await bcrypt.hash(userData.password, salt);
        }
      }
    }
    return next(params);
  });

export default prisma;