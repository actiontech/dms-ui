import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { useState } from 'react';
import { BasicButton, BasicResult, PageHeader } from '@actiontech/shared';

import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';
import { PlanFormField } from '../PlanForm/index.type';
import PlanForm from '../PlanForm';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { useCurrentProject } from '@actiontech/shared/lib/global';

import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { ResponseCode } from '../../../data/common';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { LeftArrowOutlined } from '@actiontech/icons';

const CreatePlan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectName, projectID } = useCurrentProject();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccessStatus, setSubmitSuccessStatus] = useState(false);
  const [form] = useForm<PlanFormField>();

  const onSkipList = () => {
    onReset();
    navigate(`/sqle/project/${projectID}/audit-plan`);
  };

  const onReset = () => {
    EventEmitter.emit(EmitterKey.Rest_Audit_Plan_Form);
  };

  const onSubmit = async () => {
    EventEmitter.emit(EmitterKey.Submit_Audit_Plan_Form);
  };

  const createAuditPlan = (values: PlanFormField) => {
    setSubmitLoading(true);
    return audit_plan
      .createAuditPlanV1({
        project_name: projectName,
        audit_plan_cron: values.cron,
        audit_plan_instance_database: values.schema,
        audit_plan_instance_name: values.databaseName,
        audit_plan_instance_type: values.dbType,
        audit_plan_name: values.name,
        audit_plan_type: values.auditTaskType,
        audit_plan_params: values.asyncParams,
        rule_template_name: values.ruleTemplateName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSubmitSuccessStatus(true);
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const cloneAuditPlan = () => {
    setSubmitSuccessStatus(false);
    form.setFieldsValue({
      name: ''
    });
  };

  const closedResultAndResetForm = () => {
    onReset();
    setSubmitSuccessStatus(false);
  };

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed
        title={
          <BasicButton onClick={onSkipList} icon={<LeftArrowOutlined />}>
            {t('auditPlan.action.backButton')}
          </BasicButton>
        }
        extra={
          !submitSuccessStatus ? (
            <Space>
              <BasicButton onClick={onReset} disabled={submitLoading}>
                {t('common.reset')}
              </BasicButton>
              <BasicButton
                type="primary"
                htmlType="submit"
                onClick={onSubmit}
                loading={submitLoading}
              >
                {t('common.submit')}
              </BasicButton>
            </Space>
          ) : undefined
        }
      />
      <div hidden={!submitSuccessStatus}>
        <BasicResult
          status="success"
          title={t('auditPlan.create.successTitle')}
          extra={[
            <BasicButton key="clone-audit-plan" onClick={cloneAuditPlan}>
              {t('auditPlan.create.clonePlan')}
            </BasicButton>,
            <BasicButton
              key="close-result-and-reset-form"
              onClick={closedResultAndResetForm}
            >
              {t('common.resetAndClose')}
            </BasicButton>,
            <BasicButton
              type="primary"
              key="view-audit-plan"
              onClick={() => {
                navigate(
                  `/sqle/project/${projectID}/audit-plan/detail/${form.getFieldValue(
                    'name'
                  )}`
                );
              }}
            >
              {t('auditPlan.create.successGuide')}
            </BasicButton>
          ]}
        />
      </div>
      <div hidden={submitSuccessStatus}>
        <PlanForm
          title={t('auditPlan.create.title')}
          form={form}
          projectName={projectName}
          submitLoading={submitLoading}
          submit={createAuditPlan}
        />
      </div>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default CreatePlan;
