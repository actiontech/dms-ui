import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import { SystemRole } from '../data/common';
import { I18nKey } from '../locale';

export type GlobalRouterItemKeyLiteral =
  | 'reportStatistics'
  | 'globalRuleTemplate'
  | 'globalRuleTemplateCreate'
  | 'globalRuleTemplateImport'
  | 'globalRuleTemplateUpdate'
  | 'customRule'
  | 'createCustomRule'
  | 'updateCustomRule'
  | 'projectDetail'
  | 'System'
  | 'ruleManager'
  | 'redirect';

export type ProjectDetailRouterItemKeyLiteral =
  | 'order'
  | 'orderList'
  | 'orderCreate'
  | 'orderDetail'
  | 'orderAnalyze'
  | 'plane'
  | 'auditPlanDetail'
  | 'auditPlanDetailReport'
  | 'auditPlan'
  | 'auditPlanCreate'
  | 'auditPlanUpdate'
  | 'progress'
  | 'progressDetail'
  | 'progressUpdate'
  | 'Whitelist'
  | 'data'
  | 'dataCreate'
  | 'dataUpdate'
  | 'ruleTemplate'
  | 'ruleTemplateCreate'
  | 'ruleTemplateImport'
  | 'ruleTemplateUpdate'
  | 'projectOverview'
  | 'projectRedirect'
  | 'dashboard'
  | 'rule'
  | 'operationRecord'
  | 'sqlAudit'
  | 'sqlAuditList'
  | 'sqlAuditCreate'
  | 'sqlAuditDetail';

export type RouterConfigItem<T extends string> = {
  role?: Array<SystemRole | ''>;
  label?: I18nKey;
  labelWithoutI18n?: string;
  key: T;
  icon?: ReactNode;
  children?: RouterConfigItem<T>[];
  hideChildrenInSliderMenu?: boolean;
  hideInSliderMenu?: boolean;
  hightLightMenuKey?: string;
  groups?: Array<{
    title: ReactNode;
    values: RouterConfigItem<T>[];
    key: string;
  }>;
} & RouteObject;
