import {Command} from 'commander';
import Analyzer from './Analyzer.js';
import Parser from './Parser.js';
import Line from './Line.js';
import Reporter from './Reporter.js';
import AnalyzedLine from './AnalyzedLine.js';

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
  const analyzedLines: AnalyzedLine[] = await analyzer.analyze(lines);

  const reporter: Reporter = new Reporter();
  reporter.report(analyzedLines);

  process.exit(0);
}

main()
