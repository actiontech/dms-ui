import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import useAsyncParams from '../../../components/BackendForm/useAsyncParams';
import { useSqlManagementConfFormSharedStates } from '../Common/ConfForm/hooks';
import { ConfFormContextProvide } from '../Common/ConfForm/context';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicButton, PageHeader } from '@actiontech/shared';
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
import { useNavigate, useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { useMemo } from 'react';

const Update: React.FC = () => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();
  const { id } = useParams<{ id: string }>();
  const [messageApi, messageContextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { mergeFromValueIntoParams, generateFormValueByParams } =
    useAsyncParams();
  const {
    form,
    getScanTypeMetaPending,
    submitLoading,
    startSubmit,
    finishSubmit,
    selectedScanTypeParams,
    scanTypeMetas
  } = useSqlManagementConfFormSharedStates();

  const onReset = () => {
    form.resetFields();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    instance_audit_plan
      .updateInstanceAuditPlanV1({
        project_name: projectName,
        instance_audit_plan_id: id ?? '',
        audit_plans: values.scanTypes.map((item) => {
          const { ruleTemplateName, ...paramValues } = values[
            item
          ] as ScanTypeParams;
          return {
            audit_plan_type: item,
            rule_template_name: ruleTemplateName,
            audit_plan_params: mergeFromValueIntoParams(
              paramValues,
              scanTypeMetas?.find((v) => v.audit_plan_type === item)
                ?.audit_plan_params ?? []
            )
          };
        })
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('managementConf.update.successTips'));
          navigate(`/sqle/project/${projectID}/sql-management-conf`);
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
      needConnectDataSource: !auditPlanDetail?.static_audit,
      businessScope: auditPlanDetail?.business ?? '',
      instanceName: auditPlanDetail?.instance_name ?? '',
      instanceType: auditPlanDetail?.instance_type ?? '',
      scanTypes:
        auditPlanDetail?.audit_plans?.map(
          (v) => v.audit_plan_type?.type ?? ''
        ) ?? [],
      ...(auditPlanDetail?.audit_plans ?? []).reduce<{
        [key: string]: string | boolean | string[] | ScanTypeParams;
      }>((acc, cur) => {
        const params: ScanTypeParams = {
          ruleTemplateName: cur.rule_template_name ?? '',
          ...generateFormValueByParams(cur.audit_plan_params ?? [])
        };
        return { ...acc, [cur.audit_plan_type?.type!]: params };
      }, {})
    };
  }, [
    auditPlanDetail?.audit_plans,
    auditPlanDetail?.business,
    auditPlanDetail?.instance_name,
    auditPlanDetail?.instance_type,
    auditPlanDetail?.static_audit,
    generateFormValueByParams
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
                <BasicButton onClick={onReset} disabled={submitLoading}>
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
