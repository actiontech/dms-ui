import { Outlet } from 'react-router-dom';

const SyncDataSource: React.FC = () => {
  return (
    <article>
      <Outlet />
    </article>
  );
};

export default SyncDataSource;
