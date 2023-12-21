import { BasicInput, BasicSelect } from '@actiontech/shared';
import { useRequest } from 'ahooks';
import { Form, Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IRoleFormProps } from './index.type';
import auth from '../../../../../../../api/auth';

const RoleForm: React.FC<IRoleFormProps> = ({ form, visible, isUpdate }) => {
  const { t } = useTranslation();

  const { data: scopeList, loading } = useRequest(
    () => {
      return auth.V1ListExistingScopes({});
    },
    {
      ready: visible
    }
  );

  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item
          name="role_name"
          label={t('userManagement.roleName')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('userManagement.roleName')
              })
            }
          ]}
        >
          <BasicInput disabled={!!isUpdate} />
        </Form.Item>
        <Form.Item name="role_desc" label={t('userManagement.desc')}>
          <BasicInput.TextArea
            placeholder={t('common.form.placeholder.input', {
              name: t('userManagement.desc')
            })}
          />
        </Form.Item>
        <Form.Item
          name="scopes"
          label={t('userManagement.role.operationPermission')}
        >
          <BasicSelect showSearch allowClear loading={loading} mode="multiple">
            {(scopeList?.data?.data ?? []).map((item) => (
              <Select.Option
                key={item.scope_name}
                value={item.scope_name}
                label={item.scope_desc}
              >
                {item.scope_desc}
              </Select.Option>
            ))}
          </BasicSelect>
        </Form.Item>
      </Form>
    </>
  );
};

export default RoleForm;
