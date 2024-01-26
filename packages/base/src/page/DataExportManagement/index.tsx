import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { PageHeader } from '@actiontech/shared';
import { Outlet } from 'react-router-dom';

const DataExportManagement: React.FC = () => {
  const { t } = useTranslation();

  return (
    <article>
      {/* #if [ce] */}
      <PageHeader title={t('dmsDataExport.pageTitle')} />
      {/* #endif */}
      <EnterpriseFeatureDisplay
        featureName={t('dmsDataExport.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('dmsDataExport.ceTips')}
          </Typography.Paragraph>
        }
      >
        <Outlet />
      </EnterpriseFeatureDisplay>
    </article>
  );
};

export default DataExportManagement;
