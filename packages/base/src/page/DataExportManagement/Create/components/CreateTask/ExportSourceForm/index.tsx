import { useTranslation } from 'react-i18next';
import { CreateExportTaskFormEntryProps } from '../index.type';
import { FormItemSubTitle } from '@actiontech/dms-kit';
import ExportTaskFormItem from './ExportSourceFormItem';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  formItemLayout
} from '@actiontech/dms-kit/es/components/CustomForm/style';
import { ExportSourceFormStyleWrapper } from './style';
import { BasicToolTip } from '@actiontech/dms-kit';
const ExportSourceForm: React.FC<
  Pick<CreateExportTaskFormEntryProps, 'sourceForm' | 'baseForm' | 'methodForm'>
> = ({ sourceForm, baseForm, methodForm }) => {
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
          <ExportTaskFormItem
            sourceForm={sourceForm}
            baseForm={baseForm}
            methodForm={methodForm}
          />
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </ExportSourceFormStyleWrapper>
  );
};
export default ExportSourceForm;
