import { Check, HttpCheck } from '../analyzing/Check';

export class ParsingOptions {}

export class AnalysisOptions {
  preHttpChecks: Check[];
  httpChecks: HttpCheck[];
  postHttpChecks: Check[];

  constructor(options: { preHttpChecks?: Check[]; httpChecks?: HttpCheck[]; postHttpChecks?: Check[] }) {
    this.preHttpChecks = options.preHttpChecks || [];
    this.httpChecks = options.httpChecks || [];
    this.postHttpChecks = options.postHttpChecks || [];
  }
}

export class ReportingOptions {}

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
