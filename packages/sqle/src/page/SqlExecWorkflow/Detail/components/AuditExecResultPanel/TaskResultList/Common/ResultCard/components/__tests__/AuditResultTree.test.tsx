import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import AuditResultTree, { AuditResultTreeProps } from '../AuditResultTree';
import { superRender } from '../../../../../../../../../../testUtils/customRender';
import rule_template from '../../../../../../../../../../testUtils/mockApi/rule_template';

const mockNavigateToExceptionDetail = jest.fn();

jest.mock(
  '../../../../../../../../../../components/RuleException/useRuleExceptionActions',
  () => ({
    __esModule: true,
    default: () => ({
      navigateToExceptionDetail: mockNavigateToExceptionDetail
    })
  })
);

describe('sqle/ExecWorkflow/AuditDetail/AuditResultTree', () => {
  let requestRuleList: jest.SpyInstance;

  const customRender = (params: AuditResultTreeProps = {}) => {
    return superRender(<AuditResultTree {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestRuleList = rule_template.getRuleList();
    mockNavigateToExceptionDetail.mockClear();
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

  it('should partition exempted audit results into sibling tree sections', async () => {
    customRender({
      auditResult: [
        {
          level: 'warn',
          message: 'active audit result',
          rule_name: 'rule_active',
          db_type: 'MySQL'
        }
      ],
      skippedByRuleException: [
        {
          rule_name: 'rule_exempted',
          level: 'warn',
          message: 'exempted audit result',
          exception_id: 42
        }
      ]
    });

    expect(screen.getByText('审核结果')).toBeInTheDocument();
    expect(screen.getByText('已例外')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(await screen.findByText('active audit result')).toBeInTheDocument();
    expect(screen.getByText('exempted audit result')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should navigate to exception detail when clicking exempted rule action', async () => {
    const { container } = customRender({
      auditResult: [],
      skippedByRuleException: [
        {
          rule_name: 'rule_exempted',
          level: 'warn',
          message: 'exempted audit result',
          exception_id: 42
        }
      ]
    });

    await act(async () => jest.advanceTimersByTime(3000));

    const viewDetailIcon = container.querySelector('.icon-view-detail');
    expect(viewDetailIcon).not.toBeNull();
    fireEvent.click(viewDetailIcon!);
    expect(mockNavigateToExceptionDetail).toHaveBeenCalledWith(42);
  });

  it('should show view detail action for full sql exemption', () => {
    const { container } = customRender({
      auditResult: [],
      skippedByRuleException: [
        {
          level: 'normal',
          message: '审核SQL例外',
          exception_id: 99
        }
      ]
    });

    expect(screen.getByText('审核结果')).toBeInTheDocument();
    expect(screen.getByText('已例外')).toBeInTheDocument();
    expect(screen.getByText('审核通过')).toBeInTheDocument();
    expect(screen.getByText('审核SQL例外')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(container.querySelector('.audit-result-content')).not.toBeNull();
    expect(container.querySelector('.audit-result-action')).not.toBeNull();
    expect(container.querySelector('.icon-view-detail')).not.toBeNull();
  });

  it('should navigate to exception detail when clicking full sql exemption action', () => {
    const { container } = customRender({
      auditResult: [],
      skippedByRuleException: [
        {
          level: 'normal',
          message: '审核SQL例外',
          exception_id: 99
        }
      ]
    });

    const viewDetailIcon = container.querySelector('.icon-view-detail');
    expect(viewDetailIcon).not.toBeNull();
    fireEvent.click(viewDetailIcon!);
    expect(mockNavigateToExceptionDetail).toHaveBeenCalledWith(99);
  });
});
