import { HttpCheck } from '../../analyzing/Check';
import { HttpResponse } from '../../tools/HttpClient';
import AnalyzedLine from '../../analyzing/AnalyzedLine';

export default class ContentTypeCheck implements HttpCheck {
  async check(response: HttpResponse, analyzedLine: AnalyzedLine): Promise<AnalyzedLine> {
    if (!analyzedLine.error) {
      if (!response.headers['content-type'].trim().toLowerCase().startsWith('image/')) {
        analyzedLine.markInError('HTTP_ERROR', 'HTTP response content type is not an image');
      }
    }
    return analyzedLine;
  }
}
