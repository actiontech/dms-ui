import { useTranslation } from 'react-i18next';
import { BaseForm } from '../../index.type';
import BaseInfoFormItem from './BaseInfoFormItem';
import { IconOrderCreateTitleStyleWrapper } from '../../../Order/Create/BaseInfoForm/style';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared';

const BaseInfoForm: React.FC<{ form: BaseForm }> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <FormStyleWrapper
      form={form}
      className="hasTopHeader clearPaddingBottom"
      colon={false}
      layout="vertical"
      labelAlign="left"
    >
      <FormAreaLineStyleWrapper>
        <FormAreaBlockStyleWrapper>
          <FormItemBigTitle>
            <IconOrderCreateTitleStyleWrapper />
            <span>{t('sqlOptimization.create.base.title')}</span>
          </FormItemBigTitle>
          <BaseInfoFormItem />
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </FormStyleWrapper>
  );
};

export default BaseInfoForm;
