import { useParams } from 'react-router-dom';
import { ProjectDetailUrlParamType } from './index.type';
import { useCurrentUser } from '..';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../base/src/store';

const useCurrentProject = () => {
  const { projectID = '' } = useParams<ProjectDetailUrlParamType>();
  const { bindProjects } = useCurrentUser();
  const projectArchive = useSelector(
    (state: IReduxState) => state.project.currentProjectArchive
  );
  const projectName = useMemo(() => {
    return (
      bindProjects.find((v) => v.project_id === projectID)?.project_name ?? ''
    );
  }, [bindProjects, projectID]);
  return { projectName, projectID, projectArchive };
};

export default useCurrentProject;
