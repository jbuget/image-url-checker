import chalk from 'chalk';
import { OptionValues } from 'commander';
import pMap from 'p-map';
import Line from '../parsing/Line';
import AnalyzedLine from './AnalyzedLine';
import { HttpClient } from '../tools/HttpClient';
import { logger } from '../tools/Logger';
import UrlFormatCheck from '../plugins/core/UrlFormatCheck';
import StatusCodeCheck from '../plugins/core/StatusCodeCheck';
import ContentTypeCheck from '../plugins/images/ContentTypeCheck';

export default class Analyzer {
  private readonly _options: OptionValues;
  private readonly _httpClient: HttpClient;

  bulk: number;
  delay?: number;
  headers?: any;
  timeout: number;

  constructor(options: OptionValues, httpClient?: HttpClient) {
    this._options = options;
    this.bulk = parseInt(options.bulk) || 10;
    this.delay = options.delay;
    this.timeout = parseInt(options.timeout) || 1000;

    this._httpClient = httpClient || new HttpClient();
    if (options.timeout) {
      this._httpClient.timeout = options.timeout;
    }
    if (options.headers) {
      this.headers = options.headers.reduce((result: any, header: string) => {
        const separatorIndex = header.indexOf(':');
        const headerName = header.substr(0, separatorIndex).trim();
        const headerValue = header.substr(separatorIndex + 1, header.length - 1).trim();
        if (headerName && headerValue) {
          result[headerName] = headerValue;
        }
        return result;
      }, {});
      this._httpClient.headers = this.headers;
    }
  }

  _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async _analyzeSingleLine(line: Line, analyzedLines: AnalyzedLine[]): Promise<AnalyzedLine> {
    const analyzedLine: AnalyzedLine = new AnalyzedLine(line);

    await new UrlFormatCheck().check(line, analyzedLine);

    if (!analyzedLine.error) {
      try {
        const response = await this._httpClient.head(line.url);

        await new StatusCodeCheck().check(response, analyzedLine);
        await new ContentTypeCheck().check(response, analyzedLine);
      } catch (err: any) {
        analyzedLine.markInError('HTTP_ERROR', err.message);
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
    logger.info(`  - headers: ${this.headers}`);
    logger.info(`  - timeout: ${this.timeout}`);
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
