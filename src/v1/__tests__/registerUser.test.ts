import request from "supertest";
import app from "../../index";
jest.setTimeout(30000);


beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
    jest.restoreAllMocks();
});



describe("registerUser", () => {

    describe('When user is already registered', () => {

        it('should return 409 status code', async () => {
            const response = await request(app).post(`/api/v1/user/register`).send({
                email: "hritikf@gmail.com",
                password: "Hrk@1234",
                fullName: 'Hritik Kumar Sinha'
            });
            expect(response.status).toBe(409);
        });

        it('health check', async () => {
            const response = await request(app).get(`/api/v1/health`);
            expect(response.status).toBe(200);
        });
    });
});