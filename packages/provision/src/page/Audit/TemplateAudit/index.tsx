import { SyncOutlined } from '@ant-design/icons';
import { Box } from '@mui/system';
import { useRequest } from 'ahooks';
import { Card, Space, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import ProvisionTable from '~/components/ProvisionTable';
import useTablePagination from '~/components/ProvisionTable/hooks/useTablePagination';
import { templateAuditTableColumns } from './TableColumns';
import TemplateAuditFilterForm from './TemplateAuditFilterForm';
import { useSearchParams } from 'react-router-dom';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

const TemplateAudit = () => {
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
        .AuditListDataPermissionTemplateEvents({
          page_index: pageIndex,
          page_size: pageSize,
          filter_by_create_user:
            params.get('filter_by_create_user') ?? undefined,
          filter_by_data_permission_template_name:
            params.get('filter_by_data_permission_template_name') ?? undefined,
          filter_by_data_object_service_name:
            params.get('filter_by_data_object_service_name') ?? undefined,
          filter_by_event_type: params.get('filter_by_event_type') ?? undefined,
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
            {t('provisionAudit.templateAudit.title')}
            <Button onClick={refresh} data-testid="refresh">
              <SyncOutlined spin={loading} />
            </Button>
          </Space>
        }
      >
        <TemplateAuditFilterForm />
        <ProvisionTable
          rowKey="event_uid"
          loading={loading}
          columns={templateAuditTableColumns(projectID ?? '')}
          dataSource={dataSource ?? []}
          pagination={{ total }}
          onChange={handleTablePaginationChange}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </Box>
  );
};

export default TemplateAudit;
