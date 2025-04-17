import { PageHeader } from '@actiontech/shared/';
import { useTranslation } from 'react-i18next';
import { ResourceOverviewStyleWrapper } from './style';
import ResourceDetail from './components/ResourceDetail';
import ResourceOverviewStatistic from './components/Statistic';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { Space } from 'antd';
import EmitterKey from '../../data/EmitterKey';
import EventEmitter from '../../utils/EventEmitter';

const ResourceOverview = () => {
  const { t } = useTranslation();

  const onRefresh = () => {
    EventEmitter.emit(EmitterKey.Refresh_Resource_Overview_Page);
  };

  return (
    <section>
      <PageHeader
        title={
          <Space size={12}>
            {t('resourceOverview.title')}
            <TableRefreshButton refresh={onRefresh} />
          </Space>
        }
      />
      <ResourceOverviewStyleWrapper>
        <ResourceOverviewStatistic />
        <ResourceDetail />
      </ResourceOverviewStyleWrapper>
    </section>
  );
};

export default ResourceOverview;
