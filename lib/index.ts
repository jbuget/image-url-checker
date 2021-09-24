import { Command } from 'commander';
const program = new Command();
program.version('0.0.1');

program
  .option('-v --verbose', 'display details')
  .option('-o --output', 'output file');

program.parse(process.argv);

const options = program.opts();

if (options.verbose) console.log(options);


