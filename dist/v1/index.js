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
Object.defineProperty(exports, "__esModule", { value: true });
// importing requirements
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
// routes for the application
const user_1 = __importDefault(require("./routes/user"));
// connect with the mongodb atlas server
(0, db_1.connectToMongo)();
// implmenting routes for the API
const app = express_1.default.Router();
// available routes
app.use('/user', user_1.default);
// health check for the server
app.get('/health', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ status: 200, message: 'Version 1 is Up and Running!' });
}));
exports.default = app;
