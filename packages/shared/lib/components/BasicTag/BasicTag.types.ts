import { TagProps } from 'antd';
import { BasicTagColor } from '../../theme/theme.type';

export type BasicTagProps = TagProps & {
  size?: 'small' | 'large' | 'default';
  color?: BasicTagColor;
};
