import { TagProps } from 'antd';
import { BasicTagStyleWrapper } from './style';
import classNames from 'classnames';
import { BasicTagColor } from '../../theme/theme.type';

export type IBasicTag = TagProps & {
  size?: 'small' | 'large' | 'default';
  color?: BasicTagColor;
};

const BasicTag: React.FC<IBasicTag> = ({
  className,
  size = 'default',
  color = 'default',
  ...props
}) => {
  return (
    <BasicTagStyleWrapper
      {...props}
      color={color}
      className={classNames(className, 'basic-tag-wrapper', {
        'basic-large-tag-wrapper': size === 'large',
        'basic-small-tag-wrapper': size === 'small',
        'basic-default-tag-wrapper': size === 'default'
      })}
    />
  );
};

export default BasicTag;
