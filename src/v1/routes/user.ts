// importing requirements
import express from 'express';
import validateValidationRules, { RequestData } from '../middlewares/validationMiddleware';
import { loginSchema, passwordValidationSchema, registrationSchema, updateUserInfoSchema } from '../validationSchema/user';
import { loginUser, logoutUser, registerUser, getCurrentUser, loginViaTokens, deleteUser, updateUserInformation, updateUserPassword } from '../controllers/user';
import { fetchLoggedinUserViaAccessToken, fetchLoggedinUserViaRefreshToken } from '../middlewares/validateUser';
import { passwordValidation } from '../validationSchema/userFields';


// creating router for the routes
const router = express.Router();

// Route 1: To create an user: '/api/v1/user/register' [using POST] (login not required) (Token not required)
router.post('/register', validateValidationRules(registrationSchema, RequestData.BODY), registerUser);

// Route 2: To login an existing user: '/api/v1/user/login' [using POST] (login not required) (Token not required)
router.post('/login', validateValidationRules(loginSchema, RequestData.BODY), loginUser);

// Route 3: To logout the existing users: '/api/v1/user/logout' [using POST] (login required) (Refresh Token required)
router.post('/logout', fetchLoggedinUserViaRefreshToken, logoutUser);

// Route 4: To delete the existing user: '/api/v1/user/' [using DELETE] (login required) 
router.delete('/', validateValidationRules(passwordValidationSchema, RequestData.BODY), fetchLoggedinUserViaRefreshToken, deleteUser);

// Route 5: To get the details of the current user: '/api/v1/user/' [using GET] (login required) (Access Token required)
router.get('/', fetchLoggedinUserViaAccessToken, getCurrentUser);

// Route 6: To login through tokens: '/api/v1/user/fast-login' [using GET] (login not required) (Refresh Token required)
router.post('/fast-login', fetchLoggedinUserViaRefreshToken, loginViaTokens);

// Route 7: To update the user information (except password): '/api/v1/user/' [using PUT] (login required) (Access Token required)
router.put('/', validateValidationRules(updateUserInfoSchema, RequestData.BODY), fetchLoggedinUserViaAccessToken, updateUserInformation);

// Route 8: To update the user password: '/api/v1/user/password' [using PATCH] (login required) (Refresh Token required)
router.patch('/password', validateValidationRules(passwordValidationSchema, RequestData.BODY), fetchLoggedinUserViaRefreshToken, updateUserPassword);

// exporting the router object
export default router;
