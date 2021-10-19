import { Check, HttpCheck } from '../analyzing/Check';
import PluginConfig from './PluginConfig';

export default abstract class Plugin {
  private readonly _name: string;
  private readonly _config: PluginConfig;

  protected constructor(name: string, config: PluginConfig) {
    this._name = name;
    this._config = config;
  }

  get name(): string {
    return this._name;
  }

  get preHttpChecks(): Check[] {
    return this._config.analysis.preHttpChecks;
  }

  get httpChecks(): HttpCheck[] {
    return this._config.analysis.httpChecks;
  }
}
