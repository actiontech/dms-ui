import { Form, Radio } from 'antd5';
import { useTranslation } from 'react-i18next';
import { WhitelistFormProps } from './index.type';
import { whiteSpaceSql } from '@actiontech/shared/lib/utils/FormRule';
import {
  useMonacoEditor,
  MonacoEditor
} from '@actiontech/shared/lib/components/MonacoEditor';
import { I18nKey } from '../../../locale';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { DrawerFormLayout } from '@actiontech/shared/lib/data/common';
import { BasicInput } from '@actiontech/shared';

export const WhitelistMatchTypeLabel: {
  [key in CreateAuditWhitelistReqV1MatchTypeEnum]: I18nKey;
} = {
  [CreateAuditWhitelistReqV1MatchTypeEnum.fp_match]:
    'whitelist.matchType.fingerPrint',
  [CreateAuditWhitelistReqV1MatchTypeEnum.exact_match]:
    'whitelist.matchType.exact'
};

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
        <Radio.Group>
          <Radio value={CreateAuditWhitelistReqV1MatchTypeEnum.exact_match}>
            {t(
              WhitelistMatchTypeLabel[
                CreateAuditWhitelistReqV1MatchTypeEnum.exact_match
              ]
            )}
          </Radio>
          <Radio value={CreateAuditWhitelistReqV1MatchTypeEnum.fp_match}>
            {t(
              WhitelistMatchTypeLabel[
                CreateAuditWhitelistReqV1MatchTypeEnum.fp_match
              ]
            )}
          </Radio>
        </Radio.Group>
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
        label={t('order.sqlInfo.sql')}
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
    </Form>
  );
};

export default WhitelistForm;
