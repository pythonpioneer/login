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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongo = void 0;
// importing requirements
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// loading environment variables and fetching URI to connect with mongodb
dotenv_1.default.config();
const mongoURI = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.MONGODB_URI) || "";
// if the URI is not present
if (!mongoURI) {
    console.error('Error: MONGODB_URI is not defined in environment variables');
    process.exit(1);
}
// to connect with mongodb atlas server
const connectToMongo = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connect(mongoURI)
        .then(() => {
        console.log("Successfully Connected to MongoDB Atlas Server!");
    })
        .catch((err) => {
        console.error("Coneection Interrupted");
        console.error("error: ", err);
    });
});
exports.connectToMongo = connectToMongo;
