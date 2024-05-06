import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { PageHeader } from '@actiontech/shared';
import { Outlet } from 'react-router-dom';

const SqlOptimization = () => {
  const { t } = useTranslation();

  return (
    <section>
      {/* #if [ce] */}
      <PageHeader title={t('sqlOptimization.pageTitle')} />
      {/* #endif */}
      <EnterpriseFeatureDisplay
        featureName={t('sqlOptimization.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('sqlOptimization.ceTips')}
          </Typography.Paragraph>
        }
      >
        <Outlet />
      </EnterpriseFeatureDisplay>
    </section>
  );
};

export default SqlOptimization;
