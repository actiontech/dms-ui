import { SQLUploadTypeKeys } from './index.type';
import { UploadTypeStyleWrapper } from '../../../Order/SQLStatementForm/style';
import UploadTypeItem from '../../../Order/SQLStatementForm/UploadTypeItem';
import { UploadTypeEnum } from '../SQLInfoForm/index.type';
import { uploadItem } from './index.data';

const SqlUploadType: React.FC<{
  value?: UploadTypeEnum;
  onChange?: (v: UploadTypeEnum) => void;
  submitLoading: boolean;
}> = ({ value, onChange, submitLoading }) => {
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
