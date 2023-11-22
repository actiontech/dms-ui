import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import { useState } from 'react';

const useCreateRuleTemplatePermission = ({
  showNotRuleTemplatePage,
  projectID,
  projectName
}: {
  projectID?: string;
  showNotRuleTemplatePage: boolean;
  projectName?: string;
}) => {
  const [allowCreateRuleTemplate, setAllowCreateRuleTemplate] = useState(false);
  const { isAdmin, isProjectManager } = useCurrentUser();

  useRequest(
    () => dms.ListProjects({ page_size: 10, filter_by_uid: projectID }),
    {
      ready: !!showNotRuleTemplatePage && !!projectID,
      refreshDeps: [projectID],
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const projectIsArchived = !!res.data.data?.[0]?.archived;
          setAllowCreateRuleTemplate(
            (isAdmin || isProjectManager(projectName!)) && !projectIsArchived
          );
        }
      }
    }
  );

  return {
    allowCreateRuleTemplate
  };
};

export default useCreateRuleTemplatePermission;
