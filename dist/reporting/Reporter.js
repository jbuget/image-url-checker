"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Logger_1 = require("../tools/Logger");
class Reporter {
    constructor(options) {
        this._options = options;
        this.output = options.output;
    }
    async report(analyzedLines) {
        return new Promise((resolve, reject) => {
            Logger_1.logger.info('--------------------------------------------------------------------------------');
            Logger_1.logger.info('Phase: "Reporting"');
            Logger_1.logger.info(`  - analyzed lines: ${analyzedLines.length}`);
            Logger_1.logger.info();
            const hrStart = process.hrtime();
            analyzedLines.sort((a, b) => (a.index - b.index));
            if (this.output) {
                const outputStream = (0, fs_1.createWriteStream)(this.output, { flags: 'w' });
                analyzedLines.forEach((line, index) => {
                    outputStream.write(`${line.reference};${line.url};${line.status}`);
                    if (line.error) {
                        outputStream.write(`;${line.error};`);
                        line.comments.forEach((comment) => outputStream.write(`${comment}`));
                    }
                    if (index < analyzedLines.length - 1) {
                        outputStream.write('\n');
                    }
                });
                outputStream.end();
                outputStream.on('finish', resolve);
            }
            const hrEnd = process.hrtime(hrStart);
            Logger_1.logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
            Logger_1.logger.info();
        });
    }
}
exports.default = Reporter;
