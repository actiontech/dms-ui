/* IFTRUE_isEE */
import useRecentlyOpenedProjects from '../../Nav/SideMenu/useRecentlyOpenedProjects';
import NotFoundRecentlyProject from './NotFoundRecentlyProject';
/* FITRUE_isEE */
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useEffect } from 'react';
import {
  Outlet,
  /* IFTRUE_isCE */
  useLocation,
  useNavigate
  /* FITRUE_isCE */
} from 'react-router-dom';

const ProjectDetail: React.FC = () => {
  const { projectID: nextProjectID, projectName: nextProjectName } =
    useCurrentProject();

  /* IFTRUE_isEE */
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
  /* FITRUE_isEE */

  /* IFTRUE_isCE */
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/project') {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);
  /* FITRUE_isCE */

  return (
    <>
      {/* IFTRUE_isEE */}
      {renderProjectDetail()}
      {/* FITRUE_isEE */}

      {/* IFTRUE_isCE */}
      <Outlet />
      {/* FITRUE_isCE */}
    </>
  );
};

export default ProjectDetail;
