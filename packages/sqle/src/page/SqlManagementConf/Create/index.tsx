import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/dms-kit';
import CreationResult from './CreationResult';
import BackToConf from '../Common/BackToConf';
import { useTranslation } from 'react-i18next';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { Space } from 'antd';
import {
  BasicButton,
  EmptyBox,
  LazyLoadComponent,
  PageHeader
} from '@actiontech/dms-kit';
import { useTypedQuery } from '@actiontech/shared';
import ConfForm from '../Common/ConfForm';
import { ConfFormContextProvide } from '../Common/ConfForm/context';
import { ScanTypeParams } from '../Common/ConfForm/index.type';
import { SqleApi } from '@actiontech/shared/lib/api';
import { useAsyncParams, BackendFormValues } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/dms-kit';
import { useSqlManagementConfFormSharedStates } from '../Common/ConfForm/hooks';
import { useRef } from 'react';
import { SCAN_TYPE_ALL_OPTION_VALUE } from '../Common/ConfForm/ScanTypesSelection/index.data';
import usePriorityConditionsParams from '../Common/ConfForm/ScanTypesDynamicParams/HighPriorityConditions/hooks';
import { IAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import {
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/dms-kit/es/components/CustomForm/style';
const Create: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const instanceAuditPlanCreatedId = useRef<string>('');
  const extractQueries = useTypedQuery();
  const { mergeFromValueIntoParams } = useAsyncParams();
  const { generateSubmitDataWithFormValues } = usePriorityConditionsParams();
  const {
    form,
    getScanTypeMetaPending,
    submitLoading,
    startSubmit,
    finishSubmit,
    selectedScanTypeParams,
    scanTypeMetas,
    submitSuccessStatus,
    successfulSubmit,
    backToForm,
    resetFormExceptFreezingFields
  } = useSqlManagementConfFormSharedStates();
  const onReset = () => {
    const searchParams = extractQueries(
      ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.create
    );
    if (!!searchParams?.instance_id && !!searchParams?.environment_tag) {
      resetFormExceptFreezingFields();
    } else {
      form.resetFields();
    }
  };
  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    SqleApi.InstanceAuditPlanService.createInstanceAuditPlanV1({
      project_name: projectName,
      instance_id: values.instanceId,
      audit_plans: values.scanTypes
        .filter((item) => item !== SCAN_TYPE_ALL_OPTION_VALUE)
        .map<IAuditPlan>((item) => {
          const {
            ruleTemplateName,
            markHighPrioritySql,
            prioritySqlConditions,
            ...paramValues
          } = values[item] as ScanTypeParams;
          const params: IAuditPlan = {
            audit_plan_type: item,
            rule_template_name: ruleTemplateName,
            need_mark_high_priority_sql: markHighPrioritySql,
            high_priority_conditions: markHighPrioritySql
              ? generateSubmitDataWithFormValues(prioritySqlConditions)
              : undefined,
            audit_plan_params: mergeFromValueIntoParams(
              paramValues as BackendFormValues,
              scanTypeMetas?.find((v) => v.audit_plan_type === item)
                ?.audit_plan_params ?? []
            )
          };
          return params;
        })
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          successfulSubmit();
          instanceAuditPlanCreatedId.current =
            res.data.data?.instance_audit_plan_id ?? '';
        }
      })
      .finally(() => {
        finishSubmit();
      });
  };
  return (
    <ConfFormContextProvide
      value={{
        getScanTypeMetaPending,
        submitLoading,
        selectedScanTypeParams,
        scanTypeMetas: scanTypeMetas ?? null
      }}
    >
      <PageLayoutHasFixedHeaderStyleWrapper>
        <PageHeader
          fixed
          title={<BackToConf />}
          extra={
            <EmptyBox if={!submitSuccessStatus}>
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
            </EmptyBox>
          }
        />

        <LazyLoadComponent open={!submitSuccessStatus} animation={false}>
          <FormStyleWrapper
            colon={false}
            labelAlign="left"
            className="hasTopHeader"
            form={form}
            {...formItemLayout.spaceBetween}
          >
            <ConfForm />
          </FormStyleWrapper>
        </LazyLoadComponent>

        <LazyLoadComponent open={submitSuccessStatus} animation={false}>
          <CreationResult
            instanceAuditPlanId={instanceAuditPlanCreatedId.current}
            resetForm={() => {
              onReset();
              backToForm();
            }}
          />
        </LazyLoadComponent>
      </PageLayoutHasFixedHeaderStyleWrapper>
    </ConfFormContextProvide>
  );
};
export default Create;
