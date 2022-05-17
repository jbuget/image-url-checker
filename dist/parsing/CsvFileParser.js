"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
const Line_1 = __importDefault(require("./Line"));
const Logger_1 = require("../tools/Logger");
const readline_1 = __importDefault(require("readline"));
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
class CsvFileParser extends Parser_1.AbstractParser {
    constructor(options) {
        super(options);
        this.input = options.input;
    }
    extractLines() {
        return new Promise((resolve) => {
            let index = 1;
            const lines = [];
            const rl = readline_1.default.createInterface({
                input: (0, fs_1.createReadStream)(this.input)
            });
            rl.on('line', (rawLine) => {
                const trimmedLine = rawLine.trim();
                let mustAddLine;
                mustAddLine = trimmedLine !== '';
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
            rl.on('close', () => resolve(lines));
        });
    }
}
exports.default = CsvFileParser;
//# sourceMappingURL=CsvFileParser.js.map