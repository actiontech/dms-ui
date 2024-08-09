import { useTranslation } from 'react-i18next';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import BaseInfoFormItem from './BaseInfoFormItem';
import { BriefcaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';
import { forwardRef } from 'react';

const BaseInfoForm = forwardRef<HTMLElement>((props, ref) => {
  const { t } = useTranslation();

  return (
    <FormAreaLineStyleWrapper className="has-border">
      <FormAreaBlockStyleWrapper>
        <FormItemBigTitle>
          <Icon component={BriefcaseFilled} className="title-icon" />
          <span>{t('execWorkflow.create.title')}</span>
        </FormItemBigTitle>
        <BaseInfoFormItem ref={ref} />
      </FormAreaBlockStyleWrapper>
    </FormAreaLineStyleWrapper>
  );
});

export default BaseInfoForm;
