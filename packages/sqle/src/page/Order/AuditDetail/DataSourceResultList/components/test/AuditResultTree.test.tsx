import { renderWithTheme } from '../../../../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';

import AuditResultTree, { AuditResultTreeProps } from '../AuditResultTree';

import rule_template from '../../../../../../testUtils/mockApi/rule_template';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/Order/AuditDetail/AuditResultTree', () => {
  let requestRuleList: jest.SpyInstance;

  const customRender = (params: AuditResultTreeProps = {}) => {
    return renderWithTheme(<AuditResultTree {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestRuleList = rule_template.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render tree when auditResult is null', () => {
    const { baseElement } = customRender({
      auditResult: []
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render tree snap when rule name is not has value', async () => {
    const { baseElement } = customRender({
      auditResult: [
        {
          level: 'error',
          message: 'schema test 已存在',
          rule_name: '',
          db_type: 'MySQL'
        }
      ]
    });
    expect(baseElement).toMatchSnapshot();

    const iconArrow = getBySelector('.custom-icon-arrow-down', baseElement);
    fireEvent.click(iconArrow);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2300));
    expect(requestRuleList).not.toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('schema test 已存在')).toBeInTheDocument();
  });

  it('render tree snap when rule name is has value', async () => {
    const { baseElement } = customRender({
      auditResult: [
        {
          level: 'error',
          message: '除了自增列及大字段列之外，每个列都必须添加默认值',
          rule_name: 'ddl_check_column_without_default',
          db_type: 'MySQL'
        },
        {
          level: 'error',
          message: '主键建议使用 BIGINT 无符号类型，即 BIGINT UNSIGNED',
          rule_name: 'ddl_check_pk_without_bigint_unsigned',
          db_type: 'MySQL'
        },
        {
          level: 'error',
          message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
          rule_name: 'ddl_check_table_without_if_not_exists',
          db_type: 'MySQL'
        }
      ]
    });
    expect(baseElement).toMatchSnapshot();

    const iconArrow = getBySelector('.custom-icon-arrow-down', baseElement);
    fireEvent.click(iconArrow);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2300));
    expect(requestRuleList).toHaveBeenCalled();
    expect(requestRuleList).toHaveBeenCalledWith({
      filter_rule_names:
        'ddl_check_column_without_default,ddl_check_pk_without_bigint_unsigned,ddl_check_table_without_if_not_exists'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render tree snap with rule_name and without rule_name', async () => {
    const { baseElement } = customRender({
      auditResult: [
        {
          level: 'error',
          message: 'schema test 已存在',
          rule_name: '',
          db_type: 'MySQL'
        },
        {
          level: 'error',
          message: '主键建议使用 BIGINT 无符号类型，即 BIGINT UNSIGNED',
          rule_name: 'ddl_check_pk_without_bigint_unsigned',
          db_type: 'MySQL'
        },
        {
          level: 'error',
          message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
          rule_name: 'ddl_check_table_without_if_not_exists',
          db_type: 'MySQL'
        }
      ]
    });
    expect(baseElement).toMatchSnapshot();

    const iconArrow = getBySelector('.custom-icon-arrow-down', baseElement);
    fireEvent.click(iconArrow);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2300));
    expect(requestRuleList).toHaveBeenCalled();
    expect(requestRuleList).toHaveBeenCalledWith({
      filter_rule_names:
        'ddl_check_pk_without_bigint_unsigned,ddl_check_table_without_if_not_exists'
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('schema test 已存在')).toBeInTheDocument();
  });
});
