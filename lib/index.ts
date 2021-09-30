#!/usr/bin/env node

import Program from './Program';

const program = new Program();

program.run(process.argv).then(() => process.exit(0));

