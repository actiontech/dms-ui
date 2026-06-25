import React, { useMemo } from 'react';
import { Space } from 'antd';
import {
  CheckCircleFilled,
  WarningFilled,
  InfoHexagonFilled,
  CloseCircleFilled
} from '@actiontech/icons';
import { useTranslation } from 'react-i18next';
import { ResultIconRenderProps } from './index.type';

const IconLevelDictionary = {
  normal: <CheckCircleFilled width={20} height={20} />,
  notice: <InfoHexagonFilled width={20} height={20} />,
  warn: <WarningFilled width={20} height={20} />,
  error: <CloseCircleFilled width={20} height={20} />
};

/** @deprecated use ResultIconRenderProps instead */
export type IResultIconRender = {
  iconLevels: string[];
};

const ResultIconRender = (props: ResultIconRenderProps) => {
  const { auditResultInfo, iconLevels } = props;
  const { t } = useTranslation();

  const legacyIconData = useMemo(() => {
    return Array.from(
      new Set((iconLevels ?? []).filter((icon: string) => icon))
    );
  }, [iconLevels]);

  const auditResultIconData = useMemo(() => {
    return Array.from(
      new Set(auditResultInfo?.map((v) => v.level)?.filter(Boolean))
    );
  }, [auditResultInfo]);

  if (auditResultInfo) {
    if (auditResultInfo.some((item) => item.executionFailed)) {
      return (
        <Space>
          <WarningFilled width={20} height={20} />
          <span>{t('components.auditResultMessage.hasException')}</span>
        </Space>
      );
    }

    return (
      <Space size={8}>
        {auditResultIconData.length
          ? auditResultIconData.map((icon) => (
              <React.Fragment key={icon}>
                {IconLevelDictionary[
                  icon as keyof typeof IconLevelDictionary
                ] ?? null}
              </React.Fragment>
            ))
          : IconLevelDictionary.normal}
      </Space>
    );
  }

  return (
    <Space size={8}>
      {legacyIconData.map((icon) => (
        <React.Fragment key={icon}>
          {IconLevelDictionary[icon as keyof typeof IconLevelDictionary] ??
            null}
        </React.Fragment>
      ))}
    </Space>
  );
};

export default ResultIconRender;
