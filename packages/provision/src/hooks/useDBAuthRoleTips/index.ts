import { useRequest } from 'ahooks';
import DbRoleService from '@actiontech/shared/lib/api/provision/service/db_role';
import { useMemo } from 'react';
import { DefaultOptionType } from 'antd/es/select';

const useDBAuthRoleTips = () => {
  const {
    run: updateDBAuthRoleTips,
    loading,
    data: dbAuthRoles
  } = useRequest(
    (dbServiceId: string, projectId: string) =>
      DbRoleService.AuthListDBRoleTips({
        db_service_uid: dbServiceId,
        project_uid: projectId
      }).then((res) => res.data.data),
    {
      manual: true
    }
  );

  const dbAuthRoleOptions = useMemo<DefaultOptionType[]>(() => {
    return (
      dbAuthRoles?.map((v) => ({
        label: v.db_role?.name ?? '',
        value: v.db_role?.uid ?? ''
      })) ?? []
    );
  }, [dbAuthRoles]);

  return {
    loading,
    updateDBAuthRoleTips,
    dbAuthRoles,
    dbAuthRoleOptions
  };
};

export default useDBAuthRoleTips;
