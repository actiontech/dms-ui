import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import StatisticCard from '../components/StatisticCard';
import {
  FlagFilled,
  DatabaseFilled,
  DatabaseSchemaFilled
} from '@actiontech/icons';
import useThemeStyleData from '../../../hooks/useThemeStyleData';

interface BaseInfoProps {
  businessCount: number;
  projectCount: number;
  managementCount: number;
}

const ResourceOverviewBaseInfo: React.FC<BaseInfoProps> = ({
  businessCount,
  projectCount,
  managementCount
}) => {
  const { t } = useTranslation();

  const { baseTheme } = useThemeStyleData();

  return (
    <Space className="statistic-card-wrapper full-width-element" size={24}>
      <StatisticCard
        title={t('resourceOverview.baseInfo.businessCount')}
        count={businessCount ?? 0}
        icon={
          <DatabaseSchemaFilled
            width={24}
            height={24}
            color={baseTheme.icon.resourceOverview.schemaFilled}
          />
        }
      />
      <StatisticCard
        title={t('resourceOverview.baseInfo.projectCount')}
        count={projectCount ?? 0}
        icon={<FlagFilled width={24} height={24} />}
      />
      <StatisticCard
        title={t('resourceOverview.baseInfo.sourceCount')}
        count={managementCount ?? 0}
        icon={
          <DatabaseFilled
            width={24}
            height={24}
            color={baseTheme.icon.resourceOverview.databaseFilled}
          />
        }
      />
    </Space>
  );
};

export default ResourceOverviewBaseInfo;
