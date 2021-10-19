import ImagesPlugin from '../../../lib/plugins/images/ImagesPlugin';
import ContentTypeCheck from '../../../lib/plugins/images/ContentTypeCheck';

describe('ImagesPlugin', () => {

  describe('#Constructor', () => {

    it('should set the name "plugin:images"', () => {
      // when
      const plugin = new ImagesPlugin();

      // then
      expect(plugin.name).toBe('plugin:images');
    });

    it('should not use pre-HTTP-checks', () => {
      // when
      const plugin = new ImagesPlugin();

      // then
      expect(plugin.preHttpChecks.length).toBe(0);
    });

    it('should use HTTP-checks', () => {
      // when
      const plugin = new ImagesPlugin();

      // then
      expect(plugin.httpChecks.length).toBe(1);
      expect(plugin.httpChecks[0]).toBeInstanceOf(ContentTypeCheck);
    });
  });
});
