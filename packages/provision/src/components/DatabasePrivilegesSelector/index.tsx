import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/CustomForm';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicSelect, TypedLink } from '@actiontech/shared';
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
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

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
        label={
          <CustomLabelContent
            title={t('databaseAccount.create.form.role')}
            tips={t('databaseAccount.create.form.roleTips')}
          />
        }
        name="dbRoles"
        className="has-label-tip"
        extra={
          showQuickCreateRole &&
          selectedDbServiceID &&
          selectedDBType === ListServiceDbTypeEnum.Oracle ? (
            <TypedLink
              target="_blank"
              to={ROUTE_PATHS.PROVISION.DATABASE_ROLE.create}
              params={{ projectID, db_service_id: selectedDbServiceID }}
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
        name="systemPrivileges"
        label={
          <CustomLabelContent
            title={t('databaseAccount.create.form.systemPrivileges')}
            tips={t('databaseAccount.create.form.systemPrivilegesTips')}
          />
        }
        className="has-label-tip"
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
