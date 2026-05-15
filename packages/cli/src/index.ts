import { Command } from 'commander';
import { CreateDMSPage } from './commands/create-dms-page/create-dms-page';
import { DmsKitPublish } from './commands/dms-kit-publish/services/deploy';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require('../package.json');

const program = new Command();
program
  .name('dms-cli')
  .description('ActionTech DMS UI CLI tools')
  .version(pkg.version);

const createPageCmd = new Command('create-page');
new CreateDMSPage().register(createPageCmd);
program.addCommand(createPageCmd);

const kitPublishCmd = new Command('kit-publish')
  .description('DMS Kit 包发布和文档部署工具')
  .option('--retry-deploy-trigger', '重试文档部署触发模式')
  .action(async () => {
    await new DmsKitPublish().start();
  });
program.addCommand(kitPublishCmd);

program.parse();
