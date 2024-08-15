import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import CreationResult from './CreationResult';
import BackToConf from '../Common/BackToConf';
import { useTranslation } from 'react-i18next';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Space } from 'antd';
import {
  BasicButton,
  EmptyBox,
  LazyLoadComponent,
  PageHeader
} from '@actiontech/shared';
import {
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import ConfForm from '../Common/ConfForm';
import { ConfFormContextProvide } from '../Common/ConfForm/context';
import { ScanTypeParams } from '../Common/ConfForm/index.type';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import useAsyncParams from '../../../components/BackendForm/useAsyncParams';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useSqlManagementConfFormSharedStates } from '../Common/ConfForm/hooks';
import { useRef } from 'react';
import { SCAN_TYPE_ALL_OPTION_VALUE } from '../Common/ConfForm/ScanTypesSelection/index.data';
import { useSearchParams } from 'react-router-dom';
import usePriorityConditionsParams from '../Common/ConfForm/ScanTypesDynamicParams/HighPriorityConditions/hooks';
import { BackendFormValues } from '../../../components/BackendForm';
import { IAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';

const Create: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const instanceAuditPlanCreatedId = useRef<string>('');
  const [searchParams] = useSearchParams();

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
    if (!!searchParams.get('instance_id') && !!searchParams.get('business')) {
      resetFormExceptFreezingFields();
    } else {
      form.resetFields();
    }
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    instance_audit_plan
      .createInstanceAuditPlanV1({
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
            return {
              audit_plan_type: item,
              rule_template_name: ruleTemplateName,
              mark_high_priority_sql: markHighPrioritySql,
              high_priority_conditions: markHighPrioritySql
                ? generateSubmitDataWithFormValues(prioritySqlConditions)
                : undefined,
              audit_plan_params: mergeFromValueIntoParams(
                paramValues as BackendFormValues,
                scanTypeMetas?.find((v) => v.audit_plan_type === item)
                  ?.audit_plan_params ?? []
              )
            };
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
