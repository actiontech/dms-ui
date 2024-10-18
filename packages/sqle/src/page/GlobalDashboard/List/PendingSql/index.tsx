import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { Typography } from 'antd';
import PendingSqlList from './PendingSqlList';
import { GlobalDashboardListProps } from '../../index.type';
import React from 'react';

const PendingSql: React.FC<GlobalDashboardListProps> = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <EnterpriseFeatureDisplay
        featureName={t('globalDashboard.pendingSql.title')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('globalDashboard.pendingSql.ceTips')}
          </Typography.Paragraph>
        }
      >
        <PendingSqlList {...props} />
      </EnterpriseFeatureDisplay>
    </>
  );
};

export default PendingSql;
