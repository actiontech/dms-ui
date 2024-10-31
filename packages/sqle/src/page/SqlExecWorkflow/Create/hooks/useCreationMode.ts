import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import {
  WORKFLOW_VERSION_ID_PATH_KEY,
  SOURCE_WORKFLOW_PATH_KEY,
  WORKFLOW_VERSION_NAME_PATH_KEY
} from '../../../../data/common';

const useCreationMode = () => {
  const [searchParams] = useSearchParams();

  const { isAssociationVersionMode, versionId, versionName, isCloneMode } =
    useMemo(
      () => ({
        isAssociationVersionMode:
          searchParams.has(WORKFLOW_VERSION_ID_PATH_KEY) &&
          searchParams.has(WORKFLOW_VERSION_NAME_PATH_KEY),
        versionId: searchParams.get(WORKFLOW_VERSION_ID_PATH_KEY),
        versionName: searchParams.get(WORKFLOW_VERSION_NAME_PATH_KEY),
        isCloneMode: searchParams.has(SOURCE_WORKFLOW_PATH_KEY)
      }),
      [searchParams]
    );

  return {
    isCloneMode,
    isAssociationVersionMode,
    versionId,
    versionName
  };
};

export default useCreationMode;
