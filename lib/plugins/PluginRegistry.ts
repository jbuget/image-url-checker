import Plugin from './Plugin';
import { plugin as corePlugin } from './core';
import { logger } from '../tools/Logger';
import { Check, HttpCheck } from '../analyzing/Check';

export default class PluginRegistry {
  private readonly _plugins: Map<string, Plugin>;

  constructor() {
    this._plugins = new Map<string, Plugin>();
    this.register(corePlugin);
  }

  register(plugin: Plugin): Map<string, Plugin> {
    const existingPlugin = this._plugins.get(plugin.name);
    if (existingPlugin) {
      logger.error(
        `Could not register plugin ${plugin.name} because a plugin with the same name was already registered`
      );
    } else {
      this._plugins.set(plugin.name, plugin);
    }
    return this._plugins;
  }

  remove(pluginName: string): boolean {
    const existingPlugin = this._plugins.get(pluginName);
    if (!existingPlugin) {
      logger.error(`Could not remove plugin ${pluginName} because no one was previously registered`);
    } else {
      return this._plugins.delete(pluginName);
    }
    return false;
  }

  get preHttpChecks(): Check[] {
    let checks: Check[] = [];
    Array.from(this._plugins.values()).forEach((plugin) => {
      checks = checks.concat(plugin.preHttpChecks);
    });
    return checks;
  }

  get httpChecks(): HttpCheck[] {
    let checks: HttpCheck[] = [];
    Array.from(this._plugins.values()).forEach((plugin) => {
      checks = checks.concat(plugin.httpChecks);
    });
    return checks;
  }

  get postHttpChecks(): Check[] {
    let checks: Check[] = [];
    Array.from(this._plugins.values()).forEach((plugin) => {
      checks = checks.concat(plugin.postHttpChecks);
    });
    return checks;
  }
}

const registry = new PluginRegistry();
export { registry };
