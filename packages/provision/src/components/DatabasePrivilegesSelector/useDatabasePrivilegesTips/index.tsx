import { useRequest } from 'ahooks';
import AuthService from '@actiontech/shared/lib/api/provision/service/auth';
import { AuthListOperationsDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { useCallback, useState } from 'react';
import { isEqual } from 'lodash';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { OperationScopeEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';

const TABLE_LEVEL_PRIVILEGES_SCOPE = ['Table'];
const DATABASE_LEVEL_PRIVILEGES_SCOPE = ['Database', 'Table'];
const SYSTEM_LEVEL_PRIVILEGES_SCOPE = ['Service', 'Instance'];

const REQUEST_DEFAULT_PARAMS = {
  page_index: 1,
  page_size: 9999
};

const useDatabasePrivilegesTips = () => {
  const [objectPrivilegesOptions, setObjectPrivilegesOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [systemPrivilegesOptions, setSystemPrivilegesOptions] = useState<
    Array<{ label: string; value: string }>
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
          if (dbType === AuthListOperationsDbTypeEnum.Oracle) {
            setSystemPrivilegesOptions(
              res.data.data
                ?.filter((v) =>
                  getOperationPrivilegesLevel(v.scope ?? [], 'system')
                )
                ?.map((v) => ({ label: v.name ?? '', value: v.uid ?? '' })) ??
                []
            );

            setObjectPrivilegesOptions(
              res.data.data
                ?.filter(
                  (v) =>
                    getOperationPrivilegesLevel(v.scope ?? [], 'database') ||
                    getOperationPrivilegesLevel(v.scope ?? [], 'table')
                )
                ?.map((v) => ({ label: v.name ?? '', value: v.uid ?? '' })) ??
                []
            );
          } else {
            setObjectPrivilegesOptions(
              res.data.data?.map((v) => ({
                label: v.name ?? '',
                value: v.uid ?? ''
              })) ?? []
            );
          }

          return res.data.data;
        }
      }),
    {
      manual: true
    }
  );

  const getOperationPrivilegesLevel = useCallback(
    (scope: OperationScopeEnum[], level: 'system' | 'database' | 'table') => {
      if (level === 'system') {
        return isEqual(scope, SYSTEM_LEVEL_PRIVILEGES_SCOPE);
      }

      if (level === 'database') {
        return isEqual(scope, DATABASE_LEVEL_PRIVILEGES_SCOPE);
      }

      if (level === 'table') {
        return isEqual(scope, TABLE_LEVEL_PRIVILEGES_SCOPE);
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
