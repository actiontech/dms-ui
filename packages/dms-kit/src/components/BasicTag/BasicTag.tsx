import { BasicTagProps } from './BasicTag.types';
import { BasicTagStyleWrapper } from './style';
import classNames from 'classnames';

const BasicTag: React.FC<BasicTagProps> = ({
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
