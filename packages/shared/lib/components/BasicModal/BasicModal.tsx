import { BasicModalStyleWrapper } from './style';
import classNames from 'classnames';
import { useMemo } from 'react';
import { CloseOutlined } from '@actiontech/icons';
import { BasicModalProps } from './BasicModal.types';

const BasicModal: React.FC<BasicModalProps> = ({
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
      closeIcon={<CloseOutlined width={16} height={16} fill="currentColor" />}
      {...props}
      width={width}
    />
  );
};

export default BasicModal;
