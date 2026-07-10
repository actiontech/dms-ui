import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AuditWhitelistDetailDrawerContainer from 'sqle/src/components/RuleException/AuditWhitelistDetailDrawerContainer';

const CEIndexProjectDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/project') {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <Outlet />
      <AuditWhitelistDetailDrawerContainer />
    </>
  );
};

export default CEIndexProjectDetail;
