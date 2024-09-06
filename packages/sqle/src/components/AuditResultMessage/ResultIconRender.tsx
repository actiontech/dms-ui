import React, { useMemo } from 'react';

import { Space } from 'antd';
import {
  CheckCircleFilled,
  WarningFilled,
  InfoHexagonFilled,
  CloseCircleFilled
} from '@actiontech/icons';
import { EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { ResultIconTagStyleWrapper } from './style';

export type IResultIconRender = {
  iconLevels?: string[];
  isAuditing?: boolean;
};

const ResultIconRender = (props: IResultIconRender) => {
  const { iconLevels, isAuditing } = props;

  const { t } = useTranslation();

  const iconData = useMemo(() => {
    return Array.from(new Set(iconLevels?.filter((icon: string) => icon)));
  }, [iconLevels]);

  const renderIcon = useMemo(() => {
    return {
      normal: <CheckCircleFilled width={20} height={20} />,
      notice: <InfoHexagonFilled width={20} height={20} />,
      warn: <WarningFilled width={20} height={20} />,
      error: <CloseCircleFilled width={20} height={20} />
    };
  }, []);

  return (
    <EmptyBox
      if={!isAuditing}
      defaultNode={
        <ResultIconTagStyleWrapper size="small" color="geekblue">
          {t(`sqlAudit.list.status.auditStatus.auditing`)}
        </ResultIconTagStyleWrapper>
      }
    >
      <Space size={8}>
        {!!iconData.length
          ? iconData.map((icon) => {
              return (
                <React.Fragment key={icon}>
                  {renderIcon[icon as keyof typeof renderIcon] ?? null}
                </React.Fragment>
              );
            })
          : renderIcon.normal}
      </Space>
    </EmptyBox>
  );
};

export default ResultIconRender;
