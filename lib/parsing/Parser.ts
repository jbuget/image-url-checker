import { OptionValues } from 'commander';
import { PathLike } from 'fs';
import Line from './Line';
import { logger } from '../tools/Logger';

export default interface Parser {
  parse(file: string): Promise<Line[]>;
}

export abstract class AbstractParser implements Parser {
  protected readonly _options: OptionValues;

  separator: string;
  from?: number;
  to?: number;

  protected constructor(options: OptionValues) {
    this._options = options;
    this.separator = options.separator ? options.separator : ';';
    this.from = options.from;
    this.to = options.to;
  }

  protected abstract extractLines(file: PathLike): Promise<Line[]>;

  async parse(file: PathLike): Promise<Line[]> {
    logger.info('--------------------------------------------------------------------------------');
    logger.info('Phase: "Parsing"');
    logger.info(` - file: ${file}`);
    logger.info(` - from: ${this.from}`);
    logger.info(` - separator: ${this.separator}`);
    logger.info(` - to: ${this.to}`);
    logger.info();

    const hrStart: [number, number] = process.hrtime();

    const lines = await this.extractLines(file);

    logger.info();
    const hrEnd: [number, number] = process.hrtime(hrStart);
    logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
    logger.info();

    return lines;
  }
}
