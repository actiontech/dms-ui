import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { SQLERouterConfig } from './sqle';
import { ProvisionRouterConfig } from './provision';
import { DiagnosisRouterConfig } from './diagnosis';

export const DMSRouterConfig: RouterConfigItem[] = [
  ...SQLERouterConfig,
  ...ProvisionRouterConfig,
  ...DiagnosisRouterConfig
];
