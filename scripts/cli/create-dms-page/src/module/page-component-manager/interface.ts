import { IModuleBase } from '../interface';

export interface IComponentConfig {
  componentName: string;
  componentPath: string;
  pageTitle: string;
}
export interface IPageComponentManager extends IModuleBase<IComponentConfig> {}
