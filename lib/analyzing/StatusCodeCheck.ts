import { HttpCheck } from './Check';
import { HttpResponse } from '../tools/HttpClient';
import AnalyzedLine from './AnalyzedLine';

export default class StatusCodeCheck implements HttpCheck {
  async check(response: HttpResponse, analyzedLine: AnalyzedLine): Promise<AnalyzedLine> {
    if (!analyzedLine.error) {
      if (response.statusCode !== 200) {
        analyzedLine.markInError('HTTP_ERROR', 'HTTP status is not 200(OK)');
      }
    }
    return analyzedLine;
  }
}
