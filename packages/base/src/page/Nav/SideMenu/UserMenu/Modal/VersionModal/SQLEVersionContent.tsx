import { Space, Typography } from 'antd';
import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';
import { UI_VERSION } from '../../../../../../scripts/version';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import useVersionInfo from '../../hooks/useVersionInfo';
import { VersionModalFeatureContentStyleWrapper } from '../../../style';

const SQLEVersionContent: React.FC<{
  open: boolean;
  children: React.ReactNode;
}> = ({ open, children }) => {
  const { t } = useTranslation();

  const { sqleVersion, dmsVersion, updateVersionInfo } = useVersionInfo();

  useEffect(() => {
    if (open) {
      updateVersionInfo();
    }
  }, [open, updateVersionInfo]);

  return (
    <Space direction="vertical" size="large">
      <Space>
        <Typography.Title level={2}>{DMS_DEFAULT_WEB_TITLE}</Typography.Title>
      </Space>
      <Space align="start" direction="vertical">
        <Typography.Title level={5}>
          {t('dmsSystem.version.versionInfo')}
        </Typography.Title>
        <Space direction="vertical">
          <Typography>UI: {UI_VERSION}</Typography>
          <Typography>DMS: {dmsVersion || '-'}</Typography>
          <Typography>SQLE: {sqleVersion || '-'}</Typography>
        </Space>
      </Space>
      <Space align="start" direction="vertical">
        <Typography.Title level={5}>
          {t('dmsSystem.version.productIntroduction')}
        </Typography.Title>
        <Typography.Text>{t('dmsSystem.version.sqle_desc')}</Typography.Text>
      </Space>
      <VersionModalFeatureContentStyleWrapper
        align="start"
        direction="vertical"
        className="full-width-element"
      >
        <Typography.Title level={5}>
          {t('dmsSystem.version.productFeatures')}
        </Typography.Title>
        {children}
      </VersionModalFeatureContentStyleWrapper>
    </Space>
  );
};

export default SQLEVersionContent;
