import { Form, Space } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicButton, BasicInput, BasicModal } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import useRuleExceptionActions from '../useRuleExceptionActions';
import QuickAddRuleExceptionContextSummary from '../QuickAddRuleExceptionContextSummary';
import useRuleTips from '../../../hooks/useRuleTips';
import { ISqlManageRuleExceptionContext } from '../../../page/RuleException/index.data';
import { IAuditResultWithExemption } from '../../../page/RuleException/index.type';
import { getAuditResultDisplayText } from '../../AuditResultMessage/getAuditResultDisplayText';

export type QuickAddRuleExceptionModalProps = {
  open: boolean;
  ruleName?: string;
  auditResult?: IAuditResultWithExemption;
  sqlManageContext?: ISqlManageRuleExceptionContext;
  onClose: () => void;
  onSuccess?: () => void;
};

const QuickAddRuleExceptionModal: React.FC<QuickAddRuleExceptionModalProps> = ({
  open,
  ruleName,
  auditResult,
  sqlManageContext,
  onClose,
  onSuccess
}) => {
  const { t, i18n } = useTranslation();
  const { projectName } = useCurrentProject();
  const [form] = Form.useForm<{ desc?: string }>();
  const { ruleNameDescMap, updateRuleTips } = useRuleTips();
  const { addRuleException, submitting } = useRuleExceptionActions({
    sqlManageContext,
    onSuccess: () => {
      form.resetFields();
      onSuccess?.();
      onClose();
    }
  });

  useEffect(() => {
    if (open) {
      updateRuleTips(projectName);
    }
  }, [open, projectName, updateRuleTips]);

  const ruleLabel = useMemo(() => {
    if (!ruleName) {
      return undefined;
    }
    const ruleTipsLabel = ruleNameDescMap.get(ruleName);
    if (ruleTipsLabel) {
      return ruleTipsLabel;
    }
    const auditResultLabel = getAuditResultDisplayText(auditResult, t, {
      i18nInstance: i18n
    });
    if (auditResultLabel) {
      return auditResultLabel;
    }
    return ruleName;
  }, [auditResult, i18n, ruleName, ruleNameDescMap, t]);

  const submit = async () => {
    if (!ruleName) {
      return;
    }
    const values = await form.validateFields();
    await addRuleException(ruleName, values.desc);
  };

  return (
    <BasicModal
      title={t('ruleException.quickAdd.title')}
      size="large"
      open={open}
      onCancel={onClose}
      destroyOnClose
      footer={
        <Space>
          <BasicButton onClick={onClose} disabled={submitting}>
            {t('common.cancel')}
          </BasicButton>
          <BasicButton type="primary" loading={submitting} onClick={submit}>
            {t('ruleException.button.add')}
          </BasicButton>
        </Space>
      }
    >
      <QuickAddRuleExceptionContextSummary
        sqlManageContext={sqlManageContext}
        ruleName={ruleName}
        ruleLabel={ruleLabel}
      />
      <Form form={form} layout="vertical">
        <Form.Item label={t('ruleException.quickAdd.reason')} name="desc">
          <BasicInput.TextArea
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder={t('common.form.placeholder.input')}
          />
        </Form.Item>
      </Form>
    </BasicModal>
  );
};

export default QuickAddRuleExceptionModal;
