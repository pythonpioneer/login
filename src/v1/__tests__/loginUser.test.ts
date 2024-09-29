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


// Test suite for the loginUser route
describe("Login User Route", () => {

    describe("POST /api/v1/user/login", () => {

        const apiPath = '/api/v1/user/login';

        describe("When any required field is missing", () => {
            
            it("should return status code 400 for missing 'email'", async () => {
                const response = await request(app).post(apiPath).send({
                    password: "Password@123"
                });
                expect(response.status).toBe(400);
            });

            it("should return status code 400 for missing 'password'", async () => {
                const response = await request(app).post(apiPath).send({
                    email: "p1LpZ@example.com"  
                });
                expect(response.status).toBe(400);
            });
        });

        describe("when password is not strong enough", () => {

            it("should return status code 400 for invalid or short password", async () => {
                const response = await request(app).post(apiPath).send({
                    email: "p1LpZ@example.com",
                    password: "pass"
                });
                expect(response.status).toBe(400);
            });
        });

        describe("when email is not valid", () => {

            it("should return status code 400 for invalid email", async () => {
                const response = await request(app).post(apiPath).send({
                    email: "@example.com",
                    password: "Password@123"
                });
                expect(response.status).toBe(400);
            });
        });

        describe("when user is not found", () => {
            it("should return status code 404", async () => {
                const response = await request(app).post(apiPath).send({
                    email: "usernotfount@example.com",
                    password: "Password@123"
                });
                expect(response.status).toBe(404);
            });
        });

        describe("when user is found", () => {

            const userData = {
                fullName: "Hritik Kumar Sinha",
                email: "hrk@me.com",
                password: "Password@123"
            }

            beforeAll(async () => {
                const user = await User.create(userData);
            });

            afterAll(async () => {
                await User.deleteOne({ email: userData.email });
            });

            describe("when password is correct", () => {

                it("should return status code 200", async () => {
                    const response = await request(app).post(apiPath).send({
                        email: userData.email,
                        password: userData.password
                    });
                    expect(response.status).toBe(200);
                });
            });

            describe("when password is incorrect", () => {
                
                it("should return status code 401", async () => {
                    const response = await request(app).post(apiPath).send({
                        email: userData.email,
                        password: "Wrongpassword@123",  // wrong password must follow the regex pattern
                    });
                    expect(response.status).toBe(401);
                });
            });
        });

        describe("when there is a database error", () => {

            it("should return status code 500", async () => {

                // mocking the 'findone' method to throw an error
                jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error("Internal server Error"));

                const response = await request(app).post(apiPath).send({
                    email: "hrk@me.com",
                    password: "Password@123"
                });
                expect(response.status).toBe(500);
            });
        });
    });
});
