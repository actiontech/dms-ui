import { ModalProps } from 'antd';
import { BasicModalStyleWrapper } from './style';
import classNames from 'classnames';
import { IconClose } from '../../Icon';
import { useMemo } from 'react';

export type IBasicModal = ModalProps & { size?: 'small' | 'large' };

const BasicModal: React.FC<IBasicModal> = ({
  className,
  size = 'small',
  ...props
}) => {
  const width = useMemo(() => {
    if (props.width) {
      return props.width;
    }
    return size === 'small' ? 480 : 960;
  }, [props.width, size]);

  return (
    <BasicModalStyleWrapper
      className={classNames(className, 'basic-modal-wrapper')}
      closeIcon={<IconClose width={16} height={16} />}
      {...props}
      width={width}
    />
  );
};

export default BasicModal;
