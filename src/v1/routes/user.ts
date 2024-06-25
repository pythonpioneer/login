// importing requirements
import express, { Request, Response } from 'express';


// creating router for the routes
const router = express.Router();

// Route 1: To create user: '/api/v1/user/register' [using POST] (login not required)
router.get('/register', async (req: Request, res: Response) => {
    return res.send('register')
});

// Route 2: To login user: '/api/v1/user/login' [using POST] (login not required)
router.get('/login', async (req: Request, res: Response) => {
    return res.send('login')
});

// Route 3: To generate otp to change password: '/api/v1/user/generate' [using POST] (login not required)
router.get('/generate', async (req: Request, res: Response) => {
    return res.send('generate')
});

// Route 4: To recover/set the password using OTP: '/api/v1/user/set-password' [using POST] (login not required)
router.get('/set-password',async (req: Request, res: Response) => {
    return res.send('set-pass')
});

// exporting the router object
export default router;
