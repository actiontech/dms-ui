import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import {
  SQLStatementFields,
  SQLStatementFormProps,
  UploadTypeEnum
} from '../../index.type';
import { Form } from 'antd';
import {
  MonacoEditor,
  useMonacoEditor
} from '@actiontech/shared/lib/components/MonacoEditor';
import {
  CustomDraggerUpload,
  EmptyBox,
  FormItemNoLabel
} from '@actiontech/shared';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import { whiteSpaceSql } from '@actiontech/shared/lib/utils/FormRule';
import { SQL_EDITOR_PLACEHOLDER_VALUE } from '@actiontech/shared/lib/data/common';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';

const SqlUploadFileCont = ({ form }: SQLStatementFormProps) => {
  const { t } = useTranslation();
  const submitLoading = useSelector(
    (state: IReduxState) => state.sqlOptimization.submitLoading
  );

  const uploadType = Form.useWatch('uploadType', form);

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
          <MonacoEditor
            width="100%"
            height="400px"
            language="sql"
            onMount={editorDidMount}
            options={{
              automaticLayout: true,
              readOnly: submitLoading
            }}
          />
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
                name: t(
                  'sqlOptimization.create.sqlInfo.uploadLabelEnum.sqlFile'
                )
              })
            }
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <CustomDraggerUpload
            accept=".sql"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, 'sqlFile')}
            title={t('sqlOptimization.create.sqlInfo.uploadFileTip.sqlFile')}
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
                name: t(
                  'sqlOptimization.create.sqlInfo.uploadLabelEnum.mybatisFile'
                )
              })
            }
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <CustomDraggerUpload
            accept=".xml"
            beforeUpload={() => false}
            onRemove={removeFile.bind(null, 'mybatisFile')}
            title={t(
              'sqlOptimization.create.sqlInfo.uploadFileTip.mybatisFile'
            )}
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
                  name: t(
                    'sqlOptimization.create.sqlInfo.uploadLabelEnum.zipFile'
                  )
                })
              }
            ]}
            getValueFromEvent={getFileFromUploadChangeEvent}
          >
            <CustomDraggerUpload
              accept=".zip"
              beforeUpload={() => false}
              onRemove={removeFile.bind(null, 'zipFile')}
              title={t('sqlOptimization.create.sqlInfo.uploadFileTip.zipFile')}
              disabled={submitLoading}
            />
          </FormItemNoLabel>
        </FormItemNoLabel>
      </EmptyBox>
    </>
  );
};

export default SqlUploadFileCont;
