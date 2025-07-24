import { sqleSuperRender } from '../../../testUtils/superRender';
import { AuditTaskSQLsMockDataWithOnlyExceptionRule } from '@actiontech/shared/lib/testUtil/mockApi/sqle/task/data';
import AuditExceptionItem from '../AuditExceptionItem';

describe('AuditExceptionItem', () => {
  it('should match snapshot', () => {
    const { container } = sqleSuperRender(
      <AuditExceptionItem
        auditExceptionResult={
          AuditTaskSQLsMockDataWithOnlyExceptionRule[0].audit_result![0]
        }
      />
    );

    expect(container).toMatchSnapshot();
  });
});
