import { useRequest } from 'ahooks';
import auth from '../../../api/auth';
import { useEffect, useState } from 'react';

const useGetRoleData = (isReady: boolean) => {
  const [roleOptions, setRoleOptions] = useState<
    {
      value: string | undefined;
      label: string;
    }[]
  >([]);
  const { data: roleList, loading } = useRequest(
    () => {
      return auth.V1ListRoles({ page_size: 9999 });
    },
    {
      ready: isReady
    }
  );

  useEffect(() => {
    const options = (roleList?.data?.data ?? []).map((item) => ({
      label: item?.role_name ?? '',
      value: item?.id
    }));
    setRoleOptions(options);
  }, [roleList]);

  return {
    loading,
    roleList,
    roleOptions
  };
};

export default useGetRoleData;
