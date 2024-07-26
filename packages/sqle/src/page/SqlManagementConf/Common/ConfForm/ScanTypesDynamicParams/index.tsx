import { useContext, useEffect } from 'react';
import { ConfFormContext } from '../context';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { useTranslation } from 'react-i18next';
import { FormItemSubTitle } from '@actiontech/shared/lib/components/FormCom';
import AutoCreatedFormItemByApi from '../../../../../components/BackendForm';
import { LazyLoadComponent } from '@actiontech/shared';
import AuditTemplate from './AuditTemplate';
import useGlobalRuleTemplate from '../../../../../hooks/useGlobalRuleTemplate';
import useRuleTemplate from '../../../../../hooks/useRuleTemplate';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Form } from 'antd';
import { SqlManagementConfFormFields } from '../index.type';

const ScanTypesDynamicParams: React.FC = () => {
  const { t } = useTranslation();
  const contextValue = useContext(ConfFormContext);

  const form = Form.useFormInstance<SqlManagementConfFormFields>();

  const selectedInstanceType = Form.useWatch('instanceType', form);

  const { projectName } = useCurrentProject();

  const selectedScanTypeParams = contextValue?.selectedScanTypeParams;

  const scanTypeMetas = contextValue?.scanTypeMetas ?? [];

  const submitLoading = !!contextValue?.submitLoading;
  const defaultValue = !!contextValue?.defaultValue;

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
    return selectedScanTypeParams?.map((item) => {
      const key = Object.keys(item)[0];
      if (!key) {
        return null;
      }

      const title = t('managementConf.create.scanTypeParams.title', {
        typeName: scanTypeMetas.find((meta) => meta.audit_plan_type === key)
          ?.audit_plan_type_desc
      });

      const params = item[key];

      return (
        <FormAreaLineStyleWrapper key={key} className="has-border">
          <FormAreaBlockStyleWrapper>
            <FormItemSubTitle>{title}</FormItemSubTitle>

            <LazyLoadComponent open={!!params?.length} animation={false}>
              <AutoCreatedFormItemByApi
                formMode={!!defaultValue ? 'update' : 'create'}
                paramsKey={key}
                params={params ?? []}
                disabled={submitLoading}
              />
            </LazyLoadComponent>

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

export default ScanTypesDynamicParams;
