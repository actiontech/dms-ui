import { useTranslation } from 'react-i18next';
import { BasicSelect } from '@actiontech/shared';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';

import { IAuditTemplateProps } from './index.type';
import { useMemo, useContext } from 'react';
import { FormSubmitStatusContext } from '..';

const AuditTemplate = (props: IAuditTemplateProps) => {
  const { t } = useTranslation();

  const { dbType, templateList } = props;
  const submitLoading = useContext(FormSubmitStatusContext);

  const ruleTemplateOptions = useMemo(() => {
    return templateList
      .filter((item) => item.db_type === dbType)
      .map((item) => ({
        label: item.rule_template_name,
        value: item.rule_template_name
      }));
  }, [dbType, templateList]);

  return (
    <>
      <FormItemLabel
        className="has-label-tip"
        label={
          <div className="label-cont-custom">
            <div>
              {t('auditPlan.planForm.auditTemplate.ruleTemplateName.label')}
            </div>
            <div className="tip-content-box">
              {t('auditPlan.planForm.auditTemplate.ruleTemplateName.tip')}
            </div>
          </div>
        }
        {...formItemLayout.spaceBetween}
        name="ruleTemplateName"
      >
        <BasicSelect
          disabled={submitLoading}
          options={ruleTemplateOptions}
          allowClear
        ></BasicSelect>
      </FormItemLabel>
    </>
  );
};

export default AuditTemplate;
