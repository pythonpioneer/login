import request from "supertest";
import app, { server } from "../../index";
import mongoose from "mongoose";
import { User } from "../models/User";

// Set a timeout for Jest
jest.setTimeout(30000);


// Test suite for the registerUser route
describe("Register User Route", () => {

    describe("POST /api/v1/user/register", () => {

        const apiPath = "/api/v1/user/register";

        describe("When user is created successfully", () => {

            // deleting the email after each test to set it as unique
            afterEach(async () => {
                await User.findOneAndDelete({ email: "hrk@me.com" });
            });

            // test the successful creation of a new user
            it("should return status code 201", async () => {

                const response = await request(app).post(apiPath).send({
                    email: "hrk@me.com",
                    fullName: "Hritik",
                    password: "Password@123"
                });
                expect(response.status).toBe(201);
            });
        });

    });
});
