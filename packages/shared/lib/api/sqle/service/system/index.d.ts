import {
  getSystemModuleStatusDbTypeEnum,
  getSystemModuleStatusModuleNameEnum
} from './index.enum';

import { IGetModuleStatusResV1 } from '../common.d';

export interface IGetSystemModuleStatusParams {
  db_type?: getSystemModuleStatusDbTypeEnum;

  module_name?: getSystemModuleStatusModuleNameEnum;
}

export interface IGetSystemModuleStatusReturn extends IGetModuleStatusResV1 {}
