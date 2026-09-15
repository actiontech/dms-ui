/* eslint-disable no-console */
import { useEffect } from 'react';
import { HeaderProgress } from '@actiontech/dms-kit';
import { useTypedNavigate, useTypedQuery } from '@actiontech/shared';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { TRANSIT_FROM_CONSTANT } from '@actiontech/dms-kit';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { parse2ReactRouterPath } from '@actiontech/shared/lib/components/TypedRouter/utils';

const TARGET_DATA = (
  projectID: string,
  options?: { workflowId?: string }
): Record<string, string> => {
  return {
    create_workflow: parse2ReactRouterPath(
      ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create,
      {
        params: {
          projectID
        }
      }
    ),
    workflow_detail: parse2ReactRouterPath(
      ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail,
      {
        params: {
          projectID,
          workflowId: options?.workflowId ?? ''
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
  const { bindProjects, isUserInfoFetched } = useCurrentUser();
  const extractQueries = useTypedQuery();
  useEffect(() => {
    const searchParams = extractQueries(ROUTE_PATHS.BASE.TRANSIT.index);
    const from = searchParams?.from;
    const to = searchParams?.to;
    const compressionData = searchParams?.compression_data;
    const projectName = searchParams?.project_name;
    const workflowId = searchParams?.workflow_id;
    if (!isUserInfoFetched) {
      return;
    }
    if (!from || !to) {
      console.error(`Missing required parameters!\n from=${from}\n to=${to}\n`);
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
      const path = TARGET_DATA(projectID, { workflowId })[to!];
      if (!path) {
        console.error(`Not found target path: ${to}`);
        navigate(ROUTE_PATHS.BASE.HOME, {
          replace: true
        });
        return;
      }
      if (compressionData) {
        // useTypedQuery / URLSearchParams 已解码；再拼 URL 必须重新编码，否则 + 变空格破坏预填
        navigate(
          `${path}?from=${encodeURIComponent(
            from
          )}&compression_data=${encodeURIComponent(compressionData)}`,
          {
            replace: true
          }
        );
      } else {
        navigate(path, {
          replace: true
        });
      }
    } else {
      console.error(`project name is undefined`);
      navigate(ROUTE_PATHS.BASE.HOME, {
        replace: true
      });
    }
  }, [bindProjects, isUserInfoFetched, navigate, extractQueries]);
  return <HeaderProgress />;
};
export default Transit;
