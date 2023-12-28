import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useRecentlyOpenedProjects from '../../Nav/SideMenu/useRecentlyOpenedProjects';
import NotFoundRecentlyProject from './NotFoundRecentlyProject';

const EEIndexProjectDetail: React.FC = () => {
  const { projectID: nextProjectID, projectName: nextProjectName } =
    useCurrentProject();

  const { currentProjectID, updateRecentlyProject } =
    useRecentlyOpenedProjects();

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

  return <>{renderProjectDetail()}</>;
};

export default EEIndexProjectDetail;
