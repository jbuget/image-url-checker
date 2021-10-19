import PluginRegistry, { registry } from '../../lib/plugins/PluginRegistry';
import UrlFormatCheck from '../../lib/plugins/core/UrlFormatCheck';
import StatusCodeCheck from '../../lib/plugins/core/StatusCodeCheck';
import CorePlugin from '../../lib/plugins/core/CorePlugin';
import { logger } from '../../lib/tools/Logger';
import ImagesPlugin from '../../lib/plugins/images/ImagesPlugin';
import ContentTypeCheck from '../../lib/plugins/images/ContentTypeCheck';

jest.mock('../../lib/tools/Logger');

const mockedLogger = logger as jest.Mocked<typeof logger>;

describe('Constructor', () => {

  it('should initialize a Map with the CorePlugin checks', () => {
    // when
    const pluginRegistry = new PluginRegistry();

    // then
    expect(pluginRegistry.preHttpChecks.length).toBe(1);
    expect(pluginRegistry.preHttpChecks[0]).toBeInstanceOf(UrlFormatCheck);

    expect(pluginRegistry.httpChecks.length).toBe(1);
    expect(pluginRegistry.httpChecks[0]).toBeInstanceOf(StatusCodeCheck);
  });
});

describe('#register', () => {

  describe('when we try to add an already registered plugin', () => {

    it('should not add the given plugin', () => {
      // given
      const pluginRegistry = new PluginRegistry();
      const initialPreHttpChecksLength = pluginRegistry.httpChecks.length;
      const existingPlugin = new CorePlugin();

      // when
      pluginRegistry.register(existingPlugin);

      // then
      expect(pluginRegistry.httpChecks.length).toBe(initialPreHttpChecksLength);
    });

    it('should log an error', () => {
      // given
      const pluginRegistry = new PluginRegistry();
      const corePlugin = new CorePlugin();
      mockedLogger.error.mockReturnValue();

      // when
      pluginRegistry.register(corePlugin);

      // then
      expect(mockedLogger.error).toHaveBeenCalledWith('Could not register plugin plugin:core because a plugin with the same name was already registered');
    });
  });

  describe('when we add an unregistered plugin', () => {

    it('should add plugin checks', () => {
      // given
      const pluginRegistry = new PluginRegistry();
      const initialHttpChecksLength = pluginRegistry.preHttpChecks.length;
      const unregisteredPlugin = new ImagesPlugin();

      // when
      pluginRegistry.register(unregisteredPlugin);

      // then
      expect(pluginRegistry.httpChecks.length).toBe(initialHttpChecksLength + 1);
    });
  });
});

describe('#remove', () => {

  describe('when we try to remove an unregistered plugin', () => {

    it('should not remove the plugin', () => {
      // given
      const pluginRegistry = new PluginRegistry();
      const initialHttpChecksLength = pluginRegistry.httpChecks.length;

      // when
      pluginRegistry.remove('plugin:unregistered');

      // then
      expect(pluginRegistry.httpChecks.length).toBe(initialHttpChecksLength);
    });

    it('should log an error', () => {
      // given
      const pluginRegistry = new PluginRegistry();
      mockedLogger.error.mockReturnValue();

      // when
      pluginRegistry.remove('plugin:unregistered');

      // then
      expect(mockedLogger.error).toHaveBeenCalledWith('Could not remove plugin plugin:unregistered because no one was previously registered');
    });
  });

  describe('when we remove a registered plugin', () => {

    it('should remove plugin checks', () => {
      // given
      const pluginRegistry = new PluginRegistry();
      const initialHttpChecksLength = pluginRegistry.httpChecks.length;

      // when
      pluginRegistry.remove('plugin:core');

      // then
      expect(pluginRegistry.httpChecks.length).toBe(initialHttpChecksLength - 1);
    });
  });
});

describe('#preHttpChecks', () => {

  it('should return the whole plugins aggregated list of pre-HTTP-checks', () => {
    // given
    const pluginRegistry = new PluginRegistry();

    // when
    const checks = pluginRegistry.preHttpChecks;

    // then
    expect(checks.length).toBe(1);
  });
});

describe('#httpChecks', () => {

  it('should return the whole plugins aggregated list of HTTP-checks', () => {
    // given
    const pluginRegistry = new PluginRegistry();
    pluginRegistry.register(new ImagesPlugin());

    // when
    const checks = pluginRegistry.httpChecks;

    // then
    expect(checks.length).toBe(2);
    expect(checks[0]).toBeInstanceOf(StatusCodeCheck);
    expect(checks[1]).toBeInstanceOf(ContentTypeCheck);
  });
});

it('should export an instance of PluginRegistry', () => {
  // then
  expect(registry).toBeInstanceOf(PluginRegistry);
});
