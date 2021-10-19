import CorePlugin from '../../../lib/plugins/core/CorePlugin';
import UrlFormatCheck from '../../../lib/plugins/core/UrlFormatCheck';
import StatusCodeCheck from '../../../lib/plugins/core/StatusCodeCheck';

describe('CorePlugin', () => {

  describe('#Constructor', () => {

    it('should set the name "plugin:core"', () => {
      // when
      const plugin = new CorePlugin();

      // then
      expect(plugin.name).toBe('plugin:core');
    });

    it('should use pre-HTTP-checks', () => {
      // when
      const plugin = new CorePlugin();

      // then
      expect(plugin.preHttpChecks.length).toBe(1);
      expect(plugin.preHttpChecks[0]).toBeInstanceOf(UrlFormatCheck);
    });

    it('should use HTTP-checks', () => {
      // when
      const plugin = new CorePlugin();

      // then
      expect(plugin.httpChecks.length).toBe(1);
      expect(plugin.httpChecks[0]).toBeInstanceOf(StatusCodeCheck);
    });
  });
});
