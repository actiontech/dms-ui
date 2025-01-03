import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import useAsyncParams from '../../../components/BackendForm/useAsyncParams';
import { useSqlManagementConfFormSharedStates } from '../Common/ConfForm/hooks';
import { ConfFormContextProvide } from '../Common/ConfForm/context';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  BasicButton,
  PageHeader,
  useTypedNavigate,
  useTypedParams
} from '@actiontech/shared';
import BackToConf from '../Common/BackToConf';
import { Space, Spin, message } from 'antd';
import {
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import ConfForm from '../Common/ConfForm';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import {
  ScanTypeParams,
  SqlManagementConfFormFields
} from '../Common/ConfForm/index.type';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useRequest } from 'ahooks';
import { useMemo } from 'react';
import usePriorityConditionsParams from '../Common/ConfForm/ScanTypesDynamicParams/HighPriorityConditions/hooks';
import {
  BackendFormRequestParams,
  BackendFormValues
} from '../../../components/BackendForm';
import { IAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';
import { SCAN_TYPE_ALL_OPTION_VALUE } from '../Common/ConfForm/ScanTypesSelection/index.data';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { AuditPlanParamResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const Update: React.FC = () => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();
  const { id } =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.update>();
  const [messageApi, messageContextHolder] = message.useMessage();
  const navigate = useTypedNavigate();

  const { mergeFromValueIntoParams, generateFormValueByParams } =
    useAsyncParams();

  const {
    generateFormValuesWithAPIResponse,
    generateSubmitDataWithFormValues
  } = usePriorityConditionsParams();
  const {
    form,
    getScanTypeMetaPending,
    submitLoading,
    startSubmit,
    finishSubmit,
    selectedScanTypeParams,
    scanTypeMetas,
    resetFormExceptFreezingFields
  } = useSqlManagementConfFormSharedStates();

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    instance_audit_plan
      .updateInstanceAuditPlanV1({
        project_name: projectName,
        instance_audit_plan_id: id ?? '',
        audit_plans: values.scanTypes
          .filter((item) => item !== SCAN_TYPE_ALL_OPTION_VALUE)
          .map<IAuditPlan>((item) => {
            const {
              ruleTemplateName,
              markHighPrioritySql,
              prioritySqlConditions,
              ...paramValues
            } = values[item] as ScanTypeParams;

            const auditPlanParamsWithScanType =
              scanTypeMetas?.find((v) => v.audit_plan_type === item)
                ?.audit_plan_params ?? [];

            const mergedBackendAdditionalParams = mergeFromValueIntoParams(
              paramValues as BackendFormValues,
              auditPlanParamsWithScanType
            );

            const params: IAuditPlan = {
              audit_plan_type: item,
              rule_template_name: ruleTemplateName,
              need_mark_high_priority_sql: markHighPrioritySql,
              high_priority_conditions: markHighPrioritySql
                ? generateSubmitDataWithFormValues(prioritySqlConditions)
                : undefined,
              audit_plan_params: mergedBackendAdditionalParams.filter(
                (backendAdditionalParam) => {
                  const type = auditPlanParamsWithScanType.find(
                    (auditPlanParam) =>
                      auditPlanParam.key === backendAdditionalParam.key
                  )?.type;

                  return !(
                    type === AuditPlanParamResV1TypeEnum.password &&
                    !backendAdditionalParam.value
                  );
                }
              )
            };
            return params;
          })
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('managementConf.update.successTips'));
          navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.index, {
            params: { projectID }
          });
        }
      })
      .finally(() => {
        finishSubmit();
      });
  };

  const { data: auditPlanDetail, loading: getDetailLoading } = useRequest(() =>
    instance_audit_plan
      .getInstanceAuditPlanDetailV1({
        project_name: projectName,
        instance_audit_plan_id: id ?? ''
      })
      .then((res) => {
        return res.data.data;
      })
  );

  const defaultValue = useMemo<SqlManagementConfFormFields>(() => {
    return {
      businessScope: auditPlanDetail?.business ?? '',
      instanceType: auditPlanDetail?.instance_type ?? '',
      instanceName: auditPlanDetail?.instance_name ?? '',
      instanceId: auditPlanDetail?.instance_id ?? '',
      scanTypes:
        auditPlanDetail?.audit_plans?.map(
          (v) => v.audit_plan_type?.type ?? ''
        ) ?? [],
      ...(auditPlanDetail?.audit_plans ?? []).reduce<{
        [key: string]: string | boolean | string[] | ScanTypeParams;
      }>((acc, cur) => {
        const params: ScanTypeParams = {
          ruleTemplateName: cur.rule_template_name ?? '',
          markHighPrioritySql: !!cur.need_mark_high_priority_sql,
          prioritySqlConditions: generateFormValuesWithAPIResponse(
            cur.high_priority_conditions ?? [],
            scanTypeMetas?.find(
              (v) => v.audit_plan_type === cur.audit_plan_type?.type
            )?.high_priority_conditions ?? []
          ),
          ...generateFormValueByParams(cur.audit_plan_params ?? [])
        };
        return { ...acc, [cur.audit_plan_type?.type!]: params };
      }, {})
    };
  }, [
    auditPlanDetail?.audit_plans,
    auditPlanDetail?.business,
    auditPlanDetail?.instance_id,
    auditPlanDetail?.instance_name,
    auditPlanDetail?.instance_type,
    generateFormValueByParams,
    generateFormValuesWithAPIResponse,
    scanTypeMetas
  ]);

  return (
    <ConfFormContextProvide
      value={{
        getScanTypeMetaPending,
        submitLoading,
        selectedScanTypeParams,
        defaultValue,
        scanTypeMetas: scanTypeMetas ?? null
      }}
    >
      {messageContextHolder}
      <Spin spinning={getDetailLoading || submitLoading} delay={300}>
        <PageLayoutHasFixedHeaderStyleWrapper>
          <PageHeader
            fixed
            title={<BackToConf />}
            extra={
              <Space>
                <BasicButton
                  onClick={resetFormExceptFreezingFields}
                  disabled={submitLoading}
                >
                  {t('common.reset')}
                </BasicButton>
                <BasicButton
                  type="primary"
                  htmlType="submit"
                  onClick={onSubmit}
                  disabled={submitLoading}
                >
                  {t('common.submit')}
                </BasicButton>
              </Space>
            }
          />
          <FormStyleWrapper
            colon={false}
            labelAlign="left"
            className="hasTopHeader"
            form={form}
            {...formItemLayout.spaceBetween}
          >
            <ConfForm />
          </FormStyleWrapper>
        </PageLayoutHasFixedHeaderStyleWrapper>
      </Spin>
    </ConfFormContextProvide>
  );
};

export default Update;
