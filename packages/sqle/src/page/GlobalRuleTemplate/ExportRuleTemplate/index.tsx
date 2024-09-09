import { BasicButton, BasicModal, ToggleTokens } from '@actiontech/shared';
import { ExportRuleTemplateProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { exportRuleTemplateV1ExportTypeEnum } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.enum';

const ExportRuleTemplate: React.FC<ExportRuleTemplateProps> = ({
  open,
  form,
  onClose,
  onSubmit,
  submitPending
}) => {
  const { t } = useTranslation();
  return (
    <BasicModal
      size="small"
      title={t('ruleTemplate.exportRuleTemplate.modal.title')}
      open={open}
      closable={false}
      footer={
        <>
          <BasicButton disabled={submitPending} onClick={onClose}>
            {t('common.cancel')}
          </BasicButton>
          <BasicButton
            disabled={submitPending}
            type="primary"
            onClick={async () => {
              const values = await form.validateFields();
              onSubmit(values);
            }}
          >
            {t('ruleTemplate.exportRuleTemplate.modal.submit')}
          </BasicButton>
        </>
      }
    >
      <Form form={form} wrapperCol={{ push: 1 }}>
        <FormItemLabel
          rules={[{ required: true }]}
          initialValue={exportRuleTemplateV1ExportTypeEnum.csv}
          className="has-required-style"
          name="exportFileType"
          label={t('ruleTemplate.exportRuleTemplate.modal.exportFileType')}
        >
          <ToggleTokens
            size={12}
            options={Object.values(exportRuleTemplateV1ExportTypeEnum).map(
              (v) => ({ label: v, value: v })
            )}
          />
        </FormItemLabel>
      </Form>
    </BasicModal>
  );
};

export default ExportRuleTemplate;
