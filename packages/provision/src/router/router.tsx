import React, { ReactNode } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { DatabaseOutlined, SolutionOutlined } from '@ant-design/icons';
import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';

const Operation = React.lazy(() => import('../page/Data/Operation'));
const AuthList = React.lazy(() => import('../page/Auth/AuthList'));
const AddAuth = React.lazy(() => import('../page/Auth/AddAuth'));
const AuthTemplate = React.lazy(() => import('~/page/Auth/AuthTemplateList'));
const EditTemplate = React.lazy(() => import('~/page/Auth/EditTemplate'));

const AuthAudit = React.lazy(() => import('~/page/Audit/AuthAudit'));
const TemplateAudit = React.lazy(() => import('~/page/Audit/TemplateAudit'));
const ServiceAudit = React.lazy(() => import('~/page/Audit/ServiceAudit'));

const DataMaskRuleOverview = React.lazy(
  () => import('~/page/DataMaskRuleOverview')
);

export type RouterConfigItem = RouteObject & {
  label?: string;
  icon?: ReactNode;
  hideInMenu?: boolean;
  key: string;
  children?: RouterConfigItem[];
};

export const AuthRouterConfig: RouterConfigItem[] = [
  {
    label: 'provisionNav.menu.authManage',
    key: 'authManageWrapper',
    icon: <SolutionOutlined />,
    children: [
      {
        path: `${PROJECT_ROUTER_PARAM}/auth/list`,
        key: 'authList',
        label: 'provisionNav.menu.authList',
        element: <AuthList />
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/auth/list/:purpose`,
        key: 'filteredAuthList',
        hideInMenu: true,
        element: <AuthList />
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/auth/list/add`,
        key: 'addAuth',
        hideInMenu: true,
        element: <AddAuth />
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/auth/template`,
        key: 'authTemplate',
        label: 'provisionNav.menu.authTemplate',
        element: <AuthTemplate />
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/auth/template/:name`,
        key: 'filteredAuthTemplate',
        hideInMenu: true,
        element: <AuthTemplate />
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/auth/template/edit_template`,
        key: 'addTemplate',
        hideInMenu: true,
        element: <EditTemplate />
      },
      // #if [dms]
      {
        path: `${PROJECT_ROUTER_PARAM}/auth/data_mask_rule_overview`,
        key: 'dataMaskRuleOverview',
        label: 'dataMaskRuleOverview.list.title',
        element: <DataMaskRuleOverview />
      }
      // #endif
    ]
  },

  {
    label: 'provisionNav.menu.dataObjectWrapper',
    key: 'dataObjectWrapper',
    icon: <DatabaseOutlined />,
    children: [
      {
        path: `${PROJECT_ROUTER_PARAM}/data/operation`,
        key: 'operation',
        label: 'provisionNav.menu.operation',
        element: <Operation />
      }
    ]
  },
  {
    label: 'provisionNav.menu.auditWrapper',
    key: 'auditWrapper',
    icon: <DatabaseOutlined />,
    children: [
      {
        path: `${PROJECT_ROUTER_PARAM}/audit/auth`,
        key: 'authAudit',
        label: 'provisionNav.menu.authAudit',
        element: <AuthAudit />
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/audit/template`,
        key: 'templateAudit',
        label: 'provisionNav.menu.templateAudit',
        element: <TemplateAudit />
      },
      {
        path: `${PROJECT_ROUTER_PARAM}/audit/service`,
        key: 'serviceAudit',
        label: 'provisionNav.menu.serviceAudit',
        element: <ServiceAudit />
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
