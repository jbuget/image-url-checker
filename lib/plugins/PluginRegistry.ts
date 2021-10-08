import Plugin from './Plugin';

export default class PluginRegistry {
  private readonly _plugins: Map<string, Plugin>;

  constructor() {
    this._plugins = new Map<string, Plugin>();
  }

  register(plugin: Plugin): Map<string, Plugin> {
    return this._plugins.set(plugin.name, plugin);
  }

  remove(pluginName: string): boolean {
    return this._plugins.delete(pluginName);
  }
}
