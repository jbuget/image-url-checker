"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingOptions = exports.AnalysisOptions = exports.ParsingOptions = void 0;
class ParsingOptions {
}
exports.ParsingOptions = ParsingOptions;
class AnalysisOptions {
    constructor(options) {
        this.preHttpChecks = options.preHttpChecks || [];
        this.httpChecks = options.httpChecks || [];
    }
}
exports.AnalysisOptions = AnalysisOptions;
class ReportingOptions {
}
exports.ReportingOptions = ReportingOptions;
class PluginConfig {
    constructor(parsing, analysis, reporting) {
        this.parsing = parsing;
        this.analysis = analysis;
        this.reporting = reporting;
    }
}
exports.default = PluginConfig;
//# sourceMappingURL=PluginConfig.js.map