import AuditResultFilterContainer from '.';
import { AuditResultFilterContainerProps } from './index.type';

import { renderWithTheme } from '../../../../testUtils/customRender';
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

describe('sqle/Order/Common/AuditResultFilterContainer', () => {
  const filterValueChangeFn = jest.fn();

  const customRender = (
    params: Omit<AuditResultFilterContainerProps<string>, 'filterValueChange'>
  ) => {
    return renderWithTheme(
      <AuditResultFilterContainer
        {...params}
        filterValueChange={filterValueChangeFn}
      />
    );
  };

  it('render snap when no optional parameters', () => {
    const { baseElement } = customRender({
      filterOptions: filterOptionsData,
      filterValue: 'a'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when auditLevel is normal', () => {
    const { baseElement } = customRender({
      filterOptions: filterOptionsData,
      filterValue: '',
      auditLevel: AuditTaskResV1AuditLevelEnum.normal
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when auditLevel is error', () => {
    const { baseElement } = customRender({
      filterOptions: filterOptionsData,
      filterValue: '',
      auditLevel: AuditTaskResV1AuditLevelEnum.error
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when auditLevel is notice', () => {
    const { baseElement } = customRender({
      filterOptions: filterOptionsData,
      filterValue: '',
      auditLevel: AuditTaskResV1AuditLevelEnum.notice
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when auditLevel is warn', () => {
    const { baseElement } = customRender({
      filterOptions: filterOptionsData,
      filterValue: '',
      auditLevel: AuditTaskResV1AuditLevelEnum.warn
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when border is false', () => {
    const { baseElement } = customRender({
      filterOptions: filterOptionsData,
      filterValue: '',
      bordered: false
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when other params', () => {
    const { baseElement } = customRender({
      filterOptions: filterOptionsData,
      filterValue: '',
      passRate: 1,
      score: 9,
      instanceSchemaName: 'schema name'
    });
    expect(baseElement).toMatchSnapshot();
  });
});
