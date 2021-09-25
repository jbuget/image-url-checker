import AnalyzedLine from './AnalyzedLine.js';

export default class Reporter {

  report(analyzedLines: AnalyzedLine[]) {
    console.log('--------------------------------------------------------------------------------');
    console.log('Phase: "Reporting"');
    console.log(`  - analyzed lines: ${analyzedLines.length}`);
    console.log();

    const hrStart: [number, number] = process.hrtime();

    // TODO

    console.log();
    const hrEnd: [number, number] = process.hrtime(hrStart);
    console.log('Execution time (hr): %ds %dms', hrEnd[0], hrEnd[1] / 1000000);
    console.log();
  }
}
