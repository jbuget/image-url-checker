import Line from '../../lib/parsing/Line';

it('Constructor', () => {
  // given
  const rawLine = 'rec123;http://url.com/image.png';

  // when
  const line: Line = new Line(1, rawLine, ';');

  // then
  expect(line.index).toBe(1);
  expect(line.raw).toBe(rawLine);
  expect(line.separator).toBe(';');
  expect(line.reference).toBe('rec123');
  expect(line.url).toBe('http://url.com/image.png');
});
