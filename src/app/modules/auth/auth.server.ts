import prisma from "../../utils/prisma";
import { IUser } from "./user.interface";

const signupUserIntoDB = async (user: IUser) => {
    const result = await prisma.user.create({
        data: user,
    });
    console.log(user)
    return result;

};

export const UserService = {
    signupUserIntoDB,
};