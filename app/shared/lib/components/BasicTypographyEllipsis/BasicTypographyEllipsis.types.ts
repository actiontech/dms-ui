import { EllipsisConfig } from 'antd/es/typography/Base';
import { ReactNode } from 'react';

export interface BasicTypographyEllipsisProps {
  textCont: string;
  tooltipLimitLength?: number;
  tooltipsMaxWidth?: number;
  linkData?: {
    text: string | ReactNode;
    route: string;
  };
  copyable?: boolean;
  tooltips?: EllipsisConfig['tooltip'];
  className?: string;
}
