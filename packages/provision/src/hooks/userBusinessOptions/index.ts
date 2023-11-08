import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useRequest } from 'ahooks';

const useBusinessOptions = () => {
  const { projectID } = useCurrentProject();

  const { data: businessOptions } = useRequest(() =>
    auth
      .AuthListBusiness({
        namespace_uid: projectID
      })
      .then((res) => {
        return res.data.data?.businesses?.map((item) => ({
          value: item ?? '',
          label: item ?? ''
        }));
      })
  );

  return {
    businessOptions
  };
};

export default useBusinessOptions;
