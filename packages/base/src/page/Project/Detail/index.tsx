// #if [ee]
import useRecentlyOpenedProjects from '../../Nav/SideMenu/useRecentlyOpenedProjects';
import NotFoundRecentlyProject from './NotFoundRecentlyProject';
// #endif

import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useEffect } from 'react';
import {
  Outlet,
  // #if [ce]
  useLocation,
  useNavigate
  // #endif
} from 'react-router-dom';

const ProjectDetail: React.FC = () => {
  const { projectID: nextProjectID, projectName: nextProjectName } =
    useCurrentProject();

  // #if [ee]
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

  // #else
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/project') {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);
  // #endif

  return (
    <>
      {/* #if [ee] */}
      {renderProjectDetail()}
      {/* #else */}
      <Outlet />
      {/* #endif */}
    </>
  );
};

export default ProjectDetail;
