import { PageHeader } from '@actiontech/shared/';
import { useTranslation } from 'react-i18next';
import { ResourceOverviewStyleWrapper } from './style';
import { useRequest } from 'ahooks';
import ResourceDetail from './ResourceDetail';
import ResourceOverviewBaseInfo from './BaseInfo';

const ResourceOverview = () => {
  const { t } = useTranslation();

  const { data: overviewData, loading } = useRequest(() => {
    return Promise.resolve({
      businessCount: 3,
      projectCount: 7,
      managementCount: 19,
      resourceDistribution: {
        MySQL: 8,
        Redis: 5,
        MongoDB: 3,
        Elasticsearch: 2,
        other: 1
      },
      healthStatus: {
        good: 13,
        normal: 4,
        warning: 2
      }
    });
  });

  return (
    <section>
      <PageHeader title={t('resourceOverview.title')} />
      <ResourceOverviewStyleWrapper>
        <ResourceOverviewBaseInfo
          businessCount={overviewData?.businessCount ?? 0}
          projectCount={overviewData?.projectCount ?? 0}
          managementCount={overviewData?.managementCount ?? 0}
        />
        <ResourceDetail />
      </ResourceOverviewStyleWrapper>
    </section>
  );
};

export default ResourceOverview;
