/* IFTRUE_isEE */
import useRecentlyOpenedProjects from '../../Nav/SideMenu/useRecentlyOpenedProjects';
import NotFoundRecentlyProject from './NotFoundRecentlyProject';
/* FITRUE_isEE */
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { useDispatch } from 'react-redux';
import { updateCurrentProjectArchive } from '../../../store/project';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useEffect, useState } from 'react';
import {
  Outlet,
  /* IFTRUE_isCE */
  useLocation,
  useNavigate
  /* FITRUE_isCE */
} from 'react-router-dom';
import { EmptyBox, HeaderProgress } from '@actiontech/shared';

const ProjectDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { projectID: nextProjectID, projectName: nextProjectName } =
    useCurrentProject();
  const [projectDetailFetched, setProjectDetailFetched] = useState(false);

  useRequest(
    () => dms.ListProjects({ page_size: 10, filter_by_uid: nextProjectID }),
    {
      ready: !!nextProjectID,
      refreshDeps: [nextProjectID],
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dispatch(
            updateCurrentProjectArchive(res.data?.data?.[0]?.archived ?? false)
          );
        }
      },
      onFinally: () => {
        setProjectDetailFetched(true);
      }
    }
  );
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
    <EmptyBox if={projectDetailFetched} defaultNode={<HeaderProgress />}>
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
