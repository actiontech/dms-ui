import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper
} from '@actiontech/dms-kit/es/components/CustomForm/style';
import { CreateExportTaskFormEntryProps } from '../index.type';
import { useTranslation } from 'react-i18next';
import { FormItemSubTitle } from '@actiontech/dms-kit';

import ExportMethodFormItem from './ExportMethodFormItem';

const ExportMethodForm: React.FC<
  Pick<CreateExportTaskFormEntryProps, 'methodForm' | 'sourceForm'>
> = ({ methodForm, sourceForm }) => {
  const { t } = useTranslation();

  return (
    <FormStyleWrapper
      colon={false}
      labelAlign="left"
      form={methodForm}
      className="clearPaddingBottom"
    >
      <FormAreaBlockStyleWrapper>
        <FormItemSubTitle>
          {t('dmsDataExport.create.form.method.title')}
        </FormItemSubTitle>

        <ExportMethodFormItem methodForm={methodForm} sourceForm={sourceForm} />
      </FormAreaBlockStyleWrapper>
    </FormStyleWrapper>
  );
};

export default ExportMethodForm;
