import { useTranslation } from 'react-i18next';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/dms-kit/es/components/CustomForm/style';
import { FormItemBigTitle } from '@actiontech/dms-kit';
import BaseInfoFormItem from './BaseInfoFormItem';
import { BriefcaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';
import { forwardRef } from 'react';
import useCreationMode from '../../../hooks/useCreationMode';

const BaseInfoForm = forwardRef<HTMLElement>((props, ref) => {
  const { t } = useTranslation();

  const { isAssociationVersionMode, versionName } = useCreationMode();

  return (
    <FormAreaLineStyleWrapper className="has-border">
      <FormAreaBlockStyleWrapper>
        <FormItemBigTitle>
          <Icon component={BriefcaseFilled} className="title-icon" />
          <span>
            {isAssociationVersionMode
              ? `${t('execWorkflow.create.title')}(${t(
                  'execWorkflow.create.currentVersion'
                )}：${versionName})`
              : t('execWorkflow.create.title')}
          </span>
        </FormItemBigTitle>
        <BaseInfoFormItem ref={ref} />
      </FormAreaBlockStyleWrapper>
    </FormAreaLineStyleWrapper>
  );
});

export default BaseInfoForm;
