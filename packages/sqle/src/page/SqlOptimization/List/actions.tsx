import { ActiontechTableActionMeta } from '@actiontech/dms-kit/es/components/ActiontechTable/index.type';
import { t } from '../../../locale';
import { IOptimizationRecord } from '@actiontech/shared/lib/api/sqle/service/common';

export const sqlOptimizationListActions = (
  onView: (record?: IOptimizationRecord) => void
): ActiontechTableActionMeta<IOptimizationRecord>[] => {
  return [
    {
      text: t('sqlOptimization.table.view'),
      key: 'view',
      buttonProps: (record) => {
        return {
          onClick: () => {
            onView(record);
          }
        };
      }
    }
  ];
};
