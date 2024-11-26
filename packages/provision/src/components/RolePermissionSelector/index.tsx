import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { Cascader, CascaderProps, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicCascader, BasicSelect, TypedLink } from '@actiontech/shared';
import { useEffect } from 'react';
import { AuthListOperationsDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import {
  IRolePermissionSelectorBaseFields,
  IRolePermissionSelectorProps
} from './index.type';
import useOperationPermissionTips from '../../hooks/useOperationPermissionTips';
import useDBAuthRoleTips from '../../hooks/useDBAuthRoleTips';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import { CustomCascaderPopupMenuStyleWrapper } from './style';

const RolePermissionSelector = <T extends IRolePermissionSelectorBaseFields>({
  form,
  projectID,
  showQuickCreateRole,
  mode
}: IRolePermissionSelectorProps<T>) => {
  const { t } = useTranslation();
  const {
    loading: getDBAuthRolePending,
    updateDBAuthRoleTips,
    dbAuthRoleOptions
  } = useDBAuthRoleTips();

  const selectedDbServiceID = Form.useWatch('dbServiceID', form);
  const selectedAuthType = Form.useWatch('authType', form);
  const selectedDBType = Form.useWatch('dbType', form);
  const selectedPermissions = Form.useWatch('operationsPermissions', form);
  const {
    loading: getOperationPermissionPending,
    updateOperationPermission,
    operationPermissionOptions,
    loadDataBaseOnPermissionLevel,
    permissionsDisplayRender
  } = useOperationPermissionTips(selectedDbServiceID, selectedPermissions);

  const cascaderCustomRenderDropdown: CascaderProps['dropdownRender'] = (
    menu
  ) => {
    return (
      <>
        <CustomCascaderPopupMenuStyleWrapper>
          {menu}
        </CustomCascaderPopupMenuStyleWrapper>
      </>
    );
  };

  useEffect(() => {
    if (selectedDbServiceID) {
      updateDBAuthRoleTips(selectedDbServiceID, projectID);
    } else {
      if (mode === 'create') {
        form.setFieldValue('operationsPermissions', undefined);
        form.setFieldValue('dbRoles', undefined);
      }
    }
  }, [form, mode, projectID, selectedDbServiceID, updateDBAuthRoleTips]);

  useEffect(() => {
    if (selectedDBType) {
      updateOperationPermission(selectedDBType as AuthListOperationsDbTypeEnum);
    }
  }, [selectedDBType, selectedAuthType, updateOperationPermission]);

  return (
    <>
      <FormItemLabel
        label={t('databaseAccount.create.form.role')}
        name="dbRoles"
        extra={
          showQuickCreateRole ? (
            <TypedLink
              target="_blank"
              to={`/provision/project/${projectID}/database-role?action=create_role`}
            >
              {t('databaseAccount.create.form.quickCreateRoles')}
            </TypedLink>
          ) : undefined
        }
      >
        <BasicSelect
          mode="multiple"
          popupMatchSelectWidth
          allowClear
          showSearch
          filterOption={filterOptionByLabel}
          options={dbAuthRoleOptions}
          loading={getDBAuthRolePending}
          disabled={!selectedDbServiceID}
        />
      </FormItemLabel>

      <FormItemLabel
        name="operationsPermissions"
        label={t('databaseAccount.create.form.permission')}
      >
        <BasicCascader
          options={operationPermissionOptions}
          loadData={loadDataBaseOnPermissionLevel}
          loading={getOperationPermissionPending}
          displayRender={permissionsDisplayRender}
          multiple
          showCheckedStrategy={Cascader.SHOW_CHILD}
          dropdownRender={cascaderCustomRenderDropdown}
          disabled={!selectedDbServiceID}
        />
      </FormItemLabel>
    </>
  );
};

export default RolePermissionSelector;
