import Line from '../parsing/Line';

export default class AnalyzedLine extends Line {
  status: string;
  error?: string; // PARSING_ERROR, HTTP_ERROR
  comments: string[];

  constructor(line: Line) {
    super(line.index, line.raw, line.separator);
    this.status = '-';
    this.comments = [];
  }

  markInSuccess(): void {
    this.status = 'OK';
  }

  markInError(errorType: string, errorMessage: string): void {
    this.status = 'KO';
    this.error = errorType;
    this.comments.push(errorMessage);
  }
}
