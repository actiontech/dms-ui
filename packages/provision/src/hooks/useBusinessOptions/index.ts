import { useCurrentProject } from '@actiontech/shared/lib/features';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useMemo, useCallback, useState } from 'react';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';

const useBusinessOptions = () => {
  const { projectID } = useCurrentProject();

  const [businessList, setBusinessList] = useState<string[]>([]);

  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateBusinessList = useCallback(() => {
    setTrue();
    auth
      .AuthListBusiness({
        namespace_uid: projectID
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setBusinessList(res.data.data?.businesses ?? []);
        } else {
          setBusinessList([]);
        }
      })
      .catch(() => {
        setBusinessList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue, projectID]);

  const businessOptions = useMemo(() => {
    return businessList?.map((business) => {
      return {
        value: business,
        label: business
      };
    });
  }, [businessList]);

  return {
    loading,
    businessOptions,
    businessList,
    updateBusinessList
  };
};

export default useBusinessOptions;
