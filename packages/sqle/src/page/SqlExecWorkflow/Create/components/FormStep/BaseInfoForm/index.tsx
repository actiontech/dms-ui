import { useTranslation } from 'react-i18next';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import BaseInfoFormItem from './BaseInfoFormItem';
import { BriefcaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';

const BaseInfoForm: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FormAreaLineStyleWrapper className="has-border">
      <FormAreaBlockStyleWrapper>
        <FormItemBigTitle>
          <Icon component={BriefcaseFilled} className="title-icon" />
          <span>{t('execWorkflow.create.title')}</span>
        </FormItemBigTitle>
        <BaseInfoFormItem />
      </FormAreaBlockStyleWrapper>
    </FormAreaLineStyleWrapper>
  );
};

export default BaseInfoForm;
