#!/usr/bin/env node

import {Command} from 'commander';
import AnalyzedLine from './analyzing/AnalyzedLine.js';
import Analyzer from './analyzing/Analyzer.js';
import Line from './parsing/Line.js';
import Parser from './parsing/Parser.js';
import Reporter from './reporting/Reporter.js';
import { logger} from './tools/Logger.js';

const program = new Command();
program.version('0.0.1');

program
  .argument('<file>', 'file to analyze')
  .option('-b --bulk <bulk>', 'number of concurrent line analysis in parallel')
  .option('-d --delay <delay>', 'delay between two HTTP call')
  .option('-f --from <from>', 'line from')
  .option('-o --output <output>', 'output file')
  .option('-s --separator <separator>', 'column separator')
  .option('-t --to <to>', 'line to')
;

program.parse(process.argv);

const options = program.opts();

async function main() {
  const file = program.args[0];

  logger.info('--------------------------------------------------------------------------------');
  logger.info('Options:');
  logger.info(`  - file: ${file}`);
  logger.info(`  - bulk: ${options.bulk}`);
  logger.info(`  - delay: ${options.delay}`);
  logger.info(`  - from: ${options.from}`);
  logger.info(`  - output: ${options.output}`);
  logger.info(`  - separator: ${options.separator}`);
  logger.info(`  - to: ${options.to}`);
  logger.info();

  const parser = new Parser(options);
  const lines: Line[] = await parser.parse(file);

  const analyzer = new Analyzer(options);
  const analyzedLines: AnalyzedLine[] = await analyzer.analyze(lines);

  const reporter: Reporter = new Reporter(options);
  await reporter.report(analyzedLines);

  process.exit(0);
}

main()
