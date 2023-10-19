import { useTranslation } from 'react-i18next';
import { OrderBaseInfoFormProps } from './index.type';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import { IconOrderCreateTitleStyleWrapper } from './style';
import BaseInfoFormItem from './BaseInfoFormItem';

const BaseInfoForm: React.FC<OrderBaseInfoFormProps> = ({ form }) => {
  const { t } = useTranslation();
  return (
    <FormStyleWrapper
      form={form}
      className="hasTopHeader clearPaddingBottom"
      colon={false}
      layout="vertical"
      labelAlign="left"
    >
      <FormAreaLineStyleWrapper className="has-border">
        <FormAreaBlockStyleWrapper>
          <FormItemBigTitle>
            <IconOrderCreateTitleStyleWrapper />
            <span>{t('order.createOrder.title')}</span>
          </FormItemBigTitle>
          <BaseInfoFormItem />
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </FormStyleWrapper>
  );
};

export default BaseInfoForm;
