import {Command} from 'commander';
import Analyzer from './Analyzer.js';
import Report from './Report.js';
import Parser from './Parser.js';
import Line from './Line.js';
import Printer from './Printer.js';

const program = new Command();
program.version('0.0.1');

program
  .argument('<file>', 'file to analyze')
  .option('-d --delimiter <delimiter>', 'column delimiter')
  .option('-o --output <outputFile>', 'output file');

program.parse(process.argv);

const options = program.opts();

async function main() {
  const file = program.args[0];

  const parser = new Parser(options.delimiter);
  const lines: Line[] = await parser.parse(file);

  const analyzer = new Analyzer();
  const report: Report = await analyzer.analyze(lines);

  const printer: Printer = new Printer();
  printer.print(report);

  process.exit(0);
}

main()
