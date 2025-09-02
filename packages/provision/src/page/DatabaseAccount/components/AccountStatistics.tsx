import { Col, Typography, Space } from 'antd';
import { AccountStatisticsStyleWrapper } from '../style';
import { useTranslation } from 'react-i18next';
import { IAccountStatics } from '@actiontech/shared/lib/api/provision/service/common';

const AccountStatistics: React.FC<{
  data?: IAccountStatics;
}> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <AccountStatisticsStyleWrapper gutter={20}>
      <Col span={6}>
        <Space direction="vertical" className="statistics-item total-item">
          <Typography.Text>
            {t('databaseAccount.list.allAccount')}
          </Typography.Text>
          <Typography.Title level={5}>
            {data?.total_account_num}
          </Typography.Title>
        </Space>
      </Col>
      <Col span={6}>
        <Space direction="vertical" className="statistics-item">
          <Typography.Text type="secondary">
            {t('databaseAccount.list.availableAccount')}
          </Typography.Text>
          <Typography.Title level={5}>
            {data?.unlock_account_num}
          </Typography.Title>
        </Space>
      </Col>
      <Col span={6}>
        <Space direction="vertical" className="statistics-item">
          <Typography.Text type="secondary">
            {t('databaseAccount.list.disabledAccount')}
          </Typography.Text>
          <Typography.Title level={5}>
            {data?.lock_account_num}
          </Typography.Title>
        </Space>
      </Col>
      <Col span={6}>
        <Space direction="vertical" className="statistics-item">
          <Typography.Text type="secondary">
            {t('databaseAccount.list.expirationAccount')}
          </Typography.Text>
          <Typography.Title level={5}>
            {data?.nearing_expiration_account_num}
          </Typography.Title>
        </Space>
      </Col>
    </AccountStatisticsStyleWrapper>
  );
};

export default AccountStatistics;
