import axios from 'axios';
import { OptionValues } from 'commander';
import Analyzer from '../../lib/analyzing/Analyzer';
import Line from '../../lib/parsing/Line';
import AnalyzedLine from '../../lib/analyzing/AnalyzedLine';
import { logger } from '../../lib/tools/Logger';
import { HttpClient, HttpResponse } from '../../lib/tools/HttpClient';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

class TestingHttpClient extends HttpClient {

  private readonly _mockedHead;

  constructor(mockedHead: jest.Mock) {
    super();
    this._mockedHead = mockedHead;
  }

  async head(url: string): Promise<HttpResponse> {
    const response = await this._mockedHead();
    return new HttpResponse(response);
  }

}

jest.mock('../../lib/tools/Logger');

const mockedLogger = logger as jest.Mocked<typeof logger>;

const mockedHead = jest.fn();
const mockedHttpClient = new TestingHttpClient(mockedHead);

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
    analyzer = new Analyzer({}, mockedHttpClient);
    analyzedLines = [];
  });

  describe('when given line is valid', () => {

    let line: Line;

    beforeEach(() => {
      line = new Line(1, 'rec123;http://url.com/image.jpeg', ';');

      mockedHead.mockResolvedValue({
        status: 200,
        headers: {'content-type': 'image/jpeg'},
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
      mockedHead.mockResolvedValue({
        status: 404,
        headers: {'content-length': 0},
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
      mockedHead.mockRejectedValue(new Error());

      // when
      const actual: AnalyzedLine = await analyzer._analyzeSingleLine(line, analyzedLines);

      // then
      expect(actual.status).toBe('KO');
      expect(actual.error).toBe('HTTP_ERROR');
    });
  });

  describe('when headers are defined', () => {

    it('should make an HTTP request with given headers', async () => {
      // given
      const headers = {'Authorization': 'bearer some.jwt.token'};
      analyzer = new Analyzer({headers});
      const line = new Line(1, 'rec_1;http://image.url', ';');

      // when
      await analyzer._analyzeSingleLine(line, analyzedLines);

      // then
      expect(mockedAxios.head).toHaveBeenCalledWith('http://image.url', {headers});
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
    mockedHead.mockResolvedValue({
      status: 200,
      headers: {'content-type': 'image/jpeg'},
    });

    // when
    const actual: AnalyzedLine[] = await analyzer.analyze(lines);

    // then
    expect(actual.length).toBe(3);
  });
});

