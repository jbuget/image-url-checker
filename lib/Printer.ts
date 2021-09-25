import Report from './Report.js';

export default class Printer {

  print(report: Report) {
    console.log('--------------------------------------------------------------------------------');
    console.log('Phase: "Reporting"');
    console.log(`  - analyzed lines: ${report.analyzedLines.length}`);
    console.log();

    const hrStart: [number, number] = process.hrtime();

    // TODO

    console.log();
    const hrEnd: [number, number] = process.hrtime(hrStart);
    console.log('Execution time (hr): %ds %dms', hrEnd[0], hrEnd[1] / 1000000);
    console.log();
  }
}
