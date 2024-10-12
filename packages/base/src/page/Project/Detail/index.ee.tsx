import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useRecentlyOpenedProjects from '../../Nav/SideMenu/useRecentlyOpenedProjects';
import NotFoundRecentlyProject from './NotFoundRecentlyProject';
import useFetchPermissionData from '../../../hooks/useFetchPermissionData';

const EEIndexProjectDetail: React.FC = () => {
  const { projectID: nextProjectID, projectName: nextProjectName } =
    useCurrentProject();

  const { userId } = useCurrentUser();

  const { currentProjectID, updateRecentlyProject } =
    useRecentlyOpenedProjects();

  const { fetchUserPermissions } = useFetchPermissionData();

  const renderProjectDetail = () => {
    if (!currentProjectID && !nextProjectID) {
      return (
        <NotFoundRecentlyProject
          currentProjectID={currentProjectID}
          updateRecentlyProject={updateRecentlyProject}
        />
      );
    }

    return <Outlet />;
  };

  useEffect(() => {
    if (nextProjectID !== currentProjectID) {
      updateRecentlyProject(nextProjectID, nextProjectName);
    }
  }, [currentProjectID, nextProjectID, nextProjectName, updateRecentlyProject]);

  useEffect(() => {
    if (nextProjectID) {
      fetchUserPermissions(nextProjectID, userId);
    }
  }, [fetchUserPermissions, nextProjectID, userId]);

  return <>{renderProjectDetail()}</>;
};

export default EEIndexProjectDetail;
