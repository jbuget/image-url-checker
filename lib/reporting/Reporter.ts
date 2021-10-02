import { OptionValues } from 'commander';
import AnalyzedLine from '../analyzing/AnalyzedLine';
import { logger } from '../tools/Logger';

export default interface Reporter {
  report(analyzedLines: AnalyzedLine[]): Promise<void>;
}

export abstract class AbstractReporter implements Reporter {
  protected readonly _options: OptionValues;

  protected constructor(options: OptionValues) {
    this._options = options;
  }

  protected abstract writeOutputLines(analyzedLines: AnalyzedLine[]): Promise<void>;

  async report(analyzedLines: AnalyzedLine[]): Promise<void> {
    logger.info('--------------------------------------------------------------------------------');
    logger.info('Phase: "Reporting"');
    logger.info(`  - analyzed lines: ${analyzedLines.length}`);
    logger.info();

    const hrStart: [number, number] = process.hrtime();

    analyzedLines.sort((a, b) => a.index - b.index);

    await this.writeOutputLines(analyzedLines);

    const hrEnd: [number, number] = process.hrtime(hrStart);
    logger.info(`Execution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`);
    logger.info();
  }
}
