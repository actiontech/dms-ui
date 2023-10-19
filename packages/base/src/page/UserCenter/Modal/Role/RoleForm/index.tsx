import { EmptyBox, BasicInput, BasicSelect } from '@actiontech/shared';
import { roleNameRule } from '@actiontech/shared/lib/utils/FormRule';
import { Form, Select, Switch } from 'antd5';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IRoleFormProps } from './index.type';

const RoleForm: React.FC<IRoleFormProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Form form={props.form} layout="vertical">
      <Form.Item
        name="name"
        label={t('dmsUserCenter.role.roleForm.name')}
        validateFirst={true}
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dmsUserCenter.role.roleForm.name')
            })
          },
          ...roleNameRule()
        ]}
      >
        <BasicInput
          disabled={props.isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsUserCenter.role.roleForm.name')
          })}
        />
      </Form.Item>
      <Form.Item name="desc" label={t('dmsUserCenter.role.roleForm.desc')}>
        <BasicInput.TextArea
          style={{ resize: 'none' }}
          rows={3}
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsUserCenter.role.roleForm.desc')
          })}
        />
      </Form.Item>
      <EmptyBox if={props.isUpdate}>
        <Form.Item
          name="isDisabled"
          label={t('dmsUserCenter.role.roleForm.isDisabled')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </EmptyBox>
      <Form.Item
        name="opPermissions"
        label={t('dmsUserCenter.role.roleForm.opPermissions')}
      >
        <BasicSelect
          mode="multiple"
          showSearch
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsUserCenter.role.roleForm.opPermissions')
          })}
        >
          {props.operationList.map((operation) => (
            <Select.Option
              key={operation.op_permission?.uid}
              value={operation.op_permission?.uid ?? ''}
            >
              {operation.op_permission?.name}
            </Select.Option>
          ))}
        </BasicSelect>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
