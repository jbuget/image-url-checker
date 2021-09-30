"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const readline_1 = __importDefault(require("readline"));
const Line_1 = __importDefault(require("./Line"));
const Logger_1 = require("../tools/Logger");
class Parser {
    constructor(options) {
        this._options = options;
        this.separator = options.separator ? options.separator : ';';
        this.from = options.from;
        this.to = options.to;
    }
    parse(file) {
        return new Promise((resolve, reject) => {
            Logger_1.logger.info('--------------------------------------------------------------------------------');
            Logger_1.logger.info('Phase: "Parsing"');
            Logger_1.logger.info(` - file: ${file}`);
            Logger_1.logger.info(` - from: ${this.from}`);
            Logger_1.logger.info(` - separator: ${this.separator}`);
            Logger_1.logger.info(` - to: ${this.to}`);
            Logger_1.logger.info();
            const hrStart = process.hrtime();
            let index = 1;
            const lines = [];
            const rl = readline_1.default.createInterface({
                input: (0, fs_1.createReadStream)(file),
            });
            rl.on('line', (rawLine) => {
                const trimmedLine = rawLine.trim();
                let mustAddLine = true;
                mustAddLine = (trimmedLine !== '');
                if (this.from && index < this.from)
                    mustAddLine = mustAddLine && false;
                if (this.to && index > this.to)
                    mustAddLine = mustAddLine && false;
                if (mustAddLine) {
                    Logger_1.logger.info(`${chalk_1.default.cyan(index)}. ${trimmedLine}`);
                    const line = new Line_1.default(index, trimmedLine, this.separator);
                    lines.push(line);
                }
                else {
                    Logger_1.logger.info(`${chalk_1.default.gray(index + '. ' + trimmedLine)}`);
                }
                index++;
            });
            rl.on('close', () => {
                Logger_1.logger.info();
                const hrEnd = process.hrtime(hrStart);
                Logger_1.logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
                Logger_1.logger.info();
                resolve(lines);
            });
        });
    }
}
exports.default = Parser;
