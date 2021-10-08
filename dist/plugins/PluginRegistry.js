"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PluginRegistry {
    constructor() {
        this._plugins = new Map();
    }
    register(plugin) {
        return this._plugins.set(plugin.name, plugin);
    }
    remove(pluginName) {
        return this._plugins.delete(pluginName);
    }
}
exports.default = PluginRegistry;
//# sourceMappingURL=PluginRegistry.js.map