"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestData = void 0;
const statusCodes_1 = __importDefault(require("../../statusCodes"));
const apiResponse_1 = __importDefault(require("../utils/api/apiResponse"));
// Validation middleware to validate Zod schema
function validateValidationRules(schema, type) {
    return (req, res, next) => {
        try {
            // validating that we only received body data or query data
            let result;
            if (type === RequestData.BODY) {
                result = schema.safeParse(req.body);
            }
            else if (type === RequestData.QUERY) {
                result = schema.safeParse(req.query);
            }
            else {
                throw new Error('Unsupported data type for validation');
            }
            // validation passes successfully
            if (result.success) {
                next();
            }
            else {
                // when the validation failed
                const errorMessages = result.error.errors.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                }));
                return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.BadRequest, message: "Field Validation Failed", error: errorMessages });
            }
        }
        catch (error) { // unrecogonized errors
            return (0, apiResponse_1.default)({ response: res, statusCode: statusCodes_1.default.InternalServerError, message: "Internal Server Error", error });
        }
    };
}
// constants for request data
var RequestData;
(function (RequestData) {
    RequestData["BODY"] = "BODY";
    RequestData["QUERY"] = "QUERY";
})(RequestData || (exports.RequestData = RequestData = {}));
// export the validation middleware
exports.default = validateValidationRules;
