"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const comparePassword_1 = __importDefault(require("../../utils/comparePassword"));
const auth_utils_1 = require("../../utils/auth.utils");
const config_1 = __importDefault(require("../../../config"));
const redis_utils_1 = require("../../utils/redis.utils");
const cacheKey = config_1.default.redis_cache_key_prefix;
const signupUserIntoDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try { // console.log(user);
        const result = yield prisma_1.default.user.create({
            data: user,
        });
        // console.log(result);
        return result;
    }
    catch (error) {
        // console.log(error)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Error creating user");
    }
});
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.isUserExist(payload.email);
    //if user not found
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
    }
    const isPasswordMatched = yield (0, comparePassword_1.default)(payload.password, (yield user).password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is not correct !");
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const token = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, "10h");
    yield (0, redis_utils_1.deleteCachedData)(`${cacheKey}:user:${user.email}:token`);
    yield (0, redis_utils_1.cacheData)(`${cacheKey}:user:${user.email}:token`, token, 3600 * 10);
    return { token };
});
exports.UserService = {
    signupUserIntoDB,
    loginUserService
};
