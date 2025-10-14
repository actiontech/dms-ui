import { FormItemNoLabel } from '@actiontech/dms-kit';
import {
  MonacoEditor,
  useMonacoEditor
} from '@actiontech/shared/lib/components/MonacoEditor';
import { whiteSpaceSql } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { CreateExportTaskFormEntryProps } from '../index.type';
import { ExportMethodEnum } from './index.enum';
import { ModeSwitcher } from '@actiontech/dms-kit';
import { PanelCardOutlined } from '@actiontech/icons';
import { SQL_EDITOR_PLACEHOLDER_VALUE } from '@actiontech/dms-kit';
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
              colProps: {
                span: 8
              },
              icon: <PanelCardOutlined width={18} height={18} />
            }
          ]}
        />
      </FormItemNoLabel>

      <FormItemNoLabel
        name="sql"
        initialValue={SQL_EDITOR_PLACEHOLDER_VALUE}
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
