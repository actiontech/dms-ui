import { Row, Col, Card, Statistic, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { IUserActivitySummary } from '@actiontech/shared/lib/api/base/service/UserActivity/index.d';
import {
  formatAvgRequest,
  formatCount,
  formatErrorRate,
  formatPeakHour
} from '../../utils';

type SummaryCardsProps = {
  loading?: boolean;
  data?: IUserActivitySummary;
};

const SummaryCards = ({ loading, data }: SummaryCardsProps) => {
  const { t } = useTranslation();

  const items = [
    {
      key: 'dau',
      title: t('userActivity.summary.dau'),
      value: formatCount(data?.dau)
    },
    {
      key: 'requestCount',
      title: t('userActivity.summary.requestCount'),
      value: formatCount(data?.request_count)
    },
    {
      key: 'avgRequestPerUser',
      title: t('userActivity.summary.avgRequestPerUser'),
      value: formatAvgRequest(data?.avg_request_per_user)
    },
    {
      key: 'errorRate',
      title: t('userActivity.summary.errorRate'),
      value: formatErrorRate(data?.error_rate)
    },
    {
      key: 'errorCount',
      title: t('userActivity.summary.errorCount'),
      value: formatCount(data?.error_count)
    },
    {
      key: 'peakHour',
      title: t('userActivity.summary.peakHour'),
      value: formatPeakHour(data?.peak_hour)
    }
  ];

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col key={item.key} span={24} sm={12} lg={8} xl={4}>
            <Card className="summary-card" bordered={false}>
              <Statistic title={item.title} value={item.value} />
            </Card>
          </Col>
        ))}
      </Row>
    </Spin>
  );
};

export default SummaryCards;
