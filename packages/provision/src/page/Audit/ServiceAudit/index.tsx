import { SyncOutlined } from '@ant-design/icons';
import { Box } from '@mui/system';
import { useRequest } from 'ahooks';
import { Card, Space, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import ProvisionTable from '~/components/ProvisionTable';
import useTablePagination from '~/components/ProvisionTable/hooks/useTablePagination';
import { serviceAuditTableColumns } from './TableColumns';
import AuthAuditFilterForm from './ServiceAuditFilterForm';
import { useSearchParams } from 'react-router-dom';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

const AuthAudit = () => {
  const { t } = useTranslation();
  const { pageIndex, pageSize, total, setTotal, handleTablePaginationChange } =
    useTablePagination();
  const [params] = useSearchParams();
  const { projectID } = useCurrentProject();
  const {
    data: dataSource,
    loading,
    refresh
  } = useRequest(
    () =>
      auth
        .AuditListDataObjectServiceEvents({
          page_index: pageIndex,
          page_size: pageSize,
          filter_by_business: params.get('filter_by_business') ?? undefined,
          filter_by_data_object_service_name:
            params.get('filter_by_data_object_service_name') ?? undefined,
          filter_by_operation: params.get('filter_by_operation') ?? undefined,
          filter_by_generated_time_start:
            params.get('filter_by_generated_time_start') ?? undefined,
          filter_by_generated_time_end:
            params.get('filter_by_generated_time_end') ?? undefined,
          filter_by_namespace_uid: projectID
        })
        .then((res) => {
          setTotal(res.data.total_nums ?? 0);
          return res.data.data;
        }),
    {
      refreshDeps: [pageIndex, pageSize, params, projectID]
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
            {t('provisionAudit.serviceAudit.title')}
            <Button onClick={refresh} data-testid="refresh">
              <SyncOutlined spin={loading} />
            </Button>
          </Space>
        }
      >
        <AuthAuditFilterForm />
        <ProvisionTable
          rowKey="event_uid"
          loading={loading}
          columns={serviceAuditTableColumns(projectID ?? '')}
          dataSource={dataSource ?? []}
          pagination={{ total }}
          onChange={handleTablePaginationChange}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </Box>
  );
};

export default AuthAudit;
