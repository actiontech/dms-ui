import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { dataMaskRuleOverviewTableColumns } from './columns';
import { PageHeader } from '@actiontech/shared';
import Masking from '@actiontech/shared/lib/api/base/service/Masking';
import { Space } from 'antd';
import {
  ActiontechTable,
  TableRefreshButton,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';

const DataMaskRuleOverview = () => {
  const { t } = useTranslation();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: dataMaskRuleOverviewData,
    loading,
    refresh
  } = useRequest(() => {
    return handleTableRequestError(Masking.ListMaskingRules());
  });

  return (
    <section>
      <PageHeader
        title={
          <Space>
            {t('dataMaskRuleOverview.list.title')}

            <TableRefreshButton refresh={refresh} />
          </Space>
        }
      />
      <ActiontechTable
        rowKey="id"
        dataSource={dataMaskRuleOverviewData?.list}
        columns={dataMaskRuleOverviewTableColumns()}
        errorMessage={requestErrorMessage}
        pagination={{
          total: dataMaskRuleOverviewData?.total ?? 0
        }}
        loading={loading}
      />
    </section>
  );
};

export default DataMaskRuleOverview;
