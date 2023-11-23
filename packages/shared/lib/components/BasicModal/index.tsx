import { ModalProps } from 'antd';
import { BasicModalStyleWrapper } from './style';
import classNames from 'classnames';
import { IconClose } from '../../Icon';

const BasicModal: React.FC<ModalProps & { size?: 'small' | 'large' }> = ({
  className,
  size = 'small',
  ...props
}) => {
  return (
    <BasicModalStyleWrapper
      className={classNames(className, 'basic-modal-wrapper')}
      closeIcon={<IconClose width={16} height={16} />}
      width={size === 'small' ? 480 : 960}
      {...props}
    />
  );
};

export default BasicModal;
