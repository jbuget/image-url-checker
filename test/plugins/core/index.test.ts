import { plugin } from '../../../lib/plugins/core'
import CorePlugin from '../../../lib/plugins/core/CorePlugin';

describe('plugins/core', () => {

  it('should export an instance of CorePlugin', () => {
    // then
    expect(plugin).toBeInstanceOf(CorePlugin);
  });
});
