import { IIconManager } from './icon-manager/interface';
import { ILocaleManager } from './locale-manager/interface';
import { IMenuManager } from './menu-manager/interface';
import { IPageComponentManager } from './page-component-manager/interface';
import { IRoutePathConfigManager } from './route-path-config-manager/interface';

export class ModuleOrchestrator {
  constructor(
    private readonly iconManager: IIconManager,
    private readonly pageComponentManager: IPageComponentManager,
    private readonly localeManager: ILocaleManager,
    private readonly routePathManager: IRoutePathConfigManager,
    private readonly menuManager: IMenuManager
  ) {}

  async createDmsPage() {
    await this.iconManager.run();
    await this.pageComponentManager.run();
    await this.localeManager.run();
    await this.routePathManager.run();
    await this.menuManager.run();
  }
}
