import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';

export type AuditResultMessageProps = {
  auditResult?: IAuditResult & { annotation?: string };
  styleClass?: string;
  showAnnotation?: boolean;
  moreBtnLink?: string;
  deleteStatus?: boolean;
};
