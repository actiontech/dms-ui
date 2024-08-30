import { Alert, Form, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { WhitelistFormProps } from './index.type';
import { whiteSpaceSql } from '@actiontech/shared/lib/utils/FormRule';
import {
  useMonacoEditor,
  MonacoEditor
} from '@actiontech/shared/lib/components/MonacoEditor';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { DrawerFormLayout } from '@actiontech/shared/lib/data/common';
import { BasicInput, EmptyBox } from '@actiontech/shared';
import { whitelistMatchTypeOptions } from '../index.data';
import { WarningFilled } from '@actiontech/icons';

const WhitelistForm: React.FC<WhitelistFormProps> = (props) => {
  const { t } = useTranslation();

  const { editorDidMount } = useMonacoEditor(props.form, { formName: 'sql' });

  return (
    <Form form={props.form} layout="vertical" {...DrawerFormLayout}>
      <Form.Item
        label={t('whitelist.table.matchType')}
        name="matchType"
        initialValue={CreateAuditWhitelistReqV1MatchTypeEnum.exact_match}
      >
        <Radio.Group options={whitelistMatchTypeOptions} />
      </Form.Item>
      <Form.Item label={t('whitelist.table.desc')} name="desc">
        <BasicInput.TextArea
          className="textarea-no-resize"
          autoSize={{
            minRows: 3,
            maxRows: 10
          }}
          placeholder={t('common.form.placeholder.input')}
        />
      </Form.Item>

      <Form.Item
        name="sql"
        label={t('whitelist.modal.sql')}
        initialValue="/* input your sql */"
        rules={[
          {
            required: true
          },
          ...whiteSpaceSql()
        ]}
      >
        <MonacoEditor
          width="100%"
          height="500px"
          language="sql"
          onMount={editorDidMount}
        />
      </Form.Item>

      <EmptyBox if={props.isUpdate}>
        <Alert
          showIcon
          icon={<WarningFilled />}
          message={t('whitelist.modal.update.tips')}
          type="warning"
        />
      </EmptyBox>
    </Form>
  );
};

export default WhitelistForm;
