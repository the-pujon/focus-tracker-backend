import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { IUser } from "./user.interface";
import httpStatus from "http-status";
import isPasswordMatch from "../../utils/comparePassword";
import { createToken } from "../../utils/auth.utils";
import config from "../../../config";
import { cacheData, deleteCachedData } from "../../utils/redis.utils";

const cacheKey = config.redis_cache_key_prefix;

const signupUserIntoDB = async (user: IUser) => {
 try{ // console.log(user);
  const result = await prisma.user.create({
      data: user,
  });
  // console.log(result);
  return result;
} catch (error) {
  // console.log(error)
  throw new AppError(httpStatus.BAD_REQUEST, "Error creating user");
}

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
      id: user.id,
      email: user.email,
      role: user.role as string,
    };
  
    const token = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      "10h",
    );
    await deleteCachedData(`${cacheKey}:user:${user.email}:token`);
    await cacheData(
      `${cacheKey}:user:${user.email}:token`,
      token,
      3600 * 10,
    );
  
    return { token };
  };

export const UserService = {
    signupUserIntoDB,
    loginUserService
};