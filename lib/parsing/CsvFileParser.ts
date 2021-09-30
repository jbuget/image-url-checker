import {AbstractParser} from './Parser';
import {OptionValues} from 'commander';
import Line from './Line';
import {logger} from '../tools/Logger';
import readline from 'readline';
import {createReadStream} from 'fs';
import chalk from 'chalk';

export default class CsvFileParser extends AbstractParser {

  separator: string;
  from?: number;
  to?: number;

  constructor(options: OptionValues) {
    super(options);
    this.separator = options.separator ? options.separator : ';';
    this.from = options.from;
    this.to = options.to;
  }

  parse(file: string): Promise<Line[]> {
    return new Promise<Line[]>((resolve, reject) => {
      logger.info('--------------------------------------------------------------------------------');
      logger.info('Phase: "Parsing"');
      logger.info(` - file: ${file}`);
      logger.info(` - from: ${this.from}`);
      logger.info(` - separator: ${this.separator}`);
      logger.info(` - to: ${this.to}`);
      logger.info();

      const hrStart: [number, number] = process.hrtime();

      let index = 1;
      const lines: Line[] = [];

      const rl = readline.createInterface({
        input: createReadStream(file),
      });

      rl.on('line', (rawLine) => {
        const trimmedLine = rawLine.trim();

        let mustAddLine = true;

        mustAddLine = (trimmedLine !== '');
        if (this.from && index < this.from) mustAddLine = mustAddLine && false;
        if (this.to && index > this.to) mustAddLine = mustAddLine && false;

        if (mustAddLine) {
          logger.info(`${chalk.cyan(index)}. ${trimmedLine}`);
          const line = new Line(index, trimmedLine, this.separator);
          lines.push(line);
        } else {
          logger.info(`${chalk.gray(index + '. ' + trimmedLine)}`);
        }

        index++;
      });

      rl.on('close', () => {
        logger.info();
        const hrEnd: [number, number] = process.hrtime(hrStart);
        logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
        logger.info();

        resolve(lines);
      });
    });
  }
}
