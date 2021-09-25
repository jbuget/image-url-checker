import {createReadStream} from 'fs';
import readline from 'readline';
import {URL} from 'url';
import Line from './Line.js';

export default class Parser {

  file: string;
  delimiter: string;

  constructor(file: string, delimiter: string = ';') {
    this.file = file;
    this.delimiter = delimiter;
  }

  parse(): Promise<Line[]> {
    return new Promise<Line[]>((resolve, reject) => {
      let index: number = 1;
      const lines: Line[] = [];

      const rl = readline.createInterface({
        input: createReadStream(this.file),
      });

      rl.on('line', (rawLine) => {
        let reference: string, url: string;
        [reference, url] = rawLine.split(this.delimiter);
        const line = new Line(index++, rawLine, reference, url);

        try {
          new URL(url);
        } catch (error: any) {
          line.markInError('PARSING_ERROR', error.input);
        }

        lines.push(line);
        process.stdout.write(`  ${line.index}. ${line.reference} - ${line.url} `);
        if (!line.error) {
          process.stdout.write('✅\n');
        } else {
          process.stdout.write('⚠️️\n');
        }
      });

      rl.on('close', () => {
        resolve(lines);
      })
    })
  }
}
