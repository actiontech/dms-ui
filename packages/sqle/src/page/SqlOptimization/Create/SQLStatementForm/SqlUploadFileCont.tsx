import { useTranslation } from 'react-i18next';
import { SQLStatementFormProps, UploadTypeEnum } from '../../index.type';
import { Form } from 'antd';
import { useMonacoEditor } from '@actiontech/shared/lib/components/MonacoEditor';
import { EmptyBox, FormItemNoLabel } from '@actiontech/shared';
import { SQL_EDITOR_PLACEHOLDER_VALUE } from '@actiontech/shared';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';
import CustomMonacoEditor from '../../../../components/CustomMonacoEditor';
import { whiteSpaceSql } from '@actiontech/shared/lib/utils/FormRule';

const SqlUploadFileCont = ({ form, isReadOnlyMode }: SQLStatementFormProps) => {
  const { t } = useTranslation();
  const submitLoading = useSelector(
    (state: IReduxState) => state.sqlOptimization.submitLoading
  );

  const uploadType = Form.useWatch('uploadType', form);
  const { editorDidMount } = useMonacoEditor(form, {
    formName: 'sql'
  });

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
      </EmptyBox>
    </>
  );
};
export default SqlUploadFileCont;
