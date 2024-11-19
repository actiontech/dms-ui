import { useMemo } from 'react';
import { useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const useCreationMode = () => {
  const extraQueries = useTypedQuery();

  const {
    isAssociationVersionMode,
    versionId,
    versionName,
    isCloneMode,
    isRollbackMode,
    rollbackWorkflowId
  } = useMemo(() => {
    const searchParams = extraQueries(
      ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create
    );
    return {
      isAssociationVersionMode:
        !!searchParams?.versionId && !!searchParams?.versionName,
      versionId: searchParams?.versionId,
      versionName: searchParams?.versionName,
      isCloneMode: !!searchParams?.sourceWorkflowId,
      isRollbackMode: !!searchParams?.rollbackWorkflowId,
      rollbackWorkflowId: searchParams?.rollbackWorkflowId
    };
  }, [extraQueries]);

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
