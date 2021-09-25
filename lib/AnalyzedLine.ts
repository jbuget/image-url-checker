import Line from './Line.js';

export default class AnalyzedLine extends Line {
  error?: string; // PARSING_ERROR, HTTP_ERROR
  comments: string[];

  constructor(line: Line) {
    super(line.index, line.raw, line.reference, line.url);
    this.comments = [];
  }

  markInError(errorType: string, errorMessage: string) {
    this.error = errorType;
    this.comments.push(errorMessage);
  }

}
