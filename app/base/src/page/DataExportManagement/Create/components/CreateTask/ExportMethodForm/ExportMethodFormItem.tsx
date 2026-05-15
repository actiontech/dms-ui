import {
  BasicInput,
  BasicSwitch,
  FormItemNoLabel,
  isSupportLanguage
} from '@actiontech/dms-kit';
import { useMonacoEditor } from '@actiontech/shared/lib/components/MonacoEditor';
import { whiteSpaceSql } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { CreateExportTaskFormEntryProps } from '../index.type';
import { ExportMethodEnum } from './index.enum';
import { ModeSwitcher } from '@actiontech/dms-kit';
import { PanelCardOutlined } from '@actiontech/icons';
import { SQL_EDITOR_PLACEHOLDER_VALUE } from '@actiontech/dms-kit';
import CustomMonacoEditor from 'sqle/src/components/CustomMonacoEditor';
import { useMemo } from 'react';
import { Form } from 'antd';

const ExportMethodFormItem: React.FC<
  Pick<CreateExportTaskFormEntryProps, 'methodForm' | 'sourceForm'>
> = ({ methodForm, sourceForm }) => {
  const { t } = useTranslation();
  const { editorDidMount } = useMonacoEditor(methodForm, {
    formName: 'sql'
  });
  const formatted = Form.useWatch('formatted', methodForm);
  const dbType = Form.useWatch('dbType', sourceForm);

  const isReadOnlyMode = useMemo(() => {
    return formatted && !isSupportLanguage(dbType);
  }, [formatted, dbType]);
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
        <CustomMonacoEditor
          width="100%"
          height="400px"
          language="sql"
          onMount={editorDidMount}
          options={{
            automaticLayout: true,
            readOnly: isReadOnlyMode
          }}
          showAlert={isReadOnlyMode}
        />
      </FormItemNoLabel>
      <FormItemNoLabel name="formatted" hidden valuePropName="checked">
        <BasicSwitch />
      </FormItemNoLabel>
      <FormItemNoLabel name="originSql" hidden>
        <BasicInput />
      </FormItemNoLabel>
    </>
  );
};
export default ExportMethodFormItem;
