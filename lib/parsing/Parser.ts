import {createReadStream} from 'fs';
import readline from 'readline';
import {OptionValues} from 'commander';
import Line from './Line.js';

export default class Parser {

  separator: string;
  private _options: OptionValues;

  constructor(options: OptionValues) {
    this._options= options;
    this.separator = options.separator ? options.separator : ';';
  }

  parse(file: string): Promise<Line[]> {
    return new Promise<Line[]>((resolve, reject) => {
      console.log('--------------------------------------------------------------------------------');
      console.log('Phase: "Parsing"');
      console.log(` - file: ${file}`);
      console.log(` - separator: ${this.separator}`);
      console.log();

      const hrStart: [number, number] = process.hrtime();

      let index: number = 1;
      const lines: Line[] = [];

      const rl = readline.createInterface({
        input: createReadStream(file),
      });

      rl.on('line', (rawLine) => {
        console.log(`  ${rawLine} ✓`);
        let reference: string, url: string;
        [reference, url] = rawLine.split(this.separator);
        const line = new Line(index++, rawLine, reference, url);
        lines.push(line);
      });

      rl.on('close', () => {
        console.log();
        const hrEnd: [number, number] = process.hrtime(hrStart);
        console.log('Execution time (hr): %ds %dms', hrEnd[0], hrEnd[1] / 1000000);
        console.log();

        resolve(lines);
      });
    })
  }
}
