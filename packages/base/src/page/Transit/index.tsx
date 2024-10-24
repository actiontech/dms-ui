/* eslint-disable no-console */
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HeaderProgress } from '@actiontech/shared';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { TRANSIT_FROM_CONSTANT } from '@actiontech/shared/lib/data/common';

const TARGET_DATA = (projectID: string): Record<string, string> => {
  return {
    create_workflow: `/sqle/project/${projectID}/exec-workflow/create`
  };
};

const Transit: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bindProjects } = useCurrentUser();

  useEffect(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const compressionData = searchParams.get('compression_data');
    const projectName = searchParams.get('project_name');

    if (!from || !to || !compressionData) {
      console.error(
        `Missing required parameters!\n from=${from}\n to=${to}\n compression_data=${compressionData}`
      );
      navigate('/', { replace: true });
      return;
    }

    if (!Object.keys(TRANSIT_FROM_CONSTANT).includes(from)) {
      console.error(`Unknown source: ${from}`);
      navigate('/', { replace: true });
      return;
    }

    if (projectName) {
      const projectID = bindProjects.find(
        (v) => v.project_name === projectName
      )?.project_id;

      if (!projectID) {
        console.error(`Not found project: ${projectName}`);
        navigate('/', { replace: true });
        return;
      }

      const path = TARGET_DATA(projectID)[to!];

      if (!path) {
        console.error(`Not found target path: ${to}`);
        navigate('/', { replace: true });
        return;
      }

      navigate(`${path}?from=${from}&compression_data=${compressionData}`, {
        replace: true
      });
    } else {
      console.error(`project name is undefined`);
      navigate('/', { replace: true });
    }
  }, [bindProjects, navigate, searchParams]);

  return <HeaderProgress />;
};

export default Transit;
