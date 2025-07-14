import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { baseSuperRender } from '../../../../../../../../testUtils/superRender';
import AuditResultTag from '../AuditResultTag';

describe('test base/DataExport/Detail/ExportDetail/ExportTaskList/AuditResultTag', () => {
  it('should match snapshot', () => {
    expect(baseSuperRender(<AuditResultTag />)).toMatchSnapshot();
    expect(
      baseSuperRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.error }]} />
      )
    ).toMatchSnapshot();

    expect(
      baseSuperRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.normal }]} />
      )
    ).toMatchSnapshot();

    expect(
      baseSuperRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.notice }]} />
      )
    ).toMatchSnapshot();

    expect(
      baseSuperRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.warn }]} />
      )
    ).toMatchSnapshot();

    expect(
      baseSuperRender(
        <AuditResultTag
          auditResult={[
            { level: RuleResV1LevelEnum.warn },
            { level: RuleResV1LevelEnum.error },
            { level: RuleResV1LevelEnum.notice }
          ]}
        />
      )
    ).toMatchSnapshot();
  });
});
