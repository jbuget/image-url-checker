"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponse = exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
class HttpClient {
    set headers(value) {
        this._headers = value;
    }
    async head(url) {
        let config;
        if (this._headers)
            config = { headers: this._headers };
        const response = config ? await axios_1.default.head(url, config) : await axios_1.default.head(url);
        return new HttpResponse(response);
    }
}
exports.HttpClient = HttpClient;
class HttpResponse {
    constructor(response) {
        this._response = response;
    }
    get statusCode() {
        return this._response.status;
    }
    get headers() {
        return this._response.headers;
    }
}
exports.HttpResponse = HttpResponse;
//# sourceMappingURL=HttpClient.js.map