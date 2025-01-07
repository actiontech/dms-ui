import { useTranslation } from 'react-i18next';
import { BaseForm } from '../../index.type';
import BaseInfoFormItem from './BaseInfoFormItem';
import { BriefcaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/CustomForm/style';
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
            <Icon component={BriefcaseFilled} className="title-icon" />
            <span>{t('sqlOptimization.create.base.title')}</span>
          </FormItemBigTitle>
          <BaseInfoFormItem />
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </FormStyleWrapper>
  );
};

export default BaseInfoForm;
