import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { superRender } from '../../../../../../../../testUtils/customRender';
import AuditResultTag from '../AuditResultTag';

describe('test base/DataExport/Detail/ExportDetail/ExportTaskList/AuditResultTag', () => {
  it('should match snapshot', () => {
    expect(superRender(<AuditResultTag />)).toMatchSnapshot();
    expect(
      superRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.error }]} />
      )
    ).toMatchSnapshot();

    expect(
      superRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.normal }]} />
      )
    ).toMatchSnapshot();

    expect(
      superRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.notice }]} />
      )
    ).toMatchSnapshot();

    expect(
      superRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.warn }]} />
      )
    ).toMatchSnapshot();

    expect(
      superRender(
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
