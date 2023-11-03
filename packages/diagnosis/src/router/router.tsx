import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { SolutionOutlined } from '@ant-design/icons';
import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';

const MonitorSourceConfig = React.lazy(
  () => import('../page/MonitorSourceConfig')
);

const MonitorConfig = React.lazy(
  () => import('../page/MonitorSourceConfig/components/MonitorConfig')
);

export type RouterConfigItem = {
  path?: string;
  label?: string;
  icon?: ReactNode;
  hideInMenu?: boolean;
  key: string;
  children?: RouterConfigItem[];
  element?: ReactNode;
};

export const DiagnosisRouterConfig: RouterConfigItem[] = [
  {
    label: 'dmsMenu.monitorSourceConfig',
    key: 'diagnosisWrapper',
    icon: <SolutionOutlined />,
    children: [
      {
        path: `${PROJECT_ROUTER_PARAM}/monitorSourceConfig`,
        key: 'monitorSourceConfig',
        label: 'dmsMenu.monitorSourceConfig',
        element: <MonitorSourceConfig />
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/:name/:id/:type/monitorConfigList`,
        key: 'monitorConfigList',
        element: <MonitorConfig />,
        hideInMenu: true
      }
    ]
  },
  {
    path: '*',
    hideInMenu: true,
    key: 'null',
    element: <Navigate to="/" />
  }
];
