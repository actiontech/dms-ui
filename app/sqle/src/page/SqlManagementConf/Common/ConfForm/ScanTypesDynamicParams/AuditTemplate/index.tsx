import { useTranslation } from 'react-i18next';
import { BasicSelect } from '@actiontech/dms-kit';
import { CustomLabelContent, FormItemLabel } from '@actiontech/dms-kit';
import { formItemLayout } from '@actiontech/dms-kit/es/components/CustomForm/style';
import { IAuditTemplateProps } from './index.type';
import { useMemo } from 'react';
const AuditTemplate = (props: IAuditTemplateProps) => {
  const { t } = useTranslation();
  const { prefixPath, templateList, loading, submitLoading } = props;
  const ruleTemplateOptions = useMemo(() => {
    return templateList.map((item) => ({
      label: item.rule_template_name,
      value: item.rule_template_name
    }));
  }, [templateList]);
  return (
    <>
      <FormItemLabel
        className="has-label-tip has-required-style"
        label={
          <CustomLabelContent
            tips={t(
              'managementConf.create.scanTypeParams.auditTemplate.ruleTemplate.tip'
            )}
            title={t(
              'managementConf.create.scanTypeParams.auditTemplate.ruleTemplate.label'
            )}
          />
        }
        {...formItemLayout.spaceBetween}
        name={[prefixPath, 'ruleTemplateName']}
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t(
                'managementConf.create.scanTypeParams.auditTemplate.ruleTemplate.label'
              )
            })
          }
        ]}
      >
        <BasicSelect
          disabled={!!submitLoading}
          options={ruleTemplateOptions}
          allowClear
          loading={loading}
        />
      </FormItemLabel>
    </>
  );
};
export default AuditTemplate;
