import { BasicButton, BasicModal, EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Space, Typography } from 'antd';
import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';
import { UI_VERSION } from '../../../../../../scripts/version';
import { VersionModalFeatureContentStyleWrapper } from '../../../style';
import useVersionInfo from '../../hooks/useVersionInfo';
import React, { useEffect } from 'react';
import { VersionEnum } from '../../index.enum';
import { BasicVersionModalProps } from '../../index.type';

const BasicVersionModal: React.FC<BasicVersionModalProps> = ({
  open,
  width,
  versions,
  desc,
  feature,
  setVersionModalClose
}) => {
  const { t } = useTranslation();

  const { sqleVersion, dmsVersion, provisionVersion, updateVersionInfo } =
    useVersionInfo();

  useEffect(() => {
    if (open) {
      updateVersionInfo();
    }
  }, [open, updateVersionInfo]);

  return (
    <BasicModal
      size="large"
      width={width}
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
            <EmptyBox if={versions.some((v) => v === VersionEnum.DMS)}>
              <Typography>DMS: {dmsVersion || '-'}</Typography>
            </EmptyBox>
            <EmptyBox if={versions.some((v) => v === VersionEnum.PROVISION)}>
              <Typography>PROVISION: {provisionVersion || '-'}</Typography>
            </EmptyBox>
            <EmptyBox if={versions.some((v) => v === VersionEnum.SQLE)}>
              <Typography>SQLE: {sqleVersion || '-'}</Typography>
            </EmptyBox>
          </Space>
        </Space>
        <Space align="start" direction="vertical">
          <Typography.Title level={5}>
            {t('dmsSystem.version.productIntroduction')}
          </Typography.Title>
          <Typography.Text>{desc}</Typography.Text>
        </Space>
        <VersionModalFeatureContentStyleWrapper
          align="start"
          direction="vertical"
          className="full-width-element"
        >
          <Typography.Title level={5}>
            {t('dmsSystem.version.productFeatures')}
          </Typography.Title>
          {feature}
        </VersionModalFeatureContentStyleWrapper>
      </Space>
    </BasicModal>
  );
};

export default BasicVersionModal;
