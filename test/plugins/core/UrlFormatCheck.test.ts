import Line from '../../../lib/parsing/Line';
import AnalyzedLine from '../../../lib/analyzing/AnalyzedLine';
import UrlFormatCheck from '../../../lib/plugins/core/UrlFormatCheck';

describe('UrlFormatCheck', () => {

  describe('#check', () => {

    it('should do nothing when check is successful', async () => {
      // given
      const check = new UrlFormatCheck();
      const line = new Line(1, 'BD-15128;https://pix.fr/images/logo-join-campaign.svg', ';');
      const analyzedLine = new AnalyzedLine(line);

      // when
      await check.check(line, analyzedLine);

      // then
      expect(analyzedLine.status).toBe('-');
      expect(analyzedLine.error).toBeUndefined();
      expect(analyzedLine.comments.length).toBe(0);
    });

    it('should do nothing when line has already been marked as "in error"', async () => {
      // given
      const check = new UrlFormatCheck();
      const line = new Line(1, 'BD-15128;https://pix.fr/images/logo-join-campaign.svg', ';');
      const analyzedLine = new AnalyzedLine(line);
      analyzedLine.markInError('SOME_ERROR', 'Some previous error');

      // when
      await check.check(line, analyzedLine);

      // then
      expect(analyzedLine.status).toBe('KO');
      expect(analyzedLine.error).toBe('SOME_ERROR');
      expect(analyzedLine.comments[0]).toBe('Some previous error');
    });

    it('should mark line in error when the URL found in the line being analyzed has a wrong format', async () => {
      // given
      const check = new UrlFormatCheck();
      const line = new Line(1, 'BD-15128;wrong_format_url/pix.fr/images/logo-join-campaign.svg', ';');
      const analyzedLine = new AnalyzedLine(line);

      // when
      await check.check(line, analyzedLine);

      // then
      expect(analyzedLine.status).toBe('KO');
      expect(analyzedLine.error).toBe('FORMAT_ERROR');
      expect(analyzedLine.comments[0].startsWith('Invalid URL')).toBeTruthy();
    });
  });
});
