import { FormItemSubTitle } from '@actiontech/shared/lib/components/FormCom';
import { FormAreaBlockStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { useTranslation } from 'react-i18next';
import SqlAuditInfoFormItem from './SqlAuditInfoFormItem';
import { SqlAuditInfoFormProps } from './index.type';

const SqlAuditInfoForm: React.FC<SqlAuditInfoFormProps> = (props) => {
  const { t } = useTranslation();
  return (
    <FormAreaBlockStyleWrapper>
      <FormItemSubTitle>
        {t('execWorkflow.create.form.sqlInfo.title')}
      </FormItemSubTitle>
      <SqlAuditInfoFormItem {...props} />
    </FormAreaBlockStyleWrapper>
  );
};

export default SqlAuditInfoForm;
