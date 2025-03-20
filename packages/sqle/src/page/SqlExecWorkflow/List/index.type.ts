import { IGetWorkflowsV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { PageInfoWithoutIndexAndSize } from '@actiontech/shared/lib/components/ActiontechTable';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type SqlExecWorkflowListTableFilterParam = PageInfoWithoutIndexAndSize<
  IGetWorkflowsV1Params,
  'project_name'
>;

export type WorkflowDetailResV1WithExtraParams = IWorkflowDetailResV1 & {
  instance_name?: string;
  execute_time?: string;
};
