import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import GlobalDataSourceList from './List';

const GlobalDataSource = () => {
  const { t } = useTranslation();

  return (
    <section>
      <EnterpriseFeatureDisplay
        featureName={t('dmsGlobalDataSource.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('dmsGlobalDataSource.ceTips')}
          </Typography.Paragraph>
        }
      >
        <GlobalDataSourceList />
      </EnterpriseFeatureDisplay>
    </section>
  );
};

export default GlobalDataSource;
