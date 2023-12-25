import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import { EnterpriseFeatureDisplay, PageHeader } from '@actiontech/shared';

const SyncDataSource: React.FC = () => {
  const { t } = useTranslation();

  return (
    <article>
      {/* #if [ce] */}
      <PageHeader title={t('dmsSyncDataSource.syncTaskList.title')} />
      {/* #endif */}

      <EnterpriseFeatureDisplay
        featureName={t('dmsSyncDataSource.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('dmsSyncDataSource.ceTips')}
          </Typography.Paragraph>
        }
      >
        <Outlet />
      </EnterpriseFeatureDisplay>
    </article>
  );
};

export default SyncDataSource;
