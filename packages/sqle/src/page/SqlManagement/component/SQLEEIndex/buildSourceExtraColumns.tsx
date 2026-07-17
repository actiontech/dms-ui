import { BasicTypographyEllipsis, BasicToolTips } from '@actiontech/shared';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import {
  ISourceExtraHead,
  ISqlManage
} from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../locale';
import { SqlManagementTableFilterParamType } from './column';

export const buildSourceExtraColumns = (
  headList: ISourceExtraHead[]
): ActiontechTableColumn<
  ISqlManage,
  SqlManagementTableFilterParamType,
  string
> => {
  return headList.map((head) => {
    const dataIndex = head.name ?? '';
    const columnTitle = head.desc || head.name || '';
    return {
      dataIndex,
      title: () => (
        <BasicToolTips title={t('sqlManagement.table.column.sourceExtraTips')}>
          <span className="sql-manage-source-extra-mark">{columnTitle}</span>
        </BasicToolTips>
      ),
      className: 'sql-manage-source-extra-column',
      settingMarked: true,
      sorter: !!head.sortable,
      sortDirections: ['descend', 'ascend'] as ['descend', 'ascend'],
      render: (value: string | undefined) => {
        if (value === undefined || value === null || value === '') {
          return '-';
        }
        return <BasicTypographyEllipsis textCont={String(value)} />;
      }
    };
  });
};
