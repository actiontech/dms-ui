import { IModuleBase } from '../interface';

export interface IRoutePathConfig {
  isProjectRoute: boolean;
  routePath: string;
  routeDataAtPath: string;
  routeDataVariableName: string;
  routeDataIndexObjectPathWithComponent: string;
  routeConfigAtPath: string;
  routeConfigVariableName: string;
}

export interface IRoutePathConfigManager
  extends IModuleBase<IRoutePathConfig> {}
