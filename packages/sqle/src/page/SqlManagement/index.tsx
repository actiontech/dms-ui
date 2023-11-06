import { Typography, Image } from 'antd5';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { PageHeader } from '@actiontech/shared';
import SQLEEIndex from './component/SQLEEIndex';

// todo: 替换示例图片
const SqlManagement = () => {
  const { t } = useTranslation();

  return (
    <article>
      {/* IFTRUE_isCE */}
      <PageHeader title={t('sqlManagement.pageTitle')} />
      {/* FITRUE_isCE */}
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
              src="/static/image/ce_sync_instance_preview.png"
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
