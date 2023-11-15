/* IFTRUE_isEE */
import useRecentlyOpenedProjects from '../../Nav/SideMenu/useRecentlyOpenedProjects';
import NotFoundRecentlyProject from './NotFoundRecentlyProject';
/* FITRUE_isEE */
import {
  useCurrentProject,
  useDbServiceDriver
} from '@actiontech/shared/lib/global';
import { useEffect } from 'react';
import {
  Outlet,
  /* IFTRUE_isCE */
  useLocation,
  useNavigate
  /* FITRUE_isCE */
} from 'react-router-dom';
import { EmptyBox, HeaderProgress } from '@actiontech/shared';

const ProjectDetail: React.FC = () => {
  const { projectID: nextProjectID, projectName: nextProjectName } =
    useCurrentProject();
  const { loading: updateDriverListLoading, updateDriverList } =
    useDbServiceDriver();

  /*
   * PS: 由于数据源logo存储方式的问题，现在项目入口处增加获取数据源logo并存入redux的逻辑
   */
  useEffect(() => {
    if (nextProjectID) {
      updateDriverList(nextProjectID);
    }
  }, [nextProjectID, updateDriverList]);
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
    <EmptyBox
      if={!!nextProjectID && !updateDriverListLoading}
      defaultNode={<HeaderProgress />}
    >
      {/* IFTRUE_isEE */}
      {renderProjectDetail()}
      {/* FITRUE_isEE */}

      {/* IFTRUE_isCE */}
      <Outlet />
      {/* FITRUE_isCE */}
    </EmptyBox>
  );
};

export default ProjectDetail;
