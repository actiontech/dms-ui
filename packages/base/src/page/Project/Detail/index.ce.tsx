import { DEFAULT_PROJECT_ID } from '@actiontech/shared/lib/data/common';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useFetchPermissionData from '../../../hooks/useFetchPermissionData';
import { useDispatch } from 'react-redux';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { updateUserOperationPermissions } from '../../../store/permission';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const CEIndexProjectDetail: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useTypedNavigate();
  const { fetchUserPermissions } = useFetchPermissionData();
  const { userId } = useCurrentUser();

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/project') {
      navigate(ROUTE_PATHS.BASE.HOME, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    fetchUserPermissions(DEFAULT_PROJECT_ID, userId).then((response) => {
      if (response.data.code === ResponseCode.SUCCESS) {
        dispatch(updateUserOperationPermissions(response.data.data));
      }
    });
  }, [dispatch, fetchUserPermissions, userId]);

  return <Outlet />;
};

export default CEIndexProjectDetail;
