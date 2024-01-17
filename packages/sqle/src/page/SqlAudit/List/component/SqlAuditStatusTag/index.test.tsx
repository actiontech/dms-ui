import SqlAuditStatusTag from '.';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';

describe('sqle/SqlAudit/SqlAuditStatusTag', () => {
  it('should match snap shot when status is auditing', () => {
    const { baseElement } = renderWithReduxAndTheme(
      <SqlAuditStatusTag
        status={getSQLAuditRecordsV1FilterSqlAuditStatusEnum.auditing}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snap shot when status is successfully', () => {
    const { baseElement } = renderWithReduxAndTheme(
      <SqlAuditStatusTag
        status={getSQLAuditRecordsV1FilterSqlAuditStatusEnum.successfully}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
