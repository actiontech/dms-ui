import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicSelect } from '@actiontech/shared';
import { useEffect } from 'react';
import { AuthListOperationsDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import {
  IDatabasePrivilegesSelectorProps,
  IDatabasePrivilegesSelectorBaseFields
} from './index.type';
import useDBAuthRoleTips from '../../hooks/useDBAuthRoleTips';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import { ListServiceDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';
import useDatabasePrivilegesTips from './useDatabasePrivilegesTips';
import ObjectPrivilegesField from './ObjectPrivilegesSelector/ObjectPrivilegesField';
import { Link } from 'react-router-dom';

const DatabasePrivilegesSelector = <
  T extends IDatabasePrivilegesSelectorBaseFields
>({
  form,
  projectID,
  showQuickCreateRole,
  mode
}: IDatabasePrivilegesSelectorProps<T>) => {
  const { t } = useTranslation();
  const {
    loading: getDBAuthRolePending,
    updateDBAuthRoleTips,
    dbAuthRoleOptions
  } = useDBAuthRoleTips();

  const selectedDbServiceID = Form.useWatch('dbServiceID', form);
  const selectedAuthType = Form.useWatch('authType', form);
  const selectedDBType = Form.useWatch('dbType', form);
  const {
    loading: getOperationPrivilegesPending,
    updateOperationPrivileges,
    systemPrivilegesOptions,
    objectPrivilegesOptions
  } = useDatabasePrivilegesTips();

  useEffect(() => {
    if (selectedDbServiceID) {
      updateDBAuthRoleTips(selectedDbServiceID, projectID);
    } else {
      if (mode === 'create') {
        form.setFieldValue('objectPrivileges', undefined);
        form.setFieldValue('systemPrivileges', undefined);
        form.setFieldValue('dbRoles', undefined);
      }
    }
  }, [form, mode, projectID, selectedDbServiceID, updateDBAuthRoleTips]);

  useEffect(() => {
    if (selectedDBType) {
      updateOperationPrivileges(selectedDBType as AuthListOperationsDbTypeEnum);
    }
  }, [selectedDBType, selectedAuthType, updateOperationPrivileges]);

  return (
    <>
      <FormItemLabel
        label={t('databaseAccount.create.form.role')}
        name="dbRoles"
        extra={
          showQuickCreateRole &&
          selectedDbServiceID &&
          selectedDBType === ListServiceDbTypeEnum.Oracle ? (
            <Link
              target="_blank"
              to={`/provision/project/${projectID}/database-role/create/${selectedDbServiceID}`}
            >
              {t('databaseAccount.create.form.quickCreateRoles')}
            </Link>
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
        hidden={selectedDBType !== ListServiceDbTypeEnum.Oracle}
        name="systemPrivileges"
        label={t('databaseAccount.create.form.systemPrivileges')}
      >
        <BasicSelect
          loading={getOperationPrivilegesPending}
          options={systemPrivilegesOptions}
          mode="multiple"
          filterOption={filterOptionByLabel}
          showSearch
        />
      </FormItemLabel>

      <FormItemLabel name="objectPrivileges" wrapperCol={{ span: 24 }}>
        <ObjectPrivilegesField
          getOperationPrivilegesPending={getOperationPrivilegesPending}
          objectPrivilegeOptions={objectPrivilegesOptions}
          selectedDBServiceID={selectedDbServiceID}
          selectedDBType={selectedDBType as AuthListOperationsDbTypeEnum}
        />
      </FormItemLabel>
    </>
  );
};

export default DatabasePrivilegesSelector;
