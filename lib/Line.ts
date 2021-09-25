import {URL} from 'url';

export default class Line {
  raw: string;
  index: number;
  reference: string;
  url: string;
  error?: string; // PARSING_ERROR, HTTP_ERROR
  comments: string[];

  constructor(index:number, raw: string, reference: string, url: string) {
    this.index = index;
    this.raw = raw;
    this.reference = reference;
    this.url = url;
    this.comments = [];
  }

  markInError(errorType: string, errorMessage: string) {
    this.error = errorType;
    this.comments.push(errorMessage);
  }
}
