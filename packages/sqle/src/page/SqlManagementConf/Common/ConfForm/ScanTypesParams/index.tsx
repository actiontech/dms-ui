import { useContext, useEffect } from 'react';
import { ConfFormContext } from '../context';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { useTranslation } from 'react-i18next';
import {
  CustomLabelContent,
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import AutoCreatedFormItemByApi from '../../../../../components/BackendForm';
import { BasicSelect, EmptyBox, LazyLoadComponent } from '@actiontech/shared';
import AuditTemplate from './AuditTemplate';
import useGlobalRuleTemplate from '../../../../../hooks/useGlobalRuleTemplate';
import useRuleTemplate from '../../../../../hooks/useRuleTemplate';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { Form } from 'antd';
import { SqlManagementConfFormFields } from '../index.type';
import { useRequest } from 'ahooks';
import useInstanceSchema from '../../../../../hooks/useInstanceSchema';

const ScanTypesParams: React.FC = () => {
  const { t } = useTranslation();

  const contextValue = useContext(ConfFormContext);

  const form = Form.useFormInstance<SqlManagementConfFormFields>();

  const instanceName = Form.useWatch('instanceName', form);
  const selectedInstanceType = Form.useWatch('instanceType', form);
  const needConnectDataSource = Form.useWatch('needConnectDataSource', form);

  const { projectName } = useCurrentProject();

  const scanTypeParams = contextValue?.selectedScanTypeParams;

  const scanTypeMetas = contextValue?.scanTypeMetas ?? [];

  const submitLoading = !!contextValue?.submitLoading;

  const {
    loading: getGlobalRuleTemplateLoading,
    globalRuleTemplateList,
    updateGlobalRuleTemplateList
  } = useGlobalRuleTemplate();
  const {
    loading: getRuleTemplateListLoading,
    ruleTemplateList,
    updateRuleTemplateList
  } = useRuleTemplate();

  const { data: instanceInfo } = useRequest(
    () => {
      return instance.getInstanceV2({
        instance_name: instanceName,
        project_name: projectName
      });
    },
    {
      ready: !!instanceName,
      refreshDeps: [instanceName]
    }
  );

  const {
    generateInstanceSchemaSelectOption,
    loading: getInstanceSchemaLoading,
    updateSchemaList
  } = useInstanceSchema(projectName, instanceName);

  useEffect(() => {
    updateSchemaList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceName]);

  useEffect(() => {
    updateRuleTemplateList(projectName, selectedInstanceType);
    updateGlobalRuleTemplateList(selectedInstanceType);
  }, [
    form,
    projectName,
    selectedInstanceType,
    updateGlobalRuleTemplateList,
    updateRuleTemplateList
  ]);

  const render = () => {
    return scanTypeParams?.map((map) => {
      const key = map.keys().next().value;
      if (!key) {
        return null;
      }

      const title = t('managementConf.create.scanTypeParams.title', {
        typeName: scanTypeMetas.find((item) => item.audit_plan_type === key)
          ?.audit_plan_type_desc
      });

      const params = map.get(key);

      return (
        <FormAreaLineStyleWrapper key={key} className="has-border">
          <FormAreaBlockStyleWrapper>
            <FormItemSubTitle>{title}</FormItemSubTitle>

            <LazyLoadComponent open={!!params?.length} animation={false}>
              <AutoCreatedFormItemByApi
                // formMode={!!defaultValue ? 'update' : 'create'}
                paramsKey={key}
                params={params ?? []}
                disabled={submitLoading}
              />
            </LazyLoadComponent>

            <EmptyBox if={needConnectDataSource}>
              <FormItemLabel
                name={[key, 'instanceSchema']}
                className="has-label-tip"
                label={
                  <CustomLabelContent
                    title={t('managementConf.create.schema')}
                    tips={t('managementConf.create.schemaTips')}
                  />
                }
              >
                <BasicSelect
                  loading={getInstanceSchemaLoading}
                  disabled={!instanceName || submitLoading}
                >
                  {generateInstanceSchemaSelectOption()}
                </BasicSelect>
              </FormItemLabel>
            </EmptyBox>

            <AuditTemplate
              submitLoading={submitLoading}
              prefixPath={key}
              templateList={[...ruleTemplateList, ...globalRuleTemplateList]}
              loading={
                getRuleTemplateListLoading || getGlobalRuleTemplateLoading
              }
            />
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>
      );
    });
  };

  return <>{render()}</>;
};

export default ScanTypesParams;
