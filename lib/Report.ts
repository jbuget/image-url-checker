import AnalyzedLine from './AnalyzedLine.js';

export default class Report {

  startDate?: Date;
  endDate?: Date;
  analyzedLines: AnalyzedLine[];

  constructor() {
    this.startDate = new Date();
    this.analyzedLines = [];
  }

  start() {
    this.startDate = new Date();
  }

  addAnalyzedLine(line: AnalyzedLine) {
    this.analyzedLines.push(line);
  }

  stop() {
    this.endDate = new Date();
  }
}
