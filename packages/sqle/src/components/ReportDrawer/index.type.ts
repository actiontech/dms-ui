import { ReactNode } from 'react';
import { ISkippedByRuleExceptionItem } from '@actiontech/shared/lib/api/sqle/service/common';
import { IAuditResultWithExtra } from '../AuditResultMessage/index.type';
import { ISqlManageRuleExceptionContext } from '../../page/RuleException/index.data';
import { OpenCreateAuditWhitelistExceptionParams } from '../RuleException/AddRuleExceptionButton';

export type IAuditResultItem = IAuditResultWithExtra & {
  isRuleDeleted?: boolean;
};

export type TypeData = {
  auditResult: Array<IAuditResultItem>;
  sql: string;
  sqlSourceFile?: string;
  sqlStartLine?: number;
  auditStatus?: string;
  skippedByRuleException?: ISkippedByRuleExceptionItem[];
  auditLevel?: string;
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
  sqlManageContext?: ISqlManageRuleExceptionContext;
  onOpenCreateException?: (
    params: OpenCreateAuditWhitelistExceptionParams
  ) => void;
  onRefresh?: () => void;
  status?: string;
  enrichAuditResultItem?: (item: IAuditResultItem) => IAuditResultItem;
  enrichSkippedItem?: (
    item: ISkippedByRuleExceptionItem
  ) => ISkippedByRuleExceptionItem & {
    annotation?: string;
    db_type?: string;
    isRuleDeleted?: boolean;
  };
}
