import { OpPermissionItemOpPermissionTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { TRANSIT_FROM_CONSTANT } from '@actiontech/shared/lib/data/common';
import {
  useCurrentProject,
  useUserOperationPermission
} from '@actiontech/shared/lib/global';
import { compressToEncodedURIComponent } from 'lz-string';
import { useEffect } from 'react';

const useGenerateModifiedSqlWorkflow = (
  instanceId: string,
  instanceName: string
) => {
  const { projectID } = useCurrentProject();
  const {
    isHaveServicePermission,
    updateUserOperationPermission,
    loading: getUserOperationPermissionPending
  } = useUserOperationPermission();

  const createWorkflowPermission = isHaveServicePermission(
    OpPermissionItemOpPermissionTypeEnum.create_workflow,
    instanceId
  );

  const createWorkflowAction = (sql: string) => {
    const compressionData = compressToEncodedURIComponent(
      JSON.stringify({
        sql,
        instanceName
      })
    );
    window.open(
      `/sqle/project/${projectID}/exec-workflow/create?from=${TRANSIT_FROM_CONSTANT.data_source_comparison}&compression_data=${compressionData}`
    );
  };

  useEffect(() => {
    updateUserOperationPermission();
  }, [updateUserOperationPermission]);

  return {
    createWorkflowAction,
    createWorkflowPermission,
    createWorkflowPending: getUserOperationPermissionPending
  };
};

export default useGenerateModifiedSqlWorkflow;
