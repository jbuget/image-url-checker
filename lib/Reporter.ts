import {createWriteStream} from 'fs';
import AnalyzedLine from './AnalyzedLine.js';
import {OptionValues} from 'commander';
import Line from './Line';

export default class Reporter {

  output?: string;
  private _options: OptionValues;

  constructor(options: OptionValues) {
    this._options = options;
    this.output = options.output;
  }

  async report(analyzedLines: AnalyzedLine[]) {
    return new Promise<Line[]>((resolve, reject) => {
      console.log('--------------------------------------------------------------------------------');
      console.log('Phase: "Reporting"');
      console.log(`  - analyzed lines: ${analyzedLines.length}`);
      console.log();

      const hrStart: [number, number] = process.hrtime();

      // TODO
      if (this.output) {
        const outputStream = createWriteStream(this.output, {flags: 'w'});
        analyzedLines.forEach((line) => {
          outputStream.write(`${line.reference};${line.url};${line.status}`);
          if (line.error) {
            outputStream.write(`;${line.error};`);
            line.comments.forEach((comment) => outputStream.write(`•${comment}`));
          }
          outputStream.write('\n');
        });
        outputStream.end();
        outputStream.on('finish', () => resolve);
      }

      console.log();
      const hrEnd: [number, number] = process.hrtime(hrStart);
      console.log('Execution time (hr): %ds %dms', hrEnd[0], hrEnd[1] / 1000000);
      console.log();
    });
  }
}
