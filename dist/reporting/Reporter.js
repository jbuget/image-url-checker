"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Logger_js_1 = require("../tools/Logger.js");
class Reporter {
    constructor(options) {
        this._options = options;
        this.output = options.output;
    }
    async report(analyzedLines) {
        return new Promise((resolve, reject) => {
            Logger_js_1.logger.info('--------------------------------------------------------------------------------');
            Logger_js_1.logger.info('Phase: "Reporting"');
            Logger_js_1.logger.info(`  - analyzed lines: ${analyzedLines.length}`);
            Logger_js_1.logger.info();
            const hrStart = process.hrtime();
            analyzedLines.sort((a, b) => (a.index - b.index));
            if (this.output) {
                const outputStream = (0, fs_1.createWriteStream)(this.output, { flags: 'w' });
                analyzedLines.forEach((line) => {
                    outputStream.write(`${line.reference};${line.url};${line.status}`);
                    if (line.error) {
                        outputStream.write(`;${line.error};`);
                        line.comments.forEach((comment) => outputStream.write(`${comment} `));
                    }
                    outputStream.write('\n');
                });
                outputStream.end();
                outputStream.on('finish', () => resolve);
            }
            const hrEnd = process.hrtime(hrStart);
            Logger_js_1.logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
            Logger_js_1.logger.info();
        });
    }
}
exports.default = Reporter;
//# sourceMappingURL=Reporter.js.map