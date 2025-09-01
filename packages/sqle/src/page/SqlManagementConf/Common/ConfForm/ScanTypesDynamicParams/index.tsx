import { useContext, useEffect } from 'react';
import { ConfFormContext } from '../context';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/dms-kit/es/components/CustomForm/style';
import { useTranslation } from 'react-i18next';
import { FormItemSubTitle } from '@actiontech/dms-kit';
import AutoCreatedFormItemByApi, {
  FormItem
} from '../../../../../components/BackendForm';
import { EmptyBox } from '@actiontech/dms-kit';
import AuditTemplate from './AuditTemplate';
import useGlobalRuleTemplate from '../../../../../hooks/useGlobalRuleTemplate';
import useRuleTemplate from '../../../../../hooks/useRuleTemplate';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { Form } from 'antd';
import { SqlManagementConfFormFields } from '../index.type';
import HightPriorityConditions from './HighPriorityConditions';
import { ConfFormAlertStyleWrapper } from '../style';
import useScanTypeVerify from '../useScanTypeVerify';
const ScanTypesDynamicParams: React.FC = () => {
  const { t } = useTranslation();
  const contextValue = useContext(ConfFormContext);
  const form = Form.useFormInstance<SqlManagementConfFormFields>();
  const selectedInstanceType = Form.useWatch('instanceType', form);
  const collectInputValue = Form.useWatch(
    ['mysql_slow_log', 'slow_log_collect_input'],
    form
  );
  const { projectName } = useCurrentProject();
  const { isPerformanceCollectScanType } = useScanTypeVerify();
  const selectedScanTypeParams = contextValue?.selectedScanTypeParams;
  const scanTypeMetas = contextValue?.scanTypeMetas ?? [];
  const submitLoading = !!contextValue?.submitLoading;
  const defaultValue = contextValue?.defaultValue;
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
      const currentScanTypeMeta = scanTypeMetas.find(
        (meta) => meta.audit_plan_type === key
      );
      const title = t('managementConf.create.scanTypeParams.title', {
        typeName: currentScanTypeMeta?.audit_plan_type_desc
      });
      const auditPlanTypeTips = currentScanTypeMeta?.audit_plan_type_tips;
      const isPerformanceCollectType = isPerformanceCollectScanType(
        currentScanTypeMeta?.audit_plan_type
      );
      const params: FormItem[] = item[key].map((v) => {
        //特殊处理慢日志动态表单的条件渲染。暂时没确定好使用更合理的方案来处理
        if (key === 'mysql_slow_log') {
          if (
            collectInputValue === '0' &&
            (v.key === 'collect_interval_minute' ||
              v.key === 'first_sqls_scrapped_in_last_period_hours')
          ) {
            return {
              ...v,
              hidden: true
            };
          }
        }
        return v;
      });
      return (
        <FormAreaLineStyleWrapper key={key} className="has-border">
          <FormAreaBlockStyleWrapper>
            <FormItemSubTitle>{title}</FormItemSubTitle>
            <EmptyBox if={!!auditPlanTypeTips}>
              <ConfFormAlertStyleWrapper
                message={auditPlanTypeTips}
                type="info"
                showIcon
              />
            </EmptyBox>
            <EmptyBox if={!!params?.length}>
              <AutoCreatedFormItemByApi
                formMode={!!defaultValue ? 'update' : 'create'}
                paramsKey={key}
                params={params ?? []}
                disabled={submitLoading}
              />
            </EmptyBox>
            <EmptyBox if={!!currentScanTypeMeta?.high_priority_conditions}>
              <HightPriorityConditions
                prefixPath={key}
                conditions={currentScanTypeMeta?.high_priority_conditions ?? []}
                submitLoading={submitLoading}
              />
            </EmptyBox>
            <EmptyBox if={!isPerformanceCollectType}>
              <AuditTemplate
                submitLoading={submitLoading}
                prefixPath={key}
                templateList={[...ruleTemplateList, ...globalRuleTemplateList]}
                loading={
                  getRuleTemplateListLoading || getGlobalRuleTemplateLoading
                }
              />
            </EmptyBox>
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>
      );
    });
  };
  return <>{render()}</>;
};
export default ScanTypesDynamicParams;
