"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
// importing requirements
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// importing routes from all possible versions
const v1_1 = __importDefault(require("./v1"));
const v2_1 = __importDefault(require("./v2"));
// loading environment variables and fetching information for the API
dotenv_1.default.config();
const PORT = parseInt(((_a = process.env) === null || _a === void 0 ? void 0 : _a.PORT) || '5100', 10);
const APIPATH = ((_b = process.env) === null || _b === void 0 ? void 0 : _b.APIPATH) || "/api/";
const COOKIE_SECRET_KEY = (_c = process.env) === null || _c === void 0 ? void 0 : _c.COOKIE_SECRET_KEY;
// express development environments and middlewares
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)(COOKIE_SECRET_KEY));
// providing routes for all possible versions
app.use(APIPATH + 'v1', v1_1.default);
app.use(APIPATH + 'v2', v2_1.default);
// health check for the server
app.get('/health', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ status: 200, message: 'Server is Up and Running!' });
}));
// app is running on the particular port
const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
// handling SIGTERM signal for graceful shutdown, when the process is stopped by a system signal
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed. Process Terminated.');
    });
});
// handling SIGINT signal for graceful shutdown, when the process is interrupted, like with Ctrl+C
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed. Process Terminated Manually.');
    });
});
exports.default = app;
