import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { PlanFormField } from '../PlanForm/index.type';
import { UpdateAuditPlanUrlParams } from './index.type';

import { useCurrentProject } from '@actiontech/shared/lib/global';

import { ResponseCode } from '../../../data/common';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { IAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

import { useBack } from '@actiontech/shared/lib/hooks';
import { useNavigate } from 'react-router-dom';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';

import { Space, Spin } from 'antd';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicButton, BasicResult, PageHeader } from '@actiontech/shared';
import PlanForm from '../PlanForm';

import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';

const UpdatePlan = () => {
  const { t } = useTranslation();

  const navigater = useNavigate();
  const { goBack } = useBack();

  const urlParams = useParams<UpdateAuditPlanUrlParams>();
  const { projectName, projectID } = useCurrentProject();
  const [form] = useForm<PlanFormField>();

  const [detailLoading, setDetailLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccessStatus, setSubmitSuccessStatus] = useState(false);
  const [defaultValue, setDefaultValue] = useState<IAuditPlanResV1>();

  const updateAuditPlan = (values: PlanFormField) => {
    setSubmitLoading(true);
    return audit_plan
      .updateAuditPlanV1({
        audit_plan_cron: values.cron,
        audit_plan_instance_database: values.schema ?? '',
        audit_plan_instance_name: values.databaseName ?? '',
        audit_plan_name: urlParams.auditPlanName ?? '',
        audit_plan_params: values.asyncParams,
        rule_template_name: values.ruleTemplateName,
        project_name: projectName
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

  const getCurrentAuditPlan = () => {
    setDetailLoading(true);
    audit_plan
      .getAuditPlanV1({
        audit_plan_name: urlParams.auditPlanName ?? '',
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const detailData = res.data.data ?? {};
          Object.keys(detailData).forEach((key) => {
            const currentVal = detailData[key as keyof typeof detailData];
            if (typeof currentVal === 'string' && !currentVal) {
              delete detailData[key as keyof typeof detailData];
            }
          });
          setDefaultValue(detailData);
        }
      })
      .finally(() => {
        setDetailLoading(false);
      });
  };

  useEffect(() => {
    getCurrentAuditPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSkipList = () => {
    onReset();
    goBack();
  };

  const onReset = () => {
    EventEmitter.emit(EmitterKey.Rest_Audit_Plan_Form);
    getCurrentAuditPlan();
  };

  const onSubmit = async () => {
    EventEmitter.emit(EmitterKey.Submit_Audit_Plan_Form);
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
          <BasicButton onClick={onSkipList} icon={<IconLeftArrow />}>
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
          icon={<IconSuccessResult />}
          title={t('auditPlan.update.successTitle')}
          extra={[
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
                navigater(
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
        <Spin spinning={detailLoading}>
          <PlanForm
            title={t('auditPlan.update.title', { name: '' })}
            form={form}
            projectName={projectName}
            defaultValue={defaultValue}
            submitLoading={submitLoading}
            submit={updateAuditPlan}
          />
        </Spin>
      </div>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default UpdatePlan;
