import { UpdateSqlBackupStrategyReqStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../../../../locale/index';

export const getBackupStrategyDictionary = (): {
  [key in UpdateSqlBackupStrategyReqStrategyEnum]: string;
} => ({
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
});

export const getBackupStrategyOptions = (): Array<{
  label: string;
  value: UpdateSqlBackupStrategyReqStrategyEnum;
}> => {
  const dict = getBackupStrategyDictionary();
  return [
    {
      label: dict[UpdateSqlBackupStrategyReqStrategyEnum.reverse_sql],
      value: UpdateSqlBackupStrategyReqStrategyEnum.reverse_sql
    },
    {
      label: dict[UpdateSqlBackupStrategyReqStrategyEnum.original_row],
      value: UpdateSqlBackupStrategyReqStrategyEnum.original_row
    },
    {
      label: dict[UpdateSqlBackupStrategyReqStrategyEnum.manual],
      value: UpdateSqlBackupStrategyReqStrategyEnum.manual
    },
    {
      label: dict[UpdateSqlBackupStrategyReqStrategyEnum.none],
      value: UpdateSqlBackupStrategyReqStrategyEnum.none
    }
  ];
};
