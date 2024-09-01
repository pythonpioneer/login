"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_AGE = exports.ACCESS_TOKEN_AGE = exports.COOKIE_AGE = void 0;
// tokens and cookies age, and their expiry dates
const COOKIE_AGE = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
exports.COOKIE_AGE = COOKIE_AGE;
const ACCESS_TOKEN_AGE = 1 * 24 * 60 * 60; // 1 day in seconds
exports.ACCESS_TOKEN_AGE = ACCESS_TOKEN_AGE;
const REFRESH_TOKEN_AGE = 30 * 24 * 60 * 60; // 15 days in seconds
exports.REFRESH_TOKEN_AGE = REFRESH_TOKEN_AGE;
