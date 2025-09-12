import { useMemo } from 'react';
import { useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const useCreationMode = () => {
  const extractQueries = useTypedQuery();

  const {
    isAssociationVersionMode,
    versionId,
    versionName,
    isCloneMode,
    isRollbackMode,
    rollbackWorkflowId
  } = useMemo(() => {
    const searchParams = extractQueries(
      ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create
    );
    return {
      isAssociationVersionMode:
        !!searchParams?.version_id && !!searchParams?.version_name,
      versionId: searchParams?.version_id,
      versionName: searchParams?.version_name,
      isCloneMode: !!searchParams?.source_workflow_id,
      isRollbackMode: !!searchParams?.rollback_workflow_id,
      rollbackWorkflowId: searchParams?.rollback_workflow_id
    };
  }, [extractQueries]);

  return {
    isCloneMode,
    isAssociationVersionMode,
    versionId,
    versionName,
    isRollbackMode,
    rollbackWorkflowId
  };
};

export default useCreationMode;
