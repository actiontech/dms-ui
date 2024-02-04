import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, Space, Typography } from 'antd';
import { BasicButton, BasicDrawer, BasicInput } from '@actiontech/shared';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import { CloneRuleTemplateModalProps } from './index.type';

const CloneRuleTemplateModal: React.FC<CloneRuleTemplateModalProps> = ({
  visible,
  onClose,
  loading,
  onSubmit,
  link,
  templateName,
  form
}) => {
  const { t } = useTranslation();

  return (
    <BasicDrawer
      open={visible}
      title={t('ruleTemplate.cloneRuleTemplate.title')}
      closable={false}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton onClick={onClose} disabled={loading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={onSubmit} loading={loading}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      <Space direction="vertical" className="full-width-element">
        <Row>
          <Col>
            {t('ruleTemplate.cloneRuleTemplate.currentTemplateTips')}
            <Link target="_blank" to={link}>
              {templateName}
            </Link>
          </Col>
          <Col>
            <Typography.Text type="secondary">
              {t('ruleTemplate.cloneRuleTemplate.cloneDesc')}
            </Typography.Text>
          </Col>
        </Row>
        <Form form={form} {...formItemLayout.fullLine}>
          <Form.Item
            label={t('ruleTemplate.ruleTemplateForm.templateName')}
            name="templateName"
            validateFirst={true}
            rules={[
              {
                required: true
              },
              ...nameRule()
            ]}
          >
            <BasicInput
              placeholder={t('common.form.placeholder.input', {
                name: t('ruleTemplate.ruleTemplateForm.templateName')
              })}
            />
          </Form.Item>
          <Form.Item
            label={t('ruleTemplate.ruleTemplateForm.templateDesc')}
            name="templateDesc"
          >
            <BasicInput.TextArea
              className="textarea-no-resize"
              placeholder={t('common.form.placeholder.input', {
                name: t('ruleTemplate.ruleTemplateForm.templateDesc')
              })}
            />
          </Form.Item>
        </Form>
      </Space>
    </BasicDrawer>
  );
};

export default CloneRuleTemplateModal;
