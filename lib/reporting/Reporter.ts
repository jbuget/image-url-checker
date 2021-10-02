import {OptionValues} from 'commander';
import AnalyzedLine from '../analyzing/AnalyzedLine';

export default interface Reporter {

  report(analyzedLines: AnalyzedLine[]): Promise<void>;
}

export abstract class AbstractReporter implements Reporter {

  protected readonly _options: OptionValues;

  protected constructor(options: OptionValues) {
    this._options = options;
  }

  abstract report(analyzedLines: AnalyzedLine[]): Promise<void>;
}
