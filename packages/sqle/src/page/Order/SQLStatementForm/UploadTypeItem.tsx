import { ReactNode } from 'react';
import { UploadItemTypeStyleWrapper } from './style';
import { IconOrderUploadTypeChecked } from '../../../icon/Order';
import { EmptyBox } from '@actiontech/shared';

const UploadTypeItem: React.FC<{
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}> = ({ active, onClick, children }) => {
  return (
    <UploadItemTypeStyleWrapper active={active} onClick={onClick}>
      {children}
      <EmptyBox if={active}>
        <div className="active-icon-wrapper">
          <IconOrderUploadTypeChecked className="active-icon" />
        </div>
      </EmptyBox>
    </UploadItemTypeStyleWrapper>
  );
};

export default UploadTypeItem;
