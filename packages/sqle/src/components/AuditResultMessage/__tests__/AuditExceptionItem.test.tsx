import { superRender } from '../../../testUtils/customRender';
import { AuditTaskSQLsMockDataWithOnlyExceptionRule } from '../../../testUtils/mockApi/task/data';
import AuditExceptionItem from '../AuditExceptionItem';

describe('AuditExceptionItem', () => {
  it('should match snapshot', () => {
    const { container } = superRender(
      <AuditExceptionItem
        auditExceptionResult={
          AuditTaskSQLsMockDataWithOnlyExceptionRule[0].audit_result![0]
        }
      />
    );

    expect(container).toMatchSnapshot();
  });
});
