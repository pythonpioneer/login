// importing requirements
import express from 'express';
import validateValidationRules, { RequestData } from '../middlewares/validationMiddleware';
import { loginSchema, registrationSchema } from '../validationSchema/user';
import { loginUser, logoutUser, registerUser } from '../controllers/user';
import { fetchLoggedinUser } from '../middlewares/validateUser';


// creating router for the routes
const router = express.Router();

// Route 1: To create an user: '/api/v1/user/register' [using POST] (login not required)
router.post('/register', validateValidationRules(registrationSchema, RequestData.BODY), registerUser);

// Route 2: To login an existing user: '/api/v1/user/login' [using POST] (login not required)
router.post('/login', validateValidationRules(loginSchema, RequestData.BODY), loginUser);

// Route 3: To logout an existing users: '/api/v1/user/logout' [using POST] (login required)
router.post('/logout', fetchLoggedinUser, logoutUser);

// Route 4: To delete an existing users: '/api/v1/user/delete-user' [using POST] (login required)
router.post('/delete-user', async (req, res) => {
    res.send("delete")
});

// exporting the router object
export default router;
