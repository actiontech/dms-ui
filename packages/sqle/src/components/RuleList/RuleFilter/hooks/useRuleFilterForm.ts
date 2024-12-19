import { Form, FormInstance } from 'antd';
import { useMemo } from 'react';

const useRuleFilterForm = (otherForm?: FormInstance) => {
  const [form] = Form.useForm();

  const fuzzyKeyword = Form.useWatch('fuzzy_keyword', otherForm ?? form);

  const operand = Form.useWatch('operand', otherForm ?? form);

  const auditPurpose = Form.useWatch('audit_purpose', otherForm ?? form);

  const auditAccuracy = Form.useWatch('audit_accuracy', otherForm ?? form);

  const sql = Form.useWatch('sql', otherForm ?? form);

  const tags = useMemo(() => {
    const str = [operand, auditPurpose, auditAccuracy, sql]
      .filter((i) => !!i)
      .join(',');
    return !!str ? str : undefined;
  }, [operand, auditPurpose, auditAccuracy, sql]);

  return { form, fuzzyKeyword, tags };
};

export default useRuleFilterForm;
