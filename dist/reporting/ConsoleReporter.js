"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Reporter_1 = require("./Reporter");
const Logger_1 = require("../tools/Logger");
class ConsoleReporter extends Reporter_1.AbstractReporter {
    constructor(options) {
        super(options);
    }
    writeOutputLines(analyzedLines) {
        return new Promise((resolve) => {
            analyzedLines.forEach((line) => {
                Logger_1.logger.info(`${line.reference};${line.url};${line.status};${line.error || ''};${line.comments[0] || ''}`);
            });
            Logger_1.logger.info();
            resolve();
        });
    }
}
exports.default = ConsoleReporter;
//# sourceMappingURL=ConsoleReporter.js.map