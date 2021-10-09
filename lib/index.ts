#!/usr/bin/env node

import Program from './Program';
import { plugin as imagesPlugin } from './plugins/images';

const program = new Program();

program.use(imagesPlugin);

program.run(process.argv).then(() => process.exit(0));
