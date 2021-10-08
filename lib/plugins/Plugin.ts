export default abstract class Plugin {
  private readonly _name: string;

  protected constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }
}
