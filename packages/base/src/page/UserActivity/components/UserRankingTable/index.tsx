import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'antd';
import {
  ActiontechTable,
  ActiontechTableWrapper,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { DmsApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import { IUserActivityUserItem } from '@actiontech/shared/lib/api/base/service/UserActivity/index.d';
import { IGetUserActivityUsersV1Params } from '@actiontech/shared/lib/api/base/service/UserActivity/index.d';
import { formatTime } from '@actiontech/shared/lib/utils/Common';

type UserRankingTableProps = {
  filterDateFrom: string;
  filterDateTo: string;
};

const UserRankingTable = ({
  filterDateFrom,
  filterDateTo
}: UserRankingTableProps) => {
  const { t } = useTranslation();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { tableChange, pagination } = useTableRequestParams<
    IUserActivityUserItem,
    IGetUserActivityUsersV1Params
  >();

  const { data, loading } = useRequest(
    () =>
      handleTableRequestError(
        DmsApi.UserActivityService.GetUserActivityUsersV1({
          filter_date_from: filterDateFrom,
          filter_date_to: filterDateTo,
          page_index: pagination.page_index,
          page_size: pagination.page_size
        })
      ),
    {
      refreshDeps: [
        filterDateFrom,
        filterDateTo,
        pagination.page_index,
        pagination.page_size
      ]
    }
  );

  const columns = useMemo(
    () => [
      {
        dataIndex: 'user_name',
        title: t('userActivity.userRanking.userName'),
        render: (_: string, record: IUserActivityUserItem) =>
          record.user_name || record.user_uid || '-'
      },
      {
        dataIndex: 'active_days',
        title: t('userActivity.userRanking.activeDays')
      },
      {
        dataIndex: 'request_count',
        title: t('userActivity.userRanking.requestCount')
      },
      {
        dataIndex: 'top_module_name',
        title: t('userActivity.userRanking.topModule'),
        render: (_: string, record: IUserActivityUserItem) =>
          record.top_module_name || record.top_module_code || '-'
      },
      {
        dataIndex: 'last_active_at',
        title: t('userActivity.userRanking.lastActiveAt'),
        render: (value?: string) => (value ? formatTime(value) : '-')
      }
    ],
    [t]
  );

  return (
    <Card
      className="chart-card"
      bordered={false}
      title={t('userActivity.userRanking.title')}
    >
      <ActiontechTableWrapper>
        <ActiontechTable
          rowKey="user_uid"
          dataSource={data?.list ?? []}
          columns={columns}
          loading={loading}
          errorMessage={requestErrorMessage}
          pagination={{
            total: data?.total ?? 0,
            current: pagination.page_index,
            pageSize: pagination.page_size
          }}
          onChange={tableChange}
        />
      </ActiontechTableWrapper>
    </Card>
  );
};

export default UserRankingTable;
