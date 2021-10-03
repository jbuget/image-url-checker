"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractParser = void 0;
const Logger_1 = require("../tools/Logger");
class AbstractParser {
    constructor(options) {
        this._options = options;
        this.separator = options.separator ? options.separator : ';';
        this.from = options.from;
        this.to = options.to;
    }
    async parse() {
        Logger_1.logger.info('--------------------------------------------------------------------------------');
        Logger_1.logger.info('Phase: "Parsing"');
        Logger_1.logger.info(` - from: ${this.from}`);
        Logger_1.logger.info(` - separator: ${this.separator}`);
        Logger_1.logger.info(` - to: ${this.to}`);
        Logger_1.logger.info();
        const hrStart = process.hrtime();
        const lines = await this.extractLines();
        Logger_1.logger.info();
        const hrEnd = process.hrtime(hrStart);
        Logger_1.logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
        Logger_1.logger.info();
        return lines;
    }
}
exports.AbstractParser = AbstractParser;
//# sourceMappingURL=Parser.js.map