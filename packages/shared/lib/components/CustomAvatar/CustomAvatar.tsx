import { Avatar } from 'antd';
import { useMemo } from 'react';
import { CustomAvatarStyleWrapper } from './style';
import classNames from 'classnames';
import { CustomAvatarProps } from './CustomAvatar.types';
import { BasicToolTip } from '../BasicToolTip';

const CustomAvatar: React.FC<CustomAvatarProps> = (props) => {
  const {
    src,
    name,
    noTips,
    size = 'default',
    toolTipsWrapperClassName,
    ...otherProp
  } = props;

  const NameFirstLetter = useMemo(() => {
    return (name?.[0] ?? '').toUpperCase();
  }, [name]);

  return (
    <BasicToolTip
      title={noTips ? '' : name}
      placement="top"
      className={classNames(toolTipsWrapperClassName)}
    >
      {src ? (
        <Avatar size={size} src={src} {...otherProp} />
      ) : (
        <CustomAvatarStyleWrapper
          size={size}
          className="action-avatar"
          {...otherProp}
        >
          {NameFirstLetter}
        </CustomAvatarStyleWrapper>
      )}
    </BasicToolTip>
  );
};

export default CustomAvatar;
