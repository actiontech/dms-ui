import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { dataMaskRuleOverviewTableColumns } from './columns';
import { PageHeader } from '@actiontech/shared';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { Space } from 'antd';
import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
import {
  ActiontechTable,
  ColumnsSettingProps,
  TableRefreshButton
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useMemo } from 'react';
import { useCurrentUser } from '@actiontech/shared/lib/global';

const DataMaskRuleOverview = () => {
  const { t } = useTranslation();

  const { username } = useCurrentUser();

  const {
    data: dataMaskRuleOverviewData,
    loading: getMaskRuleOverviewDataLoading,
    refresh: refreshMaskRuleOverviewData,
    error: getMaskRuleOverviewError
  } = useRequest(() => {
    return dms.ListMaskingRules().then((res) => {
      return { data: res.data.data ?? [], total: res.data?.data?.length ?? 0 };
    });
  });

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'data_mask_rule_overview',
      username: username
    }),
    [username]
  );

  return (
    <section>
      <PageHeader
        title={
          <Space>
            {t('dataMaskRuleOverview.list.title')}

            <TableRefreshButton refresh={refreshMaskRuleOverviewData} />
          </Space>
        }
      />
      <ActiontechTable
        rowKey="id"
        setting={tableSetting}
        dataSource={dataMaskRuleOverviewData?.data}
        columns={dataMaskRuleOverviewTableColumns()}
        errorMessage={getErrorMessage(getMaskRuleOverviewError ?? '')}
        pagination={{
          total: dataMaskRuleOverviewData?.total ?? 0
        }}
        loading={getMaskRuleOverviewDataLoading}
      />
    </section>
  );
};

export default DataMaskRuleOverview;
