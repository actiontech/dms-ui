import { lazy } from 'react';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { DiagnosisRouterConfig as config } from 'diagnosis/src/router/router';

const ProjectDetail = lazy(() => import('../../page/Project/Detail'));

export const DiagnosisRouterConfig: RouterConfigItem[] = [
  {
    path: 'diagnosis/project/*',
    key: 'diagnosis',
    element: <ProjectDetail />,
    children: config
  }
];
