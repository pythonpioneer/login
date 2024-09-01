"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importStar(require("../../index"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
// Set a timeout for Jest
jest.setTimeout(30000);
// Suppress console statements during tests
beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
});
// Restore console statements and close the server after all tests
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    jest.restoreAllMocks();
    yield mongoose_1.default.connection.close(); // Ensure MongoDB connection is closed
    index_1.server.close();
}));
// Test suite for the registerUser route
describe("Register User Route", () => {
    describe("POST /api/v1/user/register", () => {
        const apiPath = "/api/v1/user/register";
        describe("When any required field is missing", () => {
            it("should return status code 400 for missing 'email'", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(index_1.default).post(apiPath).send({
                    fullName: "John Doe",
                    password: "Password@123"
                });
                expect(response.status).toBe(400);
            }));
            it("should return status code 400 for missing 'password'", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(index_1.default).post(apiPath).send({
                    fullName: "John Doe",
                    email: "johndoe@me.com"
                });
                expect(response.status).toBe(400);
            }));
            it("should return status code 400 for missing 'fullName'", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(index_1.default).post(apiPath).send({
                    email: "johndoe@me.com",
                    password: "Password@123"
                });
                expect(response.status).toBe(400);
            }));
        });
        describe("When password is not strong enough", () => {
            it("should return status code 400 for weak password", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(index_1.default).post(apiPath).send({
                    email: "johndoe@me.com",
                    fullName: "John Doe",
                    password: "password"
                });
                expect(response.status).toBe(400);
            }));
            it("should return status code 400 for short password", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(index_1.default).post(apiPath).send({
                    email: "johndoe@me.com",
                    fullName: "John Doe",
                    password: "pass"
                });
                expect(response.status).toBe(400);
            }));
        });
        describe("When email already exists", () => {
            it("should return status code 409 for duplicate email", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(index_1.default).post(apiPath).send({
                    email: "hritikf@gmail.com",
                    fullName: "John Doe",
                    password: "Password@123"
                });
                expect(response.status).toBe(409);
            }));
        });
        describe("When user is created successfully", () => {
            // deleting the email after each test to set it as unique
            afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
                yield User_1.User.deleteMany({ email: "johndoe@me.com" });
            }));
            // test the successful creation of a new user
            it("should return status code 201", () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(index_1.default).post(apiPath).send({
                    email: "johndoe@me.com",
                    fullName: "John Doe",
                    password: "Password@123"
                });
                expect(response.status).toBe(201);
            }));
        });
        describe("When there is a database error", () => {
            it("should return status code 500", () => __awaiter(void 0, void 0, void 0, function* () {
                // throwing an error while creating a new user
                jest.spyOn(User_1.User, 'create').mockRejectedValue(new Error("Database error"));
                const response = yield (0, supertest_1.default)(index_1.default).post(apiPath).send({
                    email: "johndoe@me.com",
                    fullName: "John Doe",
                    password: "Password@123"
                });
                expect(response.status).toBe(500);
            }));
        });
    });
});
