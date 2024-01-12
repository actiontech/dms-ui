import { SQLUploadTypeKeys, TypeUploadKeys } from './index.type';
import {
  IconOrderFileUpload,
  IconOrderSQLUpload
} from '../../../../icon/Order';
import { SettingOutlined } from '@ant-design/icons';
import { UploadTypeStyleWrapper } from '../../../Order/SQLStatementForm/style';
import UploadTypeItem from '../../../Order/SQLStatementForm/UploadTypeItem';
import { UploadTypeEnum } from '../SQLInfoForm/index.type';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { FormSubmitStatusContext } from '..';

const uploadItemIcon: {
  [key in TypeUploadKeys]: React.ReactNode;
} = {
  sql: <IconOrderSQLUpload />,
  git: <SettingOutlined style={{ color: '#c3c6cd' }} />,
  sqlFile: <IconOrderFileUpload />,
  mybatisFile: <IconOrderFileUpload />,
  zipFile: <IconOrderFileUpload />
};

const SqlUploadType: React.FC<{
  value?: UploadTypeEnum;
  onChange?: (v: UploadTypeEnum) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();

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
            {uploadItemIcon[type]}
            <span className="text">
              {t(`sqlAudit.create.sqlInfo.uploadTypeEnum.${type}`)}
            </span>
          </UploadTypeItem>
        );
      })}
    </UploadTypeStyleWrapper>
  );
};

export default SqlUploadType;
