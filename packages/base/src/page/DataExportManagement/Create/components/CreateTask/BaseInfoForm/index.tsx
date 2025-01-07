import { useTranslation } from 'react-i18next';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/CustomForm/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/CustomForm';
import BaseInfoFormItem from './BaseInfoFormItem';
import { CreateExportTaskFormEntryProps } from '../index.type';
import { BriefcaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';

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
            <Icon component={BriefcaseFilled} className="title-icon" />
            <span>{t('dmsDataExport.create.form.base.title')}</span>
          </FormItemBigTitle>
          <BaseInfoFormItem />
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </FormStyleWrapper>
  );
};

export default BaseInfoForm;
