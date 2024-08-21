// importing requirements
import express from 'express';
import validateValidationRules, { RequestData } from '../middlewares/validationMiddleware';
import { loginSchema, registrationSchema, updateUserInfoSchema } from '../validationSchema/user';
import { loginUser, logoutUser, registerUser, getCurrentUser, loginViaTokens, deleteUser, updateUserInformation } from '../controllers/user';
import { fetchLoggedinUserViaAccessToken, fetchLoggedinUserViaRefreshToken } from '../middlewares/validateUser';
import { passwordValidation } from '../validationSchema/userFields';


// creating router for the routes
const router = express.Router();

// Route 1: To create an user: '/api/v1/user/register' [using POST] (login not required)
router.post('/register', validateValidationRules(registrationSchema, RequestData.BODY), registerUser);

// Route 2: To login an existing user: '/api/v1/user/login' [using POST] (login not required)
router.post('/login', validateValidationRules(loginSchema, RequestData.BODY), loginUser);

// Route 3: To logout the existing users: '/api/v1/user/logout' [using POST] (login required)
router.post('/logout', fetchLoggedinUserViaRefreshToken, logoutUser);

// Route 4: To delete the existing user: '/api/v1/user/' [using DELETE] (login required)
router.delete('/', validateValidationRules(passwordValidation, RequestData.BODY), deleteUser);

// Route 5: To get the details of the current user: '/api/v1/user/' [using GET] (login required)
router.get('/', fetchLoggedinUserViaAccessToken, getCurrentUser);

// Route 6: To login through tokens: '/api/v1/user/fast-login' [using GET] (login not required)
router.post('/fast-login', fetchLoggedinUserViaRefreshToken, loginViaTokens);

// Route 7: To update the user information (except password): '/api/v1/user/' [using PUT] (login required)
router.put('/', validateValidationRules(updateUserInfoSchema, RequestData.BODY), fetchLoggedinUserViaAccessToken, updateUserInformation);

// exporting the router object
export default router;
