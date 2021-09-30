#!/usr/bin/env node

import {LIB_VERSION} from './version';
import Program from './Program';

const program = new Program(LIB_VERSION);

program.run(process.argv).then(() => process.exit(0));

