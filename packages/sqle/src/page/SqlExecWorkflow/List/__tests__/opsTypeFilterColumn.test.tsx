import { SqlExecWorkflowListColumn } from '../column';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('sqle/SqlExecWorkflow/List opsType filter column', () => {
  it('should assemble filter_by_ops_type_uid via ops_type column filterKey', () => {
    const columns = SqlExecWorkflowListColumn(mockProjectInfo.projectID);
    const opsTypeColumn = columns.find((col) => col.dataIndex === 'ops_type');

    expect(opsTypeColumn).toBeDefined();
    expect(opsTypeColumn?.filterCustomType).toBe('select');
    expect(opsTypeColumn?.filterKey).toBe('filter_by_ops_type_uid');
  });
});
