import { Col, Typography, Space } from 'antd';
import { AccountStatisticsStyleWrapper } from '../style';
import { useTranslation } from 'react-i18next';
import { floatToNumberPercent } from '@actiontech/shared/lib/utils/Math';

const OperationStatistics: React.FC<{
  total?: number;
  succeedRate?: number;
  interceptedTotal?: number;
  failedTotal?: number;
}> = ({ total, succeedRate, interceptedTotal, failedTotal }) => {
  const { t } = useTranslation();

  return (
    <AccountStatisticsStyleWrapper gutter={20}>
      <Col span={6}>
        <Space direction="vertical" className="statistics-item total-item">
          <Typography.Text>
            {t('dmsCloudBeaver.statistic.total')}
          </Typography.Text>
          <Typography.Title level={5}>{total ?? '-'}</Typography.Title>
        </Space>
      </Col>
      <Col span={6}>
        <Space direction="vertical" className="statistics-item">
          <Typography.Text type="secondary">
            {t('dmsCloudBeaver.statistic.succeedTotal')}
          </Typography.Text>
          <Typography.Title level={5}>
            {floatToNumberPercent(succeedRate ?? 0, 0)}
          </Typography.Title>
        </Space>
      </Col>
      <Col span={6}>
        <Space direction="vertical" className="statistics-item">
          <Typography.Text type="secondary">
            {t('dmsCloudBeaver.statistic.interceptedTotal')}
          </Typography.Text>
          <Typography.Title level={5}>
            {interceptedTotal ?? '-'}
          </Typography.Title>
        </Space>
      </Col>
      <Col span={6}>
        <Space direction="vertical" className="statistics-item">
          <Typography.Text type="secondary">
            {t('dmsCloudBeaver.statistic.failedTotal')}
          </Typography.Text>
          <Typography.Title level={5}>{failedTotal ?? '-'}</Typography.Title>
        </Space>
      </Col>
    </AccountStatisticsStyleWrapper>
  );
};

export default OperationStatistics;
