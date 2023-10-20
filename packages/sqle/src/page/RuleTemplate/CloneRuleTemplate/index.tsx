import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'ahooks';
import { Link } from 'react-router-dom';

import { IReduxState } from '../../../store';
import { ModalName } from '../../../data/ModalName';
import { updateRuleTemplateListModalStatus } from '../../../store/ruleTemplate';

import { Col, Form, message, Row, Space, Typography } from 'antd5';
import { BasicButton, BasicDrawer, BasicInput } from '@actiontech/shared';
import { useForm } from 'antd5/es/form/Form';
import { useCurrentProject } from '@actiontech/shared/lib/global';

import { CloneRuleTemplateFormFields } from './index.type';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { IProjectRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

const CloneRuleTemplate = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { projectName, projectID } = useCurrentProject();
  const [messageApi, contextMessageHolder] = message.useMessage();

  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.ruleTemplate.modalStatus[ModalName.Clone_Rule_Template]
  );
  const currentRuleTemplate = useSelector<
    IReduxState,
    IProjectRuleTemplateResV1 | null
  >((state) => state.ruleTemplate.selectRuleTemplate);
  const [form] = useForm<CloneRuleTemplateFormFields>();
  const [requestPending, { setTrue: startRequest, setFalse: requestFinished }] =
    useBoolean();

  const close = () => {
    form.resetFields();
    dispatch(
      updateRuleTemplateListModalStatus({
        modalName: ModalName.Clone_Rule_Template,
        status: false
      })
    );
  };

  const submit = async () => {
    const value = await form.validateFields();
    startRequest();
    rule_template
      .cloneProjectRuleTemplateV1({
        rule_template_name: currentRuleTemplate?.rule_template_name ?? '',
        new_rule_template_name: value.templateName,
        desc: value.templateDesc,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('ruleTemplate.cloneRuleTemplate.successTips', {
              name: currentRuleTemplate?.rule_template_name
            })
          );
          close();
          EventEmitter.emit(EmitterKey.Refresh_Rule_Template_List);
        }
      })
      .finally(() => {
        requestFinished();
      });
  };

  return (
    <>
      {contextMessageHolder}
      <BasicDrawer
        open={visible}
        title={t('ruleTemplate.cloneRuleTemplate.title')}
        closable={false}
        showClosedIcon
        onClose={close}
        footer={
          <Space>
            <BasicButton onClick={close} disabled={requestPending}>
              {t('common.close')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={submit}
              loading={requestPending}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      >
        <Space direction="vertical" className="full-width-element">
          <Row>
            <Col>
              {t('ruleTemplate.cloneRuleTemplate.currentTemplateTips')}
              <Link
                target="_blank"
                to={`/sqle/project/${projectID}/rule/template/update/${currentRuleTemplate?.rule_template_name}`}
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
        </Space>
        <Form form={form} {...formItemLayout.fullLine}>
          <Form.Item
            label={t('ruleTemplate.ruleTemplateForm.templateName')}
            name="templateName"
            validateFirst
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
      </BasicDrawer>
    </>
  );
};

export default CloneRuleTemplate;
