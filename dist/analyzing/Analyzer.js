"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const p_map_1 = __importDefault(require("p-map"));
const url_1 = require("url");
const AnalyzedLine_1 = __importDefault(require("./AnalyzedLine"));
const Logger_1 = require("../tools/Logger");
class Analyzer {
    constructor(options) {
        this._options = options;
        this.bulk = parseInt(options.bulk) || 10;
        this.delay = options.delay;
    }
    _sleep(ms) {
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
        const analyzedLine = new AnalyzedLine_1.default(line);
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
                const response = await axios_1.default.head(line.url);
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
            Logger_1.logger.info(chalk_1.default.cyan(`${analyzedLine.index}.`) + ' ' + chalk_1.default.green(`${analyzedLine.raw}`));
        }
        else {
            Logger_1.logger.info(chalk_1.default.cyan(`${analyzedLine.index}.`) + ' ' + chalk_1.default.red(`${analyzedLine.raw}`) + ' ' + chalk_1.default.yellow(`[${analyzedLine.error}]`));
        }
        return analyzedLine;
    }
    async analyze(lines) {
        Logger_1.logger.info('--------------------------------------------------------------------------------');
        Logger_1.logger.info('Phase: "Analyzing"');
        Logger_1.logger.info(`  - lines: ${lines.length}`);
        Logger_1.logger.info(`  - bulk: ${this.bulk}`);
        Logger_1.logger.info(`  - delay: ${this.delay}`);
        Logger_1.logger.info();
        const hrStart = process.hrtime();
        const analyzedLines = [];
        await (0, p_map_1.default)(lines, (line) => this._analyzeSingleLine(line, analyzedLines), { concurrency: this.bulk });
        Logger_1.logger.info();
        const hrEnd = process.hrtime(hrStart);
        Logger_1.logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
        Logger_1.logger.info();
        return analyzedLines;
    }
}
exports.default = Analyzer;
