import Plugin from '../Plugin';
import PluginConfig, { AnalysisOptions, ParsingOptions, ReportingOptions } from '../PluginConfig';
import ContentTypeCheck from './ContentTypeCheck';

export default class ImagesPlugin extends Plugin {
  constructor() {
    const config = new PluginConfig(
      new ParsingOptions(),
      new AnalysisOptions({
        httpChecks: [new ContentTypeCheck()]
      }),
      new ReportingOptions()
    );

    super('plugin:images', config);
  }
}
