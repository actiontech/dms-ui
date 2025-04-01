import { Command } from 'commander';
import { Task } from './common/Task';
import { z } from 'zod';
import chalk from 'chalk';
import { ModuleOrchestrator } from './module/module-orchestrator';
import { IconManager } from './module/icon-manager';
import { logger } from './utils/logger';
import { PageComponentManager } from './module/page-component-manager';
import { LocaleManager } from './module/locale-manager';
import { RoutePathConfigManager } from './module/route-path-config-manager';
import { MenuManager } from './module/menu-manager';
import { handleError } from './utils/handle-error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initOptionsSchema = z.object({
  verbose: z.boolean(),
  info: z.boolean()
});

const initComponentTypeSchema = z.enum(['sqle', 'base', 'provision']);

export type IOptions = z.infer<typeof initOptionsSchema>;
export type IComponentType = z.infer<typeof initComponentTypeSchema>;

export class CreateDMSPage implements Task {
  register(program: Command): void {
    program
      .description('自动化创建dms页面模板代码')
      .arguments('<page-type>')
      .usage(`${chalk.green('<page-type>')} [options]`)
      .option('--verbose', 'print additional logs')
      .option('--info', 'print environment debug info')
      .on('--help', () => {
        logger.info('\nAllowed page types:');
        logger.info(Object.keys(initComponentTypeSchema.Values).join(', '));
      })
      .action((type: IComponentType) => {
        this.run(type);
      });
  }
  async run(type: IComponentType): Promise<void> {
    try {
      await initComponentTypeSchema.parseAsync(type);

      const iconManager = new IconManager();
      const pageComponentManager = new PageComponentManager(type);
      const localeManager = new LocaleManager(type, pageComponentManager);

      const routePathManager = new RoutePathConfigManager(
        type,
        pageComponentManager
      );

      const menuManager = new MenuManager(
        type,
        iconManager,
        pageComponentManager,
        localeManager,
        routePathManager
      );

      const orchestrator = new ModuleOrchestrator(
        iconManager,
        pageComponentManager,
        localeManager,
        routePathManager,
        menuManager
      );

      await orchestrator.createDmsPage();
    } catch (error) {
      handleError(error);
    }
  }
}
