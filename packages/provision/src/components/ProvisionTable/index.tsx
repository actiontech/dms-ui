import { TableProps } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import ProvisionTable from './ProvisionTable';
import TableFilterForm from './TableFilterForm';

export interface ProvisionTableProps<Record = any> extends TableProps<Record> {
  columns: TableColumn<Record>;
  // 空值时的展示，默认值为'--'，false可以关闭此功能。 优先级低于columns[number].render
  columnEmptyRender?: false | React.ReactNode;
}

export type UseTablePaginationOption = {
  defaultPageSize?: number;
  defaultPageIndex?: number;
};

export type TableColumn<RecordType = unknown, OtherColumnKes = ''> = Array<
  (ColumnGroupType<RecordType> | ColumnType<RecordType>) & {
    dataIndex: keyof RecordType | OtherColumnKes;
  }
>;
export { TableFilterForm };
export default ProvisionTable;
