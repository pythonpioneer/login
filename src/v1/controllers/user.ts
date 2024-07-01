import { Request, Response } from 'express';


// to create a new users or register users
const registerUser = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({ ok: "ok" });
}

export { registerUser };