import { DEFAULT_PROJECT_ID } from '@actiontech/shared/lib/data/common';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useFetchPermissionData from '../../../hooks/useFetchPermissionData';
import { useDispatch } from 'react-redux';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { updateUserOperationPermissions } from '../../../store/permission';

const CEIndexProjectDetail: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchUserPermissions } = useFetchPermissionData();
  const { userId } = useCurrentUser();

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/project') {
      navigate('/', { replace: true });
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
