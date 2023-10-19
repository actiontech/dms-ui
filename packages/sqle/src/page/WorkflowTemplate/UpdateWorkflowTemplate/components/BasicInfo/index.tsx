import React, { useEffect } from 'react';
import { UpdateWorkflowTemplateStyleWrapper } from '../../style';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd5';
import { BasicSelect } from '@actiontech/shared';
import { useForm } from 'antd5/es/form/Form';
import { BaseFormFields, BaseFormProps } from './index.type';
import useStaticStatus from '../../../../../hooks/useStaticStatus';
import StepButton from '../StepButton';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';

const BasicInfo: React.FC<BaseFormProps> = (props) => {
  const { t } = useTranslation();

  const { form } = props;

  const { getAuditLevelStatusSelectOption } = useStaticStatus();

  const nextStep = async () => {
    const value = await form.validateFields();
    props.updateBaseInfo(value?.allowSubmitWhenLessAuditLevel);
    props.nextStep();
  };

  useEffect(() => {
    const resetAllForm = () => {
      form.resetFields();
    };
    EventEmitter.subscribe(
      EmitterKey.Reset_Workflow_Template_Form,
      resetAllForm
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Workflow_Template_Form,
        resetAllForm
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!props.defaultData) {
      form.setFieldsValue({
        allowSubmitWhenLessAuditLevel: props.defaultData
          .allow_submit_when_less_audit_level as
          | WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
          | undefined
      });
    } else {
      form.setFieldsValue({
        allowSubmitWhenLessAuditLevel:
          WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn
      });
    }
  }, [form, props.defaultData]);

  const handleChangeLevel = (
    level: WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
  ) => {
    props.updateBaseInfo(level);
  };

  return (
    <>
      <UpdateWorkflowTemplateStyleWrapper>
        <div className="step-title-wrapper">
          <div className="step-title">
            {t('workflowTemplate.step.baseFormTitle')}
          </div>
          <div className="step-title-info">
            {t('workflowTemplate.step.baseFormDesc')}
          </div>
        </div>
        <div className="step-info-wrapper">
          <Form form={form} requiredMark={false} layout="vertical">
            <Form.Item
              label={t(
                'workflowTemplate.form.label.allowSubmitWhenLessAuditLevel'
              )}
              name="allowSubmitWhenLessAuditLevel"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <BasicSelect
                placeholder={t('common.form.placeholder.select', {
                  name: t(
                    'workflowTemplate.form.label.allowSubmitWhenLessAuditLevel'
                  )
                })}
                onChange={handleChangeLevel}
              >
                {getAuditLevelStatusSelectOption()}
              </BasicSelect>
            </Form.Item>
            <StepButton
              currentStep={0}
              totalStep={props.totalStep}
              nextStep={nextStep}
            />
          </Form>
        </div>
      </UpdateWorkflowTemplateStyleWrapper>
    </>
  );
};

export default BasicInfo;
