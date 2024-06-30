import { z, ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import StatusCode from "../../statusCodes/statusCodes";


// validation middleware to validate the zod validation
function validateValidationRules<T extends ZodSchema>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = schema.safeParse(req.body);

            if (result.success) {
                next();
            } else {
                const errorMessages = result.error.errors.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                }));
                return res.status(400).json({ error: 'Invalid data', details: errorMessages });
            }

        } catch (error) {
            return res.status(StatusCode.InternalServerError).json({ error: 'Internal Server Error' });
        }
    }
}
