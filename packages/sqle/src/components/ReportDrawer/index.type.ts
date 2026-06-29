import { ReactNode } from 'react';
import { IAuditResultWithExtra } from '../AuditResultMessage/index.type';

export type IAuditResultItem = IAuditResultWithExtra & {
  isRuleDeleted?: boolean;
};

export type TypeData = {
  auditResult: Array<IAuditResultItem>;
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
}
