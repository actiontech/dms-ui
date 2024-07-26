import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { useBoolean, useRequest } from 'ahooks';
import { Form } from 'antd';
import { SqlManagementConfFormFields } from './index.type';
import { SelectScanTypeParamsType } from './context';
import { useMemo } from 'react';

export const useSqlManagementConfFormSharedStates = () => {
  const [form] = Form.useForm<SqlManagementConfFormFields>();
  const [submitLoading, { setTrue: startSubmit, setFalse: finishSubmit }] =
    useBoolean(false);
  const [
    submitSuccessStatus,
    { setTrue: successfulSubmit, setFalse: backToForm }
  ] = useBoolean(false);

  const selectedInstanceType = Form.useWatch('instanceType', form);
  const scanTypes = Form.useWatch('scanTypes', form);

  const { data: scanTypeMetas, loading: getScanTypeMetaPending } = useRequest(
    () =>
      audit_plan
        .getAuditPlanMetasV1({
          filter_instance_type: selectedInstanceType
        })
        .then((res) => res.data.data),
    { ready: !!selectedInstanceType, refreshDeps: [selectedInstanceType] }
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
    backToForm
  };
};
