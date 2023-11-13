import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Image } from 'antd';
import { EnterpriseFeatureDisplay, PageHeader } from '@actiontech/shared';

const SyncDataSource: React.FC = () => {
  const { t } = useTranslation();

  return (
    <article>
      {/* IFTRUE_isCE  */}
      <PageHeader title={t('dmsSyncDataSource.syncTaskList.title')} />
      {/* FITRUE_isCE */}
      <EnterpriseFeatureDisplay
        featureName={t('dmsSyncDataSource.pageTitle')}
        eeFeatureDescription={
          <>
            <Typography.Paragraph className="paragraph">
              {t('dmsSyncDataSource.ceTips')}
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
        <Outlet />
      </EnterpriseFeatureDisplay>
    </article>
  );
};

export default SyncDataSource;
