import { Form, FormInstance } from 'antd';
import { useState } from 'react';

const useSqlReviewTemplateToggle = <
  T extends FormInstance<{
    needSqlAuditService?: boolean;
    ruleTemplateId?: string;
    ruleTemplateName?: string;
  }>
>(
  form: T
) => {
  const auditRequired = Form.useWatch<T>('needSqlAuditService', form);
  const [auditRequiredPopupVisible, setAuditRequiredPopupVisible] =
    useState<boolean>(false);

  const onAuditRequiredPopupOpenChange = (open: boolean) => {
    if (!auditRequired) {
      return;
    }
    setAuditRequiredPopupVisible(open);
  };
  const clearRuleTemplate = () => {
    form.setFieldsValue({
      needSqlAuditService: false,
      ruleTemplateId: undefined,
      ruleTemplateName: undefined
    });
  };

  const changeAuditRequired = (check: boolean) => {
    if (check) {
      form.setFieldsValue({
        needSqlAuditService: check
      });
    }
  };

  return {
    auditRequired,
    auditRequiredPopupVisible,
    onAuditRequiredPopupOpenChange,
    clearRuleTemplate,
    changeAuditRequired
  };
};

export default useSqlReviewTemplateToggle;
