import Parser from '../../lib/parsing/Parser';

describe('Constructor', () => {

  test('should set ";" as default separator', () => {
    // given
    const options = {};

    // when
    const parser = new Parser(options);

    // then
    expect(parser.separator).toBe(';');
  });

  test('should use given separator', () => {
    // given
    const options = {separator: '/'};

    // when
    const parser = new Parser(options);

    // then
    expect(parser.separator).toBe('/');
  });
});
