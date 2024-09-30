import request from 'supertest'; // Assuming you're using supertest for HTTP assertions
import app from '../../index'; // Assuming this is your Express app
import { User } from '../models/User'; // Your user model
import { setupTestDB } from './test.setup';


// Set up MongoDB in-memory server and mongoose connection
setupTestDB();

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

            beforeEach(async () => {
                await User.create({
                    email: "hritik.already.created@gmail.com",
                    fullName: "Hritik",
                    password: "Password@123"
                });
            });

            afterEach(async () => {
                await User.findOneAndDelete({ email: "hritik.already.created@gmail.com" });
            });

            it("should return status code 409 for duplicate email", async () => {

                const response = await request(app).post(apiPath).send({
                    email: "hritik.already.created@gmail.com",
                    fullName: "John Doe",
                    password: "Password@123"
                });
                expect(response.status).toBe(409);
            });
        });

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

        describe("When there is a database error", () => {

            it("should return status code 500", async () => {

                // Mock User.create to throw an error
                jest.spyOn(User, 'create').mockRejectedValueOnce(new Error("Internal server Error"));

                // Also mock other potential queries like User.findOne
                jest.spyOn(User, 'findOne').mockRejectedValueOnce(() => {
                    throw new Error("Database error");
                });

                const response = await request(app).post('/api/v1/user/register').send({
                    email: "hrk@me.com",
                    fullName: "Hritik kumar sinha",
                    password: "Password@123"
                });
                expect(response.status).toBe(500);
            });
        });
    });
});
