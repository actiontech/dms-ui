import { Avatar, AvatarProps } from 'antd';
import { useMemo } from 'react';
import { AvatarStyleWrapper } from './style';
import BasicToolTips from '../BasicToolTips';
import classNames from 'classnames';

export type IAvatarCom = {
  name?: string;
  src?: string;
  noTips?: boolean;
  toolTipsWrapperClassName?: string;
} & AvatarProps;

/**
  todo:
    Avatar 的 背景颜色，暂时使用背景颜色
 */
const AvatarCom = (props: IAvatarCom) => {
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
    <BasicToolTips
      title={noTips ? '' : name}
      placement="top"
      className={classNames(toolTipsWrapperClassName)}
    >
      {src ? (
        <Avatar size={size} src={src} {...otherProp} />
      ) : (
        <AvatarStyleWrapper
          size={size}
          className="action-avatar"
          {...otherProp}
        >
          {NameFirstLetter}
        </AvatarStyleWrapper>
      )}
    </BasicToolTips>
  );
};

export default AvatarCom;
