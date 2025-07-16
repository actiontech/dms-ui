import { ActiontechTableActionMeta } from '@actiontech/shared';
import { IGlobalSqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../locale';

export const pendingSqlListAction: (
  onCheckDetail: (record?: IGlobalSqlManage) => void
) => {
  buttons: ActiontechTableActionMeta<IGlobalSqlManage>[];
} = (onCheckDetail) => {
  return {
    buttons: [
      {
        key: 'check-detail-button',
        text: t('globalDashboard.pendingSql.column.detail'),
        buttonProps: (record) => ({
          onClick: () => onCheckDetail(record)
        })
      }
    ]
  };
};
