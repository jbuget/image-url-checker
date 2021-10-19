"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const Plugin_1 = __importDefault(require("../Plugin"));
const PluginConfig_1 = __importStar(require("../PluginConfig"));
const ContentTypeCheck_1 = __importDefault(require("./ContentTypeCheck"));
class ImagesPlugin extends Plugin_1.default {
    constructor() {
        const config = new PluginConfig_1.default(new PluginConfig_1.ParsingOptions(), new PluginConfig_1.AnalysisOptions({
            httpChecks: [new ContentTypeCheck_1.default()]
        }), new PluginConfig_1.ReportingOptions());
        super('plugin:images', config);
    }
}
exports.default = ImagesPlugin;
const plugin = new ImagesPlugin();
exports.plugin = plugin;
//# sourceMappingURL=ImagesPlugin.js.map