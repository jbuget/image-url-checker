import Program from '../lib/Program';
import Line from '../lib/parsing/Line';
import AnalyzedLine from '../lib/analyzing/AnalyzedLine';

const fakeParse = jest.fn();
jest.mock('../lib/parsing/CsvFileParser', () => {
  return jest.fn().mockImplementation(() => {
    return {parse: fakeParse};
  });
});
const fakeAnalyze = jest.fn();
jest.mock('../lib/analyzing/Analyzer', () => {
  return jest.fn().mockImplementation(() => {
    return {analyze: fakeAnalyze};
  });
});
const fakeReport = jest.fn();
jest.mock('../lib/reporting/ConsoleReporter', () => {
  return jest.fn().mockImplementation(() => {
    return {report: fakeReport};
  });
});

describe('#run', () => {

  it('should orchestrate parsing → analyzing → reporting phases', async () => {
    // given
    const program = new Program();
    const argv = ['/usr/local/bin/node', 'image-url-checker', '-i', 'test.file', '-c', 'test.config.json'];

    const line1 = new Line(1, 'rec_1', 'http://1.link.url');
    const line2 = new Line(2, 'rec_2', 'http://2.link.url');
    const line3 = new Line(3, 'rec_3', 'http://3.link.url');

    const parsedLines: Line[] = [line1, line2, line3];
    fakeParse.mockResolvedValueOnce(parsedLines);

    const aLine1 = new AnalyzedLine(line1);
    const aLine2 = new AnalyzedLine(line2);
    const aLine3 = new AnalyzedLine(line3);

    const analyzedLines: AnalyzedLine[] = [aLine1, aLine2, aLine3];
    fakeAnalyze.mockResolvedValueOnce(analyzedLines);

    // when
    await program.run(argv);

    // then
    expect(fakeParse).toHaveBeenCalled();
    expect(fakeAnalyze).toHaveBeenCalledWith(parsedLines);
    expect(fakeReport).toHaveBeenCalledWith(analyzedLines);
  });
});
