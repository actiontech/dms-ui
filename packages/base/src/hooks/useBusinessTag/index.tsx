import { useRequest } from 'ahooks';
import { DmsApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useMemo } from 'react';

const useBusinessTag = () => {
  const {
    data,
    loading,
    run: updateBusinessTagList
  } = useRequest(
    () => {
      return DmsApi.ProjectService.ListBusinessTags({
        page_size: 1000
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

  const businessTagOptions = useMemo(() => {
    return (
      data?.map((businessTag) => ({
        label: businessTag.name,
        value: businessTag.uid
      })) ?? []
    );
  }, [data]);

  return {
    businessTagList: data ?? [],
    businessTagOptions,
    loading,
    updateBusinessTagList
  };
};

export default useBusinessTag;
