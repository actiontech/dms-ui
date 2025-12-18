import { input, confirm } from '@inquirer/prompts';
import { IRoutePathConfig, IRoutePathConfigManager } from './interface';
import { IComponentType } from '../../create-dms-page';
import { PathUtils } from '../../utils/path-utils';
import { BabelUtils, ObjectValue } from '../../utils/babel-utils';
import { IPageComponentManager } from '../page-component-manager/interface';
import { StrUtils } from '../../utils/str-utils';

export class RoutePathConfigManager implements IRoutePathConfigManager {
  constructor(
    private readonly componentType: IComponentType,
    private readonly pageComponentManager: IPageComponentManager
  ) {}
  config!: IRoutePathConfig;
  private readonly routePathPattern = /^[a-z]+(-[a-z]+)*$/;

  private async getRoutePathConfig() {
    const routePath = await input({
      message: '请输入页面路由地址。（格式：/^[a-z]+(-[a-z]+)*$/）',
      required: true,
      validate: this.validateRoutePath.bind(this)
    });

    const isProjectRoute = await confirm({
      message: `当前路由是否属于项目内路由？（项目内路由最终生成路由格式为 ${
        this.componentType === 'base' ? '/' : `/${this.componentType}/`
      }project/{projectID}/${routePath}）`,
      default: true
    });

    const getRouteConfigVariableName = () => {
      if (this.componentType === 'sqle') {
        return isProjectRoute
          ? 'projectDetailRouterConfig'
          : 'globalRouterConfig';
      }

      if (this.componentType === 'base') {
        return isProjectRoute
          ? 'BaseProjectRouterConfig'
          : 'BaseGlobalRouterConfig';
      }

      return 'AuthRouterConfig';
    };

    this.config = {
      routePath,
      isProjectRoute,
      routeConfigVariableName: getRouteConfigVariableName(),
      routeConfigAtPath: PathUtils.getRouteConfigAtPath(this.componentType),
      routeDataAtPath: PathUtils.getRouteDataAtPath(),
      routeDataVariableName: 'ROUTE_PATHS',
      routeDataIndexObjectPathWithComponent: `ROUTE_PATHS.${this.componentType.toLocaleUpperCase()}.${StrUtils.camelCaseToUpperCaseSnakeCase(
        this.pageComponentManager.config.componentName
      )}.index`
    };
  }

  private validateRoutePath(routePath: string): string | boolean {
    if (!this.routePathPattern.test(routePath)) {
      return `Invalid route path format: "${routePath}". The string must be all lowercase and use hyphens to separate words.`;
    }

    return true;
  }

  private getAddRoutePathsObject(): Record<string, ObjectValue> {
    const projectParams = ':projectID';
    if (this.config.isProjectRoute) {
      if (this.componentType === 'base') {
        return {
          prefix: { type: 'literal', value: '/project' },
          path: {
            type: 'literal',
            value: `${projectParams}/${this.config.routePath}`
          }
        };
      }

      return {
        prefix: { type: 'literal', value: `/${this.componentType}/project` },
        path: {
          type: 'literal',
          value: `${projectParams}/${this.config.routePath}`
        }
      };
    }

    if (this.componentType === 'base') {
      return {
        path: {
          type: 'literal',
          value: `/${this.config.routePath}`
        }
      };
    }

    return {
      path: {
        type: 'literal',
        value: `/${this.componentType}/${this.config.routePath}`
      }
    };
  }

  private getAddRouteConfigObject(): Record<string, ObjectValue> {
    return {
      key: {
        type: 'literal',
        value: StrUtils.convertFirstLetterToLowerCase(
          this.pageComponentManager.config.componentName
        )
      },
      path: {
        type: 'identifier',
        name: `${this.config.routeDataIndexObjectPathWithComponent}.path`
      },
      element: {
        type: 'JSXElement',
        name: this.pageComponentManager.config.componentName,
        selfClosing: true
      }
    };
  }

  private async updateRoutePaths() {
    const addObject = this.getAddRoutePathsObject();

    await BabelUtils.addKeyToObject({
      filePath: this.config.routeDataAtPath,
      objectName: this.config.routeDataVariableName,
      keyPath: [
        this.componentType.toLocaleUpperCase(),
        StrUtils.camelCaseToUpperCaseSnakeCase(
          this.pageComponentManager.config.componentName
        )
      ],
      value: {
        type: 'literal',
        value: {
          index: {
            type: 'literal',
            value: addObject
          }
        }
      }
    });
  }

  private async createComponentLoaderDeclaration() {
    const importPath = PathUtils.getRelativePath(
      this.config.routeConfigAtPath,
      this.pageComponentManager.config.componentPath,
      true
    );

    await BabelUtils.addReactLoaderComponentDeclaration({
      filePath: this.config.routeConfigAtPath,
      componentName: this.pageComponentManager.config.componentName,
      importPath
    });
  }

  private async updateRouteConfig() {
    await this.createComponentLoaderDeclaration();

    await BabelUtils.addItemToArray({
      filePath: this.config.routeConfigAtPath,
      variableName: this.config.routeConfigVariableName,
      value: {
        type: 'literal',
        value: this.getAddRouteConfigObject()
      }
    });
  }

  run: () => Promise<void> = async () => {
    try {
      await this.getRoutePathConfig();
      await Promise.all([this.updateRoutePaths(), this.updateRouteConfig()]);
    } catch (error) {
      throw new Error(`generate route config: ${error}`);
    }
  };
}
