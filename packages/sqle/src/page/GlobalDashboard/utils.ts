import queryString from 'query-string';
import { IGetGlobalWorkflowsV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';

export const paramsSerializer = (params: IGetGlobalWorkflowsV1Params) =>
  queryString.stringify(params, {
    arrayFormat: 'none'
  });
