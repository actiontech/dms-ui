import { lazy } from 'react';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { BaseRouterConfig } from './base';
import { AuthRouterConfig as ProvisionAuthRouterConfig } from 'provision/src/router/router';

const ProjectDetail = lazy(() => import('../../page/Project/Detail'));

export const ProvisionRouterConfig: RouterConfigItem[] = [
  ...BaseRouterConfig,
  {
    path: 'provision/project/*',
    key: 'provision',
    element: <ProjectDetail />,
    children: ProvisionAuthRouterConfig
  }
];
