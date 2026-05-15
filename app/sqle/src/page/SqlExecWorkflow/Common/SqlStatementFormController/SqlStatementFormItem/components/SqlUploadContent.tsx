import { Form } from 'antd';
import { SqlUploadContentProps } from './index.type';
import { SqlAuditInfoFormFields } from '../../../../Create/index.type';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  getFileFromUploadChangeEvent,
  whiteSpaceSql,
  FormItemNoLabel,
  SQL_EDITOR_PLACEHOLDER_VALUE,
  CustomDraggerUpload,
  LazyLoadComponent,
  BasicSwitch,
  BasicInput
} from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { useMonacoEditor } from '@actiontech/shared/lib/components/MonacoEditor';
import { NamePath } from 'antd/es/form/interface';
import { useMemo } from 'react';
import CustomMonacoEditor from '../../../../../../components/CustomMonacoEditor';

const SqlUploadContent: React.FC<SqlUploadContentProps> = ({
  fieldPrefixPath,
  currentSqlUploadType,
  dbSourceInfoCollection
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlAuditInfoFormFields>();
  const currentFieldSqlIsFormatted = Form.useWatch(
    [fieldPrefixPath, 'formatted'],
    form
  );

  const isReadOnlyMode = useMemo(() => {
    return (
      currentFieldSqlIsFormatted &&
      !dbSourceInfoCollection.value?.[fieldPrefixPath]?.isSupportFormatSql
    );
  }, [
    currentFieldSqlIsFormatted,
    dbSourceInfoCollection.value,
    fieldPrefixPath
  ]);

  const generateFieldName = (name: string) => {
    return [fieldPrefixPath, name];
  };
  const { editorDidMount } = useMonacoEditor(form, {
    formName: generateFieldName('form_data')
  });
  const removeFile = (fieldName: NamePath) => {
    form.setFieldValue(fieldName, []);
  };
  return (
    <>
      <LazyLoadComponent
        open={currentSqlUploadType === AuditTaskResV1SqlSourceEnum.form_data}
        animation={false}
      >
        <FormItemNoLabel
          name={generateFieldName('form_data')}
          initialValue={SQL_EDITOR_PLACEHOLDER_VALUE}
          rules={[
            {
              required:
                currentSqlUploadType === AuditTaskResV1SqlSourceEnum.form_data,
              message: t('common.form.placeholder.input', {
                name: t('common.sqlStatements')
              })
            },
            ...whiteSpaceSql(
              currentSqlUploadType === AuditTaskResV1SqlSourceEnum.form_data
            )
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
        <FormItemNoLabel
          name={generateFieldName('formatted')}
          hidden
          valuePropName="checked"
        >
          <BasicSwitch />
        </FormItemNoLabel>
        <FormItemNoLabel name={generateFieldName('originSql')} hidden>
          <BasicInput />
        </FormItemNoLabel>
      </LazyLoadComponent>
      <LazyLoadComponent
        open={currentSqlUploadType === AuditTaskResV1SqlSourceEnum.sql_file}
        animation={false}
      >
        <FormItemNoLabel
          valuePropName="fileList"
          name={generateFieldName('sql_file')}
          rules={[
            {
              required:
                currentSqlUploadType === AuditTaskResV1SqlSourceEnum.sql_file,
              message: t('common.form.placeholder.upload', {
                name: t('execWorkflow.create.form.sqlInfo.sqlFile')
              })
            }
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <CustomDraggerUpload
            accept=".sql"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, generateFieldName('sql_file'))}
            title={t('execWorkflow.create.form.sqlInfo.sqlFileTips')}
          />
        </FormItemNoLabel>
      </LazyLoadComponent>
      <LazyLoadComponent
        open={currentSqlUploadType === AuditTaskResV1SqlSourceEnum.zip_file}
        animation={false}
      >
        <FormItemNoLabel
          valuePropName="fileList"
          name={generateFieldName('zip_file')}
          rules={[
            {
              required:
                currentSqlUploadType === AuditTaskResV1SqlSourceEnum.zip_file,
              message: t('common.form.placeholder.upload', {
                name: t('execWorkflow.create.form.sqlInfo.zipFile')
              })
            }
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <CustomDraggerUpload
            accept=".zip"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, generateFieldName('zip_file'))}
            title={t('execWorkflow.create.form.sqlInfo.zipFileTips')}
          />
        </FormItemNoLabel>
      </LazyLoadComponent>
    </>
  );
};
export default SqlUploadContent;
