import { NextFunction, Request, Response } from "express";
//import catchAsync from "../utils/catchAsync.";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import catchAsync from "../utils/catchAsync";
import { AuthModel } from "../modules/auth/auth.model";
//import { UserModel } from "../modules/auth/auth.model";

export const authorization = (...requiredRoles: ("admin" | "user")[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    //if token can't fount
    if (!token) {
      throw new UnauthorizedError("You are not authorized! Login first");
    }

    const decoded = jwt.verify(token, config.jwt_access_secret as string);

    const { email, role } = decoded as JwtPayload;

    const user = await AuthModel.isUserExist(email);

    //if user not found
    if (!user) {
      throw new NotFoundError("This user is not found!");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new ForbiddenError("You have no access to this route");
    }

    req.user = decoded as JwtPayload;

    next();
  });
};
