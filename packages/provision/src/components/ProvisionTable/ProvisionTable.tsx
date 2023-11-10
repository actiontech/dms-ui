import { EmptyBox } from '@actiontech/shared';
import { Table } from 'antd';
import { ProvisionTableProps } from '.';

const SHOW_EMPTY_TEXT_LIST = ['', null, undefined];

const ProvisionTable: React.FC<ProvisionTableProps> = (props) => {
  const {
    pagination,
    columns,
    columnEmptyRender = '--',
    ...otherProps
  } = props;

  let newColumns = columns;
  if (columnEmptyRender !== false) {
    newColumns = columns?.map((item) => {
      return {
        ...item,
        render:
          item.render ??
          ((val: any) => (
            <EmptyBox
              if={!SHOW_EMPTY_TEXT_LIST.includes(val)}
              defaultNode={<>{columnEmptyRender}</>}
            >
              {val}
            </EmptyBox>
          ))
      };
    });
  }
  return (
    <Table
      pagination={{
        defaultPageSize: 20,
        ...pagination
      }}
      columns={newColumns}
      {...otherProps}
    />
  );
};

export default ProvisionTable;
