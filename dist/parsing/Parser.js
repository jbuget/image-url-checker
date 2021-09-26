"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const readline_1 = __importDefault(require("readline"));
const Line_js_1 = __importDefault(require("./Line.js"));
const Logger_js_1 = require("../tools/Logger.js");
class Parser {
    constructor(options) {
        this._options = options;
        this.separator = options.separator ? options.separator : ';';
        this.from = options.from;
        this.to = options.to;
    }
    parse(file) {
        return new Promise((resolve, reject) => {
            Logger_js_1.logger.info('--------------------------------------------------------------------------------');
            Logger_js_1.logger.info('Phase: "Parsing"');
            Logger_js_1.logger.info(` - file: ${file}`);
            Logger_js_1.logger.info(` - from: ${this.from}`);
            Logger_js_1.logger.info(` - separator: ${this.separator}`);
            Logger_js_1.logger.info(` - to: ${this.to}`);
            Logger_js_1.logger.info();
            const hrStart = process.hrtime();
            let index = 1;
            const lines = [];
            const rl = readline_1.default.createInterface({
                input: (0, fs_1.createReadStream)(file),
            });
            rl.on('line', (rawLine) => {
                let reference, url;
                [reference, url] = rawLine.split(this.separator);
                let mustAddLine = true;
                if (this.from && index < this.from)
                    mustAddLine = mustAddLine && false;
                if (this.to && index > this.to)
                    mustAddLine = mustAddLine && false;
                if (mustAddLine) {
                    Logger_js_1.logger.info(`  ${rawLine}`);
                    const line = new Line_js_1.default(index, rawLine, reference, url);
                    lines.push(line);
                }
                else {
                    Logger_js_1.logger.info(`  ${chalk_1.default.gray(rawLine)}`);
                }
                index++;
            });
            rl.on('close', () => {
                Logger_js_1.logger.info();
                const hrEnd = process.hrtime(hrStart);
                Logger_js_1.logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
                Logger_js_1.logger.info();
                resolve(lines);
            });
        });
    }
}
exports.default = Parser;
//# sourceMappingURL=Parser.js.map