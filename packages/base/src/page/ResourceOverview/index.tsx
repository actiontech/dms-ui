import { PageHeader } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import {
  ResourceOverviewDetailStyleWrapper,
  ResourceOverviewStyleWrapper
} from './style';
import ResourceDetail from './components/ResourceDetail';
import ResourceOverviewStatistic from './components/Statistic';
import { TableRefreshButton } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { Space } from 'antd';
import EmitterKey from '../../data/EmitterKey';
import EventEmitter from '../../utils/EventEmitter';

const ResourceOverview = () => {
  const { t } = useTranslation();

  const onRefresh = () => {
    EventEmitter.emit(EmitterKey.Refresh_Resource_Overview_Page);
  };

  return (
    <ResourceOverviewStyleWrapper>
      <PageHeader
        title={
          <Space size={12}>
            {t('resourceOverview.title')}
            <TableRefreshButton refresh={onRefresh} />
          </Space>
        }
      />
      <ResourceOverviewDetailStyleWrapper>
        <ResourceOverviewStatistic />
        <ResourceDetail />
      </ResourceOverviewDetailStyleWrapper>
    </ResourceOverviewStyleWrapper>
  );
};

export default ResourceOverview;
