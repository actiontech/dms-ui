import SqlAuditStatusTag from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';

describe('sqle/SqlAudit/SqlAuditStatusTag', () => {
  it('should match snap shot when status is auditing', () => {
    const { baseElement } = superRender(
      <SqlAuditStatusTag
        status={getSQLAuditRecordsV1FilterSqlAuditStatusEnum.auditing}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snap shot when status is successfully', () => {
    const { baseElement } = superRender(
      <SqlAuditStatusTag
        status={getSQLAuditRecordsV1FilterSqlAuditStatusEnum.successfully}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
