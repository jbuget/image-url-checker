import axios, {AxiosResponse} from 'axios';
import chalk from 'chalk';
import {URL} from 'url';
import Line from '../parsing/Line.js';
import AnalyzedLine from './AnalyzedLine.js';
import {OptionValues} from 'commander';
import {logger} from '../tools/Logger.js';

export default class Analyzer {

  private readonly _options: OptionValues;

  delay?: number;

  constructor(options: OptionValues) {
    this._options = options;
    this.delay = options.delay;
  }

  async _sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
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
    logger.info('--------------------------------------------------------------------------------');
    logger.info('Phase: "Analyzing"');
    logger.info(`  - lines: ${lines.length}`);
    logger.info();

    const hrStart: [number, number] = process.hrtime();

    const analyzedLines: AnalyzedLine[] = [];

    for (const line of lines) {
      const analyzedLine = new AnalyzedLine(line);

      if (!analyzedLine.error) {
        try {
          new URL(line.url);
        } catch (error: any) {
          analyzedLine.markInError('FORMAT_ERROR', error.message);
        }
      }

      if (!analyzedLine.error) {
        try {
          const response = await axios.get(line.url);
          if (!this._isValid(response)) {
            analyzedLine.markInError('HTTP_ERROR', 'HTTP status is not 200(OK) or the response content type is not an image');
          }
        } catch (err) {
          analyzedLine.markInError('HTTP_ERROR', 'Unreachable HTTP resource');
        } finally {
          if (this.delay) {
            await this._sleep(this.delay);
          }
        }
      }

      if (!analyzedLine.error) {
        analyzedLine.markInSuccess();
      }

      analyzedLines.push(analyzedLine);

      if (!analyzedLine.error) {
        logger.info(chalk.cyan(`${analyzedLine.index}.`) + ' ' + chalk.green(`${analyzedLine.raw}`));
      } else {
        logger.info(chalk.cyan(`${analyzedLine.index}.`) + ' ' + chalk.red(`${analyzedLine.raw}`) + ' ' + chalk.yellow(`[${analyzedLine.error}]`));
      }

    }

    logger.info();
    const hrEnd: [number, number] = process.hrtime(hrStart);
    logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
    logger.info();

    return analyzedLines;
  }
}
