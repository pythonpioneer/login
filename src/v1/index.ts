import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response): Response => {
  return res.send("Version 1: OK!");
});

module.exports = router;
