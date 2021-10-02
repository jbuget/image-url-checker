import Line from './Line';
import {OptionValues} from 'commander';

export default interface Parser {

  parse(file: string): Promise<Line[]>;
}

export abstract class AbstractParser implements Parser {

  protected readonly _options: OptionValues;

  protected constructor(options: OptionValues) {
    this._options = options;
  }

  abstract parse(file: string): Promise<Line[]>;
}
