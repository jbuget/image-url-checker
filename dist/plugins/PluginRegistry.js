"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registry = void 0;
const core_1 = require("./core");
const Logger_1 = require("../tools/Logger");
class PluginRegistry {
    constructor() {
        this._plugins = new Map();
        this.register(core_1.plugin);
    }
    register(plugin) {
        const existingPlugin = this._plugins.get(plugin.name);
        if (existingPlugin) {
            Logger_1.logger.error(`Could not register plugin ${plugin.name} because a plugin with the same name was already registered`);
        }
        else {
            this._plugins.set(plugin.name, plugin);
        }
        return this._plugins;
    }
    remove(pluginName) {
        const existingPlugin = this._plugins.get(pluginName);
        if (!existingPlugin) {
            Logger_1.logger.error(`Could not remove plugin ${pluginName} because no one was previously registered`);
        }
        else {
            return this._plugins.delete(pluginName);
        }
        return false;
    }
    get preHttpChecks() {
        let checks = [];
        Array.from(this._plugins.values()).forEach((plugin) => {
            checks = checks.concat(plugin.preHttpChecks);
        });
        return checks;
    }
    get httpChecks() {
        let checks = [];
        Array.from(this._plugins.values()).forEach((plugin) => {
            checks = checks.concat(plugin.httpChecks);
        });
        return checks;
    }
}
exports.default = PluginRegistry;
const registry = new PluginRegistry();
exports.registry = registry;
//# sourceMappingURL=PluginRegistry.js.map