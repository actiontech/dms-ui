import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { ReactNode } from 'react';

export type typeData = {
  auditResult: Array<{ annotation?: string } & IAuditResult>;
  sql: string;
};

export interface DetailReportDrawerProps {
  open: boolean;
  title: ReactNode | string;
  data: typeData | null;
  onClose: () => void;
  footer?: ReactNode;
  dbType?: string;
  showAnnotation?: boolean;
}
