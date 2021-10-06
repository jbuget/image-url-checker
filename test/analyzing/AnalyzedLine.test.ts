import Line from '../../lib/parsing/Line';
import AnalyzedLine from '../../lib/analyzing/AnalyzedLine';

it('Constructor', () => {
  // given
  const line = new Line(1, 'rec123;http://image.url', ';');

  // when
  const analyzedLine = new AnalyzedLine(line);

  // then
  expect(analyzedLine.index).toBe(1);
  expect(analyzedLine.status).toBe('-');
  expect(analyzedLine.comments.length).toBe(0);
});

it('#markInSuccess should set status to "OK"', () => {
  // given
  const line = new Line(1, 'rec123;http://image.url', ';');
  const analyzedLine = new AnalyzedLine(line);

  // when
  analyzedLine.markInSuccess();

  // then
  expect(analyzedLine.status).toBe('OK');
});

it('#markInError should set status to "KO"', () => {
  // given
  const line = new Line(1, 'rec123;http://image.url', ';');
  const analyzedLine = new AnalyzedLine(line);

  // when
  analyzedLine.markInError('ERROR', 'My error message');

  // then
  expect(analyzedLine.status).toBe('KO');
  expect(analyzedLine.error).toBe('ERROR');
  expect(analyzedLine.comments.length).toBe(1);
  expect(analyzedLine.comments[0]).toBe('My error message');
});

