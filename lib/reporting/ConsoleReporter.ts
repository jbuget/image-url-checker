import AnalyzedLine from '../analyzing/AnalyzedLine';
import {AbstractReporter} from './Reporter';
import {OptionValues} from 'commander';
import {logger} from '../tools/Logger';

export default class ConsoleReporter extends AbstractReporter {

  constructor(options: OptionValues) {
    super(options);
  }

  protected writeOutputLines(analyzedLines: AnalyzedLine[]): Promise<void> {
    return new Promise((resolve) => {
      analyzedLines.forEach((line) => {
        logger.info(`${line.reference};${line.url};${line.status};${line.error || ''};${line.comments[0] || ''}`);
      });
      logger.info();
      resolve();
    });
  }
}
