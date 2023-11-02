import { lazy } from 'react';

import { projectDetailRouterConfig } from 'sqle/src/router/config';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';

const ProjectDetail = lazy(() => import('../../page/Project/Detail'));

//sqle global page
const Rule = lazy(() => import('sqle/src/page/Rule'));
const RuleManager = lazy(() => import('sqle/src/page/RuleManager'));
const GlobalRuleTemplateDetail = lazy(
  () => import('sqle/src/page/GlobalRuleTemplate/RuleTemplateDetail')
);
const GlobalImportRuleTemplate = lazy(
  () => import('sqle/src/page/GlobalRuleTemplate/ImportRuleTemplate')
);
const GlobalUpdateRuleTemplate = lazy(
  () => import('sqle/src/page/GlobalRuleTemplate/UpdateRuleTemplate')
);
const GlobalCreateRuleTemplate = lazy(
  () => import('sqle/src/page/GlobalRuleTemplate/CreateRuleTemplate')
);
const CreateCustomRule = lazy(
  () => import('sqle/src/page/CustomRule/CreateCustomRule')
);
const UpdateCustomRule = lazy(
  () => import('sqle/src/page/CustomRule/UpdateCustomRule')
);
const ReportStatistics = lazy(() => import('sqle/src/page/ReportStatistics'));

export const SQLERouterConfig: RouterConfigItem[] = [
  //====== 这部分路由为sqle特有的全局页面, 所以无法放在 projectDetailRouterConfig, 其内容为 sqle 中 globalRouterConfig 的展开项
  {
    path: 'sqle/reportStatistics',
    label: 'menu.reportStatistics',
    element: <ReportStatistics />,
    key: 'reportStatistics',
    role: [SystemRole.admin]
  },
  {
    path: 'sqle/rule',
    label: 'menu.rule',
    element: <Rule />,
    key: 'rule'
  },
  {
    key: 'ruleManager',
    path: 'sqle/ruleManager',
    role: [SystemRole.admin],
    children: [
      {
        index: true,
        element: <RuleManager />
      },
      {
        path: 'globalCreate',
        key: 'globalRuleTemplateCreate',
        element: <GlobalCreateRuleTemplate />
      },
      {
        path: 'globalImport',
        key: 'globalRuleTemplateImport',
        element: <GlobalImportRuleTemplate />
      },
      {
        path: 'globalUpdate/:templateName',
        key: 'globalRuleTemplateUpdate',
        element: <GlobalUpdateRuleTemplate />
      },
      {
        path: 'globalDetail/:templateName/:dbType',
        key: 'globalRuleTemplateDetail',
        element: <GlobalRuleTemplateDetail />
      },
      {
        path: 'customCreate',
        key: 'createCustomRule',
        element: <CreateCustomRule />
      },
      {
        path: 'customUpdate/:ruleID',
        key: 'updateCustomRule',
        element: <UpdateCustomRule />
      }
    ] as RouterConfigItem[]
  },
  //=========
  {
    key: 'projectDetail',
    path: 'sqle/project/*',
    element: <ProjectDetail />,
    children: projectDetailRouterConfig
  }
];
