import { SyncOutlined } from '@ant-design/icons';
import { Box } from '@mui/system';
import { useRequest } from 'ahooks';
import { Card, Space, Button } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProvisionTable from '~/components/ProvisionTable';
import useTablePagination from '~/components/ProvisionTable/hooks/useTablePagination';
import { EventEmitterKey } from '~/data/enum';
import { externalDataSourceListTableColumns } from './TableColumns';
import EventEmitter from '~/utils/EventEmitter';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

const ExternalDataSource = () => {
  const { t } = useTranslation();
  const { pageIndex, pageSize, total, setTotal, handleTablePaginationChange } =
    useTablePagination();

  const {
    data: dataSource,
    loading,
    refresh
  } = useRequest(
    () =>
      auth
        .AuthListDataObjectSources({
          page_index: pageIndex,
          page_size: pageSize
        })
        .then((res) => {
          setTotal(res.data.total_nums ?? 0);
          return res.data.data;
        }),
    {
      refreshDeps: [pageIndex, pageSize]
    }
  );

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EventEmitterKey.Refresh_External_Data_Source_List_Table,
      () => {
        refresh();
      }
    );
    return unsubscribe;
  }, [refresh]);

  return (
    <Box
      sx={{
        padding: (theme) => theme.layout.padding
      }}
    >
      <Card
        title={
          <Space>
            {t('externalDataSource.title')}
            <Button onClick={refresh} data-testid="refresh">
              <SyncOutlined spin={loading} />
            </Button>
          </Space>
        }
      >
        <ProvisionTable
          rowKey="uid"
          loading={loading}
          columns={externalDataSourceListTableColumns()}
          dataSource={dataSource ?? []}
          pagination={{ total }}
          onChange={handleTablePaginationChange}
        />
      </Card>
    </Box>
  );
};

export default ExternalDataSource;
