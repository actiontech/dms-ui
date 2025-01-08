import { FormItemSubTitle } from '@actiontech/shared/lib/components/CustomForm';
import { FormAreaBlockStyleWrapper } from '@actiontech/shared/lib/components/CustomForm/style';
import { useTranslation } from 'react-i18next';
import SqlAuditInfoFormItem from './SqlAuditInfoFormItem';
import { SqlAuditInfoFormProps } from './index.type';
import { forwardRef } from 'react';

const SqlAuditInfoForm = forwardRef<HTMLElement, SqlAuditInfoFormProps>(
  (props, ref) => {
    const { t } = useTranslation();
    return (
      <FormAreaBlockStyleWrapper>
        <FormItemSubTitle>
          {t('execWorkflow.create.form.sqlInfo.title')}
        </FormItemSubTitle>
        <SqlAuditInfoFormItem {...props} ref={ref} />
      </FormAreaBlockStyleWrapper>
    );
  }
);

export default SqlAuditInfoForm;
