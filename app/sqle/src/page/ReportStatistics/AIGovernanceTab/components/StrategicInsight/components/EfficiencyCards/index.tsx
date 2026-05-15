import { Row, Col, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { IEfficiencyCard } from '@actiontech/shared/lib/api/sqle/service/common.d';
import {
  CodeStandardOutlined,
  QueryPerformanceOutlined,
  ResearchEfficiencyOutlined,
  ResourceCostOutlined,
  SecurityDefenseOutlined
} from '@actiontech/icons';
import { EfficiencyCardsStyleWrapper } from './style';

interface EfficiencyCardsProps {
  cards: IEfficiencyCard[];
}

const getMetricClassName = (metricTitle?: string): string => {
  const supportedMetrics = new Set([
    'security_defense',
    'resource_cost',
    'code_standard',
    'rd_efficiency',
    'query_performance'
  ]);

  if (!metricTitle || !supportedMetrics.has(metricTitle)) {
    return '';
  }

  return `metric-${metricTitle}`;
};

const getMetricIcon = (metricTitle?: string): JSX.Element | null => {
  switch (metricTitle) {
    case 'security_defense':
      return <SecurityDefenseOutlined />;
    case 'resource_cost':
      return <ResourceCostOutlined />;
    case 'code_standard':
      return <CodeStandardOutlined />;
    case 'rd_efficiency':
      return <ResearchEfficiencyOutlined />;
    case 'query_performance':
      return <QueryPerformanceOutlined />;
    default:
      return null;
  }
};

const EfficiencyCards: React.FC<EfficiencyCardsProps> = ({ cards }) => {
  const { t } = useTranslation();

  return (
    <EfficiencyCardsStyleWrapper>
      <Row gutter={[16, 16]} wrap={false}>
        {cards.map((card, index) => {
          const metricClassName = getMetricClassName(card?.metric_title);

          return (
            <Col flex="1 0 0" key={index}>
              <Card size="small" hoverable={true} className="efficiency-card">
                <div className={`card-icon-wrapper ${metricClassName}`}>
                  <div className="card-icon">
                    {getMetricIcon(card?.metric_title)}
                  </div>
                </div>
                <div className="card-title">
                  {card?.metric_title &&
                    t(
                      `reportStatistics.aiGovernance.efficiencyCard.${card.metric_title}`
                    )}
                </div>
                <div className="card-evaluation">
                  {card?.metric_evaluation ?? '-'}
                </div>
                <div className={`card-value ${metricClassName}`}>
                  {card?.evidence_value ?? '-'}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </EfficiencyCardsStyleWrapper>
  );
};

export default EfficiencyCards;
