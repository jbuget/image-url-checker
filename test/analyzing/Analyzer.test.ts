import axios from 'axios';
import {OptionValues} from 'commander';
import Analyzer from '../../lib/analyzing/Analyzer';
import Line from '../../lib/parsing/Line';
import AnalyzedLine from '../../lib/analyzing/AnalyzedLine';
import {logger} from '../../lib/tools/Logger';

jest.mock('axios');
jest.mock('../../lib/tools/Logger');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedLogger = logger as jest.Mocked<typeof logger>;

describe('#constructor', () => {

  test('Default bulk value should be 10', () => {
    // given
    const options: OptionValues = {};

    // when
    const analyzer = new Analyzer(options);

    // then
    expect(analyzer.bulk).toBe(10);
  });
})

describe('#_analyzeSingleLine', () => {

  let analyzer: Analyzer;
  let analyzedLines: AnalyzedLine[];

  beforeEach(() => {
    analyzer = new Analyzer({});
    analyzedLines = [];
  });

  describe('when given line is valid', () => {

    let line: Line;

    beforeEach(() => {
      line = new Line(1, 'rec123;http://url.com/image.jpeg', ';');

      mockedAxios.head.mockResolvedValue({
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {'content-type': 'image/jpeg'},
        config: {}
      });
    });

    test('should set status to "OK"', async () => {
      // when
      const actual: AnalyzedLine = await analyzer._analyzeSingleLine(line, analyzedLines);

      // then
      expect(actual.status).toBe('OK');
    });

    test('should add given line to given analyzed lines array', async () => {
      // given
      const initialAnalyzedLinesCount = analyzedLines.length;

      // when
      await analyzer._analyzeSingleLine(line, analyzedLines);

      // then
      expect(analyzedLines.length).toBe(initialAnalyzedLinesCount + 1);
    });

    test('should log as success', async () => {
      // when
      await analyzer._analyzeSingleLine(line, analyzedLines);

      // then
      expect(mockedLogger.info).toHaveBeenCalled();
    });
  });

  describe('when given line is invalid', () => {

    test('should add given line to given analyzed lines array', async () => {
      // given
      const initialAnalyzedLinesCount = analyzedLines.length;
      const line = new Line(1, 'rec123;http://bad-url', ';');

      // when
      await analyzer._analyzeSingleLine(line, analyzedLines);

      // then
      expect(analyzedLines.length).toBe(initialAnalyzedLinesCount + 1);
    });

    test('should mark line in error when URL is badly formed', async () => {
      // given
      const line = new Line(1, 'rec123;bad-url', ';');

      // when
      const actual: AnalyzedLine = await analyzer._analyzeSingleLine(line, analyzedLines);

      // then
      expect(actual.status).toBe('KO');
      expect(actual.error).toBe('FORMAT_ERROR');
    });

    test('should mark line in error when resource is not accessible', async () => {
      // given
      const line = new Line(1, 'rec123;http://not.found/image.jpeg', ';');
      mockedAxios.head.mockResolvedValue({
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: {'content-length': 0},
        config: {}
      });

      // when
      const actual: AnalyzedLine = await analyzer._analyzeSingleLine(line, analyzedLines);

      // then
      expect(actual.status).toBe('KO');
      expect(actual.error).toBe('HTTP_ERROR');
    });

    test('should mark line in error when resource is not an image', async () => {
      // given
      const line = new Line(1, 'rec123;http://bad-url', ';');

      // when
      const actual: AnalyzedLine = await analyzer._analyzeSingleLine(line, analyzedLines);

      // then
      expect(actual.status).toBe('KO');
      expect(actual.error).toBe('HTTP_ERROR');
    });

    test('should mark line in error when HTTP request fails', async () => {
      // given
      const line = new Line(1, 'rec123;http://request.failed/image.jpeg', ';');
      mockedAxios.head.mockRejectedValue(new Error());

      // when
      const actual: AnalyzedLine = await analyzer._analyzeSingleLine(line, analyzedLines);

      // then
      expect(actual.status).toBe('KO');
      expect(actual.error).toBe('HTTP_ERROR');
    });
  });
});

describe('#analyze', () => {

  test('should set status to "OK"', async () => {
    // given
    const analyzer = new Analyzer({});
    const lines: Line[] = [
      new Line(1, 'rec1;http://image.url/1', ';'),
      new Line(2, 'rec2;http://image.url/2', ';'),
      new Line(3, 'rec3;http://image.url/3', ';'),
    ]
    mockedAxios.head.mockResolvedValue({
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {'content-type': 'image/jpeg'},
      config: {}
    });

    // when
    const actual: AnalyzedLine[] = await analyzer.analyze(lines);

    // then
    expect(actual.length).toBe(3);
  });
});
