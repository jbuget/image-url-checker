import axios, {AxiosResponse} from 'axios';
import {OptionValues} from 'commander';
import Line from './Line.js';
import Report from './Report.js';
import Parser from './Parser.js';

export default class Analyzer {

  file: string;
  options: OptionValues;

  constructor(file: string, options: OptionValues) {
    this.file = file;
    this.options = options;
  }

  _isValid(response: AxiosResponse): boolean {
    return this._isStatusOk(response) && this._isAnImage(response);
  }

  _isStatusOk(response: AxiosResponse): boolean {
    return response.status === 200;
  }

  _isAnImage(response: AxiosResponse): boolean {
    return response.headers['content-type'].trim().toLowerCase().startsWith('image/');
  }

  async analyze(): Promise<Report> {
    const report = new Report();

    console.log('1) Parse file');
    const parser = new Parser(this.file, this.options.delimiter);
    const lines: Line[] = await parser.parse();
    console.log('');

    console.log('2) Test URLs');
    for (const line of lines) {
      if (!line.error) {
        process.stdout.write(`  ${line.index}. ${line.reference} - ${line.url} `);
        const response = await axios.get(line.url);
        if (this._isValid(response)) {
          process.stdout.write('✅\n');
        } else {
          line.markInError('HTTP_ERROR', 'HTTP status is not 200(OK) or the response content type is not an image');
          process.stdout.write('⚠️️\n');
        }
      }
    }
    console.log('');

    report.consignLines(lines);
    report.finalize();

    console.log('3) Print report');
    report.print();
    console.log('');
    return report;
  }
}
