import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { SQLERouterConfig } from './sqle';
import { ProvisionRouterConfig } from './provision';
import { DiagnosisRouterConfig } from './diagnosis';
import { BaseRouterConfig } from './base';

export const DMSRouterConfig: RouterConfigItem[] = [
  ...BaseRouterConfig,
  ...SQLERouterConfig,
  ...ProvisionRouterConfig,
  ...DiagnosisRouterConfig
];
