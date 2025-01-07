import { useRequest } from 'ahooks';
import AuthService from '@actiontech/shared/lib/api/provision/service/auth';
import { AuthListOperationsDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { useCallback, useState } from 'react';
import { isEqual } from 'lodash';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { OperationScopeEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';

const SYSTEM_LEVEL_PRIVILEGES_SCOPE = [
  OperationScopeEnum.Service,
  OperationScopeEnum.Instance
];

const REQUEST_DEFAULT_PARAMS = {
  page_index: 1,
  page_size: 9999
};

export type IDatabasePrivilegeOption = {
  label: string;
  value: string;
  scope: string[];
};

const useDatabasePrivilegesTips = () => {
  const [objectPrivilegesOptions, setObjectPrivilegesOptions] = useState<
    Array<IDatabasePrivilegeOption>
  >([]);

  const [systemPrivilegesOptions, setSystemPrivilegesOptions] = useState<
    Array<IDatabasePrivilegeOption>
  >([]);

  const {
    data: operationPrivilegesList,
    run: updateOperationPrivileges,
    loading
  } = useRequest(
    (dbType: AuthListOperationsDbTypeEnum) =>
      AuthService.AuthListOperations({
        db_type: dbType,
        ...REQUEST_DEFAULT_PARAMS
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSystemPrivilegesOptions(
            res.data.data
              ?.filter((v) =>
                getOperationPrivilegesLevel(v.scope ?? [], 'system')
              )
              ?.map((v) => ({
                label: v.name ?? '',
                value: v.uid ?? '',
                scope: v.scope ?? []
              })) ?? []
          );

          setObjectPrivilegesOptions(
            res.data.data
              ?.filter((v) =>
                getOperationPrivilegesLevel(v.scope ?? [], 'object')
              )
              ?.map((v) => ({
                label: v.name ?? '',
                value: v.uid ?? '',
                scope: v.scope ?? []
              })) ?? []
          );

          return res.data.data;
        }
      }),
    {
      manual: true
    }
  );

  const getOperationPrivilegesLevel = useCallback(
    (scope: OperationScopeEnum[], level: 'system' | 'object') => {
      if (level === 'system') {
        return isEqual(scope, SYSTEM_LEVEL_PRIVILEGES_SCOPE);
      }

      if (level === 'object') {
        return (
          scope.includes(OperationScopeEnum.Database) ||
          scope.includes(OperationScopeEnum.Table)
        );
      }

      return false;
    },
    []
  );

  return {
    updateOperationPrivileges,
    loading,
    operationPrivilegesList,
    objectPrivilegesOptions,
    systemPrivilegesOptions,
    getOperationPrivilegesLevel
  };
};
export default useDatabasePrivilegesTips;
