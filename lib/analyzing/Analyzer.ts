import chalk from 'chalk';
import { OptionValues } from 'commander';
import pMap from 'p-map';
import { URL } from 'url';
import Line from '../parsing/Line';
import AnalyzedLine from './AnalyzedLine';
import { HttpClient, HttpResponse } from '../tools/HttpClient';
import { logger } from '../tools/Logger';

export default class Analyzer {
  private readonly _options: OptionValues;
  private readonly _httpClient: HttpClient;

  bulk: number;
  delay?: number;

  constructor(options: OptionValues, httpClient?: HttpClient) {
    this._options = options;
    this._httpClient = httpClient || new HttpClient();
    this.bulk = parseInt(options.bulk) || 10;
    this.delay = options.delay;
  }

  _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  _isValid(response: HttpResponse): boolean {
    return this._isStatusOk(response) && this._isAnImage(response);
  }

  _isStatusOk(response: HttpResponse): boolean {
    return response.statusCode === 200;
  }

  _isAnImage(response: HttpResponse): boolean {
    return response.headers['content-type'].trim().toLowerCase().startsWith('image/');
  }

  async _analyzeSingleLine(line: Line, analyzedLines: AnalyzedLine[]): Promise<AnalyzedLine> {
    const analyzedLine = new AnalyzedLine(line);

    if (!analyzedLine.error) {
      try {
        new URL(line.url);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        analyzedLine.markInError('FORMAT_ERROR', error.message);
      }
    }

    if (!analyzedLine.error) {
      try {
        const response = await this._httpClient.head(line.url);

        if (!this._isValid(response)) {
          analyzedLine.markInError(
            'HTTP_ERROR',
            'HTTP status is not 200(OK) or the response content type is not an image'
          );
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
      logger.info(
        chalk.cyan(`${analyzedLine.index}.`) +
          ' ' +
          chalk.red(`${analyzedLine.raw}`) +
          ' ' +
          chalk.yellow(`[${analyzedLine.error}]`)
      );
    }

    return analyzedLine;
  }

  async analyze(lines: Line[]): Promise<AnalyzedLine[]> {
    logger.info('--------------------------------------------------------------------------------');
    logger.info('Phase: "Analyzing"');
    logger.info(`  - lines: ${lines.length}`);
    logger.info(`  - bulk: ${this.bulk}`);
    logger.info(`  - delay: ${this.delay}`);
    logger.info();

    const hrStart: [number, number] = process.hrtime();

    const analyzedLines: AnalyzedLine[] = [];

    await pMap(lines, (line) => this._analyzeSingleLine(line, analyzedLines), { concurrency: this.bulk });

    logger.info();
    const hrEnd: [number, number] = process.hrtime(hrStart);
    logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
    logger.info();

    return analyzedLines;
  }
}
