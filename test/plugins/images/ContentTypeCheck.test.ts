import AnalyzedLine from '../../../lib/analyzing/AnalyzedLine';
import { HttpResponse } from '../../../lib/tools/HttpClient';
import ContentTypeCheck from '../../../lib/plugins/images/ContentTypeCheck';
import Line from '../../../lib/parsing/Line';

describe('ContentTypeCheck', () => {

  describe('#check', () => {

    it('should do nothing when check is successful', async () => {
      // given
      const check = new ContentTypeCheck();
      const line = new Line(1, 'BD-15128;https://pix.fr/images/logo-join-campaign.svg', ';');
      const analyzedLine = new AnalyzedLine(line);
      const httpResponse = new HttpResponse({status: 200, headers: {'content-type': 'image/svg'}});

      // when
      await check.check(httpResponse, analyzedLine);

      // then
      expect(analyzedLine.status).toBe('-');
      expect(analyzedLine.error).toBeUndefined();
      expect(analyzedLine.comments.length).toBe(0);
    });

    it('should do nothing when line has already been marked as "in error"', async () => {
      // given
      const check = new ContentTypeCheck();
      const line = new Line(1, 'BD-15128;https://pix.fr/images/logo-join-campaign.svg', ';');
      const analyzedLine = new AnalyzedLine(line);
      analyzedLine.markInError('SOME_ERROR', 'Some previous error');
      const httpResponse = new HttpResponse({status: 400});

      // when
      await check.check(httpResponse, analyzedLine);

      // then
      expect(analyzedLine.status).toBe('KO');
      expect(analyzedLine.error).toBe('SOME_ERROR');
      expect(analyzedLine.comments[0]).toBe('Some previous error');
    });

    it('should mark line in error when HTTP response content type is not an image', async () => {
      // given
      const check = new ContentTypeCheck();
      const line = new Line(1, 'BD-15128;https://pix.fr/js/vendors.js', ';');
      const analyzedLine = new AnalyzedLine(line);
      const httpResponse = new HttpResponse({status: 200, headers: {'content-type': 'application/javascript'}});

      // when
      await check.check(httpResponse, analyzedLine);

      // then
      expect(analyzedLine.status).toBe('KO');
      expect(analyzedLine.error).toBe('HTTP_ERROR');
      expect(analyzedLine.comments[0]).toBe('HTTP response content type is not an image');
    });
  });
});
