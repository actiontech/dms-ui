import { Box } from '@mui/system';
import { useRequest } from 'ahooks';
import { Button, Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { SyncOutlined } from '@ant-design/icons';
import ProvisionTable from '~/components/ProvisionTable';
import useTablePagination from '~/components/ProvisionTable/hooks/useTablePagination';
import { operationTableColumns } from './TableColumns';
import OperationListFilterForm, {
  IFilteredInfo
} from './OperationListFilterForm';
import { useState } from 'react';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IOperationInfo } from '@actiontech/shared/lib/api/provision/service/common';
export interface IOperationData extends IOperationInfo {
  uid?: string;
  name?: string;
  rowSpan: number;
}
const Operation = () => {
  const { t } = useTranslation();
  const { pageIndex, pageSize, total, setTotal, handleTablePaginationChange } =
    useTablePagination();
  const [filteredInfo, setFilteredInfo] = useState<IFilteredInfo | null>(null);
  const {
    data: dataSource,
    loading,
    refresh
  } = useRequest(
    () =>
      auth
        .AuthListDataOperationSets({
          page_index: pageIndex,
          page_size: pageSize,
          ...filteredInfo
        })
        .then((res) => {
          setTotal(res.data.total_nums ?? 0);
          const data: IOperationData[] = [];
          res.data.data?.forEach((item) => {
            const { operations, name, uid } = item;
            operations?.forEach((operation, index) => {
              data.push({
                ...operation,
                name,
                uid,
                rowSpan: index === 0 ? operations.length : 0
              });
            });
          });
          return data;
        }),
    {
      refreshDeps: [pageIndex, pageSize, filteredInfo]
    }
  );

  return (
    <Box
      sx={{
        padding: (theme) => theme.layout.padding
      }}
    >
      <Card
        title={
          <Space>
            {t('operation.title')}
            <Button onClick={refresh} data-testid="refresh">
              <SyncOutlined spin={loading} />
            </Button>
          </Space>
        }
      >
        <OperationListFilterForm setFilteredInfo={setFilteredInfo} />
        <ProvisionTable
          rowKey={(record) => record.uid + record.db_type}
          loading={loading}
          columns={operationTableColumns()}
          dataSource={dataSource ?? []}
          pagination={{ total }}
          onChange={handleTablePaginationChange}
        />
      </Card>
    </Box>
  );
};

export default Operation;
