"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractReporter = void 0;
const Logger_1 = require("../tools/Logger");
class AbstractReporter {
    constructor(options) {
        this._options = options;
    }
    async report(analyzedLines) {
        Logger_1.logger.info('--------------------------------------------------------------------------------');
        Logger_1.logger.info('Phase: "Reporting"');
        Logger_1.logger.info(`  - analyzed lines: ${analyzedLines.length}`);
        Logger_1.logger.info();
        const hrStart = process.hrtime();
        analyzedLines.sort((a, b) => a.index - b.index);
        await this.writeOutputLines(analyzedLines);
        const hrEnd = process.hrtime(hrStart);
        Logger_1.logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
        Logger_1.logger.info();
    }
}
exports.AbstractReporter = AbstractReporter;
//# sourceMappingURL=Reporter.js.map