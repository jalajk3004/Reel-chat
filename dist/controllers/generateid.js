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
exports.generateUniqueUserId = void 0;
const userSchemas_1 = __importDefault(require("../models/userSchemas"));
const uuid_1 = require("uuid");
const generateUniqueUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    // Search for an existing user ID in the database
    let user = yield userSchemas_1.default.findOne();
    if (user) {
        // If a user ID exists, return it
        return user.userId;
    }
    else {
        // If no user ID exists, create a new one
        const newUserId = (0, uuid_1.v4)();
        // Save the new user ID to the database
        const newUser = new userSchemas_1.default({ userId: newUserId });
        yield newUser.save();
        return newUserId;
    }
});
exports.generateUniqueUserId = generateUniqueUserId;
