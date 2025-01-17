import {
  IAuditResult,
  IRuleResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { ReactNode } from 'react';

export type IAuditResultItem = Omit<IRuleResV1, 'level'> &
  IAuditResult & {
    isRuleDeleted?: boolean;
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
  extra?: ReactNode;
}
