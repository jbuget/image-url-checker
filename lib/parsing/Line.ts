export default class Line {
  raw: string;
  separator: string;
  index: number;
  reference: string;
  url: string;

  constructor(index: number, rawLine: string, separator: string) {
    this.index = index;
    this.raw = rawLine;
    this.separator = separator;
    const [reference, url] = rawLine.split(this.separator);
    this.reference = reference;
    this.url = url;
  }
}
