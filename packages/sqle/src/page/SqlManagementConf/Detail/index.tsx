import { PageHeader, SegmentedTabs } from '@actiontech/shared';
import BackToConf from '../Common/BackToConf';
import { useTranslation } from 'react-i18next';
import { SegmentedTabsProps } from '@actiontech/shared/lib/components/SegmentedTabs/index.type';
import ConfDetailOverview from './Overview';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { useState } from 'react';
import ScanTypeSqlCollection from './ScanTypeSqlCollection/indx';

const OVERVIEW_TAB_KEY = 'OVERVIEW_TAB_KEY';

const ConfDetail: React.FC = () => {
  const { t } = useTranslation();

  const [activeKey, setActiveKey] = useState(OVERVIEW_TAB_KEY);

  const items: SegmentedTabsProps['items'] = [
    {
      label: t('managementConf.detail.overview.title'),
      value: OVERVIEW_TAB_KEY,
      children: (
        <ConfDetailOverview
          activeTabKey={activeKey}
          handleChangeTab={setActiveKey}
        />
      )
    },
    {
      label: '库表元数据',
      value: '1',
      children: <ScanTypeSqlCollection />
    },
    {
      label: '慢日志',
      value: '2',
      children: <ScanTypeSqlCollection />
    }
  ];

  return (
    <>
      <PageHeader
        title={t('managementConf.detail.title', { dbName: 'mysql-1' })}
        extra={<BackToConf />}
      />
      <SegmentedTabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={items}
        segmentedRowClassName="flex-space-between"
        segmentedRowExtraContent={<TableRefreshButton />}
      />
    </>
  );
};

export default ConfDetail;
