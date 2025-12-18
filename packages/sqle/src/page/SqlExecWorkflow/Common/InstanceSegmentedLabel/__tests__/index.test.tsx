import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import InstanceSegmentedLabel from '..';
import { sqleSuperRender } from '../../../../../testUtils/superRender';

describe('sqle/ExecWorkflow/Common/InstanceSegmentedLabel', () => {
  const customRender = (auditLevel?: AuditTaskResV1AuditLevelEnum) => {
    return sqleSuperRender(
      <InstanceSegmentedLabel
        instanceName="instance name a"
        auditLevel={auditLevel}
      />
    );
  };

  it('render snap when audit level undefined', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when audit level error', () => {
    const { baseElement } = customRender(AuditTaskResV1AuditLevelEnum.error);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when audit level normal', () => {
    const { baseElement } = customRender(AuditTaskResV1AuditLevelEnum.normal);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when audit level notice', () => {
    const { baseElement } = customRender(AuditTaskResV1AuditLevelEnum.notice);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when audit level warn', () => {
    const { baseElement } = customRender(AuditTaskResV1AuditLevelEnum.warn);
    expect(baseElement).toMatchSnapshot();
  });
});
