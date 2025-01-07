import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/CustomForm/style';
import { CreateExportTaskFormEntryProps } from '../index.type';
import { useTranslation } from 'react-i18next';
import { FormItemSubTitle } from '@actiontech/shared/lib/components/CustomForm';

import ExportMethodFormItem from './ExportMethodFormItem';

const ExportMethodForm: React.FC<
  Pick<CreateExportTaskFormEntryProps, 'methodForm'>
> = ({ methodForm }) => {
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

        <ExportMethodFormItem methodForm={methodForm} />
      </FormAreaBlockStyleWrapper>
    </FormStyleWrapper>
  );
};

export default ExportMethodForm;
