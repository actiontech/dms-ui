import { useParams } from 'react-router-dom';
import { ProjectDetailUrlParamType } from './index.type';
import { useMemo } from 'react';
import useCurrentUser from '../useCurrentUser';

const useCurrentProject = () => {
  const { projectID = '' } = useParams<ProjectDetailUrlParamType>();
  const { bindProjects } = useCurrentUser();
  const projectName = useMemo(() => {
    return (
      bindProjects.find((v) => v.project_id === projectID)?.project_name ?? ''
    );
  }, [bindProjects, projectID]);

  return { projectName, projectID };
};

export default useCurrentProject;
