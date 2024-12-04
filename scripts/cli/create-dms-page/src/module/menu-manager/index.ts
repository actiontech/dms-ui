import { IComponentType } from '../../create-dms-page';
import { PathUtils } from '../../utils/path-utils';
import { IMenuConfig, IMenuManager } from './interface';
import { IPageComponentManager } from '../page-component-manager/interface';
import { IRoutePathConfigManager } from '../route-path-config-manager/interface';
import { IIconManager } from '../icon-manager/interface';
import { BabelUtils, ObjectValue } from '../../utils/babel-utils';
import { StrUtils } from '../../utils/str-utils';
import { ILocaleManager } from '../locale-manager/interface';

export class MenuManager implements IMenuManager {
  config!: IMenuConfig;

  constructor(
    private readonly componentType: IComponentType,
    private readonly iconManager: IIconManager,
    private readonly pageComponentManager: IPageComponentManager,
    private readonly localeManager: ILocaleManager,
    private readonly routePathManager: IRoutePathConfigManager
  ) {}

  private getMenuConfig() {
    this.config = {
      menuAtPath: PathUtils.getMenuDataAtPath(this.componentType),
      menuStructTreeKeyTypeAnnotationAtPath:
        PathUtils.getMenuDataTypeAnnotationAtPath(),
      menuItemVariableName: `${StrUtils.convertFirstLetterToLowerCase(
        this.pageComponentManager.config.componentName
      )}`,
      menuStructTreeKeyTypeAnnotationName: `${StrUtils.convertFirstLetterToUpperCase(
        this.componentType
      )}MenuStructTreeKey`,
      menuItemArrowFunctionTypeAnnotationName: 'GenerateMenuItemType',
      menuStructKey: this.routePathManager.config.routePath,
      menusCollectionVariableName: `${this.componentType}MenusCollection`
    };
  }

  private generateMenuItemKey(): ObjectValue {
    if (this.routePathManager.config.isProjectRoute) {
      const prefix =
        this.componentType === 'base'
          ? 'project/'
          : `${this.componentType}/project/`;

      const suffix = `/${this.routePathManager.config.routePath}`;

      return {
        type: 'templateLiteral',
        quasis: [
          {
            raw: prefix,
            tail: false
          },
          {
            raw: suffix,
            tail: true
          }
        ],
        names: ['SIDE_MENU_DATA_PLACEHOLDER_KEY']
      };
    }

    return {
      type: 'literal',
      value: this.routePathManager.config.routePath
    };
  }

  private generateMenuItemValueData(): Record<string, ObjectValue> {
    return {
      label: {
        type: 'JSXElement',
        name: 'TypedLink',
        attribute: this.routePathManager.config.isProjectRoute
          ? [
              {
                name: 'to',
                value: {
                  type: 'identifier',
                  name: this.routePathManager.config
                    .routeDataIndexObjectPathWithComponent
                }
              },
              {
                name: 'params',
                value: {
                  type: 'literal',
                  value: {
                    projectID: {
                      type: 'shorthand',
                      name: 'projectID'
                    }
                  }
                }
              }
            ]
          : [
              {
                name: 'to',
                value: {
                  type: 'identifier',
                  name: this.routePathManager.config
                    .routeDataIndexObjectPathWithComponent
                }
              }
            ],
        selfClosing: false,
        children: [
          {
            type: 'function',
            functionName: 't',
            params: [
              {
                type: 'literal',
                value: this.localeManager.config.menuI18nKeyPath
              }
            ]
          }
        ]
      },
      icon: {
        type: 'JSXElement',
        name: this.iconManager.config.iconName,
        selfClosing: true,
        attribute: [
          {
            name: 'width',
            value: {
              type: 'identifier',
              name: '18'
            }
          },
          {
            name: 'height',
            value: {
              type: 'identifier',
              name: '18'
            }
          }
        ]
      },
      key: this.generateMenuItemKey(),
      structKey: {
        type: 'literal',
        value: this.config.menuStructKey
      }
    };
  }

  private async generateMenuItemArrowFunctionExpression() {
    await BabelUtils.addStringLiteralToType({
      filePath: this.config.menuStructTreeKeyTypeAnnotationAtPath,
      typeName: this.config.menuStructTreeKeyTypeAnnotationName,
      stringLiteral: this.config.menuStructKey
    });
    await BabelUtils.updateImportDeclaration({
      filePath: this.config.menuAtPath,
      moduleSpecifier: this.iconManager.config.iconLibName,
      specifiers: [this.iconManager.config.iconName]
    });
    await BabelUtils.addMenuItemVariable({
      filePath: this.config.menuAtPath,
      variableName: this.config.menuItemVariableName,
      value: {
        type: 'literal',
        value: this.generateMenuItemValueData()
      }
    });
  }

  private async exportMenuItemArrowFunctionExpression() {
    await BabelUtils.addItemToArray({
      filePath: this.config.menuAtPath,
      variableName: this.config.menusCollectionVariableName,
      value: { type: 'identifier', name: this.config.menuItemVariableName }
    });
  }

  async run(): Promise<void> {
    this.getMenuConfig();

    await this.generateMenuItemArrowFunctionExpression();
    await this.exportMenuItemArrowFunctionExpression();
  }
}
