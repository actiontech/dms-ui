import { useRequest } from 'ahooks';
import { ProvisionApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useMemo } from 'react';
import { IAuthListEnvironmentTagsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';

const useServiceEnvironment = () => {
  const {
    data,
    loading,
    run: updateEnvironmentList
  } = useRequest(
    (params: IAuthListEnvironmentTagsParams) => {
      return ProvisionApi.AuthService.AuthListEnvironmentTags({
        ...params
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data?.environment_tags ?? [];
          }
          return [];
        })
        .catch(() => {
          return [];
        });
    },
    {
      manual: true
    }
  );

  const environmentOptions = useMemo(() => {
    return (
      data?.map((environment) => ({
        label: environment.name,
        value: environment.uid
      })) ?? []
    );
  }, [data]);

  return {
    environmentList: data ?? [],
    environmentOptions,
    loading,
    updateEnvironmentList
  };
};

export default useServiceEnvironment;
