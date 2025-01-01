import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { IUser } from "./user.interface";
import httpStatus from "http-status";
import isPasswordMatch from "../../utils/comparePassword";
import { createToken, omitPassword } from "../../utils/auth.utils";
import config from "../../../config";
import { cacheData, deleteCachedData } from "../../utils/redis.utils";

const signupUserIntoDB = async (user: IUser) => {
    const result = await prisma.user.create({
        data: user,
    });
    return result;

};


const loginUserService = async (payload: JwtPayload) => {
    const user = await prisma.user.isUserExist(payload.email);
  
    //if user not found
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }
    const isPasswordMatched = await isPasswordMatch(
      payload.password,
      (await user).password,
    );
  
    if (!isPasswordMatched) {
      throw new AppError(httpStatus.BAD_REQUEST, "Password is not correct !");
    }
  
    const jwtPayload = {
      email: user.email,
      role: user.role as string,
    };
  
    const token = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      "10h",
    );
    await deleteCachedData(`sparkle-car-service:user:${user.email}:token`);
    await cacheData(
      `sparkle-car-service:user:${user.email}:token`,
      token,
      3600 * 10,
    );
  
    const loggedUserWithoutPassword = omitPassword(user);
  
    return { token, user: loggedUserWithoutPassword };
  };

export const UserService = {
    signupUserIntoDB,
    loginUserService
};