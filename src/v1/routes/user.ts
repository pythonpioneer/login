// importing requirements
import express from 'express';
import validateValidationRules, { RequestData } from '../middlewares/validationMiddleware';
import { loginSchema, registrationSchema } from '../validationSchema/user';
import { loginUser, logoutUser, registerUser, getCurrentUser, loginViaTokens } from '../controllers/user';
import { fetchLoggedinUserViaAccessToken, fetchLoggedinUserViaRefreshToken } from '../middlewares/validateUser';


// creating router for the routes
const router = express.Router();

// Route 1: To create an user: '/api/v1/user/register' [using POST] (login not required)
router.post('/register', validateValidationRules(registrationSchema, RequestData.BODY), registerUser);

// Route 2: To login an existing user: '/api/v1/user/login' [using POST] (login not required)
router.post('/login', validateValidationRules(loginSchema, RequestData.BODY), loginUser);

// Route 3: To logout the existing users: '/api/v1/user/logout' [using POST] (login required)
router.post('/logout', fetchLoggedinUserViaRefreshToken, logoutUser);

// Route 4: To delete the existing user: '/api/v1/user/delete-user' [using POST] (login required)
router.post('/delete-user', async (req, res) => {
    res.send("Can't delete, Work in progress");
});

// Route 5: To get the details of the current user: '/api/v1/user/' [using GET] (login required)
router.get('/', fetchLoggedinUserViaAccessToken, getCurrentUser);

// Route 6: To login through tokens: '/api/v1/user/fast-login' [using GET] (login required)
router.post('/fast-login', fetchLoggedinUserViaRefreshToken, loginViaTokens);

// exporting the router object
export default router;
