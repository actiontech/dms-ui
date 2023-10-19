import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { IGetProjectStatisticsResDataV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export const projectStatisticsData: IGetProjectStatisticsResDataV1 = {
  workflow_total: 12,
  audit_plan_total: 10,
  instance_total: 3,
  member_total: 22,
  rule_template_total: 12,
  whitelist_total: 3
};

export const mockGetProjectStatistics = () => {
  const spy = jest.spyOn(statistic, 'getProjectStatisticsV1');
  spy.mockImplementation(() => resolveThreeSecond(projectStatisticsData));
  return spy;
};
