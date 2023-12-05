import { useTranslation } from 'react-i18next';
import { useCallback, useContext } from 'react';

import {
  SQLStatementFields,
  SqlUploadFileContProps,
  UploadTypeEnum
} from '../SQLInfoForm/index.type';
import { FormItemNoLabel } from '@actiontech/shared/lib/components/FormCom';
import { Form } from 'antd';
import {
  MonacoEditor,
  useMonacoEditor
} from '@actiontech/shared/lib/components/MonacoEditor';
import { CustomDraggerUpload, EmptyBox } from '@actiontech/shared';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import { FormSubmitStatusContext } from '..';
import { SqlFiledInitialValue } from '../../../../data/common';
import { whiteSpaceSql } from '@actiontech/shared/lib/utils/FormRule';

const SqlUploadFileCont = ({ form }: SqlUploadFileContProps) => {
  const { t } = useTranslation();
  const submitLoading = useContext(FormSubmitStatusContext);

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
          initialValue={SqlFiledInitialValue}
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
