import { IBasicTable } from '@actiontech/shared/lib/components/BasicTable';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { IAuditFileStatistic } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../../../../../../locale';
import { SqlFileOutlined } from '@actiontech/icons';

export const SortableSqlFilesModalColumns: () => IBasicTable<
  IAuditFileStatistic & { index: number }
>['columns'] = () => {
  return [
    {
      dataIndex: 'exec_order',
      title: () =>
        t(
          'execWorkflow.audit.fileModeExecute.sortableSQLFilesModal.tableColumns.execOrder'
        ),
      render: (num: number) => {
        if (typeof num === 'undefined') {
          return '-';
        }
        return `#${num}`;
      }
    },
    {
      dataIndex: 'index',
      title: () =>
        t(
          'execWorkflow.audit.fileModeExecute.sortableSQLFilesModal.tableColumns.index'
        ),
      render: (num: number) => {
        if (typeof num === 'undefined') {
          return '-';
        }
        return `#${num}`;
      }
    },
    {
      dataIndex: 'file_name',
      title: () =>
        t(
          'execWorkflow.audit.fileModeExecute.sortableSQLFilesModal.tableColumns.fileName'
        ),
      className: 'ellipsis-column-width',
      render: (fileName: string) => {
        if (!fileName) {
          return '-';
        }

        return (
          <TableColumnWithIconStyleWrapper>
            <SqlFileOutlined />
            <BasicTypographyEllipsis textCont={fileName} copyable={false} />
          </TableColumnWithIconStyleWrapper>
        );
      }
    }
  ];
};
