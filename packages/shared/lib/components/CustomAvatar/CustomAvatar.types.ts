import { AvatarProps } from 'antd';

export interface CustomAvatarProps extends AvatarProps {
  name?: string;
  src?: string;
  noTips?: boolean;
  toolTipsWrapperClassName?: string;
}
