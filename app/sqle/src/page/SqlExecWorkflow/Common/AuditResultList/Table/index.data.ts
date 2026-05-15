import { UpdateSqlBackupStrategyReqStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../../../../locale/index';

export const BackupStrategyDictionary: {
  [key in UpdateSqlBackupStrategyReqStrategyEnum]: string;
} = {
  [UpdateSqlBackupStrategyReqStrategyEnum.reverse_sql]: t(
    'execWorkflow.create.backupStrategy.reverseSql'
  ),
  [UpdateSqlBackupStrategyReqStrategyEnum.original_row]: t(
    'execWorkflow.create.backupStrategy.originRow'
  ),
  [UpdateSqlBackupStrategyReqStrategyEnum.manual]: t(
    'execWorkflow.create.backupStrategy.manual'
  ),
  [UpdateSqlBackupStrategyReqStrategyEnum.none]: t(
    'execWorkflow.create.backupStrategy.none'
  )
};

export const BackupStrategyOptions: Array<{
  label: string;
  value: UpdateSqlBackupStrategyReqStrategyEnum;
}> = [
  {
    label:
      BackupStrategyDictionary[
        UpdateSqlBackupStrategyReqStrategyEnum.reverse_sql
      ],
    value: UpdateSqlBackupStrategyReqStrategyEnum.reverse_sql
  },
  {
    label:
      BackupStrategyDictionary[
        UpdateSqlBackupStrategyReqStrategyEnum.original_row
      ],
    value: UpdateSqlBackupStrategyReqStrategyEnum.original_row
  },
  {
    label:
      BackupStrategyDictionary[UpdateSqlBackupStrategyReqStrategyEnum.manual],
    value: UpdateSqlBackupStrategyReqStrategyEnum.manual
  },
  {
    label:
      BackupStrategyDictionary[UpdateSqlBackupStrategyReqStrategyEnum.none],
    value: UpdateSqlBackupStrategyReqStrategyEnum.none
  }
];
