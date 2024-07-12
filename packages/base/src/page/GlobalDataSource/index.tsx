import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { PageHeader } from '@actiontech/shared';
import { Outlet } from 'react-router-dom';

const GlobalDataSource = () => {
  const { t } = useTranslation();

  return (
    <section>
      {/* #if [ce] */}
      <PageHeader title={t('dmsGlobalDataSource.pageTitle')} />
      {/* #endif */}
      <EnterpriseFeatureDisplay
        featureName={t('dmsGlobalDataSource.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('dmsGlobalDataSource.ceTips')}
          </Typography.Paragraph>
        }
      >
        <Outlet />
      </EnterpriseFeatureDisplay>
    </section>
  );
};

export default GlobalDataSource;
