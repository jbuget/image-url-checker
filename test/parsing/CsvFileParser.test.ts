import Line from '../../lib/parsing/Line';
import CsvFileParser from '../../lib/parsing/CsvFileParser';

describe('Constructor', () => {

  test('should set ";" as default separator', () => {
    // given
    const options = {};

    // when
    const parser = new CsvFileParser(options);

    // then
    expect(parser.separator).toBe(';');
  });

  test('should use given separator', () => {
    // given
    const options = {separator: '/'};

    // when
    const parser = new CsvFileParser(options);

    // then
    expect(parser.separator).toBe('/');
  });
});

describe('#parse', () => {

  test('should return as many Line objects as file lines', async () => {
    // given
    const parser = new CsvFileParser({ input_file: `${__dirname}/test_simple.csv.fixture` });

    // when
    const lines: Line[] = await parser.parse();

    // then
    expect(lines.length).toBe(5);
  });

  test('should ignore blank or empty lines', async () => {
    // given
    const parser = new CsvFileParser({ input_file: `${__dirname}/test_blank_or_empty_lines.csv.fixture` });

    // when
    const lines: Line[] = await parser.parse();

    // then
    expect(lines.length).toBe(3);
  });

  test('should take into account "--from" option', async () => {
    // given
    const parser = new CsvFileParser({from: 2, input_file: `${__dirname}/test_simple.csv.fixture`});

    // when
    const lines: Line[] = await parser.parse();

    // then
    expect(lines.length).toBe(4);
  });

  test('should take into account "--to" option', async () => {
    // given
    const parser = new CsvFileParser({from: 3, input_file: `${__dirname}/test_simple.csv.fixture`});

    // when
    const lines: Line[] = await parser.parse();

    // then
    expect(lines.length).toBe(3);
  });

  test('should support "--from" and "--to" options simultaneously', async () => {
    // given
    const parser = new CsvFileParser({from: 3, to: 4, input_file: `${__dirname}/test_simple.csv.fixture`});

    // when
    const lines: Line[] = await parser.parse();

    // then
    expect(lines.length).toBe(2);
  });
});
