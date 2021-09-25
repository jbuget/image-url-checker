import { Logger as TSLogger } from 'tslog';

export default class Logger {

  private readonly _logger: TSLogger;

  constructor() {
    this._logger = new TSLogger({
      displayFilePath: 'hidden',
      displayFunctionName: false,
    });
  }

  info(...args: any[]) {
    this._logger.info(...args);
  }

  error(...args: any[]) {
    this._logger.error(...args);
  }
}

const logger = new Logger();

export { logger };
