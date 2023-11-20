import { useParams } from 'react-router-dom';
import { ProjectDetailUrlParamType } from './index.type';
import { useCurrentUser } from '..';
import { useMemo } from 'react';

const useCurrentProject = () => {
  const { projectID = '' } = useParams<ProjectDetailUrlParamType>();
  const { bindProjects } = useCurrentUser();
  const projectName = useMemo(() => {
    return (
      bindProjects.find((v) => v.project_id === projectID)?.project_name ?? ''
    );
  }, [bindProjects, projectID]);

  const projectArchive = useMemo(() => {
    return (
      bindProjects.find((v) => v.project_id === projectID)?.archived ?? false
    );
  }, [bindProjects, projectID]);
  return { projectName, projectID, projectArchive };
};

export default useCurrentProject;
