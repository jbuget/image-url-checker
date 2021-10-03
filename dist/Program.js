"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const Analyzer_1 = __importDefault(require("./analyzing/Analyzer"));
const CsvFileParser_1 = __importDefault(require("./parsing/CsvFileParser"));
const CsvFileReporter_1 = __importDefault(require("./reporting/CsvFileReporter"));
const Logger_1 = require("./tools/Logger");
const version_1 = require("./version");
const ConsoleReporter_1 = __importDefault(require("./reporting/ConsoleReporter"));
class Program {
    constructor() {
        this._version = version_1.LIB_VERSION;
        this._command = new commander_1.Command();
        this._command.version(this._version);
        this._command
            .option('-b, --bulk <bulk>', 'number of concurrent line analysis in parallel')
            .option('-d, --delay <delay>', 'delay between two HTTP call')
            .option('-f, --from <from>', 'line from')
            .option('-H, --headers <headers...>', 'specify HTTP request headers, ex: -H header:1 -H header:2 -H ...')
            .requiredOption('-i, --input <input>', 'input file data to analyze')
            .option('-o, --output <output>', 'output file report to generate')
            .option('-s, --separator <separator>', 'input file data column separator')
            .option('-t, --to <to>', 'line to');
    }
    async run(argv) {
        this._command.parse(argv);
        const options = this._command.opts();
        Logger_1.logger.info('--------------------------------------------------------------------------------');
        Logger_1.logger.info(`Version: ${this._version}`);
        Logger_1.logger.info('Options:');
        Logger_1.logger.info(`  - input: ${options.input}`);
        Logger_1.logger.info(`  - bulk: ${options.bulk}`);
        Logger_1.logger.info(`  - delay: ${options.delay}`);
        Logger_1.logger.info(`  - from: ${options.from}`);
        Logger_1.logger.info(`  - headers: ${options.headers}`);
        Logger_1.logger.info(`  - output: ${options.output}`);
        Logger_1.logger.info(`  - separator: ${options.separator}`);
        Logger_1.logger.info(`  - to: ${options.to}`);
        Logger_1.logger.info();
        const parser = new CsvFileParser_1.default(options);
        const lines = await parser.parse();
        const analyzer = new Analyzer_1.default(options);
        const analyzedLines = await analyzer.analyze(lines);
        const reporter = options.output ? new CsvFileReporter_1.default(options) : new ConsoleReporter_1.default(options);
        await reporter.report(analyzedLines);
    }
}
exports.default = Program;
//# sourceMappingURL=Program.js.map