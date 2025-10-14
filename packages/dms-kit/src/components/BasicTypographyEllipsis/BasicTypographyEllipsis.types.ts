import { EllipsisConfig } from 'antd/es/typography/Base';

export interface BasicTypographyEllipsisProps {
  textCont: string;
  tooltipLimitLength?: number;
  tooltipsMaxWidth?: number;
  copyable?: boolean;
  tooltips?: EllipsisConfig['tooltip'];
  className?: string;
}
