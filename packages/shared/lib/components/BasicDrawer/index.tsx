import { DrawerProps } from 'antd';
import classNames from 'classnames';

import { BasicDrawerStyleWrapper } from './style';
import { CloseOutlined } from '@ant-design/icons';
import { useMemo } from 'react';

export interface BasicDrawerProps extends DrawerProps {
  showClosedIcon?: boolean;
  noBodyPadding?: boolean;
}

const BasicDrawer: React.FC<BasicDrawerProps> = ({
  className,
  size = 'default',
  children,
  showClosedIcon = true,
  noBodyPadding,
  onClose,
  ...props
}) => {
  const width = useMemo(() => {
    if (props.width) {
      return props.width;
    }
    return size === 'default' ? 480 : 720;
  }, [props.width, size]);
  return (
    <BasicDrawerStyleWrapper
      size="default"
      className={classNames(className, 'basic-drawer-wrapper', {
        'drawer-wrapper-no-padding': noBodyPadding
      })}
      maskClosable={false}
      closeIcon={false}
      {...props}
      width={width}
      onClose={onClose}
    >
      {showClosedIcon && (
        <div className="closed-icon-custom" onClick={onClose}>
          <CloseOutlined />
        </div>
      )}
      {children}
    </BasicDrawerStyleWrapper>
  );
};

export default BasicDrawer;
