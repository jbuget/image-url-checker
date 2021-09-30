"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const tslog_1 = require("tslog");
class Logger {
    constructor() {
        this._logger = new tslog_1.Logger({
            displayFilePath: 'hidden',
            displayFunctionName: false,
            suppressStdOutput: process.env['NODE_ENV'] === 'test'
        });
    }
    info(...args) {
        this._logger.info(...args);
    }
    error(...args) {
        this._logger.error(...args);
    }
}
exports.default = Logger;
const logger = new Logger();
exports.logger = logger;
