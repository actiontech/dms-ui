import { BasicInput } from '@actiontech/shared';
import {
  FormInputBotBorder,
  FormItemNoLabel,
  FormItemLabel
} from '@actiontech/shared/lib/components/FormCom';
import { workflowNameRule } from '@actiontech/shared/lib/utils/FormRule';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const BaseInfoFormItem: React.FC<{ slot?: ReactNode }> = ({ slot }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormItemNoLabel
        name="workflow_subject"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t('order.baseInfo.name')
            })
          },
          {
            validator: workflowNameRule()
          },
          {
            max: 59
          }
        ]}
      >
        <FormInputBotBorder
          className="workflow-name-input-wrapper"
          placeholder={t('common.form.placeholder.input', {
            name: t('order.baseInfo.name')
          })}
        />
      </FormItemNoLabel>

      {slot}

      <FormItemLabel
        className="order-base-info-desc-form-item"
        name="desc"
        label={t('order.baseInfo.describe')}
      >
        <BasicInput.TextArea
          autoSize={{
            maxRows: 10,
            minRows: 8
          }}
          placeholder={t('order.baseInfo.describePlaceholder')}
          maxLength={3000}
          showCount
        />
      </FormItemLabel>
    </>
  );
};

export default BaseInfoFormItem;
