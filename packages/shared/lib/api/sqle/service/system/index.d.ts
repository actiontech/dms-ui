import { IGetModuleStatusResV1 } from '../common.d';

import {
  getSystemModuleStatusDbTypeEnum,
  getSystemModuleStatusModuleNameEnum
} from './index.enum';

export interface IGetSystemModuleStatusParams {
  db_type?: getSystemModuleStatusDbTypeEnum;

  module_name?: getSystemModuleStatusModuleNameEnum;
}

export interface IGetSystemModuleStatusReturn extends IGetModuleStatusResV1 {}
