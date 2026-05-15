import { IModuleBase } from '../interface';

export interface IIconConfig {
  iconName: string;
  iconPath: string;
  iconSvgContent: string;
  iconLibName: string;
}

export interface IIconManager extends IModuleBase<IIconConfig> {}
