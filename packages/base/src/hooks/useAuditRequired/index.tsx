import { Form, FormInstance } from 'antd5';
import { useState } from 'react';

const useAuditRequired = (form: FormInstance) => {
  const auditRequired = Form.useWatch('needSqlAuditService', form);
  const [auditRequiredPopupVisible, setAuditRequiredPopupVisible] =
    useState<boolean>(false);
  const onAuditRequiredPopupOpenChange = (open: boolean) => {
    if (!auditRequired) return;
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
    if (check)
      form.setFieldsValue({
        needSqlAuditService: check
      });
  };

  return {
    auditRequired,
    auditRequiredPopupVisible,
    onAuditRequiredPopupOpenChange,
    clearRuleTemplate,
    changeAuditRequired
  };
};

export default useAuditRequired;
