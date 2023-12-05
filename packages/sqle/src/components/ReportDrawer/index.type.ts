import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { ReactNode } from 'react';

export type TypeData = {
  auditResult: Array<{ annotation?: string } & IAuditResult>;
  sql: string;
  sqlSourceFile?: string;
};

export interface DetailReportDrawerProps {
  open: boolean;
  title: ReactNode | string;
  data: TypeData | null;
  onClose: () => void;
  showAnnotation?: boolean;
  showSourceFile?: boolean;
}
