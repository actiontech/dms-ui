import {
  IAuditResult,
  ISQLRuleExceptionResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { ReactNode } from 'react';

export type IAuditResultItem = IAuditResult & {
  isRuleDeleted?: boolean;
  annotation?: string;
  desc?: string;
};

export type SkippedAuditResultItem = IAuditResult &
  Partial<ISQLRuleExceptionResV1>;

export type RuleExceptionContext = {
  projectName: string;
  projectID?: string;
  instanceName?: string;
  instanceId?: string;
  dbType?: string;
  sqlFingerprint?: string;
};

export type TypeData = {
  auditResult: Array<IAuditResultItem>;
  skippedAuditResult?: Array<SkippedAuditResultItem>;
  sql: string;
  sqlSourceFile?: string;
  sqlStartLine?: number;
  auditStatus?: string;
};

export interface DetailReportDrawerProps {
  open: boolean;
  title: ReactNode | string;
  data: TypeData | null;
  onClose: () => void;
  showAnnotation?: boolean;
  showSourceFile?: boolean;
  loading?: boolean;
  extra?: ReactNode;
  ruleExceptionContext?: RuleExceptionContext;
  canCreateRuleException?: boolean;
  onRuleExceptionCreated?: () => void;
}

export type RuleExceptionFormFields = {
  reason: string;
};

export type RuleExceptionDrawerProps = {
  open: boolean;
  data?: IAuditResultItem;
  context?: RuleExceptionContext;
  onClose: () => void;
  onCreated?: () => void;
};
