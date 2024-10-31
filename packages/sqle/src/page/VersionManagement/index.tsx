import VersionManagementList from './List';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay, PageHeader } from '@actiontech/shared';
import { Typography } from 'antd';

const VersionManagement = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* #if [ce] */}
      <PageHeader title={t('versionManagement.pageTitle')} />
      {/* #endif */}

      <EnterpriseFeatureDisplay
        featureName={t('versionManagement.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('versionManagement.ceTips')}
          </Typography.Paragraph>
        }
      >
        <VersionManagementList />
      </EnterpriseFeatureDisplay>
    </>
  );
};

export default VersionManagement;
