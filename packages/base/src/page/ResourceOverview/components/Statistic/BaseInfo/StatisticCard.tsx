import { Card, Statistic, Space } from 'antd';
import { StatisticCardProps } from '../../../index.type';

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  count,
  icon
}) => {
  return (
    <Card className="statistic-card">
      <div className="statistic-card-content">
        <div className="statistic-card-icon">{icon}</div>
        <Statistic title={<Space>{title}</Space>} value={count} />
      </div>
    </Card>
  );
};

export default StatisticCard;
