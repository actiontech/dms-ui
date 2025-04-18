import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';

export type AuditResultMessageProps = {
  auditResult?: IAuditResult & { annotation?: string };
  styleClass?: string;
  showAnnotation?: boolean;
  moreBtnLink?: string;
  isRuleDeleted?: boolean;
};

export type ResultIconRenderProps = {
  auditResultInfo?: Array<{ level: string; executionFailed: boolean }>;
  isAuditing?: boolean;
};

export type AuditExceptionItemProps = {
  auditExceptionResult: IAuditResult;
};
