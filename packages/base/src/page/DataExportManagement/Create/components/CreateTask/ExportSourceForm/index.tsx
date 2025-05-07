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
import { BasicToolTip } from '@actiontech/shared';

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
            <BasicToolTip
              title={t('dmsDataExport.create.form.source.titleTips')}
              suffixIcon
            >
              {t('dmsDataExport.create.form.source.title')}
            </BasicToolTip>
          </FormItemSubTitle>
          <ExportTaskFormItem sourceForm={sourceForm} baseForm={baseForm} />
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </ExportSourceFormStyleWrapper>
  );
};

export default ExportSourceForm;
