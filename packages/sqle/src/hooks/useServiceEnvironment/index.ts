import { useRequest } from 'ahooks';
import { DmsApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import { createElement, useMemo } from 'react';
import { EnvironmentTag } from '@actiontech/shared';

const useServiceEnvironment = () => {
  const {
    data,
    loading,
    run: updateEnvironmentList
  } = useRequest(
    (projectID: string) => {
      return DmsApi.ProjectService.ListEnvironmentTags({
        page_size: 1000,
        project_uid: projectID
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
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
        label: createElement(EnvironmentTag, {
          name: environment.name,
          color: environment.color,
          size: 'small'
        }),
        text: environment.name,
        title: environment.name,
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
