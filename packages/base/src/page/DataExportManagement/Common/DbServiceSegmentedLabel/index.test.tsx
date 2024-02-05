import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import DbServiceSegmentedLabel from '.';
import { superRender } from '../../../../testUtils/customRender';

describe('test DbServiceSegmentedLabel', () => {
  it('should match snapshot', () => {
    expect(
      superRender(<DbServiceSegmentedLabel dbServiceName="mysql-1" />).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <DbServiceSegmentedLabel
          auditLevel={AuditTaskResV1AuditLevelEnum.error}
          dbServiceName="mysql-1"
        />
      ).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <DbServiceSegmentedLabel
          auditLevel={AuditTaskResV1AuditLevelEnum.normal}
          dbServiceName="mysql-1"
        />
      ).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <DbServiceSegmentedLabel
          auditLevel={AuditTaskResV1AuditLevelEnum.notice}
          dbServiceName="mysql-1"
        />
      ).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <DbServiceSegmentedLabel
          auditLevel={AuditTaskResV1AuditLevelEnum.warn}
          dbServiceName="mysql-1"
        />
      ).container
    ).toMatchSnapshot();
  });
});
