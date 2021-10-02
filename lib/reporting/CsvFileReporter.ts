import { strict as assert } from 'assert';
import { OptionValues } from 'commander';
import { createWriteStream, PathLike } from 'fs';
import AnalyzedLine from '../analyzing/AnalyzedLine';
import { AbstractReporter } from './Reporter';

export default class CsvFileReporter extends AbstractReporter {
  output?: PathLike;

  constructor(options: OptionValues) {
    super(options);
    this.output = options.output_file;
  }

  writeOutputLines(analyzedLines: AnalyzedLine[]): Promise<void> {
    return new Promise((resolve) => {
      assert(!!this.output, 'Options "output" must be specified');
      const outputStream = createWriteStream(this.output, { flags: 'w' });

      outputStream.on('finish', resolve);

      analyzedLines.forEach((line) => {
        outputStream.write(`${line.reference};${line.url};${line.status}`);
        if (line.error) {
          outputStream.write(`;${line.error};`);
          line.comments.forEach((comment) => outputStream.write(`${comment}`));
        }
        outputStream.write('\n');
      });
      outputStream.end();
    });
  }
}
