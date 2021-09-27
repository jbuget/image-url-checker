import Line from '../parsing/Line';

export default class AnalyzedLine extends Line {
  status: string;
  error?: string; // PARSING_ERROR, HTTP_ERROR
  comments: string[];

  constructor(line: Line) {
    super(line.index, line.raw, line.reference, line.url);
    this.status = '-';
    this.comments = [];
  }

  markInSuccess() {
    this.status = 'OK';
  }

  markInError(errorType: string, errorMessage: string) {
    this.status = 'KO';
    this.error = errorType;
    this.comments.push(errorMessage);
  }

}
