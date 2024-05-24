import AuditResultFilterContainer from '..';
import { superRender } from '../../../../../testUtils/customRender';
import { AuditResultFilterContainerProps } from '../index.type';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const filterOptionsData = [
  {
    value: 'a1',
    label: 'a'
  },
  {
    value: 'b1',
    label: 'b'
  }
];

describe('sqle/ExecWorkflow/Common/AuditResultFilterContainer', () => {
  const filterValueChangeFn = jest.fn();

  const customRender = (
    params: Omit<AuditResultFilterContainerProps<string>, 'filterValueChange'>
  ) => {
    return superRender(
      <AuditResultFilterContainer {...params} onChange={filterValueChangeFn} />
    );
  };

  it('render snap when no optional parameters', () => {
    const { baseElement } = customRender({
      options: filterOptionsData,
      value: 'a'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when auditLevel is normal', () => {
    const { baseElement } = customRender({
      options: filterOptionsData,
      value: '',
      auditLevel: AuditTaskResV1AuditLevelEnum.normal
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when auditLevel is error', () => {
    const { baseElement } = customRender({
      options: filterOptionsData,
      value: '',
      auditLevel: AuditTaskResV1AuditLevelEnum.error
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when auditLevel is notice', () => {
    const { baseElement } = customRender({
      options: filterOptionsData,
      value: '',
      auditLevel: AuditTaskResV1AuditLevelEnum.notice
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when auditLevel is warn', () => {
    const { baseElement } = customRender({
      options: filterOptionsData,
      value: '',
      auditLevel: AuditTaskResV1AuditLevelEnum.warn
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when border is false', () => {
    const { baseElement } = customRender({
      options: filterOptionsData,
      value: '',
      className: 'audit-result-filter-container-borderless'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when other params', () => {
    const { baseElement } = customRender({
      options: filterOptionsData,
      value: '',
      passRate: 1,
      score: 9,
      instanceSchemaName: 'schema name'
    });
    expect(baseElement).toMatchSnapshot();
  });
});
