import { DEFAULT_PROJECT_ID } from '@actiontech/shared/lib/data/common';
import { useFetchPermissionData } from '@actiontech/shared/lib/global';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const CEIndexProjectDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchUserPermissions } = useFetchPermissionData();

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/project') {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    fetchUserPermissions(DEFAULT_PROJECT_ID);
  }, [fetchUserPermissions]);

  return <Outlet />;
};

export default CEIndexProjectDetail;
