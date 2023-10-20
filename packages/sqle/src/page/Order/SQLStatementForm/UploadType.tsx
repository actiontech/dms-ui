import { SQLInputType } from '.';
import { IconOrderFileUpload, IconOrderSQLUpload } from '../../../icon/Order';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'antd5';
import UploadTypeItem from './UploadTypeItem';

const UploadType: React.FC<{
  value?: SQLInputType;
  onChange?: (value: SQLInputType) => void;
  hideUpdateMybatisFile?: boolean;
}> = ({ value, onChange, hideUpdateMybatisFile = false }) => {
  const { t } = useTranslation();
  return (
    <Row gutter={12}>
      <Col span={8}>
        <UploadTypeItem
          onClick={() => onChange?.(SQLInputType.manualInput)}
          active={value === SQLInputType.manualInput}
        >
          <IconOrderSQLUpload />
          <span className="text">{t('order.sqlInfo.manualInput')}</span>
        </UploadTypeItem>
      </Col>
      <Col span={8}>
        <UploadTypeItem
          active={value === SQLInputType.uploadFile}
          onClick={() => onChange?.(SQLInputType.uploadFile)}
        >
          <IconOrderFileUpload />
          <span className="text">{t('order.sqlInfo.uploadFile')}</span>
        </UploadTypeItem>
      </Col>
      <Col span={8} hidden={hideUpdateMybatisFile}>
        <UploadTypeItem
          active={value === SQLInputType.uploadMybatisFile}
          onClick={() => onChange?.(SQLInputType.uploadMybatisFile)}
        >
          <IconOrderFileUpload />
          <span className="text">{t('order.sqlInfo.updateMybatisFile')}</span>
        </UploadTypeItem>
      </Col>
    </Row>
  );
};

export default UploadType;
