import { OpPermissionItemOpPermissionTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { TRANSIT_FROM_CONSTANT } from '@actiontech/shared/lib/data/common';
import {
  useCurrentProject,
  useUserOperationPermission
} from '@actiontech/shared/lib/global';
import { compressToEncodedURIComponent } from 'lz-string';
import { useEffect } from 'react';
import useInstanceSchema from '../../../../hooks/useInstanceSchema';

const useGenerateModifiedSqlWorkflow = (
  instanceId: string,
  instanceName: string
) => {
  const { projectID, projectName } = useCurrentProject();
  const {
    isHaveServicePermission,
    updateUserOperationPermission,
    loading: getUserOperationPermissionPending
  } = useUserOperationPermission();
  const { schemaList, loading: getSchemaListPending } = useInstanceSchema(
    projectName,
    instanceName
  );

  const createWorkflowPermission = isHaveServicePermission(
    OpPermissionItemOpPermissionTypeEnum.create_workflow,
    instanceId
  );

  const createWorkflowAction = (sql: string, schemaNames: string[]) => {
    const compressionData = compressToEncodedURIComponent(
      JSON.stringify({
        sql,
        instanceName,
        schema: schemaNames.filter((schema) => schemaList.includes(schema))
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
    createWorkflowPending:
      getSchemaListPending || getUserOperationPermissionPending
  };
};

export default useGenerateModifiedSqlWorkflow;
