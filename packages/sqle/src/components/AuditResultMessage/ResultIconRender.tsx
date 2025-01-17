import React, { useMemo } from 'react';
import { Space } from 'antd';
import {
  CheckCircleFilled,
  WarningFilled,
  InfoHexagonFilled,
  CloseCircleFilled
} from '@actiontech/icons';
import { useTranslation } from 'react-i18next';
import { ResultIconTagStyleWrapper } from './style';
import { ResultIconRenderProps } from './index.type';

const IconLevelDictionary = {
  normal: <CheckCircleFilled width={20} height={20} />,
  notice: <InfoHexagonFilled width={20} height={20} />,
  warn: <WarningFilled width={20} height={20} />,
  error: <CloseCircleFilled width={20} height={20} />
};

const ResultIconRender = (props: ResultIconRenderProps) => {
  const { iconLevels, isAuditing } = props;

  const { t } = useTranslation();

  const iconData = useMemo(() => {
    return Array.from(new Set(iconLevels?.filter((icon: string) => icon)));
  }, [iconLevels]);

  if (isAuditing) {
    return (
      <ResultIconTagStyleWrapper size="small" color="geekblue">
        {t('components.auditResultMessage.auditing')}
      </ResultIconTagStyleWrapper>
    );
  }

  if (iconLevels?.includes('audit_execution_error')) {
    return (
      <Space>
        <WarningFilled width={20} height={20} />
        <span>{t('components.auditResultMessage.hasException')}</span>
      </Space>
    );
  }

  return (
    <Space size={8}>
      {!!iconData.length
        ? iconData.map((icon) => {
            return (
              <React.Fragment key={icon}>
                {IconLevelDictionary[
                  icon as keyof typeof IconLevelDictionary
                ] ?? null}
              </React.Fragment>
            );
          })
        : IconLevelDictionary.normal}
    </Space>
  );
};

export default ResultIconRender;
