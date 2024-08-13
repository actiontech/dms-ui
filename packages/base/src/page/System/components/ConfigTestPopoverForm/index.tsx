import { useTranslation } from 'react-i18next';
import { BasicButton } from '@actiontech/shared';
import { Col, Row, Space } from 'antd';

interface ConfigTestPopoverFormProps {
  handleTest: () => void;
  handleCancel: () => void;
  children: React.ReactNode;
}

/**
 * @deprecated
 * 使用 shared 中 ConfigTestPopoverForm 替换
 */
const ConfigTestPopoverForm: React.FC<ConfigTestPopoverFormProps> = (props) => {
  const { t } = useTranslation();
  const { handleTest, handleCancel, children } = props;
  return (
    <Space size={16} direction="vertical" className="full-width-element">
      {children}
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Space size={12}>
            <BasicButton size="small" onClick={handleCancel}>
              {t('common.cancel')}
            </BasicButton>
            <BasicButton type="primary" size="small" onClick={handleTest}>
              {t('common.ok')}
            </BasicButton>
          </Space>
        </Col>
      </Row>
    </Space>
  );
};

export default ConfigTestPopoverForm;
