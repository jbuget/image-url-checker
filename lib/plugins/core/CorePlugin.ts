import Plugin from '../Plugin';
import PluginConfig, { AnalysisOptions, ParsingOptions, ReportingOptions } from '../PluginConfig';
import UrlFormatCheck from './UrlFormatCheck';
import StatusCodeCheck from './StatusCodeCheck';

export default class CorePlugin extends Plugin {
  constructor() {
    const config = new PluginConfig(
      new ParsingOptions(),
      new AnalysisOptions({
        preHttpChecks: [new UrlFormatCheck()],
        httpChecks: [new StatusCodeCheck()]
      }),
      new ReportingOptions()
    );

    super('plugin:core', config);
  }
}

const plugin = new CorePlugin();

export { plugin };
