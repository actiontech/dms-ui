import React, { useMemo } from 'react';

import { Space } from 'antd';
import {
  CheckCircleFilled,
  WarningFilled,
  InfoHexagonFilled,
  CloseCircleFilled
} from '@actiontech/icons';

export type IResultIconRender = {
  iconLevels?: string[];
};

const ResultIconRender = (props: IResultIconRender) => {
  const { iconLevels } = props;

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
  );
};

export default ResultIconRender;
