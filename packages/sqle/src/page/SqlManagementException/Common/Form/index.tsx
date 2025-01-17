import { Alert, Form, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { SqlManagementExceptionFormProps } from '../../index.type';
import { whiteSpaceSql } from '@actiontech/shared/lib/utils/FormRule';
import {
  useMonacoEditor,
  MonacoEditor
} from '@actiontech/shared/lib/components/MonacoEditor';
import { CreateBlacklistReqV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { DrawerFormLayout } from '@actiontech/shared/lib/data/common';
import { BasicInput, EmptyBox, BasicSelect } from '@actiontech/shared';
import { SqlManagementExceptionMatchTypeOptions } from '../../index.data';
import useInstance from '../../../../hooks/useInstance';
import { useEffect } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { WarningFilled } from '@actiontech/icons';

const SqlManagementExceptionForm: React.FC<SqlManagementExceptionFormProps> = ({
  form,
  isUpdate
}) => {
  const { t } = useTranslation();

  const { editorDidMount } = useMonacoEditor(form, { formName: 'sql' });

  const matchType = Form.useWatch('type', form);

  const { updateInstanceList, generateInstanceSelectOption, loading } =
    useInstance();

  const { projectName } = useCurrentProject();

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
  }, [updateInstanceList, projectName]);

  return (
    <Form form={form} layout="vertical" {...DrawerFormLayout}>
      <Form.Item
        label={t('sqlManagementException.table.matchType')}
        name="type"
        initialValue={CreateBlacklistReqV1TypeEnum.sql}
      >
        <Radio.Group
          options={SqlManagementExceptionMatchTypeOptions}
          onChange={() => form.resetFields(['content'])}
        />
      </Form.Item>
      <Form.Item label={t('sqlManagementException.table.desc')} name="desc">
        <BasicInput.TextArea
          className="textarea-no-resize"
          autoSize={{
            minRows: 3,
            maxRows: 10
          }}
          placeholder={t('common.form.placeholder.input')}
        />
      </Form.Item>
      <EmptyBox
        if={
          matchType === CreateBlacklistReqV1TypeEnum.sql ||
          matchType === CreateBlacklistReqV1TypeEnum.fp_sql
        }
      >
        <Form.Item
          name="sql"
          label={t('sqlManagementException.modal.sql')}
          rules={[
            {
              required: true
            },
            ...whiteSpaceSql()
          ]}
          initialValue="/* input your sql */"
        >
          <MonacoEditor
            width="100%"
            height="500px"
            language="sql"
            onMount={editorDidMount}
          />
        </Form.Item>
      </EmptyBox>
      <EmptyBox if={matchType === CreateBlacklistReqV1TypeEnum.instance}>
        <Form.Item
          name="instance"
          label={t('sqlManagementException.matchType.instance')}
          rules={[
            {
              required: true
            }
          ]}
        >
          <BasicSelect loading={loading}>
            {generateInstanceSelectOption()}
          </BasicSelect>
        </Form.Item>
      </EmptyBox>
      <EmptyBox
        if={
          matchType === CreateBlacklistReqV1TypeEnum.ip ||
          matchType === CreateBlacklistReqV1TypeEnum.cidr ||
          matchType === CreateBlacklistReqV1TypeEnum.host
        }
      >
        <Form.Item
          name={matchType}
          label={t(`sqlManagementException.matchType.${matchType}`)}
          rules={[
            {
              required: true
            }
          ]}
        >
          <BasicInput />
        </Form.Item>
      </EmptyBox>

      <EmptyBox if={isUpdate}>
        <Alert
          showIcon
          icon={<WarningFilled />}
          message={t('sqlManagementException.modal.update.tips')}
          type="warning"
        />
      </EmptyBox>
    </Form>
  );
};

export default SqlManagementExceptionForm;
