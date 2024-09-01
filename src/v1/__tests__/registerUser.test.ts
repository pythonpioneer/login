import request from "supertest";
import app, { server } from "../../index";
import mongoose from "mongoose";
import { User } from "../models/User";

// Set a timeout for Jest
jest.setTimeout(30000);

// Suppress console statements during tests
beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

// Restore console statements and close the server after all tests
afterAll(async () => {
    jest.restoreAllMocks();
    await mongoose.connection.close(); // ensure MongoDB connection is closed
    server.close();
});

// reset all mocks before each test
beforeEach(() => {
    jest.resetAllMocks();
});

// Test suite for the registerUser route
describe("Register User Route", () => {

    describe("POST /api/v1/user/register", () => {

        const apiPath = "/api/v1/user/register";

        describe("When any required field is missing", () => {

            it("should return status code 400 for missing 'email'", async () => {
                const response = await request(app).post(apiPath).send({
                    fullName: "John Doe",
                    password: "Password@123"
                });
                expect(response.status).toBe(400);
            });

            it("should return status code 400 for missing 'password'", async () => {
                const response = await request(app).post(apiPath).send({
                    fullName: "John Doe",
                    email: "johndoe@me.com"
                });
                expect(response.status).toBe(400);
            });

            it("should return status code 400 for missing 'fullName'", async () => {
                const response = await request(app).post(apiPath).send({
                    email: "johndoe@me.com",
                    password: "Password@123"
                });
                expect(response.status).toBe(400);
            });
        });

        describe("When password is not strong enough", () => {

            it("should return status code 400 for invalid password", async () => {
                const response = await request(app).post(apiPath).send({
                    email: "johndoe@me.com",
                    fullName: "John Doe",
                    password: "password"  // validPassword: Password@123 (symbol, capital, small, number, length:6-20)
                });
                expect(response.status).toBe(400);
            });

            it("should return status code 400 for short password", async () => {

                const response = await request(app).post(apiPath).send({
                    email: "johndoe@me.com",
                    fullName: "John Doe",
                    password: "pass"
                });
                expect(response.status).toBe(400);
            });
        });

        describe("When email already exists", () => {

            it("should return status code 409 for duplicate email", async () => {

                const response = await request(app).post(apiPath).send({
                    email: "hritikf@gmail.com",
                    fullName: "John Doe",
                    password: "Password@123"
                });
                expect(response.status).toBe(409);
            });
        });

        describe("When user is created successfully", () => {

            // deleting the email after each test to set it as unique
            afterEach(async () => {
                await User.findOneAndDelete({ email: "johndoe@me.com" });
            });

            // test the successful creation of a new user
            it("should return status code 201", async () => {

                const response = await request(app).post(apiPath).send({
                    email: "johndoe@me.com",
                    fullName: "John Doe",
                    password: "Password@123"
                });
                expect(response.status).toBe(201);
            });
        });

        describe("When there is a database error", () => {

            it("should return status code 500", async () => {

                jest.spyOn(User, 'create').mockImplementation(() => {
                    throw new Error("Internal server Error");
                });
        
                const response = await request(app).post('/api/v1/user/register').send({
                    email: "johndoe@me.com",
                    fullName: "John Doe",
                    password: "Password@123"
                });
                expect(response.status).toBe(500);
            });
        });
    });
});
