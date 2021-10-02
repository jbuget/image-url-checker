import {Command} from 'commander';
import AnalyzedLine from './analyzing/AnalyzedLine';
import Analyzer from './analyzing/Analyzer';
import CsvFileParser from './parsing/CsvFileParser';
import Line from './parsing/Line';
import CsvFileReporter from './reporting/CsvFileReporter';
import {logger} from './tools/Logger';
import {LIB_VERSION} from './version';

export default class Program {

  private readonly _version: string;
  private readonly _command: Command;

  constructor() {
    this._version = LIB_VERSION;
    this._command = new Command();
    this._command.version(this._version);
    this._command
      .argument('<file>', 'file to analyze')
      .option('-b --bulk <bulk>', 'number of concurrent line analysis in parallel')
      .option('-d --delay <delay>', 'delay between two HTTP call')
      .option('-f --from <from>', 'line from')
      .option('-o --output <output>', 'output file')
      .option('-s --separator <separator>', 'column separator')
      .option('-t --to <to>', 'line to')
    ;
  }

  async run(argv: string[]): Promise<void> {
    this._command.parse(argv);

    const options = this._command.opts();

    const file = this._command.args[0];

    logger.info('--------------------------------------------------------------------------------');
    logger.info(`Version: ${this._version}`);
    logger.info('Options:');
    logger.info(`  - file: ${file}`);
    logger.info(`  - bulk: ${options.bulk}`);
    logger.info(`  - delay: ${options.delay}`);
    logger.info(`  - from: ${options.from}`);
    logger.info(`  - headers: ${options.headers}`);
    logger.info(`  - output: ${options.output}`);
    logger.info(`  - separator: ${options.separator}`);
    logger.info(`  - to: ${options.to}`);
    logger.info();

    const parser = new CsvFileParser(options);
    const lines: Line[] = await parser.parse(file);

    const analyzer = new Analyzer(options);
    const analyzedLines: AnalyzedLine[] = await analyzer.analyze(lines);

    const reporter = new CsvFileReporter(options);
    await reporter.report(analyzedLines);
  }
}
