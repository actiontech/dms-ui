import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'ahooks';
import { Col, Form, message, Row, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { BasicButton, BasicDrawer, BasicInput } from '@actiontech/shared';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateGlobalRuleTemplateListModalStatus } from '../../../../../store/globalRuleTemplate';
import EventEmitter from '../../../../../utils/EventEmitter';
import { CloneRuleTemplateFormFields } from './index.type';
import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { IRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

const CloneRuleTemplateModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = useForm<CloneRuleTemplateFormFields>();
  const [messageApi, messageContextHolder] = message.useMessage();
  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.globalRuleTemplate.modalStatus[ModalName.Clone_Rule_Template]
  );
  const [requestPending, { setTrue: startRequest, setFalse: requestFinished }] =
    useBoolean();

  const currentRuleTemplate = useSelector<
    IReduxState,
    IRuleTemplateResV1 | null
  >((state) => state.globalRuleTemplate.selectGlobalRuleTemplate);

  const close = () => {
    form.resetFields();
    dispatch(
      updateGlobalRuleTemplateListModalStatus({
        modalName: ModalName.Clone_Rule_Template,
        status: false
      })
    );
  };

  const submit = async () => {
    const value = await form.validateFields();
    startRequest();
    rule_template
      .CloneRuleTemplateV1({
        rule_template_name: currentRuleTemplate?.rule_template_name ?? '',
        new_rule_template_name: value.templateName,
        desc: value.templateDesc
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('ruleTemplate.cloneRuleTemplate.successTips', {
              name: currentRuleTemplate?.rule_template_name
            })
          );
          close();
          EventEmitter.emit(EmitterKey.Refresh_Global_Rule_Template_List);
        }
      })
      .finally(() => {
        requestFinished();
      });
  };

  return (
    <BasicDrawer
      open={visible}
      title={t('ruleTemplate.cloneRuleTemplate.title')}
      closable={false}
      onClose={close}
      footer={
        <Space>
          <BasicButton onClick={close} disabled={requestPending}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={submit} loading={requestPending}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {messageContextHolder}
      <Space direction="vertical" className="full-width-element">
        <Row>
          <Col>
            {t('ruleTemplate.cloneRuleTemplate.currentTemplateTips')}
            <Link
              target="_blank"
              to={`/sqle/rule/template/update/${currentRuleTemplate?.rule_template_name}`}
            >
              {currentRuleTemplate?.rule_template_name}
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
