import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { useBoolean, useRequest } from 'ahooks';
import { Form } from 'antd';
import { SqlManagementConfFormFields, FreezingFormFields } from './index.type';
import { SelectScanTypeParamsType } from './context';
import { useMemo, useCallback } from 'react';

const freezingFormFields: FreezingFormFields = [
  'instanceId',
  'instanceName',
  'businessScope',
  'instanceType'
];

export const useSqlManagementConfFormSharedStates = () => {
  const [form] = Form.useForm<SqlManagementConfFormFields>();
  const [submitLoading, { setTrue: startSubmit, setFalse: finishSubmit }] =
    useBoolean(false);
  const [
    submitSuccessStatus,
    { setTrue: successfulSubmit, setFalse: backToForm }
  ] = useBoolean(false);

  const selectedInstanceType = Form.useWatch('instanceType', form);
  const selectedInstanceId = Form.useWatch('instanceId', form);
  const scanTypes = Form.useWatch('scanTypes', form);

  const { data: scanTypeMetas, loading: getScanTypeMetaPending } = useRequest(
    () =>
      audit_plan
        .getAuditPlanMetasV1({
          filter_instance_type: selectedInstanceType,
          filter_instance_id: selectedInstanceId
        })
        .then((res) => res.data.data),
    {
      ready: !!selectedInstanceType,
      refreshDeps: [selectedInstanceType, selectedInstanceId]
    }
  );

  const selectedScanTypeParams: SelectScanTypeParamsType = useMemo(() => {
    return (
      scanTypeMetas
        ?.filter((v) => scanTypes?.includes(v.audit_plan_type ?? ''))
        .map((v) => {
          const param: SelectScanTypeParamsType[0] = {
            [v.audit_plan_type ?? '']: v.audit_plan_params ?? []
          };

          return param;
        }) ?? []
    );
  }, [scanTypeMetas, scanTypes]);

  const resetFormExceptFreezingFields = useCallback(() => {
    form.resetFields(
      Object.keys(form.getFieldsValue()).filter(
        (key) => !freezingFormFields.includes(key)
      )
    );
  }, [form]);

  return {
    form,
    getScanTypeMetaPending,
    submitLoading,
    startSubmit,
    finishSubmit,
    selectedInstanceType,
    selectedScanTypeParams,
    scanTypeMetas,
    submitSuccessStatus,
    successfulSubmit,
    backToForm,
    freezingFormFields,
    resetFormExceptFreezingFields
  };
};
