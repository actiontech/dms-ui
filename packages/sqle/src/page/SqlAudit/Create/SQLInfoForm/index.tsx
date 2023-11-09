import { useTranslation } from 'react-i18next';
import { FormItemSubTitle } from '@actiontech/shared/lib/components/FormCom';
import { FormAreaBlockStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { SQLInfoFormStyleWrapper } from '../../../Order/Create/SQLInfoForm/style';
import { SQLInfoFormProps } from './index.type';
import SQLInfoFormItem from './SQLInfoFormItem';

const SQLInfoForm = (props: SQLInfoFormProps) => {
  const { t } = useTranslation();

  return (
    <SQLInfoFormStyleWrapper colon={false} labelAlign="left" form={props.form}>
      <FormAreaBlockStyleWrapper>
        <FormItemSubTitle>
          {t('sqlAudit.create.sqlInfo.title')}
        </FormItemSubTitle>
        <SQLInfoFormItem {...props} />
      </FormAreaBlockStyleWrapper>
    </SQLInfoFormStyleWrapper>
  );
};

export default SQLInfoForm;
