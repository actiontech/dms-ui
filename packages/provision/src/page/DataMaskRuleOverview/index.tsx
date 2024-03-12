import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { dataMaskRuleOverviewTableColumns } from './columns';
import { PageHeader } from '@actiontech/shared';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { Spin } from 'antd';
import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
import {
  ActiontechTable,
  TableToolbar
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IListMaskingRulesData } from '@actiontech/shared/lib/api/base/service/common';

const Operation = () => {
  const { t } = useTranslation();

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

  return (
    <section>
      <PageHeader title={t('dataMaskRuleOverview.list.title')} />
      <Spin spinning={getMaskRuleOverviewDataLoading}>
        <TableToolbar
          refreshButton={{
            refresh: refreshMaskRuleOverviewData,
            disabled: getMaskRuleOverviewDataLoading
          }}
        />
        <ActiontechTable
          rowKey={(record: IListMaskingRulesData) =>
            `${record?.effect}-${record?.masking_type}`
          }
          dataSource={dataMaskRuleOverviewData?.data}
          columns={dataMaskRuleOverviewTableColumns()}
          errorMessage={getErrorMessage(getMaskRuleOverviewError ?? '')}
          pagination={{
            total: dataMaskRuleOverviewData?.total ?? 0
          }}
        />
      </Spin>
    </section>
  );
};

export default Operation;
