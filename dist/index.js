#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const Analyzer_js_1 = __importDefault(require("./analyzing/Analyzer.js"));
const Parser_js_1 = __importDefault(require("./parsing/Parser.js"));
const Reporter_js_1 = __importDefault(require("./reporting/Reporter.js"));
const Logger_js_1 = require("./tools/Logger.js");
const program = new commander_1.Command();
program.version('0.0.1');
program
    .argument('<file>', 'file to analyze')
    .option('-b --bulk <bulk>', 'number of concurrent line analysis in parallel')
    .option('-d --delay <delay>', 'delay between two HTTP call')
    .option('-f --from <from>', 'line from')
    .option('-o --output <output>', 'output file')
    .option('-s --separator <separator>', 'column separator')
    .option('-t --to <to>', 'line to');
program.parse(process.argv);
const options = program.opts();
async function main() {
    const file = program.args[0];
    Logger_js_1.logger.info('--------------------------------------------------------------------------------');
    Logger_js_1.logger.info('Options:');
    Logger_js_1.logger.info(`  - file: ${file}`);
    Logger_js_1.logger.info(`  - bulk: ${options.bulk}`);
    Logger_js_1.logger.info(`  - delay: ${options.delay}`);
    Logger_js_1.logger.info(`  - from: ${options.from}`);
    Logger_js_1.logger.info(`  - output: ${options.output}`);
    Logger_js_1.logger.info(`  - separator: ${options.separator}`);
    Logger_js_1.logger.info(`  - to: ${options.to}`);
    Logger_js_1.logger.info();
    const parser = new Parser_js_1.default(options);
    const lines = await parser.parse(file);
    const analyzer = new Analyzer_js_1.default(options);
    const analyzedLines = await analyzer.analyze(lines);
    const reporter = new Reporter_js_1.default(options);
    await reporter.report(analyzedLines);
    process.exit(0);
}
main();
//# sourceMappingURL=index.js.map