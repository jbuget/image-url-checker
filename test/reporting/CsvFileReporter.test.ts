import CsvFileReporter from '../../lib/reporting/CsvFileReporter';
import AnalyzedLine from '../../lib/analyzing/AnalyzedLine';
import Line from '../../lib/parsing/Line';
import * as fs from 'fs';

describe('Constructor', () => {

  it('should set output', () => {
    // given
    const options = {output: `test_output.csv`};

    // when
    const reporter = new CsvFileReporter(options);

    // then
    expect(reporter.output).toBe('test_output.csv');
  });

  it('should set ";" as default separator', () => {
    // given
    const options = {};

    // when
    const reporter = new CsvFileReporter(options);

    // then
    expect(reporter.separator).toBe(';');
  });

  it('should use given separator', () => {
    // given
    const options = {separator: ','};

    // when
    const reporter = new CsvFileReporter(options);

    // then
    expect(reporter.separator).toBe(',');
  });
});

describe('#report', () => {

  it('should ', async () => {
    // given
    const output = `${__dirname}/test_output.csv`;
    const reporter = new CsvFileReporter({output});

    const line1 = new Line(1, 'ref_1;https://site.com/image-1', ';');
    const analyzedLine1 = new AnalyzedLine(line1);
    analyzedLine1.markInSuccess();

    const line2 = new Line(2, 'ref_2;https://site.com/image-2', ';');
    const analyzedLine2 = new AnalyzedLine(line2);
    analyzedLine2.markInError('FORMAT_ERROR', 'Not an URL');

    const line3 = new Line(3, 'ref_3;https://site.com/image-3', ';');
    const analyzedLine3 = new AnalyzedLine(line3);
    analyzedLine3.markInError('HTTP_ERROR', 'Not an image');

    const analyzedLines: AnalyzedLine[] = [analyzedLine1, analyzedLine2, analyzedLine3];

    // when
    await reporter.report(analyzedLines);

    // then
    const printedLines: string[] = fs.readFileSync(output).toString().split('\n');
    expect(printedLines.length).toBe(4);
    expect(printedLines[0]).toBe('ref_1;https://site.com/image-1;OK');
    expect(printedLines[1]).toBe('ref_2;https://site.com/image-2;KO;FORMAT_ERROR;Not an URL');
    expect(printedLines[2]).toBe('ref_3;https://site.com/image-3;KO;HTTP_ERROR;Not an image');
  });
});
