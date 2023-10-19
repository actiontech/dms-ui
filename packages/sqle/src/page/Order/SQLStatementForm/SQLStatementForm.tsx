import {
  MonacoEditor,
  useMonacoEditor
} from '@actiontech/shared/lib/components/MonacoEditor';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SQLInputType,
  SQLStatementFields,
  SQLStatementFormProps
} from './index';
import { CustomDraggerUpload, EmptyBox } from '@actiontech/shared';
import { FormItemNoLabel } from '@actiontech/shared/lib/components/FormCom';
import UploadType from './UploadType';

const SQLStatementForm: React.FC<SQLStatementFormProps> = ({
  form,
  isClearFormWhenChangeSqlType = false,
  sqlStatement,
  fieldName,
  hideUpdateMybatisFile = false
}) => {
  const { t } = useTranslation();

  const [currentSQLInputType, setCurrentSQLInputTYpe] = useState(
    SQLInputType.manualInput
  );

  const currentSQLInputTypeChange = (value: SQLInputType) => {
    setCurrentSQLInputTYpe(value);
    if (isClearFormWhenChangeSqlType) {
      form.resetFields([
        generateFieldName('sql'),
        generateFieldName('sqlFile'),
        generateFieldName('mybatisFile')
      ]);
    }
  };

  const removeFile = useCallback(
    (fileName: keyof SQLStatementFields) => {
      form.setFieldsValue({
        [fieldName ?? '0']: {
          [fileName]: []
        }
      });
    },
    [fieldName, form]
  );

  const generateFieldName = (name: string) => {
    return [fieldName ?? '0', name];
  };

  const { editorDidMount } = useMonacoEditor(form, {
    formName: generateFieldName('sql')
  });

  useEffect(() => {
    if (sqlStatement) {
      form.setFieldsValue({
        [fieldName ?? '0']: {
          sql: sqlStatement
        }
      });
    }
  }, [fieldName, form, sqlStatement]);

  return (
    <>
      <FormItemNoLabel
        name={generateFieldName('sqlInputType')}
        initialValue={SQLInputType.manualInput}
      >
        <UploadType
          hideUpdateMybatisFile={hideUpdateMybatisFile}
          onChange={currentSQLInputTypeChange}
        />
      </FormItemNoLabel>
      <EmptyBox if={currentSQLInputType === SQLInputType.manualInput}>
        <FormItemNoLabel
          name={generateFieldName('sql')}
          initialValue="/* input your sql */"
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.input', {
                name: t('order.sqlInfo.sql')
              })
            }
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
      </EmptyBox>
      <EmptyBox if={currentSQLInputType === SQLInputType.uploadFile}>
        <FormItemNoLabel
          valuePropName="fileList"
          name={generateFieldName('sqlFile')}
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('order.sqlInfo.sqlFile')
              })
            }
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <CustomDraggerUpload
            accept=".sql"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, 'sqlFile')}
            title={t('order.sqlInfo.sqlFileTips')}
          />
        </FormItemNoLabel>
      </EmptyBox>
      <EmptyBox
        if={
          currentSQLInputType === SQLInputType.uploadMybatisFile &&
          !hideUpdateMybatisFile
        }
      >
        <FormItemNoLabel
          valuePropName="fileList"
          name={generateFieldName('mybatisFile')}
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('order.sqlInfo.mybatisFile')
              })
            }
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <CustomDraggerUpload
            accept=".sql"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, 'sqlFile')}
            title={t('order.sqlInfo.mybatisFileTips')}
          />
        </FormItemNoLabel>
      </EmptyBox>
    </>
  );
};

export default SQLStatementForm;
