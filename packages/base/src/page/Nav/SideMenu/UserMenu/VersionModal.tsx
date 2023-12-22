import { useEffect, useState } from 'react';
import { BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import DmsService from '@actiontech/shared/lib/api/base/service/dms';
import { Space, Typography } from 'antd';
import { UI_VERSION } from '../../../../scripts/version';
import {
  VersionModalDescribeTextStyleWrapper,
  VersionModalStyleWrapper
} from '../style';
import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';
import VersionComparison from '@actiontech/shared/lib/components/EnterpriseFeatureDisplay/components/VersionComparison';

const VersionModal: React.FC<{
  open: boolean;
  setVersionModalClose: () => void;
}> = ({ open, setVersionModalClose }) => {
  const { t } = useTranslation();

  const [dmsVersion, setDmsVersion] = useState<string | undefined>('');

  // #if [sqle]
  const [sqleVersion, setSqleVersion] = useState<string | undefined>('');
  // #endif

  useEffect(() => {
    if (open) {
      DmsService.GetBasicInfo().then((res) => {
        const dms = res.data.data?.components?.find(
          (i) => i.name === 'dms'
        )?.version;
        setDmsVersion(formatServerVersion(dms));

        // #if [sqle]
        const sqle = res.data.data?.components?.find(
          (i) => i.name === 'sqle'
        )?.version;
        setSqleVersion(formatServerVersion(sqle));

        // #endif
      });
    }
  }, [open]);

  const formatServerVersion = (version?: string): string => {
    if (!version) {
      return '';
    }
    const versionArr = version.replace(/"/g, '').split(' ');
    if (versionArr.length === 1) {
      return versionArr[0];
    }
    return `${versionArr[0]} ${versionArr[1].slice(0, 10)}`;
  };

  const getIsEE = () => {
    // #if [ee && !demo]
    return true;
    // #else
    return false;
    // #endif
  };

  return (
    <VersionModalStyleWrapper
      isEE={getIsEE()}
      size="large"
      className="version-modal"
      open={open}
      onCancel={setVersionModalClose}
      footer={
        <Space>
          <BasicButton type="primary">
            <a
              target="_blank"
              href="https://actiontech.github.io/sqle-docs/"
              rel="noreferrer"
            >
              {t('common.showMore')}
            </a>
          </BasicButton>
          <BasicButton type="primary" onClick={setVersionModalClose}>
            {t('dmsSystem.version.gotIt')}
          </BasicButton>
        </Space>
      }
    >
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

            {/* #if [sqle] */}
            <Typography>SQLE: {sqleVersion || '-'}</Typography>
            {/* #endif */}
          </Space>
        </Space>
        <Space align="start" direction="vertical">
          <Typography.Title level={5}>
            {t('dmsSystem.version.productIntroduction')}
          </Typography.Title>
          <Typography.Text>{t('dmsSystem.version.dms_desc')}</Typography.Text>
        </Space>
        {/* #if [ee && !demo] */}
        <Space align="start" direction="vertical">
          <Typography.Title level={5}>
            {t('dmsSystem.version.productFeatures')}
          </Typography.Title>
          <VersionModalDescribeTextStyleWrapper>
            {t('dmsSystem.version.dms_feature')}
          </VersionModalDescribeTextStyleWrapper>
        </Space>
        {/* #else */}
        <VersionComparison />
        {/* #endif */}
      </Space>
    </VersionModalStyleWrapper>
  );
};

export default VersionModal;
