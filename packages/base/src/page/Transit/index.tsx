/* eslint-disable no-console */
import { useEffect } from 'react';
import {
  HeaderProgress,
  useTypedNavigate,
  useTypedQuery
} from '@actiontech/shared';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { parse2ReactRouterPath } from '@actiontech/shared/lib/components/TypedRouter/utils';
import { TRANSIT_FROM_CONSTANT } from '@actiontech/shared/lib/data/common';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const TARGET_DATA = (projectID: string): Record<string, string> => {
  return {
    create_workflow: parse2ReactRouterPath(
      ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create,
      {
        params: {
          projectID
        }
      }
    ),
    create_export_workflow: parse2ReactRouterPath(
      ROUTE_PATHS.BASE.DATA_EXPORT.create,
      {
        params: {
          projectID
        }
      }
    )
  };
};

const Transit: React.FC = () => {
  const navigate = useTypedNavigate();
  const { bindProjects } = useCurrentUser();
  const extractQueries = useTypedQuery();
  useEffect(() => {
    const searchParams = extractQueries(ROUTE_PATHS.BASE.TRANSIT.index);
    const from = searchParams?.from;
    const to = searchParams?.to;
    const compressionData = searchParams?.compression_data;
    const projectName = searchParams?.project_name;
    if (!from || !to || !compressionData) {
      console.error(
        `Missing required parameters!\n from=${from}\n to=${to}\n compression_data=${compressionData}`
      );
      navigate(ROUTE_PATHS.BASE.HOME, {
        replace: true
      });
      return;
    }
    if (!Object.keys(TRANSIT_FROM_CONSTANT).includes(from)) {
      console.error(`Unknown source: ${from}`);
      navigate(ROUTE_PATHS.BASE.HOME, {
        replace: true
      });
      return;
    }
    if (projectName) {
      const projectID = bindProjects.find(
        (v) => v.project_name === projectName
      )?.project_id;
      if (!projectID) {
        console.error(`Not found project: ${projectName}`);
        navigate(ROUTE_PATHS.BASE.HOME, {
          replace: true
        });
        return;
      }
      const path = TARGET_DATA(projectID)[to!];
      if (!path) {
        console.error(`Not found target path: ${to}`);
        navigate(ROUTE_PATHS.BASE.HOME, {
          replace: true
        });
        return;
      }
      navigate(`${path}?from=${from}&compression_data=${compressionData}`, {
        replace: true
      });
    } else {
      console.error(`project name is undefined`);
      navigate(ROUTE_PATHS.BASE.HOME, {
        replace: true
      });
    }
  }, [bindProjects, navigate, extractQueries]);
  return <HeaderProgress />;
};
export default Transit;
