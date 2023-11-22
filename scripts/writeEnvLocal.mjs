import { resolve } from 'path';
import { writeFileSync } from 'fs';

const cwd = process.cwd();
const args = (process.argv[2] ?? '').split(',');

const envPath = resolve(cwd, './.env.local');

writeFileSync(envPath, args.join('\n'));
