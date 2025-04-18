import { useTranslation } from 'react-i18next';
import { Col, Row, Card } from 'antd';
import DistributionChart from './DistributionChart';
import ResourceOverviewBaseInfo from './BaseInfo';

const ResourceOverviewStatistic: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Row gutter={16} className="resource-overview-base-info-wrapper">
      <Col span={8}>
        <ResourceOverviewBaseInfo />
      </Col>
      <Col span={16}>
        <Card
          title={t('resourceOverview.distributionChart.title')}
          className="resource-overview-base-info-chart-card"
          hoverable
        >
          <DistributionChart />
        </Card>
      </Col>
    </Row>
  );
};

export default ResourceOverviewStatistic;
