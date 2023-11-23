import { TagProps } from 'antd';
import { BasicTagStyleWrapper } from './style';
import classNames from 'classnames';
import { BasicTagColor } from '../../theme/theme.type';

const BasicTag: React.FC<
  TagProps & { size?: 'small' | 'large' | 'default'; color?: BasicTagColor }
> = ({ className, size = 'default', color = 'default', ...props }) => {
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
