import { useTranslation } from 'react-i18next';
import { SqlInfoFormProps } from '../../index.type';
import SQLInfoFormItem from './SQLInfoFormItem';
import { SqlInfoFormStyleWrapper } from './style';
import { FormAreaBlockStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
import { FormItemSubTitle } from '@actiontech/dms-kit';

const SQLInfoForm = (props: SqlInfoFormProps) => {
  const { t } = useTranslation();

  return (
    <SqlInfoFormStyleWrapper colon={false} labelAlign="left" form={props.form}>
      <FormAreaBlockStyleWrapper>
        <FormItemSubTitle>
          {t('sqlOptimization.create.sqlInfo.title')}
        </FormItemSubTitle>
        <SQLInfoFormItem {...props} />
      </FormAreaBlockStyleWrapper>
    </SqlInfoFormStyleWrapper>
  );
};

export default SQLInfoForm;
