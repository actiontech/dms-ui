import { useTranslation } from 'react-i18next';
import { Space, Typography } from 'antd';
import { UI_VERSION } from '../../../../../scripts/version';
import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';
import VersionComparison from '@actiontech/shared/lib/components/EnterpriseFeatureDisplay/components/VersionComparison';
import BasicVersionModal from './BasicVersionModal';
import useVersionInfo from '../hooks/useVersionInfo';
import { useEffect } from 'react';

const VersionModal: React.FC<{
  open: boolean;
  setVersionModalClose: () => void;
}> = ({ open, setVersionModalClose }) => {
  const { t } = useTranslation();

  const { sqleVersion, dmsVersion, updateVersionInfo } = useVersionInfo();

  useEffect(() => {
    if (open) {
      updateVersionInfo();
    }
  }, [open, updateVersionInfo]);

  return (
    <BasicVersionModal open={open} setVersionModalClose={setVersionModalClose}>
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
        <VersionComparison />
      </Space>
    </BasicVersionModal>
  );
};

export default VersionModal;
