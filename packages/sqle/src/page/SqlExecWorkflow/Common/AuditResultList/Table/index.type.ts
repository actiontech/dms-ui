import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { getAuditTaskSQLsV2FilterAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { InstanceTipResV1SupportedBackupStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { AuditResultListProps } from '../index.type';

export interface AuditResultTableProps
  extends Pick<
    AuditResultListProps,
    | 'updateTaskRecordCount'
    | 'allowSwitchBackupPolicy'
    | 'updateTaskAuditRuleExceptionStatus'
  > {
  noDuplicate: boolean;
  taskID?: string;
  auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum | null;
  projectID: string;
  dbType?: string;
  supportedBackupPolicies?: InstanceTipResV1SupportedBackupStrategyEnum[];
}

export type AuditResultDrawerProps = {
  open: boolean;
  onClose: () => void;
  auditResultRecord?: IAuditTaskSQLResV2;
  dbType?: string;
  clickAnalyze: (sqlNum?: number) => void;
  handleClickSqlRewritten?: (record: IAuditTaskSQLResV2) => void;
};

export type SwitchSqlBackupStrategyModalProps = {
  sqlID?: number;
  open: boolean;
  onCancel: () => void;
  taskID?: string;
  refresh: () => void;
  supportedBackupPolicies?: InstanceTipResV1SupportedBackupStrategyEnum[];
};
