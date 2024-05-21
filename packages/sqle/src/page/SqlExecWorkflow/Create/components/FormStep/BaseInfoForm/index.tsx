import { useTranslation } from 'react-i18next';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import BaseInfoFormItem from './BaseInfoFormItem';
import { IconWorkflowCreateTitle } from '../../../../../../icon/SqlExecWorkflow';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';

const BaseInfoForm: React.FC = () => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();

  return (
    <FormAreaLineStyleWrapper className="has-border">
      <FormAreaBlockStyleWrapper>
        <FormItemBigTitle>
          <IconWorkflowCreateTitle
            color={sqleTheme.execWorkflow.create.form.baseInfoTitleIconColor}
          />
          <span>{t('execWorkflow.create.title')}</span>
        </FormItemBigTitle>
        <BaseInfoFormItem />
      </FormAreaBlockStyleWrapper>
    </FormAreaLineStyleWrapper>
  );
};

export default BaseInfoForm;
