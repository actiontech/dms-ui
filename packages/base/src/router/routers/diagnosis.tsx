import { lazy } from 'react';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { DiagnosisRouterConfig as config } from 'diagnosis/src/router/router';
import { BaseRouterConfig } from './base';

const ProjectDetail = lazy(() => import('../../page/Project/Detail'));

export const DiagnosisRouterConfig: RouterConfigItem[] = [
  ...BaseRouterConfig,
  {
    path: 'diagnosis/project/*',
    key: 'diagnosis',
    element: <ProjectDetail />,
    children: config
  }
];
