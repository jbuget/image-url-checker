import axios, {AxiosResponse} from 'axios';
import {URL} from 'url';
import Line from './Line.js';
import AnalyzedLine from './AnalyzedLine.js';
import {OptionValues} from 'commander';

export default class Analyzer {

  private _options: OptionValues;

  constructor(options: OptionValues) {
    this._options = options;
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

  async analyze(lines: Line[]): Promise<AnalyzedLine[]> {
    console.log('--------------------------------------------------------------------------------');
    console.log('Phase: "Analyzing"');
    console.log(`  - lines: ${lines.length}`);
    console.log();

    const hrStart: [number, number] = process.hrtime();

    const analyzedLines: AnalyzedLine[] = [];

    for (const line of lines) {
      process.stdout.write(`  ${line.raw}... `);

      const analyzedLine = new AnalyzedLine(line);

      try {
        new URL(line.url);
      } catch (error: any) {
        analyzedLine.markInError('FORMAT_ERROR', error.input);
        process.stdout.write('⚠️️ [FORMAT_ERROR]\n');
      }

      if (!analyzedLine.error) {
        const response = await axios.get(line.url);
        if (this._isValid(response)) {
          process.stdout.write('✅\n');
        } else {
          analyzedLine.markInError('HTTP_ERROR', 'HTTP status is not 200(OK) or the response content type is not an image');
          process.stdout.write('⚠️️ [HTTP_ERROR]\n');
        }
      }

      if (!analyzedLine.error) {
        analyzedLine.markInSuccess();
      }

      analyzedLines.push(analyzedLine);
    }

    console.log();
    const hrEnd: [number, number] = process.hrtime(hrStart);
    console.log('Execution time (hr): %ds %dms', hrEnd[0], hrEnd[1] / 1000000);
    console.log();

    return analyzedLines;
  }
}
