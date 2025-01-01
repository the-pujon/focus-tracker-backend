import jwt from "jsonwebtoken";
import { IUser } from "../modules/auth/user.interface";

//creating token
export const createToken = (
  jwtPayload: {
    email: string;
    role: string;
    //userId: string;
  },
  secret: string,
  expireIn: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn: expireIn });
};

//omitting password from user
export const omitPassword = (user: IUser) => {
  const plainUser = JSON.parse(JSON.stringify(user));
  delete plainUser.password;
  delete plainUser.__v;

  return plainUser;
};
