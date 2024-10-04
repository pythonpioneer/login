import request from "supertest";
import app from "../../index";
import { User } from "../models/User";
import { setupTestDB } from "./test.setup";
import { Token } from "../models/interfaces";
import { REFRESH_TOKEN_AGE } from "../utils/secure/constants";


// Setup mongodb in-memory server and mongoose connection
setupTestDB();

describe("Logout User Route", () => {

    describe("POST /api/v1/user/logout", () => {

        const logoutRoute = '/api/v1/user/logout';
        const loginRoute = '/api/v1/user/login';
        const registerRoute = '/api/v1/user/register';

        const userData = {
            fullName: "Hritik Kumar Sinha",
            email: "y9rjA@example.com",
            password: "Hritik@123",
        };

        describe("When any required fields are missing", () => {

            it("Should return status code 404", async () => {
                const response = await request(app).post(logoutRoute);
                expect(response.status).toBe(404);
            });
        });

        describe("when refresh token is invalid", () => {

            describe("when token format is invalid", () => {

                const invalidRefreshToken = "invalidrefreshtoken";

                it("Should return status code 401", async () => {

                    // now, make the request to the logout route
                    const response = await request(app).post(logoutRoute)
                        .set('Cookie', `refreshToken=${invalidRefreshToken}`)
                        .send();

                    expect(response.status).toBe(401);
                });
            });         
        });

        describe("when user is logged in", () => {

            let refreshToken: Token;
            let accessToken: Token;

            // create the user and login the user to properly test the logout route
            beforeEach(async () => {

                // register the user
                await request(app).post(registerRoute).send(userData);

                // login the user
                const loginResponse = await request(app).post(loginRoute).send({
                    email: userData.email,
                    password: userData.password
                });

                expect(loginResponse.status).toBe(200);
                expect(loginResponse.body.data.accessToken).toBeDefined();
                expect(loginResponse.body.data.refreshToken).toBeDefined();

                // saving tokens
                refreshToken = loginResponse.body.data.refreshToken;
                accessToken = loginResponse.body.data.accessToken;
            });

            describe("when refresh token is valid", () => {

                it("Should return status code 200", async () => {

                    // now, make the request to the logout route
                    const response = await request(app).post(logoutRoute)
                        .set('Cookie', `refreshToken=${refreshToken}`)
                        .send();

                    expect(response.status).toBe(200);
                });
            });

            describe("when refresh token is invalid", () => {

                it("Should return status code 401", async () => {

                    let invalidRefreshToken = accessToken;

                    // now, make the request to the logout route
                    const response = await request(app).post(logoutRoute)
                        .set('Cookie', `refreshToken=${invalidRefreshToken}`)
                        .send();

                    expect(response.status).toBe(401);
                });
            });

            describe("when user is already logged out", () => {

                it("Should return status code 200", async () => {

                    // logging out the user
                    await request(app).post(logoutRoute)
                        .set('Cookie', `refreshToken=${refreshToken}`)
                        .send();

                    // now, make the request to the logout route
                    const response = await request(app).post(logoutRoute)
                        .set('Cookie', `refreshToken=${refreshToken}`)
                        .send();

                    expect(response.status).toBe(200);
                });
            });

            describe("when user is trying to logout via other valid refresh token", () => {

                let newRefreshToken: Token;

                beforeEach(async () => {

                    // register the user
                    await request(app).post(registerRoute).send(userData);

                    // login the user
                    const response = await request(app).post(loginRoute).send({
                        email: userData.email,
                        password: userData.password
                    });
                    expect(response.status).toBe(200);
                    expect(response.body.data.accessToken).toBeDefined();

                    // storing refresh token
                    newRefreshToken = response.body.data.refreshToken;
                });

                describe("when logging out with new refresh token", () => {

                    it("Should return status code 200", async () => {

                        // now, make the request to the logout route
                        const response = await request(app).post(logoutRoute)
                            .set('Cookie', `refreshToken=${newRefreshToken}`)
                            .send();

                        expect(response.status).toBe(200);
                    });
                });

                describe("when logging out with old refresh token", () => {

                    it("should return status code 403", async () => {

                        const oldRefreshToken = refreshToken;

                        // hitting the login route again to make the current token old
                        await request(app).post(loginRoute).send({
                            email: userData.email,
                            password: userData.password
                        });

                        // now, make the request to the logout route
                        const response = await request(app).post(logoutRoute)
                            .set('Cookie', `refreshToken=${oldRefreshToken}`)
                            .send();

                        expect(response.status).toBe(403);
                    });
                });
            });
        });

        describe("when user is not logged in", () => {

            let refreshToken: Token;

            beforeEach(async () => {

                // register the user
                await request(app).post(registerRoute).send(userData);

                // login the user
                const response = await request(app).post(loginRoute).send({
                    email: userData.email,
                    password: userData.password
                });

                expect(response.status).toBe(200);
                expect(response.body.data.accessToken).toBeDefined();
                expect(response.body.data.refreshToken).toBeDefined();

                refreshToken = response.body.data.refreshToken;

                // now, logout the user
                await request(app).post(logoutRoute)
                    .set('Cookie', `refreshToken=${refreshToken}`)
                    .send();
            });

            it("Should return status code 200", async () => {

                // now, make the request to the logout route
                const response = await request(app).post(logoutRoute)
                    .set('Cookie', `refreshToken=${refreshToken}`)
                    .send();

                expect(response.status).toBe(200);
            });
        });

        describe("when there is a database error", () => {

            let refreshToken: Token;

            beforeEach(async () => {

                // register the user
                await request(app).post(registerRoute).send(userData);

                // login the user
                const response = await request(app).post(loginRoute).send({
                    email: userData.email,
                    password: userData.password
                });

                expect(response.status).toBe(200);
                expect(response.body.data.accessToken).toBeDefined();
                expect(response.body.data.refreshToken).toBeDefined();

                refreshToken = response.body.data.refreshToken;
            });

            it("Should return status code 500", async () => {

                jest.spyOn(User, 'findById').mockImplementationOnce(() => {
                    throw new Error();
                });

                // now, make the request to the logout route
                const response = await request(app).post(logoutRoute)
                    .set('Cookie', `refreshToken=${refreshToken}`)
                    .send();

                jest.restoreAllMocks();

                expect(response.status).toBe(500);
            });
        });
    });
});