import { Typography, Image } from 'antd5';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { PageHeader } from '@actiontech/shared';
import SQLEEIndex from './component/SQLEEIndex';

const SqlManagement = () => {
  const { t } = useTranslation();

  return (
    <article>
      {/* #if [prod_version=ce] */}
      <PageHeader title={t('sqlManagement.pageTitle')} />
      {/* #endif */}
      <EnterpriseFeatureDisplay
        featureName={t('sqlManagement.pageTitle')}
        eeFeatureDescription={
          <>
            <Typography.Paragraph className="paragraph">
              {t('sqlManagement.ceTips')}
            </Typography.Paragraph>
            <Image
              width="100%"
              className="ce_img"
              alt="reportStatisticsPreview"
              src="/static/image/ce_sql_management.png"
            />
          </>
        }
      >
        <SQLEEIndex />
      </EnterpriseFeatureDisplay>
    </article>
  );
};

export default SqlManagement;
