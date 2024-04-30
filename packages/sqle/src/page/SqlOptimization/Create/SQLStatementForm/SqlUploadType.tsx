import { UploadTypeStyleWrapper } from '../../../Order/SQLStatementForm/style';
import UploadTypeItem from '../../../Order/SQLStatementForm/UploadTypeItem';
import { UploadTypeEnum, SQLUploadTypeKeys } from '../../index.type';
import { useContext } from 'react';
import { FormSubmitStatusContext } from '..';
import { uploadItem } from './index.data';

const SqlUploadType: React.FC<{
  value?: UploadTypeEnum;
  onChange?: (v: UploadTypeEnum) => void;
}> = ({ value, onChange }) => {
  const submitLoading = useContext(FormSubmitStatusContext);

  return (
    <UploadTypeStyleWrapper>
      {SQLUploadTypeKeys.map((type) => {
        return (
          <UploadTypeItem
            key={`upload-item-${type}`}
            onClick={() => {
              if (!submitLoading) {
                onChange?.(UploadTypeEnum[type]);
              }
            }}
            active={value === UploadTypeEnum[type]}
          >
            {uploadItem[type].icon}
            <span className="text">{uploadItem[type].title}</span>
          </UploadTypeItem>
        );
      })}
    </UploadTypeStyleWrapper>
  );
};

export default SqlUploadType;
