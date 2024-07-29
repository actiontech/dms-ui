import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { ReactNode } from 'react';

export type IAuditResultItem = IAuditResult & {
  isRuleDeleted?: boolean;
  annotation?: string;
};

export type TypeData = {
  auditResult: Array<IAuditResultItem>;
  sql: string;
  sqlSourceFile?: string;
  sqlStartLine?: number;
};

export interface DetailReportDrawerProps {
  open: boolean;
  title: ReactNode | string;
  data: TypeData | null;
  onClose: () => void;
  showAnnotation?: boolean;
  showSourceFile?: boolean;
  loading?: boolean;
}
