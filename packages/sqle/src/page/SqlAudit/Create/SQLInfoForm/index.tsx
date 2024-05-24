import { useTranslation } from 'react-i18next';
import { FormItemSubTitle } from '@actiontech/shared/lib/components/FormCom';
import { FormAreaBlockStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { SQLInfoFormProps } from './index.type';
import SQLInfoFormItem from './SQLInfoFormItem';
import { SqlInfoFormStyleWrapper } from './style';

const SQLInfoForm = (props: SQLInfoFormProps) => {
  const { t } = useTranslation();

  return (
    <SqlInfoFormStyleWrapper colon={false} labelAlign="left" form={props.form}>
      <FormAreaBlockStyleWrapper>
        <FormItemSubTitle>
          {t('sqlAudit.create.sqlInfo.title')}
        </FormItemSubTitle>
        <SQLInfoFormItem {...props} />
      </FormAreaBlockStyleWrapper>
    </SqlInfoFormStyleWrapper>
  );
};

export default SQLInfoForm;
