import { SQLInputType } from '.';
import { IconOrderFileUpload, IconOrderSQLUpload } from '../../../icon/Order';
import { useTranslation } from 'react-i18next';
import UploadTypeItem from './UploadTypeItem';
import { UploadTypeStyleWrapper } from './style';

const UploadType: React.FC<{
  value?: SQLInputType;
  onChange?: (value: SQLInputType) => void;
  hideUpdateMybatisFile?: boolean;
}> = ({ value, onChange, hideUpdateMybatisFile = false }) => {
  const { t } = useTranslation();
  return (
    <UploadTypeStyleWrapper>
      <UploadTypeItem
        onClick={() => onChange?.(SQLInputType.manualInput)}
        active={value === SQLInputType.manualInput}
      >
        <IconOrderSQLUpload />
        <span className="text">{t('order.sqlInfo.manualInput')}</span>
      </UploadTypeItem>
      <UploadTypeItem
        active={value === SQLInputType.uploadFile}
        onClick={() => onChange?.(SQLInputType.uploadFile)}
      >
        <IconOrderFileUpload />
        <span className="text">{t('order.sqlInfo.uploadFile')}</span>
      </UploadTypeItem>
      <UploadTypeItem
        active={value === SQLInputType.uploadMybatisFile}
        onClick={() => onChange?.(SQLInputType.uploadMybatisFile)}
        hidden={hideUpdateMybatisFile}
      >
        <IconOrderFileUpload />
        <span className="text">{t('order.sqlInfo.updateMybatisFile')}</span>
      </UploadTypeItem>
      <UploadTypeItem
        active={value === SQLInputType.zipFile}
        onClick={() => onChange?.(SQLInputType.zipFile)}
      >
        <IconOrderFileUpload />
        <span className="text">{t('order.sqlInfo.uploadZipFile')}</span>
      </UploadTypeItem>
    </UploadTypeStyleWrapper>
  );
};

export default UploadType;
