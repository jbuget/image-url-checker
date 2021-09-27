import {OptionValues} from 'commander';
import {createWriteStream} from 'fs';
import AnalyzedLine from '../analyzing/AnalyzedLine';
import { logger } from '../tools/Logger';

export default class Reporter {

  private readonly _options: OptionValues;

  output?: string;

  constructor(options: OptionValues) {
    this._options = options;
    this.output = options.output;
  }

  async report(analyzedLines: AnalyzedLine[]) {
    return new Promise((resolve, reject) => {
      logger.info('--------------------------------------------------------------------------------');
      logger.info('Phase: "Reporting"');
      logger.info(`  - analyzed lines: ${analyzedLines.length}`);
      logger.info();

      const hrStart: [number, number] = process.hrtime();

      analyzedLines.sort((a, b) => (a.index - b.index));

      if (this.output) {
        const outputStream = createWriteStream(this.output, {flags: 'w'});
        analyzedLines.forEach((line) => {
          outputStream.write(`${line.reference};${line.url};${line.status}`);
          if (line.error) {
            outputStream.write(`;${line.error};`);
            line.comments.forEach((comment) => outputStream.write(`${comment} `));
          }
          outputStream.write('\n');
        });
        outputStream.end();
        outputStream.on('finish', () => resolve);
      }

      const hrEnd: [number, number] = process.hrtime(hrStart);
      logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
      logger.info();
    });
  }
}
