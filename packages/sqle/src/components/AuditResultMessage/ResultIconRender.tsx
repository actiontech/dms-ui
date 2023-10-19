import React, { useMemo } from 'react';

import {
  IconStatusSuccess,
  IconStatusTip,
  IconStatusWarning,
  IconStatusError
} from '../../icon/AuditPlan';
import { Space } from 'antd5';

type IResultIconRender = {
  iconLevels: string[];
};

const ResultIconRender = (props: IResultIconRender) => {
  const { iconLevels } = props;

  const iconData = useMemo(() => {
    return Array.from(new Set(iconLevels.filter((icon: string) => icon)));
  }, [iconLevels]);

  const renderIcon = useMemo(() => {
    return {
      normal: <IconStatusSuccess />,
      notice: <IconStatusTip />,
      warn: <IconStatusWarning />,
      error: <IconStatusError />
    };
  }, []);

  return (
    <Space size={8}>
      {iconData.map((icon) => {
        return (
          <React.Fragment key={icon}>
            {renderIcon[icon as keyof typeof renderIcon] ?? null}
          </React.Fragment>
        );
      })}
    </Space>
  );
};

export default ResultIconRender;
