import { useTranslation } from 'react-i18next';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import BaseInfoFormItem from './BaseInfoFormItem';
import { IconTaskCreateTitleStyleWrapper } from './style';
import { CreateExportTaskFormEntryProps } from '../index.type';

const BaseInfoForm: React.FC<
  Pick<CreateExportTaskFormEntryProps, 'baseForm'>
> = ({ baseForm }) => {
  const { t } = useTranslation();
  return (
    <FormStyleWrapper
      form={baseForm}
      className="hasTopHeader clearPaddingBottom"
      colon={false}
      layout="vertical"
      labelAlign="left"
    >
      <FormAreaLineStyleWrapper className="has-border">
        <FormAreaBlockStyleWrapper>
          <FormItemBigTitle>
            <IconTaskCreateTitleStyleWrapper />
            <span>{t('dmsDataExport.create.form.base.title')}</span>
          </FormItemBigTitle>
          <BaseInfoFormItem />
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </FormStyleWrapper>
  );
};

export default BaseInfoForm;
