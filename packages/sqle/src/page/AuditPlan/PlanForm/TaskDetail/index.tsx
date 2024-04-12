import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { useContext, useEffect, useMemo, useState } from 'react';

import { BasicSelect, EmptyBox } from '@actiontech/shared';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';

import { ITaskDetail } from './index.type';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import AutoCreatedFormItemByApi from '../../../../components/BackendForm/AutoCreatedFormItemByApi';
import useAsyncParams from '../../../../components/BackendForm/useAsyncParams';
import { FormSubmitStatusContext } from '..';

const TaskDetail = (props: ITaskDetail) => {
  const { t } = useTranslation();

  const { form, dbType, defaultValue, updateCurrentTypeParams } = props;
  const submitLoading = useContext(FormSubmitStatusContext);

  const {
    data: metas,
    loading,
    run: updateAuditTaskMetas
  } = useRequest(
    () =>
      audit_plan
        .getAuditPlanMetasV1({
          filter_instance_type: dbType
        })
        .then((res) => res.data.data),
    {
      manual: true
    }
  );

  const [currentType, setCurrentType] = useState('');
  const { generateFormValueByParams } = useAsyncParams();

  const formMate = useMemo(() => {
    if (!currentType || !metas) {
      return undefined;
    }
    return metas.find((item) => item.audit_plan_type === currentType)
      ?.audit_plan_params;
  }, [currentType, metas]);

  const metaOptions = useMemo(() => {
    return (metas ?? [])?.map((item) => ({
      label: item.audit_plan_type_desc,
      value: item.audit_plan_type
    }));
  }, [metas]);

  useEffect(() => {
    updateCurrentTypeParams?.(formMate);
  }, [formMate, updateCurrentTypeParams]);

  useEffect(() => {
    if (!formMate) {
      return;
    }
    if (!defaultValue) {
      form.setFieldsValue({
        params: generateFormValueByParams(formMate)
      });
    } else {
      form.setFieldsValue({
        params: generateFormValueByParams(
          defaultValue.audit_plan_meta?.audit_plan_params ?? []
        )
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formMate]);

  useEffect(() => {
    if (dbType) {
      updateAuditTaskMetas();
      return;
    }
    setCurrentType('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbType]);

  useEffect(() => {
    if (!form) return;
    if (!!dbType && !defaultValue) {
      form.setFieldsValue({
        auditTaskType: undefined
      });
      return;
    }
    const audit_plan_type_val = defaultValue?.audit_plan_meta?.audit_plan_type;
    if (!!audit_plan_type_val && metas) {
      form.setFieldsValue({
        auditTaskType: audit_plan_type_val
      });
      setCurrentType(audit_plan_type_val ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbType, defaultValue, metas, form]);

  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label={t('auditPlan.planForm.taskDetail.taskType')}
        {...formItemLayout.spaceBetween}
        name="auditTaskType"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicSelect
          loading={loading}
          onChange={(val) => {
            setCurrentType(val ?? '');
          }}
          placeholder={t('common.form.placeholder.select')}
          disabled={submitLoading || !!defaultValue}
          options={metaOptions}
        ></BasicSelect>
      </FormItemLabel>
      <EmptyBox if={!!formMate}>
        <AutoCreatedFormItemByApi
          formMode={!!defaultValue ? 'update' : 'create'}
          params={formMate ?? []}
          disabled={submitLoading}
        />
      </EmptyBox>
    </>
  );
};

export default TaskDetail;
