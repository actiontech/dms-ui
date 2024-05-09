import { ModeSwitcherOptionsType } from '@actiontech/shared/lib/components/ModeSwitcher/index.type';
import {
  IconOrderFileUpload,
  IconOrderSQLUpload
} from '../../../../icon/Order';
import { t } from '../../../../locale';
import { CreateAuditTasksGroupReqV1ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const sqlExecuteModeOptions: ModeSwitcherOptionsType = [
  {
    label: t('order.sqlInfo.executeSqlMode'),
    icon: <IconOrderSQLUpload />,
    value: CreateAuditTasksGroupReqV1ExecModeEnum.sqls,
    colProps: {
      span: 12
    }
  },
  {
    label: t('order.sqlInfo.executeFileMode'),
    icon: <IconOrderFileUpload />,
    value: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
    colProps: {
      span: 12
    }
  }
];
