import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';

export type AuditResultMessageProps = {
  auditResult?: IAuditResult & { annotation?: string };
  styleClass?: string;
  showAnnotation?: boolean;
  showMoreBtn?: boolean;
  moreBtnLink?: string;
};
