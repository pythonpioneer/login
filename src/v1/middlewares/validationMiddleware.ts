import { z, ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import StatusCode from "../../statusCodes";
import apiResponse from "../utils/api/apiResponse";


// Validation middleware to validate Zod schema
function validateValidationRules<T extends ZodSchema>(schema: T, type: requestDataType) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {

            // validating that we only received body data or query data
            let result;
            if (type === RequestData.BODY) {
                result = schema.safeParse(req.body);
            } else if (type === RequestData.QUERY) {
                result = schema.safeParse(req.query);
            } else {
                throw new Error('Unsupported data type for validation');
            }

            // validation passes successfully
            if (result.success) {
                next();
            } else {

                // when the validation failed
                const errorMessages = result.error.errors.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                }));
                return apiResponse({ response: res, statusCode: StatusCode.BadRequest, message: "Field Validation Failed", error: errorMessages });
            }
        } catch (error) {  // unrecogonized errors
            return apiResponse({ response: res, statusCode: StatusCode.InternalServerError, message: "Internal Server Error", error })
        }
    };
}

// constants for request data
enum RequestData {
    BODY = 'BODY',
    QUERY = 'QUERY',
}

// to validate the request body and request query
type requestDataType = RequestData.BODY | RequestData.QUERY;

// export the validation middleware
export default validateValidationRules;
export { RequestData };