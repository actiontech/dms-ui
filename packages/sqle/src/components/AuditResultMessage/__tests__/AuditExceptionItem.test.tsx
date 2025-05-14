import { sqleSuperRender } from '../../../testUtils/superRender';
import { AuditTaskSQLsMockDataWithOnlyExceptionRule } from '../../../testUtils/mockApi/task/data';
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
