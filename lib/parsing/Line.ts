export default class Line {
  raw: string;
  index: number;
  reference: string;
  url: string;

  constructor(index: number, raw: string, reference: string, url: string) {
    this.index = index;
    this.raw = raw;
    this.reference = reference;
    this.url = url;
  }
}
