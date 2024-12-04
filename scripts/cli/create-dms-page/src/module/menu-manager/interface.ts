import { IModuleBase } from '../interface';

export interface IMenuConfig {
  menuAtPath: string;
  menuItemVariableName: string;
  menuItemArrowFunctionTypeAnnotationName: string;
  menuStructTreeKeyTypeAnnotationName: string;
  menuStructTreeKeyTypeAnnotationAtPath: string;
  menuStructKey: string;
  menusCollectionVariableName: string;
}

export interface IMenuManager extends IModuleBase<IMenuConfig> {}
