import {Command} from 'commander';
import Analyzer from './Analyzer.js';
import Report from './Report.js';

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
  const analyzer = new Analyzer(file, options);
  const report: Report = await analyzer.analyze();
  process.exit(0);
}

main()
