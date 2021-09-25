import Line from './Line.js';

export default class Report {

  startDate: Date;
  endDate?: Date;
  lines: Line[];

  constructor() {
    this.startDate = new Date();
    this.lines = [];
  }

  finalize() {
    this.endDate = new Date();
  }

  get duration() {
    if (this.endDate) {
      const diff = this.endDate.getTime() - this.startDate.getTime();
      return `${diff} (en ms)`;
    }
    return 'N/A';
  }

  print() {
    console.log(`Début de l'analyse: ${this.startDate}`);
    console.log(`Fin de l'analyse: ${this.endDate}`);
    console.log(`Durée de l'analyse: ${this.duration}`);
    console.log('');

    const linesInError = this.lines.filter((line) => !!line.error);
    console.log(`Ligne(s) en erreur: ${linesInError.length}`);
    linesInError.forEach((line) => {
      console.error(`  ${line.index}. ${line.reference} - ${line.url} [${line.error}]`);
    })
  }

  consignLines(lines: Line[]) {
    this.lines = lines;
  }
}
