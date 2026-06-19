import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { getAuditTaskSQLsV2FilterAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import {
  InstanceTipResV2SupportedBackupStrategyEnum,
  UpdateSqlBackupStrategyReqStrategyEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type AuditResultTableProps = {
  noDuplicate: boolean;
  taskID?: string;
  auditLevelFilterValue?: getAuditTaskSQLsV2FilterAuditLevelEnum | null;
  projectID: string;
  updateTaskRecordCount?: (taskId: string, sqlNumber: number) => void;
  dbType?: string;
  projectName?: string;
  instanceName?: string;
  allowSwitchBackupPolicy?: boolean;
  onBatchSwitchBackupPolicy?: (
    currentTaskID?: string,
    supportedBackupStrategy?: InstanceTipResV2SupportedBackupStrategyEnum[]
  ) => void;
  supportedBackupPolicies?: InstanceTipResV2SupportedBackupStrategyEnum[];
  updateTaskAuditRuleExceptionStatus?: (taskSqls: IAuditTaskSQLResV2[]) => void;
  canCreateRuleException?: boolean;
  onRuleExceptionCreated?: () => void;
};

export type AuditResultDrawerProps = {
  open: boolean;
  onClose: () => void;
  auditResultRecord?: IAuditTaskSQLResV2;
  dbType?: string;
  projectID?: string;
  projectName?: string;
  instanceName?: string;
  canCreateRuleException?: boolean;
  onRuleExceptionCreated?: () => void;
  clickAnalyze: (sqlNum?: number) => void;
  handleClickSqlRewritten?: (record?: IAuditTaskSQLResV2) => void;
};

export type SwitchSqlBackupStrategyModalProps = {
  open: boolean;
  onCancel: () => void;
  taskID?: string;
  sqlID?: number;
  refresh: () => void;
  supportedBackupPolicies?: InstanceTipResV2SupportedBackupStrategyEnum[];
  currentStrategy?: UpdateSqlBackupStrategyReqStrategyEnum;
};
