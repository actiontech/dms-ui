import { FormItemSubTitle } from '@actiontech/dms-kit';
import { FormAreaBlockStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
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
