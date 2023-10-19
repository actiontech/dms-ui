import { UploadItemTypeStyleWrapper } from './style';
import { SQLInputType } from '.';
import { IconOrderFileUpload, IconOrderSQLUpload } from '../../../icon/Order';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'antd5';

const UploadType: React.FC<{
  value?: SQLInputType;
  onChange?: (value: SQLInputType) => void;
  hideUpdateMybatisFile?: boolean;
}> = ({ value, onChange, hideUpdateMybatisFile = false }) => {
  const { t } = useTranslation();
  return (
    <Row gutter={12}>
      <Col span={8}>
        <UploadItemTypeStyleWrapper
          onClick={() => onChange?.(SQLInputType.manualInput)}
          active={value === SQLInputType.manualInput}
        >
          <IconOrderSQLUpload />
          <span className="text">{t('order.sqlInfo.manualInput')}</span>
        </UploadItemTypeStyleWrapper>
      </Col>
      <Col span={8}>
        <UploadItemTypeStyleWrapper
          active={value === SQLInputType.uploadFile}
          onClick={() => onChange?.(SQLInputType.uploadFile)}
        >
          <IconOrderFileUpload />
          <span className="text">{t('order.sqlInfo.uploadFile')}</span>
        </UploadItemTypeStyleWrapper>
      </Col>
      <Col span={8} hidden={hideUpdateMybatisFile}>
        <UploadItemTypeStyleWrapper
          active={value === SQLInputType.uploadMybatisFile}
          onClick={() => onChange?.(SQLInputType.uploadMybatisFile)}
        >
          <IconOrderFileUpload />
          <span className="text">{t('order.sqlInfo.updateMybatisFile')}</span>
        </UploadItemTypeStyleWrapper>
      </Col>
    </Row>
  );
};

export default UploadType;
