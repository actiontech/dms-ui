import { FormItemNoLabel } from '@actiontech/shared/lib/components/FormCom';
import {
  MonacoEditor,
  useMonacoEditor
} from '@actiontech/shared/lib/components/MonacoEditor';
import { whiteSpaceSql } from '@actiontech/shared/lib/utils/FormRule';
import { useTranslation } from 'react-i18next';
import { SqlFiledInitialValue } from 'sqle/src/data/common';
import { CreateExportTaskFormEntryProps } from '../index.type';
import { ExportMethodEnum } from './index.enum';
import { IconOrderSQLUpload } from 'sqle/src/icon/Order';
import { ModeSwitcher } from '@actiontech/shared';

const ExportMethodFormItem: React.FC<
  Pick<CreateExportTaskFormEntryProps, 'methodForm'>
> = ({ methodForm }) => {
  const { t } = useTranslation();

  const { editorDidMount } = useMonacoEditor(methodForm, {
    formName: 'sql'
  });
  return (
    <>
      <FormItemNoLabel name="exportMethod" initialValue={ExportMethodEnum.sql}>
        <ModeSwitcher
          options={[
            {
              label: t('dmsDataExport.create.form.method.manualInput'),
              value: ExportMethodEnum.sql,
              colProps: { span: 8 },
              icon: <IconOrderSQLUpload />
            }
          ]}
        />
      </FormItemNoLabel>

      <FormItemNoLabel
        name="sql"
        initialValue={SqlFiledInitialValue}
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t('common.sqlStatements')
            })
          },
          ...whiteSpaceSql()
        ]}
      >
        <MonacoEditor
          width="100%"
          height="400px"
          language="sql"
          onMount={editorDidMount}
          options={{
            automaticLayout: true
          }}
        />
      </FormItemNoLabel>
    </>
  );
};

export default ExportMethodFormItem;
