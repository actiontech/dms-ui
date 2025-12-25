// @warn/cli/create-dms-page
import { existsSync } from 'fs';
import path from 'path';
import { IComponentType } from '../create-dms-page';
export class PathUtils {
  static CLI_ROOT_CWD = path.resolve(__dirname, '..', '..');
  static DMS_ROOT_CWD = path.join(this.CLI_ROOT_CWD, '..', '..', '..');
  static SQLE_ROOT_CWD = path.join(this.DMS_ROOT_CWD, 'packages', 'sqle');
  static BASE_ROOT_CWD = path.join(this.DMS_ROOT_CWD, 'packages', 'base');
  static SHARED_ROOT_CWD = path.join(this.DMS_ROOT_CWD, 'packages', 'shared');

  // icon path
  static ICON_ROOT_CWD = path.join(this.DMS_ROOT_CWD, 'packages', 'icons');
  static getIconDirectoryAtPath(style: string, type?: string): string {
    const iconPath = type
      ? path.join(PathUtils.ICON_ROOT_CWD, 'svg', style, type)
      : path.join(PathUtils.ICON_ROOT_CWD, 'svg', style);

    if (!existsSync(iconPath)) {
      throw new Error(
        `${iconPath} does not exist. Please check the icon package path under the packages directory!`
      );
    }

    return iconPath;
  }

  // local path
  static getLocaleDirectoryAtPath(type: IComponentType) {
    const localeDirAtPath = path.join(
      PathUtils.getRootCWDWithType(type),
      'src',
      'locale',
      'zh-CN'
    );

    if (!existsSync(localeDirAtPath)) {
      throw new Error(
        `${localeDirAtPath} does not exist. Please check the path under the packages directory!`
      );
    }

    return localeDirAtPath;
  }
  static getLocaleIndexFileAtPath(type: IComponentType) {
    const localeDirAtPath = this.getLocaleDirectoryAtPath(type);

    const indexFileAtPath = path.join(localeDirAtPath, 'index.ts');

    if (!existsSync(indexFileAtPath)) {
      throw new Error(
        `${indexFileAtPath} does not exist. Please check the path under the packages directory!`
      );
    }

    return indexFileAtPath;
  }
  static getLocaleModuleFileAtPath(type: IComponentType, moduleName: string) {
    const localeModuleFileAtPath = path.join(
      this.getLocaleDirectoryAtPath(type),
      `${moduleName}.ts`
    );

    if (existsSync(localeModuleFileAtPath)) {
      throw new Error(
        `${localeModuleFileAtPath} does exist. Please check the path under the packages directory!`
      );
    }

    return localeModuleFileAtPath;
  }
  static getMenu18nLocaleFileAtPath() {
    const menuI18nFileAtPath = path.join(
      PathUtils.getRootCWDWithType('base'),
      'src',
      'locale',
      'zh-CN',
      'dmsMenu.ts'
    );

    if (!existsSync(menuI18nFileAtPath)) {
      throw new Error(
        `${menuI18nFileAtPath} does not exist. Please check the path under the packages directory!`
      );
    }

    return menuI18nFileAtPath;
  }

  // component path
  static getComponentDirectoryAtPath(type: IComponentType) {
    const componentDirAtPath = path.join(
      PathUtils.getRootCWDWithType(type),
      'src',
      'page'
    );

    if (!existsSync(componentDirAtPath)) {
      throw new Error(
        `${componentDirAtPath} does not exist. Please check the path under the packages directory!`
      );
    }

    return componentDirAtPath;
  }
  static getComponentIndexFileAtPath(
    type: IComponentType,
    componentName: string
  ) {
    const componentDirAtPath = this.getComponentDirectoryAtPath(type);

    return path.join(componentDirAtPath, componentName, 'index.tsx');
  }

  // router path
  static getRouteConfigAtPath(type: IComponentType) {
    let configAtPath = '';
    if (type === 'base') {
      configAtPath = path.join(
        PathUtils.getRootCWDWithType('base'),
        'src',
        'router',
        'router.base.tsx'
      );
    }

    if (type === 'sqle') {
      configAtPath = path.join(
        PathUtils.getRootCWDWithType('sqle'),
        'src',
        'router',
        'config.tsx'
      );
    }
    if (type === 'provision') {
      configAtPath = path.join(
        PathUtils.getRootCWDWithType('provision'),
        'src',
        'router',
        'router.tsx'
      );
    }

    if (!configAtPath) {
      throw new Error(
        `No routing configuration file corresponding to ${type} was found`
      );
    }

    if (!existsSync(configAtPath)) {
      throw new Error(
        `${configAtPath} does not exist. Please check the path under the packages directory!`
      );
    }

    return configAtPath;
  }
  static getRouteDataAtPath() {
    const routeDataAtPath = path.join(
      PathUtils.SHARED_ROOT_CWD,
      'lib',
      'data',
      'routePaths.ts'
    );

    if (!existsSync(routeDataAtPath)) {
      throw new Error(
        `${routeDataAtPath} does not exist. Please check the path under the packages directory!`
      );
    }

    return routeDataAtPath;
  }

  // menu path
  static getMenuDataAtPath(type: IComponentType) {
    const menuDataAtPath = path.join(
      PathUtils.getRootCWDWithType('base'),
      'src',
      'page',
      'Nav',
      'SideMenu',
      'MenuList',
      'menus',
      `${type}.tsx`
    );

    if (!existsSync(menuDataAtPath)) {
      throw new Error(
        `${menuDataAtPath} does not exist. Please check the path under the packages directory!`
      );
    }

    return menuDataAtPath;
  }
  static getMenuDataTypeAnnotationAtPath() {
    const menuStructTreeKeyTypeAnnotationAtPath = path.join(
      PathUtils.getRootCWDWithType('base'),
      'src',
      'page',
      'Nav',
      'SideMenu',
      'MenuList',
      'menus',
      `index.type.ts`
    );

    if (!existsSync(menuStructTreeKeyTypeAnnotationAtPath)) {
      throw new Error(
        `${menuStructTreeKeyTypeAnnotationAtPath} does not exist. Please check the path under the packages directory!`
      );
    }

    return menuStructTreeKeyTypeAnnotationAtPath;
  }

  static getRootCWDWithType(
    type: 'sqle' | 'base' | 'shared' | 'icons' | 'provision'
  ) {
    return path.join(this.DMS_ROOT_CWD, 'packages', type);
  }

  static getRelativePath(from: string, to: string, isFile?: boolean): string {
    const normalize = (str: string) => {
      return str.replace(/[\\/]+$/, '').split(/[\\/]+/);
    };

    const fromParts = normalize(from);
    const toParts = normalize(to);

    if (isFile) {
      fromParts.pop();
      toParts.pop();
    }

    let i = 0;
    while (
      i < fromParts.length &&
      i < toParts.length &&
      fromParts[i] === toParts[i]
    ) {
      i++;
    }

    const upCount = fromParts.length - i;
    const relativeParts = [...Array(upCount).fill('..'), ...toParts.slice(i)];

    return relativeParts.length === 0 ? '.' : relativeParts.join('/');
  }
}
