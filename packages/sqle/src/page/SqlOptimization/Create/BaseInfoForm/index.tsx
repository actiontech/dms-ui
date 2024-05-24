import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../../index.type';
import BaseInfoFormItem from './BaseInfoFormItem';
import { IconWorkflowCreateTitle } from '../../../../icon/SqlExecWorkflow';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';

const BaseInfoForm: React.FC<{ form: BaseForm }> = ({ form }) => {
  const { t } = useTranslation();
  const { sharedTheme } = useThemeStyleData();

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
            <IconWorkflowCreateTitle
              color={sharedTheme.uiToken.colorTextQuaternary}
            />
            <span>{t('sqlOptimization.create.base.title')}</span>
          </FormItemBigTitle>
          <BaseInfoFormItem />
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </FormStyleWrapper>
  );
};

export default BaseInfoForm;
