#!/user/bin/env node
import { Command } from 'commander';
// import pkg from '../package.json';
import { CreateDMSPage } from './create-dms-page';

const program = new Command();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require('../package.json');

program.name(pkg.name).description(pkg.description).version(pkg.version);

new CreateDMSPage().register(program);

program.parse();
