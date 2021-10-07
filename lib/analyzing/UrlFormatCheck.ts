import { Check } from './Check';
import Line from '../parsing/Line';
import AnalyzedLine from './AnalyzedLine';
import { URL } from 'url';

export default class UrlFormatCheck implements Check {
  async check(line: Line, analyzedLine: AnalyzedLine): Promise<AnalyzedLine> {
    if (!analyzedLine.error) {
      try {
        new URL(line.url);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        analyzedLine.markInError('FORMAT_ERROR', error.message);
      }
    }
    return analyzedLine;
  }
}
