"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const url_1 = require("url");
const AnalyzedLine_js_1 = __importDefault(require("./AnalyzedLine.js"));
const Logger_js_1 = require("../tools/Logger.js");
class Analyzer {
    constructor(options) {
        this._options = options;
        this.bulk = options.bulk || 10;
        this.delay = options.delay;
    }
    async _sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    _isValid(response) {
        return this._isStatusOk(response) && this._isAnImage(response);
    }
    _isStatusOk(response) {
        return response.status === 200;
    }
    _isAnImage(response) {
        return response.headers['content-type'].trim().toLowerCase().startsWith('image/');
    }
    async _analyzeSingleLine(line, analyzedLines) {
        const analyzedLine = new AnalyzedLine_js_1.default(line);
        if (!analyzedLine.error) {
            try {
                new url_1.URL(line.url);
            }
            catch (error) {
                analyzedLine.markInError('FORMAT_ERROR', error.message);
            }
        }
        if (!analyzedLine.error) {
            try {
                const response = await axios_1.default.get(line.url);
                if (!this._isValid(response)) {
                    analyzedLine.markInError('HTTP_ERROR', 'HTTP status is not 200(OK) or the response content type is not an image');
                }
            }
            catch (err) {
                analyzedLine.markInError('HTTP_ERROR', 'Unreachable HTTP resource');
            }
            finally {
                if (this.delay) {
                    await this._sleep(this.delay);
                }
            }
        }
        if (!analyzedLine.error) {
            analyzedLine.markInSuccess();
        }
        analyzedLines.push(analyzedLine);
        if (!analyzedLine.error) {
            Logger_js_1.logger.info(chalk_1.default.cyan(`${analyzedLine.index}.`) + ' ' + chalk_1.default.green(`${analyzedLine.raw}`));
        }
        else {
            Logger_js_1.logger.info(chalk_1.default.cyan(`${analyzedLine.index}.`) + ' ' + chalk_1.default.red(`${analyzedLine.raw}`) + ' ' + chalk_1.default.yellow(`[${analyzedLine.error}]`));
        }
    }
    async analyze(lines) {
        Logger_js_1.logger.info('--------------------------------------------------------------------------------');
        Logger_js_1.logger.info('Phase: "Analyzing"');
        Logger_js_1.logger.info(`  - lines: ${lines.length}`);
        Logger_js_1.logger.info(`  - bulk: ${this.bulk}`);
        Logger_js_1.logger.info(`  - delay: ${this.delay}`);
        Logger_js_1.logger.info();
        const hrStart = process.hrtime();
        const analyzedLines = [];
        let i = 0, nbLines = lines.length;
        while (i < nbLines) {
            const bulkLines = [];
            for (let j = 0; (i < nbLines) && (j < this.bulk); j++) {
                const line = lines[i++];
                bulkLines.push(this._analyzeSingleLine(line, analyzedLines));
            }
            await Promise.all(bulkLines);
        }
        Logger_js_1.logger.info();
        const hrEnd = process.hrtime(hrStart);
        Logger_js_1.logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
        Logger_js_1.logger.info();
        return analyzedLines;
    }
}
exports.default = Analyzer;
//# sourceMappingURL=Analyzer.js.map