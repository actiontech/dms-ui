import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { superRender } from '../../../../../../../../testUtils/customRender';
import AuditResultTree from '../AuditResultTree';

describe('test base/DataExport/Detail/ExportDetail/ExportTaskList/AuditResultTree ', () => {
  it('should match snapshot', () => {
    expect(superRender(<AuditResultTree />)).toMatchSnapshot();

    expect(
      superRender(
        <AuditResultTree
          auditResult={[
            {
              level: RuleResV1LevelEnum.error,
              db_type: 'MySQL',
              rule_name: 'all_check_where_is_invalid',
              message: '禁止使用没有WHERE条件或者WHERE条件恒为TRUE的SQL'
            }
          ]}
        />
      )
    ).toMatchSnapshot();
  });
});
