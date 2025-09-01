import { ROUTE_PATHS } from '@actiontech/dms-kit';
import useSystemConfig from '../../../../hooks/useSystemConfig';
import { useTypedNavigate } from '@actiontech/shared';

const ProjectTitle: React.FC = () => {
  const navigate = useTypedNavigate();
  const { renderWebTitle } = useSystemConfig();

  return (
    <div
      onClick={() => {
        navigate(ROUTE_PATHS.BASE.HOME);
      }}
      className="title-wrapper"
    >
      {renderWebTitle()}
    </div>
  );
};

export default ProjectTitle;
