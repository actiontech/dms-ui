import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Switch } from 'antd';
import { EmptyBox, BasicInput, BasicSelect } from '@actiontech/shared';
import { roleNameRule } from '@actiontech/shared/lib/utils/FormRule';
import { IRoleFormProps } from './index.type';
import { ListOpPermissionsFilterByTargetEnum } from '@actiontech/shared/lib/api/base/service/OpPermission/index.enum';
import useOpPermission from '../../../../../hooks/useOpPermission';

const RoleForm: React.FC<IRoleFormProps> = (props) => {
  const { t } = useTranslation();
  const {
    loading: getOpPermissionListLoading,
    updateOpPermissionList,
    opPermissionOptions
  } = useOpPermission();

  useEffect(() => {
    if (props.visible) {
      updateOpPermissionList(ListOpPermissionsFilterByTargetEnum.member);
    }
  }, [updateOpPermissionList, props.visible]);

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
          loading={getOpPermissionListLoading}
          options={opPermissionOptions}
          optionFilterProp="label"
        />
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
