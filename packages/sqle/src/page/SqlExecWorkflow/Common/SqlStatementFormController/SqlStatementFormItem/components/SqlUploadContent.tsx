import { Form } from 'antd';
import { SqlUploadContentProps } from './index.type';
import { SqlAuditInfoFormFields } from '../../../../Create/index.type';
import { CustomDraggerUpload, EmptyBox } from '@actiontech/shared';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { FormItemNoLabel } from '@actiontech/shared/lib/components/FormCom';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import { useTranslation } from 'react-i18next';
import { SqlFiledInitialValue } from '../../../../../../data/common';
import { whiteSpaceSql } from '@actiontech/shared/lib/utils/FormRule';
import {
  MonacoEditor,
  useMonacoEditor
} from '@actiontech/shared/lib/components/MonacoEditor';
import { NamePath } from 'antd/es/form/interface';

const SqlUploadContent: React.FC<SqlUploadContentProps> = ({
  fieldPrefixPath
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlAuditInfoFormFields>();
  const currentSqlUploadType = Form.useWatch(
    [fieldPrefixPath, 'currentUploadType'],
    form
  ) as AuditTaskResV1SqlSourceEnum;

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
      <EmptyBox
        if={currentSqlUploadType === AuditTaskResV1SqlSourceEnum.form_data}
      >
        <FormItemNoLabel
          name={generateFieldName('form_data')}
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
      <EmptyBox
        if={currentSqlUploadType === AuditTaskResV1SqlSourceEnum.sql_file}
      >
        <FormItemNoLabel
          valuePropName="fileList"
          name={generateFieldName('sql_file')}
          rules={[
            {
              required: true,
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
      </EmptyBox>
      <EmptyBox
        if={currentSqlUploadType === AuditTaskResV1SqlSourceEnum.zip_file}
      >
        <FormItemNoLabel
          valuePropName="fileList"
          name={generateFieldName('zip_file')}
          rules={[
            {
              required: true,
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
      </EmptyBox>
    </>
  );
};

export default SqlUploadContent;
