import { Command } from 'commander';
import AnalyzedLine from './analyzing/AnalyzedLine';
import Analyzer from './analyzing/Analyzer';
import CsvFileParser from './parsing/CsvFileParser';
import Line from './parsing/Line';
import CsvFileReporter from './reporting/CsvFileReporter';
import { logger } from './tools/Logger';
import { LIB_VERSION } from './version';
import ConsoleReporter from './reporting/ConsoleReporter';

export default class Program {
  private readonly _version: string;
  private readonly _command: Command;

  constructor() {
    this._version = LIB_VERSION;
    this._command = new Command();
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

  async run(argv: string[]): Promise<void> {
    this._command.parse(argv);

    const options = this._command.opts();

    logger.info('--------------------------------------------------------------------------------');
    logger.info(`Version: ${this._version}`);
    logger.info('Options:');
    logger.info(`  - input: ${options.input}`);
    logger.info(`  - bulk: ${options.bulk}`);
    logger.info(`  - delay: ${options.delay}`);
    logger.info(`  - from: ${options.from}`);
    logger.info(`  - headers: ${options.headers}`);
    logger.info(`  - output: ${options.output}`);
    logger.info(`  - separator: ${options.separator}`);
    logger.info(`  - to: ${options.to}`);
    logger.info();

    const parser = new CsvFileParser(options);
    const lines: Line[] = await parser.parse();

    const analyzer = new Analyzer(options);
    const analyzedLines: AnalyzedLine[] = await analyzer.analyze(lines);

    const reporter = options.output ? new CsvFileReporter(options) : new ConsoleReporter(options);
    await reporter.report(analyzedLines);
  }
}
