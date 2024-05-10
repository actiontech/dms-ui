import {
  MonacoEditor,
  useMonacoEditor
} from '@actiontech/shared/lib/components/MonacoEditor';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SQLInputType,
  SQLStatementFields,
  SQLStatementFormProps
} from './index';
import {
  CustomDraggerUpload,
  EmptyBox,
  ModeSwitcher
} from '@actiontech/shared';
import { FormItemNoLabel } from '@actiontech/shared/lib/components/FormCom';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { Form } from 'antd';
import { whiteSpaceSql } from '@actiontech/shared/lib/utils/FormRule';
import { SqlFiledInitialValue } from '../../../data/common';
import { defaultUploadTypeOptions } from './index.data';

const SQLStatementForm: React.FC<SQLStatementFormProps> = ({
  form,
  isClearFormWhenChangeSqlType = false,
  sqlStatement,
  fieldName = '0',
  uploadTypeOptions,
  sqlInputTypeChangeHandle
}) => {
  const { t } = useTranslation();
  const currentSQLInputTypeChange = (type: SQLInputType) => {
    if (isClearFormWhenChangeSqlType) {
      form.resetFields([
        generateFieldName('sql'),
        generateFieldName('sqlFile'),
        generateFieldName('mybatisFile'),
        generateFieldName('zipFile')
      ]);
    }
    sqlInputTypeChangeHandle?.(type);
  };

  const removeFile = useCallback(
    (fileName: keyof SQLStatementFields) => {
      form.setFieldsValue({
        [fieldName]: {
          [fileName]: []
        }
      });
    },
    [fieldName, form]
  );

  const generateFieldName = (name: string) => {
    return [fieldName ?? '0', name];
  };

  const sqlInputTypeName = useMemo(() => {
    return [fieldName, 'sqlInputType'];
  }, [fieldName]);

  const currentSQLInputType = Form.useWatch(sqlInputTypeName, form);

  const { editorDidMount } = useMonacoEditor(form, {
    formName: generateFieldName('sql')
  });

  useEffect(() => {
    if (sqlStatement) {
      form.setFieldsValue({
        [fieldName]: {
          sql: sqlStatement
        }
      });
    }
  }, [fieldName, form, sqlStatement]);

  useEffect(() => {
    const reset = () => {
      form.setFieldValue(sqlInputTypeName, SQLInputType.manualInput);
    };
    EventEmitter.subscribe(EmitterKey.Reset_Create_Order_Form, reset);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Reset_Create_Order_Form, reset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormItemNoLabel
        name={sqlInputTypeName}
        initialValue={SQLInputType.manualInput}
      >
        <ModeSwitcher<SQLInputType>
          rowProps={{ gutter: 12 }}
          options={uploadTypeOptions ?? defaultUploadTypeOptions}
          onChange={(type) => {
            currentSQLInputTypeChange(type);
          }}
        />
      </FormItemNoLabel>
      <EmptyBox if={currentSQLInputType === SQLInputType.manualInput}>
        <FormItemNoLabel
          name={generateFieldName('sql')}
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
      </EmptyBox>
      <EmptyBox if={currentSQLInputType === SQLInputType.uploadFile}>
        <FormItemNoLabel
          valuePropName="fileList"
          name={generateFieldName('sqlFile')}
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.upload', {
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
      {/* <EmptyBox if={currentSQLInputType === SQLInputType.uploadMybatisFile}>
        <FormItemNoLabel
          valuePropName="fileList"
          name={generateFieldName('mybatisFile')}
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.upload', {
                name: t('order.sqlInfo.mybatisFile')
              })
            }
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <CustomDraggerUpload
            accept=".xml"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, 'mybatisFile')}
            title={t('order.sqlInfo.mybatisFileTips')}
          />
        </FormItemNoLabel>
      </EmptyBox> */}
      <EmptyBox if={currentSQLInputType === SQLInputType.zipFile}>
        <FormItemNoLabel
          valuePropName="fileList"
          name={generateFieldName('zipFile')}
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.upload', {
                name: t('order.sqlInfo.zipFile')
              })
            }
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <CustomDraggerUpload
            accept=".zip"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, 'zipFile')}
            title={t('order.sqlInfo.zipFileTips')}
          />
        </FormItemNoLabel>
      </EmptyBox>
    </>
  );
};

export default SQLStatementForm;
