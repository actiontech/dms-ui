import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import SyncTaskList from './List';

const SyncDataSource: React.FC = () => {
  const { t } = useTranslation();

  return (
    <article>
      <EnterpriseFeatureDisplay
        featureName={t('dmsSyncDataSource.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('dmsSyncDataSource.ceTips')}
          </Typography.Paragraph>
        }
      >
        <SyncTaskList />
      </EnterpriseFeatureDisplay>
    </article>
  );
};

export default SyncDataSource;
