import express, { Request, Response } from 'express';
import { connectToMongo } from './db';

const router = express.Router();
connectToMongo();

router.get('/', (req: Request, res: Response): Response => {
  return res.send("Version 1: OK!");
});

module.exports = router;
