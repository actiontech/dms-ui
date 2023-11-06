import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay, PageHeader } from '@actiontech/shared';
import { Space, Typography, Image } from 'antd5';
import WhitelistList from './List';

const Whitelist = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* IFTRUE_isCE  */}
      <PageHeader title={t('whitelist.pageTitle')} />
      {/* FITRUE_isCE */}
      <EnterpriseFeatureDisplay
        featureName={t('whitelist.pageTitle')}
        eeFeatureDescription={
          <Space direction="vertical">
            <Typography.Paragraph className="paragraph">
              {t('whitelist.ceTips')}
            </Typography.Paragraph>
            <Image
              width="100%"
              className="ce_img"
              alt="white_list_preview"
              src="/static/image/ce_white_list_preview.png"
            />
          </Space>
        }
      >
        <WhitelistList />
      </EnterpriseFeatureDisplay>
    </>
  );
};

export default Whitelist;
