"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Plugin {
    constructor(name, config) {
        this._name = name;
        this._config = config;
    }
    get name() {
        return this._name;
    }
    get preHttpChecks() {
        return this._config.analysis.preHttpChecks;
    }
    get httpChecks() {
        return this._config.analysis.httpChecks;
    }
}
exports.default = Plugin;
//# sourceMappingURL=Plugin.js.map