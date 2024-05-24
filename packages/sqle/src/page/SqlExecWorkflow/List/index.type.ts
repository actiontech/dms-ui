import { IGetWorkflowsV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { PageInfoWithoutIndexAndSize } from '@actiontech/shared/lib/components/ActiontechTable';

export type SqlExecWorkflowListTableFilterParam = PageInfoWithoutIndexAndSize<
  IGetWorkflowsV1Params,
  'project_name'
>;
