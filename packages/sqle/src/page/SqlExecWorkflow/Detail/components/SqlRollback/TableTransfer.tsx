import { BasicTable } from '@actiontech/dms-kit';
import {
  TableTransferProps,
  TableRowSelection,
  ExpandedBackupSqlType
} from './index.type';
import { useMedia } from '@actiontech/shared';
import classNames from 'classnames';
import { MobileTableTransferStyleWrapper } from './style';
const TableTransfer: React.FC<TableTransferProps> = (props) => {
  const {
    leftColumns,
    rightColumns,
    loading,
    leftDataSource,
    rightDataSource,
    leftPagination,
    onTableChange,
    ...restProps
  } = props;
  const { isMobile } = useMedia();
  return (
    <MobileTableTransferStyleWrapper
      className={classNames('full-width-element', {
        'mobile-table-transfer': isMobile
      })}
      {...restProps}
    >
      {({
        direction,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys
      }) => {
        const isLeftTable = direction === 'left';
        const columns = isLeftTable ? leftColumns : rightColumns;
        const rowSelection: TableRowSelection<ExpandedBackupSqlType> = {
          getCheckboxProps: isLeftTable
            ? (item) => ({
                disabled: item.disabled
              })
            : undefined,
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys as string[], 'replace');
          },
          selectedRowKeys: listSelectedKeys,
          columnWidth: 60
        };
        return (
          <BasicTable
            rowSelection={rowSelection}
            rowKey={(record) => record.id ?? ''}
            columns={columns}
            dataSource={isLeftTable ? leftDataSource : rightDataSource}
            size="small"
            loading={loading}
            onRow={({ id = '', disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled) {
                  return;
                }
                onItemSelect(id, !listSelectedKeys.includes(id));
              }
            })}
            pagination={isLeftTable ? leftPagination : undefined}
            onChange={isLeftTable ? onTableChange : undefined}
            scroll={{
              y: '700px',
              x: isMobile ? '100%' : true // todo 待验证移动端适配情况
            }}
            className={isLeftTable ? 'left-table' : 'right-table'}
          />
        );
      }}
    </MobileTableTransferStyleWrapper>
  );
};
export default TableTransfer;
