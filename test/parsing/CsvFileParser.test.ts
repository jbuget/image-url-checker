import Line from '../../lib/parsing/Line';
import CsvFileParser from '../../lib/parsing/CsvFileParser';

describe('Constructor', () => {

  it('should set ";" as default separator', () => {
    // given
    const options = {};

    // when
    const parser = new CsvFileParser(options);

    // then
    expect(parser.separator).toBe(';');
  });

  it('should use given separator', () => {
    // given
    const options = {separator: '/'};

    // when
    const parser = new CsvFileParser(options);

    // then
    expect(parser.separator).toBe('/');
  });
});

describe('#parse', () => {

  it('should return as many Line objects as file lines', async () => {
    // given
    const parser = new CsvFileParser({ input: `${__dirname}/test_simple.csv.fixture` });

    // when
    const lines: Line[] = await parser.parse();

    // then
    expect(lines.length).toBe(5);
  });

  it('should ignore blank or empty lines', async () => {
    // given
    const parser = new CsvFileParser({ input: `${__dirname}/test_blank_or_empty_lines.csv.fixture` });

    // when
    const lines: Line[] = await parser.parse();

    // then
    expect(lines.length).toBe(3);
  });

  it('should take into account "--from" option', async () => {
    // given
    const parser = new CsvFileParser({from: 2, input: `${__dirname}/test_simple.csv.fixture`});

    // when
    const lines: Line[] = await parser.parse();

    // then
    expect(lines.length).toBe(4);
  });

  it('should take into account "--to" option', async () => {
    // given
    const parser = new CsvFileParser({from: 3, input: `${__dirname}/test_simple.csv.fixture`});

    // when
    const lines: Line[] = await parser.parse();

    // then
    expect(lines.length).toBe(3);
  });

  it('should support "--from" and "--to" options simultaneously', async () => {
    // given
    const parser = new CsvFileParser({from: 3, to: 4, input: `${__dirname}/test_simple.csv.fixture`});

    // when
    const lines: Line[] = await parser.parse();

    // then
    expect(lines.length).toBe(2);
  });
});
