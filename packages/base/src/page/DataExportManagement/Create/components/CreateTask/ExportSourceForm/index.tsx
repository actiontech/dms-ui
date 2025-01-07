import { useTranslation } from 'react-i18next';
import { CreateExportTaskFormEntryProps } from '../index.type';
import { FormItemSubTitle } from '@actiontech/shared/lib/components/CustomForm';
import ExportTaskFormItem from './ExportSourceFormItem';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/CustomForm/style';
import { ExportSourceFormStyleWrapper } from './style';

const ExportSourceForm: React.FC<
  Pick<CreateExportTaskFormEntryProps, 'sourceForm' | 'baseForm'>
> = ({ sourceForm, baseForm }) => {
  const { t } = useTranslation();
  return (
    <ExportSourceFormStyleWrapper
      colon={false}
      labelAlign="left"
      form={sourceForm}
      className="clearPaddingBottom"
      {...formItemLayout.spaceBetween}
    >
      <FormAreaLineStyleWrapper className="has-border">
        <FormAreaBlockStyleWrapper>
          <FormItemSubTitle>
            {t('dmsDataExport.create.form.source.title')}
          </FormItemSubTitle>
          <ExportTaskFormItem sourceForm={sourceForm} baseForm={baseForm} />
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </ExportSourceFormStyleWrapper>
  );
};

export default ExportSourceForm;
