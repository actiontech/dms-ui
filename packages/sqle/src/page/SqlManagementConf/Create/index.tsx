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
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const Create: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [searchParams] = useSearchParams();
  const instanceAuditPlanCreatedId = useRef<string>();

  const { mergeFromValueIntoParams } = useAsyncParams();
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
    backToForm
  } = useSqlManagementConfFormSharedStates();

  const onReset = () => {
    form.resetFields();
  };

  const cloneForm = () => {
    backToForm();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    instance_audit_plan
      .createInstanceAuditPlanV1({
        project_name: projectName,
        business: values.businessScope,
        static_audit: !values.needConnectDataSource,
        instance_name: values.instanceName,
        instance_type: values.instanceType,
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
          successfulSubmit();
          instanceAuditPlanCreatedId.current = '1';
        }
      })
      .finally(() => {
        finishSubmit();
      });
  };

  useEffect(() => {
    const defaultInstanceName = searchParams?.get('instance_name');
    if (defaultInstanceName) {
      form.setFieldsValue({
        needConnectDataSource: true,
        instanceName: defaultInstanceName
      });
    }
  }, [form, searchParams]);

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
            id={instanceAuditPlanCreatedId.current ?? ''}
            resetForm={() => {
              onReset();
              backToForm();
            }}
            cloneForm={cloneForm}
          />
        </LazyLoadComponent>
      </PageLayoutHasFixedHeaderStyleWrapper>
    </ConfFormContextProvide>
  );
};

export default Create;
