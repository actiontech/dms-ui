import type { ReactNode } from 'react';
import { ISkippedByRuleExceptionItem } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IAuditResultItem } from '../../ReportDrawer/index.type';
import { ISqlManageRuleExceptionContext } from '../../../page/RuleException/index.data';
import { enrichSkippedRuleExceptionItem } from '../../AuditResultMessage/auditResultDisplay';
import { OpenCreateAuditWhitelistExceptionParams } from '../AddRuleExceptionButton';

export type AuditResultExemptionPanelLayout = 'report' | 'diff';

export type AuditResultExemptionActionsConfig = {
  sqlManageContext?: ISqlManageRuleExceptionContext;
  onOpenCreateException?: (
    params: OpenCreateAuditWhitelistExceptionParams
  ) => void;
  onRefresh?: () => void;
  status?: SqlManageStatusEnum | string;
  showRuleExceptionActions?: boolean;
  showExemptedActions?: boolean;
};

export type AuditResultExemptionEnrichConfig = {
  enrichAuditResultItem?: (item: IAuditResultItem) => IAuditResultItem;
  enrichSkippedItem?: (
    item: ISkippedByRuleExceptionItem
  ) => ReturnType<typeof enrichSkippedRuleExceptionItem>;
  renderAuditResultItem?: (
    item: IAuditResultItem,
    index: number,
    options?: {
      showRuleExceptionActions?: boolean;
      showExemptedActions?: boolean;
    }
  ) => ReactNode;
};

export type AuditResultExemptionPanelProps = {
  auditResult?: IAuditResultItem[];
  skippedByRuleException?: ISkippedByRuleExceptionItem[];
  auditLevel?: string;
  layout?: AuditResultExemptionPanelLayout;
  showAnnotation?: boolean;
  auditStatus?: string;
  actions?: AuditResultExemptionActionsConfig;
  enrichment?: AuditResultExemptionEnrichConfig;
} & AuditResultExemptionActionsConfig &
  AuditResultExemptionEnrichConfig;
