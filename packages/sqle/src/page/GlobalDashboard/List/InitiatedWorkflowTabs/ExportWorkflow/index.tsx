import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { Typography } from 'antd';
import React from 'react';
import { GlobalDashboardListProps } from '../../../index.type';
import PendingExportWorkflowList from './List';

const PendingExportWorkflow: React.FC<GlobalDashboardListProps> = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <EnterpriseFeatureDisplay
        featureName={t('globalDashboard.pendingExportWorkflow.title')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('globalDashboard.pendingExportWorkflow.ceTips')}
          </Typography.Paragraph>
        }
      >
        <PendingExportWorkflowList {...props} />
      </EnterpriseFeatureDisplay>
    </>
  );
};

export default PendingExportWorkflow;
