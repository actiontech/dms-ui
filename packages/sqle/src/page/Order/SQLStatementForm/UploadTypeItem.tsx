import { ReactNode } from 'react';
import { UploadItemTypeStyleWrapper } from './style';
import { IconOrderUploadTypeChecked } from '../../../icon/Order';

export interface UploadTypeItemProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  hidden?: boolean;
}

const UploadTypeItem: React.FC<UploadTypeItemProps> = ({
  active,
  onClick,
  children,
  hidden
}) => {
  return (
    <UploadItemTypeStyleWrapper
      active={active}
      onClick={onClick}
      className="update-type-item-wrapper"
      hidden={hidden}
    >
      {children}
      <div className="active-icon-wrapper" hidden={!active}>
        <IconOrderUploadTypeChecked className="active-icon" />
      </div>
    </UploadItemTypeStyleWrapper>
  );
};

export default UploadTypeItem;
