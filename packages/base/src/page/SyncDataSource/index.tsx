import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { Typography, Image } from 'antd5';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

const SyncDataSource: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <article>
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
    </>
  );
};

export default SyncDataSource;
