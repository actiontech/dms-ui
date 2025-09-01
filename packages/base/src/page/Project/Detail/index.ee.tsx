import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/features';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useRecentlyOpenedProjects from '../../Nav/SideMenu/useRecentlyOpenedProjects';
import NotFoundRecentlyProject from './NotFoundRecentlyProject';
import useFetchPermissionData from '../../../hooks/useFetchPermissionData';
import { ResponseCode } from '@actiontech/dms-kit';
import { useDispatch } from 'react-redux';
import { updateUserOperationPermissions } from '../../../store/permission';

const EEIndexProjectDetail: React.FC = () => {
  const { projectID: nextProjectID, projectName: nextProjectName } =
    useCurrentProject();
  const dispatch = useDispatch();
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
      fetchUserPermissions(nextProjectID, userId).then((response) => {
        if (response.data.code === ResponseCode.SUCCESS) {
          dispatch(updateUserOperationPermissions(response.data.data));
        }
      });
    }
  }, [dispatch, fetchUserPermissions, nextProjectID, userId]);

  return <>{renderProjectDetail()}</>;
};

export default EEIndexProjectDetail;
