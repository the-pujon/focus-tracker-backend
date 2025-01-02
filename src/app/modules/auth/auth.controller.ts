import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./auth.service";
// import { UserService } from "./auth.service";

const signupUser = catchAsync(async (req, res) => {
    // console.log(req.body);
    const result = await UserService.signupUserIntoDB(req.body);
    console.log(result);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User registered successfully",
        data: result,
    });
});

const loginUser = catchAsync(async (req, res) => {
    const result = await UserService.loginUserService(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User login successful",
        data: {
            accessToken: result.token
        },
    });
});

export const AuthController = { signupUser, loginUser };