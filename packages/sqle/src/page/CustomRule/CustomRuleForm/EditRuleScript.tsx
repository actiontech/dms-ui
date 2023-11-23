import { useEffect } from 'react';
import { EditRuleScriptFields, EditRuleScriptProps } from '.';
import { useTranslation } from 'react-i18next';
import { PageFormLayout } from '../../../data/common';
import {
  MonacoEditor,
  useMonacoEditor
} from '@actiontech/shared/lib/components/MonacoEditor';
import {
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormInstance } from 'antd';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';

const EditRuleScript: React.FC<EditRuleScriptProps> = (props) => {
  const { t } = useTranslation();

  const { editorDidMount, registerRegexLanguage } = useMonacoEditor(
    props.form,
    {
      formName: 'script',
      placeholder: ''
    }
  );

  useEffect(() => {
    if (props.defaultData) {
      props.form.setFieldsValue({
        script: props.defaultData.rule_script
      });
    }
  }, [props.defaultData, props.form]);

  return (
    <FormStyleWrapper
      colon={false}
      labelAlign="left"
      form={props.form as FormInstance<EditRuleScriptFields>}
      className="hasTopGap"
      {...formItemLayout.fullLine}
    >
      <FormItemLabel
        name="script"
        label={t('customRule.editScriptForm.inputRuleScript')}
        wrapperCol={{
          ...PageFormLayout.wrapperCol
        }}
        rules={[
          {
            required: true
          }
        ]}
      >
        <MonacoEditor
          width="720px"
          height="500px"
          language="regexp"
          onMount={(editor, monaco) => {
            editorDidMount(editor, monaco);
            registerRegexLanguage(editor, monaco);
          }}
          options={{
            automaticLayout: true
          }}
        />
      </FormItemLabel>
    </FormStyleWrapper>
  );
};

export default EditRuleScript;
