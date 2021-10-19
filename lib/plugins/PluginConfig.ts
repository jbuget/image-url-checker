import { Check, HttpCheck } from '../analyzing/Check';

export class ParsingOptions {
}

export class AnalysisOptions {
  preHttpChecks: Check[];
  httpChecks: HttpCheck[];

  constructor(options: { preHttpChecks?: Check[]; httpChecks?: HttpCheck[] }) {
    this.preHttpChecks = options.preHttpChecks || [];
    this.httpChecks = options.httpChecks || [];
  }
}

export class ReportingOptions {
}

export default class PluginConfig {
  parsing: ParsingOptions;
  analysis: AnalysisOptions;
  reporting: ReportingOptions;

  constructor(parsing: ParsingOptions, analysis: AnalysisOptions, reporting: ReportingOptions) {
    this.parsing = parsing;
    this.analysis = analysis;
    this.reporting = reporting;
  }
}
