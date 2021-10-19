import { plugin } from '../../../lib/plugins/images'
import ImagesPlugin from '../../../lib/plugins/images/ImagesPlugin';

describe('plugins/images', () => {

  it('should export an instance of ImagesPlugin', () => {
    // then
    expect(plugin).toBeInstanceOf(ImagesPlugin);
  });
});
