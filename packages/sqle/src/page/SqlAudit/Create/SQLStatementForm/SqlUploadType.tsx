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
import { I18nKey } from '../../../../locale';

const uploadItem: {
  [key in TypeUploadKeys]: {
    icon: React.ReactNode;
    title: I18nKey;
  };
} = {
  sql: {
    icon: <IconOrderSQLUpload />,
    title: 'sqlAudit.create.sqlInfo.uploadTypeEnum.sql'
  },
  git: {
    icon: <SettingOutlined style={{ color: '#c3c6cd' }} />,
    title: 'sqlAudit.create.sqlInfo.uploadTypeEnum.git'
  },
  sqlFile: {
    icon: <IconOrderFileUpload />,
    title: 'sqlAudit.create.sqlInfo.uploadTypeEnum.sqlFile'
  },
  mybatisFile: {
    icon: <IconOrderFileUpload />,
    title: 'sqlAudit.create.sqlInfo.uploadTypeEnum.mybatisFile'
  },
  zipFile: {
    icon: <IconOrderFileUpload />,
    title: 'sqlAudit.create.sqlInfo.uploadTypeEnum.zipFile'
  }
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
            {uploadItem[type].icon}
            <span className="text">{t(uploadItem[type].title)}</span>
          </UploadTypeItem>
        );
      })}
    </UploadTypeStyleWrapper>
  );
};

export default SqlUploadType;
