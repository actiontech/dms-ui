import { useTranslation } from 'react-i18next';
import { PageHeader } from '@actiontech/dms-kit';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { Typography } from 'antd';
import WhitelistList from './List';
const Whitelist = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* #if [ce] */}
      <PageHeader title={t('whitelist.pageTitle')} />
      {/* #endif */}

      <EnterpriseFeatureDisplay
        featureName={t('whitelist.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('whitelist.ceTips')}
          </Typography.Paragraph>
        }
      >
        <WhitelistList />
      </EnterpriseFeatureDisplay>
    </>
  );
};
export default Whitelist;
