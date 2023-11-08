import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useRequest } from 'ahooks';
import { useMemo } from 'react';

const useProvisionUser = () => {
  const { projectID } = useCurrentProject();

  const { data: userOptions } = useRequest(() =>
    auth
      .AuthListUser({
        page_index: 1,
        page_size: 999,
        namespace_uid: projectID
      })
      .then((res) => {
        return (
          res.data.data?.map((item) => ({
            value: item.user_uid ?? '',
            label: item.name ?? ''
          })) ?? []
        );
      })
  );

  const userNameOptions = useMemo(() => {
    return userOptions?.map((user) => {
      return {
        value: user.label,
        label: user.label
      };
    });
  }, [userOptions]);

  return { userOptions, userNameOptions };
};

export default useProvisionUser;
