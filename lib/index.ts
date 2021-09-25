import {Command} from 'commander';
import AnalyzedLine from './analyzing/AnalyzedLine.js';
import Analyzer from './analyzing/Analyzer.js';
import Line from './parsing/Line.js';
import Parser from './parsing/Parser.js';
import Reporter from './reporting/Reporter.js';

const program = new Command();
program.version('0.0.1');

program
  .argument('<file>', 'file to analyze')
  .option('-s --separator <separator>', 'column separator')
  .option('-o --output <output>', 'output file');

program.parse(process.argv);

const options = program.opts();

async function main() {
  const file = program.args[0];

  const parser = new Parser(options);
  const lines: Line[] = await parser.parse(file);

  const analyzer = new Analyzer(options);
  const analyzedLines: AnalyzedLine[] = await analyzer.analyze(lines);

  const reporter: Reporter = new Reporter(options);
  await reporter.report(analyzedLines);

  process.exit(0);
}

main()
