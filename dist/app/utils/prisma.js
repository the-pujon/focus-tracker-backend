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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient().$extends({
    name: "HashPasswordMiddleware",
    query: {
        user: {
            create: (_a) => __awaiter(void 0, [_a], void 0, function* ({ args, query }) {
                if (args.data.password) {
                    const salt = yield bcrypt_1.default.genSalt(10);
                    args.data.password = yield bcrypt_1.default.hash(args.data.password, salt);
                }
                return query(args);
            }),
            update: (_a) => __awaiter(void 0, [_a], void 0, function* ({ args, query }) {
                if (args.data.password) {
                    const salt = yield bcrypt_1.default.genSalt(10);
                    args.data.password = yield bcrypt_1.default.hash(args.data.password, salt);
                }
                return query(args);
            }),
        },
    },
    model: {
        user: {
            isUserExist: (email) => __awaiter(void 0, void 0, void 0, function* () {
                return prisma.user.findUnique({
                    where: { email }
                });
            }),
        },
    },
});
exports.default = prisma;
