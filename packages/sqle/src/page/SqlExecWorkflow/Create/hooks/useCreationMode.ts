import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { SOURCE_WORKFLOW_PATH_KEY } from '../../Common/data';

const useCreationMode = () => {
  const [searchParams] = useSearchParams();

  const isCloneMode = useMemo(
    () => searchParams.has(SOURCE_WORKFLOW_PATH_KEY),
    [searchParams]
  );

  return {
    isCloneMode
  };
};

export default useCreationMode;
