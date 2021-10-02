import { AbstractParser } from './Parser';
import { OptionValues } from 'commander';
import Line from './Line';
import { logger } from '../tools/Logger';
import readline from 'readline';
import { createReadStream, PathLike } from 'fs';
import chalk from 'chalk';

export default class CsvFileParser extends AbstractParser {
  constructor(options: OptionValues) {
    super(options);
  }

  extractLines(file: PathLike): Promise<Line[]> {
    return new Promise<Line[]>((resolve) => {
      let index = 1;
      const lines: Line[] = [];

      const rl = readline.createInterface({
        input: createReadStream(file)
      });

      rl.on('line', (rawLine) => {
        const trimmedLine = rawLine.trim();

        let mustAddLine: boolean;

        mustAddLine = trimmedLine !== '';
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

      rl.on('close', () => resolve(lines));
    });
  }
}
