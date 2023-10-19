import { FormAreaBlockStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { SQLInfoFormProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { FormItemSubTitle } from '@actiontech/shared/lib/components/FormCom';
import SQLInfoFormItem from './SQLInfoFormItem';
import { SQLInfoFormStyleWrapper } from './style';

const SQLInfoForm: React.FC<SQLInfoFormProps> = (props) => {
  const { t } = useTranslation();

  return (
    <SQLInfoFormStyleWrapper colon={false} labelAlign="left" form={props.form}>
      <FormAreaBlockStyleWrapper>
        <FormItemSubTitle>{t('order.sqlInfo.title')}</FormItemSubTitle>
        <SQLInfoFormItem {...props} />
      </FormAreaBlockStyleWrapper>
    </SQLInfoFormStyleWrapper>
  );
};

export default SQLInfoForm;
