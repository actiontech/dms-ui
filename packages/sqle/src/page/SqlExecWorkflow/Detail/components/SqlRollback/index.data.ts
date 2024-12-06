import { execStatusDictionary } from '../../../../../hooks/useStaticStatus/index.data';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { t } from '../../../../../locale';
import { BackupSqlDataBackupStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const SqlExecStatusOptions: Array<{
  label: string;
  value: getAuditTaskSQLsV2FilterExecStatusEnum;
}> = [
  {
    label: t(
      execStatusDictionary[getAuditTaskSQLsV2FilterExecStatusEnum.doing]
    ),
    value: getAuditTaskSQLsV2FilterExecStatusEnum.doing
  },
  {
    label: t(
      execStatusDictionary[getAuditTaskSQLsV2FilterExecStatusEnum.failed]
    ),
    value: getAuditTaskSQLsV2FilterExecStatusEnum.failed
  },
  {
    label: t(
      execStatusDictionary[getAuditTaskSQLsV2FilterExecStatusEnum.initialized]
    ),
    value: getAuditTaskSQLsV2FilterExecStatusEnum.initialized
  },
  {
    label: t(
      execStatusDictionary[
        getAuditTaskSQLsV2FilterExecStatusEnum.manually_executed
      ]
    ),
    value: getAuditTaskSQLsV2FilterExecStatusEnum.manually_executed
  },
  {
    label: t(
      execStatusDictionary[getAuditTaskSQLsV2FilterExecStatusEnum.succeeded]
    ),
    value: getAuditTaskSQLsV2FilterExecStatusEnum.succeeded
  },
  {
    label: t(
      execStatusDictionary[
        getAuditTaskSQLsV2FilterExecStatusEnum.terminate_failed
      ]
    ),
    value: getAuditTaskSQLsV2FilterExecStatusEnum.terminate_failed
  },
  {
    label: t(
      execStatusDictionary[
        getAuditTaskSQLsV2FilterExecStatusEnum.terminate_succeeded
      ]
    ),
    value: getAuditTaskSQLsV2FilterExecStatusEnum.terminate_succeeded
  },
  {
    label: t(
      execStatusDictionary[getAuditTaskSQLsV2FilterExecStatusEnum.terminating]
    ),
    value: getAuditTaskSQLsV2FilterExecStatusEnum.terminating
  }
];

export const SqlBackupStatusDictionary = {
  [BackupSqlDataBackupStatusEnum.succeed]: t(
    'execWorkflow.detail.rollback.backupSucceeded'
  ),
  [BackupSqlDataBackupStatusEnum.failed]: t(
    'execWorkflow.detail.rollback.backupFailed'
  ),
  [BackupSqlDataBackupStatusEnum.waiting_for_execution]: t(
    'execWorkflow.detail.rollback.backupWaitingForExecution'
  ),
  [BackupSqlDataBackupStatusEnum.executing]: t(
    'execWorkflow.detail.rollback.backupExecuting'
  )
};
