import { Outlet } from 'react-router-dom';

const DataSource = () => {
  return (
    <article className="data-source-page-project">
      <Outlet />
    </article>
  );
};

export default DataSource;
