import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay, PageHeader } from '@actiontech/shared';
import { Typography } from 'antd';
import SqlManagementExceptionList from './List';

const SqlManagementException = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* #if [ce] */}
      <PageHeader title={t('sqlManagementException.pageTitle')} />
      {/* #endif */}

      <EnterpriseFeatureDisplay
        featureName={t('sqlManagementException.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('sqlManagementException.ceTips')}
          </Typography.Paragraph>
        }
      >
        <SqlManagementExceptionList />
      </EnterpriseFeatureDisplay>
    </>
  );
};

export default SqlManagementException;
