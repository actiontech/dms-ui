import { useTranslation } from 'react-i18next';
import { useCallback, useContext, useMemo } from 'react';
import {
  SQLStatementFields,
  SqlUploadFileContProps,
  UploadTypeEnum
} from '../../../SQLInfoForm/index.type';
import {
  BasicInput,
  BasicSwitch,
  FormItemNoLabel,
  isSupportLanguage,
  CustomDraggerUpload,
  EmptyBox,
  whiteSpaceSql,
  SQL_EDITOR_PLACEHOLDER_VALUE,
  getFileFromUploadChangeEvent
} from '@actiontech/dms-kit';
import { Form } from 'antd';
import { useMonacoEditor } from '@actiontech/shared/lib/components/MonacoEditor';
import { FormSubmitStatusContext } from '../../..';
import CustomMonacoEditor from '../../../../../../components/CustomMonacoEditor';

const SqlUploadFileCont = ({ form }: SqlUploadFileContProps) => {
  const { t } = useTranslation();
  const submitLoading = useContext(FormSubmitStatusContext);
  const uploadType = Form.useWatch('uploadType', form);
  const selectedDbType = Form.useWatch('dbType', form);
  const formatted = Form.useWatch('formatted', form);

  const { editorDidMount } = useMonacoEditor(form, {
    formName: 'sql'
  });
  const removeFile = useCallback(
    (fileName: keyof SQLStatementFields) => {
      form.setFieldsValue({
        [fileName]: []
      });
    },
    [form]
  );

  const isReadOnlyMode = useMemo(() => {
    return formatted && !isSupportLanguage(selectedDbType);
  }, [formatted, selectedDbType]);

  return (
    <>
      {/* sql */}
      <EmptyBox if={uploadType === UploadTypeEnum.sql}>
        <FormItemNoLabel
          name="sql"
          rules={[
            {
              required: uploadType === UploadTypeEnum.sql,
              message: t('common.form.placeholder.input', {
                name: t('common.sqlStatements')
              })
            },
            ...whiteSpaceSql()
          ]}
          initialValue={SQL_EDITOR_PLACEHOLDER_VALUE}
        >
          <CustomMonacoEditor
            width="100%"
            height="400px"
            language="sql"
            onMount={editorDidMount}
            options={{
              automaticLayout: true,
              readOnly: submitLoading || isReadOnlyMode
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
      </EmptyBox>
      {/* sqlFile */}
      <EmptyBox if={uploadType === UploadTypeEnum.sqlFile}>
        <FormItemNoLabel
          name="sqlFile"
          valuePropName="fileList"
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.upload', {
                name: t('sqlAudit.create.sqlInfo.uploadLabelEnum.sqlFile')
              })
            }
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <CustomDraggerUpload
            accept=".sql"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, 'sqlFile')}
            title={t('sqlAudit.create.sqlInfo.uploadFileTip.sqlFile')}
            disabled={submitLoading}
          />
        </FormItemNoLabel>
      </EmptyBox>
      {/* mybatisFile */}
      <EmptyBox if={uploadType === UploadTypeEnum.mybatisFile}>
        <FormItemNoLabel
          name="mybatisFile"
          valuePropName="fileList"
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.upload', {
                name: t('sqlAudit.create.sqlInfo.uploadLabelEnum.mybatisFile')
              })
            }
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <CustomDraggerUpload
            accept=".xml"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, 'mybatisFile')}
            title={t('sqlAudit.create.sqlInfo.uploadFileTip.mybatisFile')}
            disabled={submitLoading}
          />
        </FormItemNoLabel>
      </EmptyBox>
      {/* zipFile */}
      <EmptyBox if={uploadType === UploadTypeEnum.zipFile}>
        <FormItemNoLabel>
          <FormItemNoLabel
            name="zipFile"
            valuePropName="fileList"
            rules={[
              {
                required: true,
                message: t('common.form.placeholder.upload', {
                  name: t('sqlAudit.create.sqlInfo.uploadLabelEnum.zipFile')
                })
              }
            ]}
            getValueFromEvent={getFileFromUploadChangeEvent}
          >
            <CustomDraggerUpload
              accept=".zip"
              beforeUpload={() => false}
              onRemove={removeFile.bind(null, 'zipFile')}
              title={t('sqlAudit.create.sqlInfo.uploadFileTip.zipFile')}
              disabled={submitLoading}
            />
          </FormItemNoLabel>
        </FormItemNoLabel>
      </EmptyBox>
    </>
  );
};
export default SqlUploadFileCont;
