import {
  BasicInput,
  BasicSwitch,
  FormItemLabel,
  FormItemNoLabel
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
import { Form, Radio } from 'antd';

const MONGODB_DB_TYPE = 'MongoDB';
const EXPORT_FILE_TYPE_CSV = 'CSV';
const EXPORT_FILE_TYPE_JSON = 'JSON';

const ExportMethodFormItem: React.FC<
  Pick<CreateExportTaskFormEntryProps, 'methodForm' | 'sourceForm'>
> = ({ methodForm, sourceForm }) => {
  const { t } = useTranslation();
  const { editorDidMount } = useMonacoEditor(methodForm, {
    formName: 'sql'
  });
  const dbType = Form.useWatch('dbType', sourceForm);

  const isMongoDb = dbType === MONGODB_DB_TYPE;
  const editorLanguage = isMongoDb ? 'javascript' : 'sql';

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

      <FormItemLabel
        className="has-required-style"
        name="exportFileType"
        initialValue={EXPORT_FILE_TYPE_CSV}
        label={t('dmsDataExport.create.form.method.exportFileType')}
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.select', {
              name: t('dmsDataExport.create.form.method.exportFileType')
            })
          }
        ]}
      >
        <Radio.Group>
          <Radio value={EXPORT_FILE_TYPE_CSV}>
            {t('dmsDataExport.create.form.method.exportFileTypeCSV')}
          </Radio>
          <Radio value={EXPORT_FILE_TYPE_JSON}>
            {t('dmsDataExport.create.form.method.exportFileTypeJSON')}
          </Radio>
        </Radio.Group>
      </FormItemLabel>

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
          language={editorLanguage}
          onMount={editorDidMount}
          options={{
            automaticLayout: true,
            // FE-S3-02：不因「不支持语言」只读锁死（含 Mongo）
            readOnly: false
          }}
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
