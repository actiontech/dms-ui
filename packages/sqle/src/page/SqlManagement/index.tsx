import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { PageHeader } from '@actiontech/dms-kit';
import SQLEEIndex from './component/SQLEEIndex';
const SqlManagement = () => {
  const { t } = useTranslation();
  return (
    <article>
      {/* #if [ce] */}
      <PageHeader title={t('sqlManagement.pageTitle')} />
      {/* #endif */}
      <EnterpriseFeatureDisplay
        featureName={t('sqlManagement.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('sqlManagement.ceTips')}
          </Typography.Paragraph>
        }
      >
        <SQLEEIndex />
      </EnterpriseFeatureDisplay>
    </article>
  );
};
export default SqlManagement;
