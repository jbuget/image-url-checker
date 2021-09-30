#!/usr/bin/env node

import fs from 'fs';
import Program from './Program';

const version = fs.readFileSync(`${__dirname}/version.txt`, 'utf-8').trim();

const program = new Program(version);

program.run(process.argv).then(() => process.exit(0));


